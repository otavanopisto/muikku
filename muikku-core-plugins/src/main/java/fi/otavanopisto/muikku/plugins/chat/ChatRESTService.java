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
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;
import fi.otavanopisto.muikku.plugins.chat.rest.ChatSettingsRESTModel;
import fi.otavanopisto.muikku.plugins.chat.rest.StatusRESTModel;
import fi.otavanopisto.muikku.plugins.chat.rest.WorkspaceChatSettingsRESTModel;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;
import rocks.xmpp.core.XmppException;
import rocks.xmpp.core.net.ChannelEncryption;
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
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private OrganizationEntityController organizationEntityController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @GET
  @Path("/prebind")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response fetchPrebindIdentifiers() {
    PrivateKey privateKey = getPrivateKey();
    if (privateKey == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Private key not set").build();
    }
    Instant now = Instant.now();
    
    String userIdentifierString = String.format("muikku-user-%d", sessionController.getLoggedUserEntity().getId());
    
    // Do we ever need to resume an existing session? Re-using ChatPrebindParameters and incrementing rid doesn't work.
    
    try {
      XmppCredentials credentials = computeXmppCredentials(privateKey, now, userIdentifierString);
      BoshConnectionConfiguration connectionConfig = BoshConnectionConfiguration
          .builder()
          .hostname(request.getServerName())
          .channelEncryption(ChannelEncryption.DIRECT)
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
      chatPrebindParameters.setJid(credentials.getJid());
      chatPrebindParameters.setSid(sessionId);
      chatPrebindParameters.setRid(rid);
      
      return Response.ok(chatPrebindParameters).build();
    } catch (InvalidKeyException | SignatureException | NoSuchAlgorithmException | XmppException ex) {
      logger.log(Level.SEVERE, "Prebind failure", ex);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(ex.getMessage()).build();
    }
  }
   
  @GET
  @Path("/credentials")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response fetchCredentials() {
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
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response chatStatus() {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    boolean chatEnabled = false;
    String nick = "";
    UserChatSettings userChatSettings = chatController.findUserChatSettings(userEntity);
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
    User user = userController.findUserByIdentifier(userEntity.defaultSchoolDataIdentifier());
    if (user == null) {
      return Response.status(Status.NOT_FOUND).entity("Logged user doesn't exist").build();
    }
    if (chatEnabled) {
      return Response.ok(new StatusRESTModel(true, true, user.getDisplayName(), nick)).build();
    }
    else {
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
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response chatSettingsGet() {
    UserChatSettings userChatSettings = chatController.findUserChatSettings(sessionController.getLoggedUserEntity());
    if (userChatSettings == null) {
      return Response.status(Status.NOT_FOUND).build(); 
    }
    ChatSettingsRESTModel result = new ChatSettingsRESTModel();
    result.setNick(userChatSettings.getNick());
    result.setVisibility(userChatSettings.getVisibility());
    return Response.ok(result).build();
  }

  @PUT
  @Path("/settings")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateUserChatSettings(ChatSettingsRESTModel payload) {
    // TODO Validate nick exists if chat is on
    // TODO Validate nick is unique
    UserEntity userEntity = sessionController.getLoggedUserEntity();

    chatSyncController.syncStudent(userEntity);

    UserChatVisibility visibility = payload.getVisibility();
    String nick = payload.getNick();
    if (nick == null) {
      nick = "";
    }
    UserChatSettings userChatSettings = chatController.findUserChatSettings(userEntity);	  
    if (userChatSettings == null) {
      userChatSettings = chatController.createUserChatSettings(userEntity, visibility, nick);
    }
    else {
      chatController.updateUserChatVisibility(userChatSettings, visibility);
      chatController.updateChatNick(userChatSettings, nick);
    }
    return Response.ok(userChatSettings).build(); 
  }
  
  private WorkspaceChatSettingsRESTModel restModel(WorkspaceChatSettings workspaceChatSettings) {
    WorkspaceChatSettingsRESTModel restModel = new WorkspaceChatSettingsRESTModel();
    restModel.setWorkspaceEntityId(workspaceChatSettings.getWorkspaceEntityId());
    restModel.setChatStatus(workspaceChatSettings.getStatus());
    return restModel;
  }

  @GET
  @Path("/userInfo/{userIdentifier}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getUserInfo(@PathParam("userIdentifier") String identifierString) {
    
    // Payload validation 
    
    if (StringUtils.isEmpty(identifierString) || !StringUtils.startsWithIgnoreCase(identifierString, "muikku-user-")) {
      return Response.status(Status.NOT_FOUND).build();
    }
    Long userEntityId = NumberUtils.toLong(StringUtils.substring(identifierString, 12));
    if (userEntityId == null || userEntityId == 0) { 
      return Response.status(Status.NOT_FOUND).build();
    }
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Find user
    
    SearchProvider searchProvider = getSearchProvider();
    if (searchProvider == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    SearchResult result = searchProvider.findUser(userEntity.defaultSchoolDataIdentifier(), true);
    List<Map<String, Object>> results = result.getResults();
    if (results == null || results.isEmpty()) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Return nick and name (latter for staff only)

    EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(sessionController.getLoggedUser());
    boolean isStudent = roleEntity == null || roleEntity.getArchetype() == EnvironmentRoleArchetype.STUDENT;
    UserChatSettings userChatSettings = chatController.findUserChatSettings(userEntity);
    HashMap<String, String> senderInfo = new HashMap<>();
    senderInfo.put("nick", userChatSettings == null ? null : userChatSettings.getNick());
    if (!isStudent) {
      senderInfo.put("name", String.format("%s %s", String.valueOf(results.get(0).get("firstName")), String.valueOf(results.get(0).get("lastName"))));
    }
    return Response.ok(senderInfo).build();
  }
  
  @GET
  @Path("/settings/{userIdentifier}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getNick(@PathParam("userIdentifier") String identifierString) {

    // Payload validation 
    
    if (StringUtils.isEmpty(identifierString) || !StringUtils.startsWithIgnoreCase(identifierString, "user-")) {
      return Response.status(Status.NOT_FOUND).build();
    }
    Long userEntityId = NumberUtils.toLong(StringUtils.substring(identifierString, 5));
    if (userEntityId == null || userEntityId == 0) { 
      return Response.status(Status.NOT_FOUND).build();
    }
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    UserChatSettings userChatSettings = chatController.findUserChatSettings(userEntity);
    return Response.ok(userChatSettings).build();
  }

  @GET
  @Path("/workspaceChatSettings/{workspaceEntityId}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response workspaceChatSettingsGet(@PathParam("workspaceEntityId") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity != null) {
      WorkspaceChatSettings workspaceChatSettings = chatController.findWorkspaceChatSettings(workspaceEntity);
      if (workspaceChatSettings != null) {
        return Response.ok(workspaceChatSettings.getStatus()).build();
      }
    }
    return Response.ok(WorkspaceChatStatus.DISABLED).build();
  }
  
  @PUT
  @Path("/workspaceChatSettings/{WorkspaceEntityId}")
  @RESTPermit(MuikkuPermissions.WORKSPACE_MANAGEWORKSPACESETTINGS)
  public Response createOrUpdateWorkspaceChatSettings(@PathParam("WorkspaceEntityId") Long workspaceEntityId, WorkspaceChatSettingsRESTModel workspaceChatSettings) {
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
  
    if (!workspaceEntityId.equals(workspaceChatSettings.getWorkspaceEntityId())) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    WorkspaceChatStatus status = workspaceChatSettings.getChatStatus();
    if (status != null) {
      WorkspaceChatSettings findWorkspaceChatSettings = chatController.findWorkspaceChatSettings(workspaceEntity);
      if (findWorkspaceChatSettings == null) {
        findWorkspaceChatSettings = chatController.createWorkspaceChatSettings(workspaceEntity, status);
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
  
  private SearchProvider getSearchProvider() {
    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      return searchProviderIterator.next();
    } else {
      return null;
    }
  }
  
}
