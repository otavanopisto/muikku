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
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
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
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;
import fi.otavanopisto.muikku.plugins.chat.rest.ChatRoomRESTModel;
import fi.otavanopisto.muikku.plugins.chat.rest.ChatSettingsRESTModel;
import fi.otavanopisto.muikku.plugins.chat.rest.WorkspaceChatSettingsRESTModel;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
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
  private LocaleController localeController;
  
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
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @GET
  @Path("/prebind")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response fetchPrebindIdentifiers() {
    
    if (!chatController.isChatActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    PrivateKey privateKey = getPrivateKey();
    if (privateKey == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Private key not set").build();
    }
    Instant now = Instant.now();
    
    String userIdentifierString = String.format(
        isStudent(sessionController.getLoggedUserEntity()) ? "muikku-student-%d" : "muikku-staff-%d",
        sessionController.getLoggedUserEntity().getId());
    
    try {
      String serverName = getServerName();
      XmppCredentials credentials = computeXmppCredentials(privateKey, now, userIdentifierString);
      BoshConnectionConfiguration connectionConfig = BoshConnectionConfiguration
          .builder()
          .hostname(serverName)
          .channelEncryption(ChannelEncryption.DIRECT)
          .port(443)
          .path("/http-bind/")
          .build();

      // Initializing cache directory fails if there's non-ascii chars in user name
      XmppSessionConfiguration sessionConfig = XmppSessionConfiguration.builder()
          .cacheDirectory(null)
          .build();
      XmppClient xmppClient = XmppClient.create(serverName, sessionConfig, connectionConfig);
      xmppClient.connect();
      xmppClient.login(credentials.getUsername(), credentials.getPassword());
      BoshConnection boshConnection = (BoshConnection) xmppClient.getActiveConnection();
      String sessionId = boshConnection.getSessionId();
      long rid = boshConnection.detach();
      chatClientHolder.addClient(xmppClient);

      ChatPrebindParameters chatPrebindParameters = new ChatPrebindParameters();
      chatPrebindParameters.setBound(true);
      chatPrebindParameters.setHostname(getServerName());
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

    if (!chatController.isChatActive()) {
      return Response.status(Status.FORBIDDEN).build();
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
    
    String serverName = getServerName();
    String jid = userIdentifierString + "@" + serverName;
    
    String password = tokenString + "," + Base64.encodeBase64String(signature);
    XmppCredentials credentials = new XmppCredentials(userIdentifierString, jid, password);
    return credentials;
  }
  
  private String getServerName() {
    String setting = pluginSettingsController.getPluginSetting("chat", "openfireUrl");
    if (setting == null) {
      return null;
    }
    int protocolPrefix = setting.indexOf("//");
    return protocolPrefix == -1 ? setting : StringUtils.substringAfter(setting, "//");
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
  
  /**
   * GET mapi().chat.isAvailable
   * 
   * Returns whether chat functionality is active and available for the currently logged in user.
   * 
   * Output: true|false
   */
  @GET
  @Path("/isAvailable")
  @RESTPermit(handling = Handling.INLINE)
  public Response getIsActive() {
    if (!chatController.isChatActive()) {
      return Response.ok(false).build();
    }
    UserChatSettings userChatSettings = sessionController.isLoggedIn() ? chatController.findUserChatSettings(sessionController.getLoggedUserEntity()) : null;
    return Response.ok(userChatSettings != null).build();
  }

  @GET
  @Path("/settings")
  @RESTPermit(handling = Handling.INLINE)
  public Response getUserChatSettings() {

    if (!chatController.isChatActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    ChatSettingsRESTModel result = new ChatSettingsRESTModel();
    UserChatSettings userChatSettings = sessionController.isLoggedIn() ? chatController.findUserChatSettings(sessionController.getLoggedUserEntity()) : null;
    if (userChatSettings != null) {
      result.setNick(userChatSettings.getNick());
      result.setVisibility(userChatSettings.getVisibility());
    }
    else {
      result.setVisibility(UserChatVisibility.DISABLED);
    }
    return Response.ok(result).build();
  }
  
  @POST
  @Path("/publicRoom")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createPublicChatRoom(ChatRoomRESTModel payload) {

    if (!chatController.isChatActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (isStudent(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Payload validation
    
    String title = StringUtils.trim(payload.getTitle());
    if (StringUtils.isEmpty(title)) {
      return Response.status(Status.BAD_REQUEST).entity("Missing title").build();
    }
    String description = StringUtils.trim(payload.getDescription());
    if (StringUtils.isEmpty(description)) {
      return Response.status(Status.BAD_REQUEST).entity("Missing description").build();
    }
    
    // Room creation
    
    String roomName = chatSyncController.createPublicChatRoom(title, description, sessionController.getLoggedUserEntity());
    if (StringUtils.isEmpty(roomName)) {
      // Room creation failed; see server log for more details, caller may just as well settle with an error
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    payload.setName(roomName);
    return Response.ok().entity(payload).build();
  }

  @PUT
  @Path("/publicRoom")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updatePublicChatRoom(ChatRoomRESTModel payload) {

    if (!chatController.isChatActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (isStudent(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Payload validation
    
    String name = StringUtils.trim(payload.getName());
    if (StringUtils.isEmpty(name)) {
      return Response.status(Status.BAD_REQUEST).entity("Missing name").build();
    }
    String title = StringUtils.trim(payload.getTitle());
    if (StringUtils.isEmpty(title)) {
      return Response.status(Status.BAD_REQUEST).entity("Missing title").build();
    }
    String description = StringUtils.trim(payload.getDescription());
    if (StringUtils.isEmpty(description)) {
      return Response.status(Status.BAD_REQUEST).entity("Missing description").build();
    }
    
    // Room update
    
    chatSyncController.updatePublicChatRoom(name, title, description);
    return Response.ok().entity(payload).build();
  }

  @DELETE
  @Path("/publicRoom")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deletePublicChatRoom(ChatRoomRESTModel payload) {

    if (!chatController.isChatActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (isStudent(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Payload validation
    
    String name = StringUtils.trim(payload.getName());
    if (StringUtils.isEmpty(name)) {
      return Response.status(Status.BAD_REQUEST).entity("Missing name").build();
    }
    
    // Room delete
    
    chatSyncController.removePublicChatRoom(name);
    return Response.noContent().build();
  }

  @PUT
  @Path("/settings")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateUserChatSettings(ChatSettingsRESTModel payload) {
    
    if (!chatController.isChatActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Payload validation
    
    String nick = StringUtils.trim(payload.getNick());
    if (payload.getVisibility() == UserChatVisibility.VISIBLE_TO_ALL && StringUtils.isEmpty(nick)) {
      return Response.status(Status.BAD_REQUEST).entity(localeController.getText(sessionController.getLocale(), "plugin.chat.nicknameRequired")).build();
    }
    UserChatSettings userChatSettings = chatController.findUserChatSettingsByNick(payload.getNick());
    if (userChatSettings != null && !userChatSettings.getUserEntityId().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.CONFLICT).entity(localeController.getText(sessionController.getLocale(), "plugin.chat.nicknameInUse")).build();
    }
    
    // If chat is disabled, we simply delete the settings, freeing the nickname for someone else to use

    UserEntity userEntity = sessionController.getLoggedUserEntity();
    UserChatVisibility visibility = payload.getVisibility();
    if (visibility == UserChatVisibility.DISABLED) {
      payload.setNick(null);
      userChatSettings = chatController.findUserChatSettings(sessionController.getLoggedUserEntity());
      if (userChatSettings != null) {
        chatController.deleteUserChatSettings(userChatSettings);
      }

      // Remove user from all workspace chat rooms
      
      List<WorkspaceEntity> workspaceEntities = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(userEntity);
      for (WorkspaceEntity workspaceEntity : workspaceEntities) {
        // Ignore workspaces that don't have chat enabled
        WorkspaceChatSettings workspaceChatSettings = chatController.findWorkspaceChatSettings(workspaceEntity);
        if (workspaceChatSettings == null || workspaceChatSettings.getStatus() == WorkspaceChatStatus.DISABLED) {
          continue;
        }
        chatSyncController.removeChatRoomMembership(userEntity, workspaceEntity);
      }
    }
    else {
      
      // Store nick and visibility
      
      userChatSettings = chatController.findUserChatSettings(userEntity);
      boolean syncMembership = userChatSettings == null || userChatSettings.getVisibility() != visibility;
      if (userChatSettings == null) {
        chatController.createUserChatSettings(userEntity, visibility, nick);
      }
      else {
        chatController.updateNickAndVisibility(userChatSettings, nick, visibility);
      }
      
      // When chat is turned on, ensure that the user exists in Openfire and
      // is a member of all workspace chat rooms that the user belongs to
      
      if (syncMembership) {
        chatSyncController.syncUser(userEntity);
      }
    }
    return Response.ok(payload).build(); 
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
    
    if (!chatController.isChatActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Payload validation 
    
    if (StringUtils.isEmpty(identifierString) || !StringUtils.startsWithIgnoreCase(identifierString, "muikku-")) {
      return Response.status(Status.NOT_FOUND).build();
    }
    Long userEntityId = NumberUtils.toLong(StringUtils.substringAfterLast(identifierString, "-"));
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

    UserChatSettings userChatSettings = chatController.findUserChatSettings(userEntity);
    HashMap<String, String> senderInfo = new HashMap<>();
    senderInfo.put("nick", userChatSettings == null ? null : userChatSettings.getNick());
    if (!isStudent(sessionController.getLoggedUserEntity()) || StringUtils.startsWith(identifierString, "muikku-staff")) {
      String realName = String.format("%s %s", String.valueOf(results.get(0).get("firstName")), String.valueOf(results.get(0).get("lastName")));
      senderInfo.put("name", realName);
      if (results.get(0).containsKey("studyProgrammeName")) {
        senderInfo.put("studyProgramme", String.valueOf(results.get(0).get("studyProgrammeName")));
      }
    }
    return Response.ok(senderInfo).build();
  }
  
  @GET
  @Path("/settings/{userIdentifier}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getNick(@PathParam("userIdentifier") String identifierString) {

    if (!chatController.isChatActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

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
  @RESTPermit(handling = Handling.INLINE)
  public Response getWorkspaceChatSettings(@PathParam("workspaceEntityId") Long workspaceEntityId) {

    if (!chatController.isChatActive()) {
      return Response.ok(WorkspaceChatStatus.DISABLED).build();
    }
    
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
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateWorkspaceChatSettings(@PathParam("WorkspaceEntityId") Long workspaceEntityId, WorkspaceChatSettingsRESTModel workspaceChatSettings) {
    
    if (!chatController.isChatActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
  
    if (!workspaceEntityId.equals(workspaceChatSettings.getWorkspaceEntityId())) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.WORKSPACE_MANAGEWORKSPACESETTINGS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
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
  
  private boolean isStudent(UserEntity userEntity) {
    EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(userEntity);
    return roleEntity == null || roleEntity.getArchetype() == EnvironmentRoleArchetype.STUDENT;
  }
  
}
