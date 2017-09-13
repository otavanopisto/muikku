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
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

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

  @Context
  private HttpServletRequest request;
  
  @Inject
  private ChatController chatController;
   
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
    String tokenString = now.getEpochSecond() + "," + userIdentifierString;
    byte[] hash = DigestUtils.sha256(tokenString);
    
    byte[] signature;
   
    try {
      Signature sig = Signature.getInstance("SHA1withRSA");
      sig.initSign(privateKey);
      sig.update(hash);
      signature = sig.sign();
    } catch (InvalidKeyException | SignatureException | NoSuchAlgorithmException ex) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(ex.getMessage()).build();
    }
    
    String serverName = request.getServerName();
    String jid = userIdentifierString + "@" + serverName;
    
    String password = tokenString + "," + Base64.encodeBase64String(signature);
    return Response.ok(new CredentialsRESTModel(jid, password)).build();
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
  @Path("/status")
  @RESTPermit(handling = Handling.INLINE)
  public Response chatStatus() {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    String enabledUsersCsv = pluginSettingsController.getPluginSetting("chat", "enabledUsers");
    if (enabledUsersCsv == null) {
      enabledUsersCsv = "";
    }
    List<String> enabledUsers = Arrays.asList(enabledUsersCsv.split(","));
    SchoolDataIdentifier identifier = sessionController.getLoggedUser();
    
    if (identifier == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Couldn't find logged user").build();
    }
    
    if (enabledUsers.contains(identifier.toId())) {
      return Response.ok(new StatusRESTModel(true)).build();
    } else {
      return Response.ok(new StatusRESTModel(false)).build();
    }
  }

  @GET
  @Path("/settings")
  @RESTPermit(handling = Handling.INLINE)
  public Response chatSettings() {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    
    SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
    if (loggedUser == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Logged user not found").build();
    }
    UserChatSettings settings = chatController.findUserChatSettings(loggedUser);
    if (settings == null) {
      return Response.status(Status.NOT_FOUND).entity("User settings not found").build();
    }
    
    return Response.ok(settings).build();
  }

  @POST
  @Path("/settings")
  @RESTPermit(handling = Handling.INLINE)
  public Response setChatSettings(UserChatSettings input) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(input.getUserIdentifier());
    
    if (identifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Ill-formed identifier").build();
    }
    
    UserChatSettings settings = chatController.createUserChatSettings(
        SchoolDataIdentifier.fromId(input.getUserIdentifier()),
        input.getVisibility());
    
    return Response.ok(settings).build();
  }
}
