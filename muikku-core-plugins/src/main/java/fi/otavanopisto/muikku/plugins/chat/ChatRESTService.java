package fi.otavanopisto.muikku.plugins.chat;

import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.SignatureException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.chat.dao.UserChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings_;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;
import rocks.xmpp.core.XmppException;
import rocks.xmpp.core.session.XmppClient;
import rocks.xmpp.core.session.XmppSessionConfiguration;
import rocks.xmpp.extensions.httpbind.BoshConnection;
import rocks.xmpp.extensions.httpbind.BoshConnectionConfiguration;

@Path("/chat")
@RequestScoped
@Stateful
@Produces ("application/json")
public class ChatRESTService extends PluginRESTService {

  private static final long serialVersionUID = -10681497398136513L;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private Logger logger;
  
  @Inject
  private UserController userController;
  
  @Inject
  private ChatClientHolder chatClientHolder;
 
  @Context
  private HttpServletRequest request;
  
  @Inject
  private ChatController chatController;
  
  @GET
  @Path("/prebind")
  @RESTPermit(handling = Handling.INLINE)
  public Response fetchPrebindIdentifiers() {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    PrivateKey privateKey = getPrivateKey();
    if (privateKey == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Private key not set").build();
    }
    Instant now = Instant.now();
    
    SchoolDataIdentifier loggedUserIdentifier = sessionController.getLoggedUser();
    if (loggedUserIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Logged user identifier not found").build();
    }
    String userIdentifierString = loggedUserIdentifier.toId();
    
    // Do we ever need to resume an existing session? Re-using ChatPrebindParameters and incrementing rid doesn't work.
    
    try {
      XmppCredentials credentials = computeXmppCredentials(privateKey, now, userIdentifierString);
      BoshConnectionConfiguration connectionConfig = BoshConnectionConfiguration
          .builder()
          .secure(true)
          .hostname(request.getServerName())
          .port(443)
          .path("/http-bind/")
          .build();

      // Initializing cache directory fails if there's non-ascii chars in user name
      XmppSessionConfiguration sessionConfig = XmppSessionConfiguration.builder()
          .cacheDirectory(null)
          .build();
      XmppClient xmppClient = XmppClient.create(request.getServerName(), sessionConfig, connectionConfig);
      xmppClient.connect();
      xmppClient.login(credentials.getUsername(), credentials.getPassword());
      BoshConnection boshConnection = (BoshConnection) xmppClient.getActiveConnection();
      String sessionId = boshConnection.getSessionId();
      long rid = boshConnection.detach();
      chatClientHolder.addClient(xmppClient);

      ChatPrebindParameters chatPrebindParameters = new ChatPrebindParameters();
      chatPrebindParameters.setBound(true);
      chatPrebindParameters.setBindEpochMilli(Instant.now().toEpochMilli());
      chatPrebindParameters.setJid(credentials.getJid() + "/" + sessionId);
      chatPrebindParameters.setSid(sessionId);
      chatPrebindParameters.setRid(rid);

      return Response.ok(chatPrebindParameters).build();
    } catch (InvalidKeyException | SignatureException | NoSuchAlgorithmException | XmppException ex) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(ex.getMessage()).build();
    }
  }
   
  @GET
  @Path("/credentials")
  @RESTPermit(handling = Handling.INLINE)
  public Response fetchCredentials() {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    
    PrivateKey privateKey = getPrivateKey();
    if (privateKey == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Private key not set").build();
    }
    Instant now = Instant.now();
    
    SchoolDataIdentifier loggedUserIdentifier = sessionController.getLoggedUser();
    if (loggedUserIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Logged user identifier not found").build();
    }
    String userIdentifierString = loggedUserIdentifier.toId();
    try {
      XmppCredentials credentials = computeXmppCredentials(privateKey, now, userIdentifierString);
      return Response.ok(credentials).build();
    } catch (InvalidKeyException | SignatureException | NoSuchAlgorithmException ex) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(ex.getMessage()).build();
    }
  }

  @GET
  @Path("/status")
  @RESTPermit(handling = Handling.INLINE)
  public Response chatStatus() {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    SchoolDataIdentifier identifier = sessionController.getLoggedUser();
    
    if (identifier == null) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Couldn't find logged user").build();
      }
    
    UserChatSettings userChatSettings = chatController.findUserChatSettings(identifier);
    boolean chatEnabled = false;
    
    if (userChatSettings != null) {
      UserChatVisibility visibility = userChatSettings.getVisibility();
    	
      if (visibility.toString().equals("VISIBLE_TO_ALL")) {
    	chatEnabled = true;
      }
    } 
    
    User user = userController.findUserByIdentifier(identifier);
    
    if (user == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Logged user doesn't exist").build();
    }

    if (chatEnabled) {
      return Response.ok(new StatusRESTModel(true, user.getDisplayName())).build();
    } else {
      return Response.ok(new StatusRESTModel(false, null)).build();
    }
  }

  private XmppCredentials computeXmppCredentials(
      PrivateKey privateKey,
      Instant now,
      String userIdentifierString
  ) throws InvalidKeyException, SignatureException, NoSuchAlgorithmException {
    String tokenString = now.getEpochSecond() + "," + userIdentifierString;
    byte[] hash = DigestUtils.sha256(tokenString);
    
    byte[] signature;
   
    Signature sig = Signature.getInstance("SHA1withRSA");
    sig.initSign(privateKey);
    sig.update(hash);
    signature = sig.sign();
    
    String serverName = request.getServerName();
    String jid = userIdentifierString + "@" + serverName;
    
    String password = tokenString + "," + Base64.encodeBase64String(signature);
    XmppCredentials credentials = new XmppCredentials(userIdentifierString, jid, password);
    return credentials;
  }
  
  private PrivateKey getPrivateKey() {
    String setting = pluginSettingsController.getPluginSetting("chat", "privateKey");
    if (setting == null) {
      return null;
    }
    
    byte[] keyBytes = Base64.decodeBase64(setting);
    PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
    try {
      KeyFactory kf = KeyFactory.getInstance("RSA");
      return kf.generatePrivate(spec);
    } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
      logger.log(Level.SEVERE, "Couldn't construct private key", e);
      return null;
    }
  }
  
  @GET
  @Path("/settings")
  @RESTPermit(handling = Handling.INLINE)
  public Response chatSettingsGet() {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
	}

	SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();	  
	UserChatSettings userChatSettings = chatController.findUserChatSettings(userIdentifier);
	  
	return Response.ok(userChatSettings).build();
  }
  @PUT
  @Path("/settings")
  @RESTPermit(handling = Handling.INLINE)
  public Response chatSettings(UserChatSettings userChatSettings) {
	if (!sessionController.isLoggedIn()) {
	  return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
	}
    UserChatVisibility visibility = userChatSettings.getVisibility();
	SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();
	UserChatSettings findUserChatSettings = chatController.findUserChatSettings(userIdentifier);
	  
	if (findUserChatSettings == null) {
	  chatController.createUserChatSettings(userIdentifier, visibility);

	} else {
	  chatController.updateUserChatSettings(findUserChatSettings, visibility);
	}
	return Response.ok(userChatSettings).build();
  }
}
