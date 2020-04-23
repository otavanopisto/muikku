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
import java.util.ArrayList;
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
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity_;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.OrganizationEntity_;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.chat.dao.UserChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings_;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.EnvironmentRoleEntityController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
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
  
  @Inject
  private ChatSyncController chatSyncController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject 
  private OrganizationEntity organizationEntity;
  
  @Inject 
  private EnvironmentRoleEntity environmentRoleEntity;
  
    
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

    boolean chatEnabled = false;
    String nick = "";

    UserChatSettings userChatSettings = chatController.findUserChatSettings(identifier);

    if (userChatSettings != null) {
      UserChatVisibility visibility = userChatSettings.getVisibility();

      if (visibility == UserChatVisibility.VISIBLE_TO_ALL) {
        chatEnabled = true;
      }

      nick = userChatSettings.getNick();
      if (nick == null) {
        nick = "";
      }

      
    } 

    User user = userController.findUserByIdentifier(identifier);

    if (user == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Logged user doesn't exist").build();
    }

    if (chatEnabled) {
      return Response.ok(new StatusRESTModel(true, true, user.getDisplayName(), nick)).build();
    } else {
      return Response.ok(new StatusRESTModel(false, true, null, null)).build();
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
  public Response createOrUpdateUserChatSettings(UserChatSettings userChatSettings) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();

    chatSyncController.syncStudent(userIdentifier);

    UserChatVisibility visibility = userChatSettings.getVisibility();
    String nick = userChatSettings.getNick();
    if (nick == null) {
      nick = "";
    }
    UserChatSettings findUserChatSettings = chatController.findUserChatSettings(userIdentifier);	  
    if (findUserChatSettings == null) {
      findUserChatSettings = chatController.createUserChatSettings(userIdentifier, visibility, nick);
    } else {
      chatController.updateUserChatVisibility(findUserChatSettings, visibility);
      chatController.updateChatNick(findUserChatSettings, nick);
    }
    return Response.ok(findUserChatSettings).build(); 
  }
  private WorkspaceChatSettingsRestModel restModel(WorkspaceChatSettings workspaceChatSettings) {
    WorkspaceChatSettingsRestModel restModel = new WorkspaceChatSettingsRestModel();
    restModel.setWorkspaceEntityId(workspaceChatSettings.getWorkspaceEntityId());
    restModel.setChatStatus(workspaceChatSettings.getStatus());
    return restModel;
  }
  
  @GET
  @Path("/settings/{userIdentifier}")
  @RESTPermit(handling = Handling.INLINE)
  public Response getNick(@PathParam("userIdentifier") String identifierString) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(identifierString);

    UserChatSettings userChatSettings = chatController.findUserChatSettings(identifier);

    return Response.ok(userChatSettings).build();
  }

  @GET
  @Path("/workspaceChatSettings/{WorkspaceEntityId}")
  @RESTPermit(handling = Handling.INLINE)
  public Response workspaceChatSettingsGet(@PathParam("WorkspaceEntityId") Long workspaceEntityId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    
    WorkspaceChatSettings workspaceChatSettings = chatController.findWorkspaceChatSettings(workspaceEntityId);
    
    if (workspaceChatSettings == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    return Response.ok(restModel(workspaceChatSettings)).build();
  }
  
  @PUT
  @Path("/workspaceChatSettings/{WorkspaceEntityId}")
  @RESTPermit(handling = Handling.INLINE)
  public Response createOrUpdateWorkspaceChatSettings(@PathParam("WorkspaceEntityId") Long workspaceEntityId, WorkspaceChatSettingsRestModel workspaceChatSettings) {
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);   
  
    if (!workspaceEntityId.equals(workspaceChatSettings.getWorkspaceEntityId())) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.WORKSPACE_MANAGEWORKSPACESETTINGS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    WorkspaceChatStatus status = workspaceChatSettings.getChatStatus();
    if (status != null) {
      WorkspaceChatSettings findWorkspaceChatSettings = chatController.findWorkspaceChatSettings(workspaceEntityId);
      if (findWorkspaceChatSettings == null) {
        findWorkspaceChatSettings = chatController.createWorkspaceChatSettings(workspaceEntityId, status);
      }
      else {
        findWorkspaceChatSettings = chatController.updateWorkspaceChatSettings(findWorkspaceChatSettings, status);
      }
      if (status == WorkspaceChatStatus.ENABLED) {
        chatSyncController.syncWorkspace(workspaceEntity);
      }
      else {
        chatSyncController.removeWorkspaceChatRoom(workspaceEntity);
      }
      return Response.ok(restModel(findWorkspaceChatSettings)).build(); 
    }
    else {
      return Response.noContent().build();
    }
  }
  
  @GET
  @Path("/affiliations/")
  @RESTPermit(handling = Handling.INLINE)
  public Response chatUserAffiliations(@QueryParam("roomName") String roomName) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    
    //SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();
    List<String> roles = new ArrayList<String>();
    roles.add("ADMINISTRATOR");
    roles.add("STYDY_PROGRAM_LEADER");


    List<UserSchoolDataIdentifier> usersByAffiliations = chatController.listByOrganizationAndRoles(1, roles);
    String roomNameWithoutSpaces = roomName.replaceAll("\\s+","");
    for(UserSchoolDataIdentifier user: usersByAffiliations){
        EnvironmentRoleEntity userRole = user.getRole();
        
        if (EnvironmentRoleArchetype.ADMINISTRATOR.equals(userRole.getArchetype()) || EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER.equals(userRole.getArchetype())) {
          chatSyncController.syncRoomOwners(user, roomNameWithoutSpaces);
        } 
      

    }

    return Response.ok(usersByAffiliations).build();
  }
  
}
