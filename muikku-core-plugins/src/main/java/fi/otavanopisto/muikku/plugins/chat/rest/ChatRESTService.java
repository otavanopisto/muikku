package fi.otavanopisto.muikku.plugins.chat.rest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.function.Predicate;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.plugins.chat.ChatController;
import fi.otavanopisto.muikku.plugins.chat.ChatPermissions;
import fi.otavanopisto.muikku.plugins.chat.dao.ChatBlockDAO;
import fi.otavanopisto.muikku.plugins.chat.dao.ChatClosedConvoDAO;
import fi.otavanopisto.muikku.plugins.chat.dao.ChatMessageDAO;
import fi.otavanopisto.muikku.plugins.chat.dao.ChatReadDAO;
import fi.otavanopisto.muikku.plugins.chat.dao.ChatRoomDAO;
import fi.otavanopisto.muikku.plugins.chat.dao.ChatUserDAO;
import fi.otavanopisto.muikku.plugins.chat.model.ChatBlock;
import fi.otavanopisto.muikku.plugins.chat.model.ChatClosedConvo;
import fi.otavanopisto.muikku.plugins.chat.model.ChatMessage;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRead;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRoom;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRoomType;
import fi.otavanopisto.muikku.plugins.chat.model.ChatUser;
import fi.otavanopisto.muikku.plugins.chat.model.ChatUserVisibility;
import fi.otavanopisto.muikku.rest.ISO8601UTCTimestamp;
import fi.otavanopisto.muikku.rest.user.GuidanceCounselorRestModels;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserProfilePictureController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/chat")
@RequestScoped
@Stateful
@Produces(MediaType.APPLICATION_JSON)
public class ChatRESTService {
  
  @Inject
  private ChatController chatController;
  
  @Inject
  private ChatRoomDAO chatRoomDAO;

  @Inject
  private ChatMessageDAO chatMessageDAO;
  
  @Inject
  private ChatReadDAO chatReadDAO;

  @Inject
  private ChatBlockDAO chatBlockDAO;

  @Inject
  private ChatClosedConvoDAO chatClosedConvoDAO;

  @Inject
  private ChatUserDAO chatUserDAO;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserProfilePictureController userProfilePictureController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private GuidanceCounselorRestModels guidanceCounselorRestModels;

  @Inject
  private HttpServletRequest httpRequest;
  
  @Path("/room")
  @POST
  @RESTPermit(ChatPermissions.CHAT_MANAGE_PUBLIC_ROOMS)
  public Response createRoom(ChatRoomRestModel payload) {
    
    // Validation
    
    if (StringUtils.isEmpty(payload.getName())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing room name").build();
    }
    
    // Creation
    
    chatController.createPublicRoom(payload.getName(), payload.getDescription(), sessionController.getLoggedUserEntity());
    
    // Response
    
    return Response.status(Status.NO_CONTENT).build();
  }

  @Path("/room/{IDENTIFIER}")
  @PUT
  @RESTPermit(ChatPermissions.CHAT_MANAGE_PUBLIC_ROOMS)
  public Response updateRoom(@PathParam("IDENTIFIER") String identifier, ChatRoomRestModel payload) {
    
    Long id = extractId(identifier);
    if (isUserIdentifier(identifier)) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid room identifier %s", identifier)).build();
    }
    
    // Validation
    
    ChatRoom chatRoom = chatController.findChatRoomByIdAndArchived(id,  Boolean.FALSE);
    if (chatRoom == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Room %d not found", id)).build();
    }
    if (chatRoom.getType() != ChatRoomType.PUBLIC) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Room %d is not public", id)).build();
    }
    if (StringUtils.isEmpty(payload.getName())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing room name").build();
    }
    
    // Update
    
    chatController.updatePublicRoom(chatRoom, payload.getName(), payload.getDescription(), sessionController.getLoggedUserEntity());
    
    // Response
    
    return Response.status(Status.NO_CONTENT).build();
  }
  
  @Path("/users")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUsers(@QueryParam("onlyOnline") @DefaultValue("true") boolean onlyOnline) {
    
    // Validation
    
    if (!chatController.isOnline(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    ChatUser chatUser = chatUserDAO.findByUserEntityId(sessionController.getLoggedUserEntity().getId());
    if (chatUser == null) {
      return Response.status(Status.BAD_REQUEST).entity("Chat user not found" ).build();
    }
    
    // Action
    
    List<ChatUserRestModel> restUsers = chatController.listChatUsers(onlyOnline);
    boolean isStudent = userEntityController.isStudent(sessionController.getLoggedUserEntity());
    for (int i = restUsers.size() - 1; i >= 0; i--) {
      // Don't list ourselves 
      if (restUsers.get(i).getId().equals(sessionController.getLoggedUserEntity().getId())) {
        restUsers.remove(i);
        continue;
      }
      // If I am a student with staff only visibility, I can't see other students at all (a bit dumb)
      if (isStudent && chatUser.getVisibility() == ChatUserVisibility.STAFF && restUsers.get(i).getType() == ChatUserType.STUDENT) {
        restUsers.remove(i);
        continue;
      }
      // For students, strip those only visible to staff
      if (isStudent && restUsers.get(i).getVisibility() == ChatUserVisibility.STAFF) {
        restUsers.remove(i);
        continue;
      }
      // Students may not know each others' names
      if (isStudent && restUsers.get(i).getType() == ChatUserType.STUDENT) {
        restUsers.get(i).setName(null);
      }
    }
    
    // Response
    
    return Response.ok(restUsers).build();
  }
  
  @Path("/markAsRead/{IDENTIFIER}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)  
  public Response markAsRead(@PathParam("IDENTIFIER") String identifier) {
    ChatRead chatRead = chatReadDAO.findByUserEntityIdAndTargetIdentifier(sessionController.getLoggedUserEntity().getId(), identifier);
    if (chatRead == null) {
      chatReadDAO.create(sessionController.getLoggedUserEntity().getId(), identifier);
    }
    else {
      chatReadDAO.update(chatRead);
    }
    return Response.noContent().build();
  }
  
  @Path("/activity")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listActivity() {
    
    // Validation
    
    if (!chatController.isOnline(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Private discussion activity
    
    List<ChatActivityRestModel> activities = new ArrayList<>();
    Set<Long> userEntityIds = chatMessageDAO.listPrivateDiscussionPartners(sessionController.getLoggedUserEntity().getId());
    for (Long userEntityId : userEntityIds) {
      String identifier = String.format("user-%d", userEntityId);
      ChatRead chatRead = chatReadDAO.findByUserEntityIdAndTargetIdentifier(sessionController.getLoggedUserEntity().getId(), identifier);
      Date since = chatRead == null ? new Date(0) : chatRead.getLastRead();
      Long unreadMessages = chatMessageDAO.countBySourceUserAndTargetUserAndSince(sessionController.getLoggedUserEntity().getId(), userEntityId, since);
      Date latest = chatMessageDAO.findLatestDateByTargetUser(sessionController.getLoggedUserEntity().getId(), userEntityId);
      ChatActivityRestModel activity = new ChatActivityRestModel();
      activity.setTargetIdentifier(identifier);
      activity.setLatestMessage(latest);
      activity.setUnreadMessages(unreadMessages);
      activities.add(activity);
    }

    // Public room activity
    
    List<ChatRoom> chatRooms = chatRoomDAO.listByArchived(Boolean.FALSE);
    for (ChatRoom chatRoom : chatRooms) {
      String identifier = String.format("room-%d", chatRoom.getId());
      ChatRead chatRead = chatReadDAO.findByUserEntityIdAndTargetIdentifier(sessionController.getLoggedUserEntity().getId(), identifier);
      Date since = chatRead == null ? new Date(0) : chatRead.getLastRead();
      Long unreadMessages = chatMessageDAO.countByTargetRoomAndSince(chatRoom.getId(), since);
      Date latest = chatMessageDAO.findLatestDateByTargetRoom(chatRoom.getId());
      ChatActivityRestModel activity = new ChatActivityRestModel();
      activity.setTargetIdentifier(identifier);
      activity.setLatestMessage(latest);
      activity.setUnreadMessages(unreadMessages);
      activities.add(activity);
    }
    
    return Response.ok(activities).build();
  }

  @Path("/blocklist")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listBlockedUsers() {
    
    // Validation
    
    if (!chatController.isOnline(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    ChatUser chatUser = chatUserDAO.findByUserEntityId(sessionController.getLoggedUserEntity().getId());
    if (chatUser == null) {
      return Response.status(Status.BAD_REQUEST).entity("Chat user not found" ).build();
    }
    
    // Action
    
    boolean isStudent = userEntityController.isStudent(sessionController.getLoggedUserEntity());
    List<ChatUserRestModel> restUsers = new ArrayList<>();
    List<ChatBlock> blocks = chatBlockDAO.listBySourceUserEntityId(sessionController.getLoggedUserEntity().getId());
    for (ChatBlock block : blocks) {
      ChatUserRestModel restUser = chatController.getChatUserRestModel(block.getTargetUserEntityId());
      // Students may not know each others' names
      if (isStudent && restUser.getType() == ChatUserType.STUDENT) {
        restUser.setName(null);
      }
      restUsers.add(restUser);
    }
    
    // Response
    
    return Response.ok(restUsers).build();
  }
  
  @Path("/privateDiscussions")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listPrivateDiscussions() {
    
    // Validation
    
    if (!chatController.isOnline(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Action
    
    Set<Long> userEntityIds = chatMessageDAO.listPrivateDiscussionPartners(sessionController.getLoggedUserEntity().getId());
    List<ChatUserRestModel> restUsers = new ArrayList<>();
    for (Long userEntityId : userEntityIds) {
      // Don't list ourselves 
      if (userEntityId.equals(sessionController.getLoggedUserEntity().getId())) {
        continue;
      }
      // Skip discussions that we have closed ourselves
      ChatClosedConvo closedConvo = chatClosedConvoDAO.findBySourceUserEntityIdAndTargetUserEntityId(sessionController.getLoggedUserEntity().getId(), userEntityId);
      if (closedConvo != null) {
        continue;
      }
      ChatUserRestModel chatUser = chatController.getChatUserRestModel(userEntityId); 
      if (chatUser != null) {
        restUsers.add(chatUser);
      }
    }

    boolean isStudent = userEntityController.isStudent(sessionController.getLoggedUserEntity());
    if (isStudent) {
      for (int i = restUsers.size() - 1; i >= 0; i--) {
        // Students may not know each others' names
        if (restUsers.get(i).getType() == ChatUserType.STUDENT) {
          restUsers.get(i).setName(null);
        }
      }
    }
    
    // Response
    
    return Response.ok(restUsers).build();
  }

  @Path("/room/{IDENTIFIER}")
  @DELETE
  @RESTPermit(ChatPermissions.CHAT_MANAGE_PUBLIC_ROOMS)
  public Response deleteRoom(@PathParam("IDENTIFIER") String identifier) {
    
    Long id = extractId(identifier);
    if (isUserIdentifier(identifier)) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid room identifier %s", identifier)).build();
    }
    
    // Validation
    
    ChatRoom chatRoom = chatController.findChatRoomByIdAndArchived(id,  Boolean.FALSE);
    if (chatRoom == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Room %d not found", id)).build();
    }
    if (chatRoom.getType() != ChatRoomType.PUBLIC) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Room %d is not public", id)).build();
    }
    
    // Remove
    
    chatController.deleteRoom(chatRoom, sessionController.getLoggedUserEntity());
    
    // Response
    
    return Response.status(Status.NO_CONTENT).build();
  }

  @Path("/rooms")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getChatRooms() {
    List<ChatRoom> rooms = chatController.listRooms(sessionController.getLoggedUserEntity());
    List<ChatRoomRestModel> restRooms = new ArrayList<>();
    for (ChatRoom room : rooms) {
      ChatRoomRestModel restRoom = new ChatRoomRestModel();
      restRoom.setIdentifier("room-" + room.getId());
      restRoom.setName(room.getName());
      restRoom.setDescription(room.getDescription());
      restRoom.setType(room.getType());
      restRoom.setWorkspaceEntityId(room.getWorkspaceEntityId());
      restRooms.add(restRoom);
    }
    return Response.ok(restRooms).build();
  }
  
  @Path("/message/{IDENTIFIER}")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response postMessage(@PathParam("IDENTIFIER") String identifier, MessageContentRestModel payload) {
    if (StringUtils.isEmpty(payload.getMessage())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing message content").build();
    }
    if (payload.getMessage().length() > 4096) {
      return Response.status(Status.BAD_REQUEST).entity("Message content too long").build();
    }
    Long id = extractId(identifier);
    if (isUserIdentifier(identifier)) {
      
      // Post private message
      
      UserEntity targetUserEntity = userEntityController.findUserEntityById(id);
      if (targetUserEntity == null) {
        return Response.status(Status.NOT_FOUND).entity(String.format("User %d not found", id)).build();
      }
      if (targetUserEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
        return Response.status(Status.BAD_REQUEST).entity("Cannot message self").build();
      }
      
      // Check that the target user has not blocked us
      
      ChatBlock chatBlock = chatBlockDAO.findBySourceUserEntityIdAndTargetUserEntityId(targetUserEntity.getId(), sessionController.getLoggedUserEntity().getId());
      if (chatBlock != null) {
        return Response.status(Status.FORBIDDEN).build();
      }
      
      // If target had closed conversation with us (or vice versa), reopen it
      
      ChatClosedConvo closedConvo = chatClosedConvoDAO.findBySourceUserEntityIdAndTargetUserEntityId(targetUserEntity.getId(), sessionController.getLoggedUserEntity().getId());
      if (closedConvo != null) {
        chatClosedConvoDAO.delete(closedConvo);
      }
      closedConvo = chatClosedConvoDAO.findBySourceUserEntityIdAndTargetUserEntityId(sessionController.getLoggedUserEntity().getId(), targetUserEntity.getId());
      if (closedConvo != null) {
        chatClosedConvoDAO.delete(closedConvo);
      }
      
      chatController.postMessage(targetUserEntity, sessionController.getLoggedUserEntity(), payload.getMessage());
    }
    else {
      
      // Post public room message

      ChatRoom room = chatController.findChatRoomByIdAndArchived(id, Boolean.FALSE);
      if (room == null) {
        return Response.status(Status.NOT_FOUND).entity(String.format("Room %d not found", id)).build();
      }
      if (!chatController.isInRoom(sessionController.getLoggedUserEntity(), room)) {
        return Response.status(Status.FORBIDDEN).build();
      }
      chatController.postMessage(room, sessionController.getLoggedUserEntity(), payload.getMessage());
    }
    return Response.status(Status.NO_CONTENT).build();
  }
  
  @Path("/message/{ID}")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateMessage(@PathParam("ID") Long id, MessageContentRestModel payload) {
    
    // Validation
    
    if (StringUtils.isEmpty(payload.getMessage())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing message content").build();
    }
    ChatMessage chatMessage = chatController.findChatMessageByIdAndArchived(id, Boolean.FALSE);
    if (chatMessage == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Message %d not found", id)).build();
    }
    if (!sessionController.getLoggedUserEntity().getId().equals(chatMessage.getSourceUserEntityId())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    chatController.updateMessage(chatMessage, payload.getMessage(), sessionController.getLoggedUserEntity());
    return Response.status(Status.NO_CONTENT).build();
  }

  @Path("/message/{ID}")
  @DELETE
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteMessage(@PathParam("ID") Long id) {
    
    // Validation
    
    ChatMessage chatMessage = chatController.findChatMessageByIdAndArchived(id, Boolean.FALSE);
    if (chatMessage == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Message %d not found", id)).build();
    }
    if (!sessionController.getLoggedUserEntity().getId().equals(chatMessage.getSourceUserEntityId())) {
      if (!sessionController.hasEnvironmentPermission(ChatPermissions.CHAT_DELETE_MESSAGE)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    chatController.deleteMessage(chatMessage, sessionController.getLoggedUserEntity());
    return Response.status(Status.NO_CONTENT).build();
  }
  
  @Path("/block/{IDENTIFIER}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response blockUser(@PathParam("IDENTIFIER") String identifier) {
    Long id = extractId(identifier);
    ChatBlock chatBlock = chatBlockDAO.findBySourceUserEntityIdAndTargetUserEntityId(sessionController.getLoggedUserEntity().getId(), id);
    if (chatBlock == null) {
      chatBlockDAO.create(sessionController.getLoggedUserEntity().getId(), id);
    }
    return Response.status(Status.NO_CONTENT).build();
  }

  @Path("/unblock/{IDENTIFIER}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response unblockUser(@PathParam("IDENTIFIER") String identifier) {
    Long id = extractId(identifier);
    ChatBlock chatBlock = chatBlockDAO.findBySourceUserEntityIdAndTargetUserEntityId(sessionController.getLoggedUserEntity().getId(), id);
    if (chatBlock != null) {
      chatBlockDAO.delete(chatBlock);
    }
    return Response.status(Status.NO_CONTENT).build();
  }

  @Path("/closeDiscussion/{IDENTIFIER}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response closeDiscussion(@PathParam("IDENTIFIER") String identifier) {
    Long id = extractId(identifier);
    ChatClosedConvo closedConvo = chatClosedConvoDAO.findBySourceUserEntityIdAndTargetUserEntityId(sessionController.getLoggedUserEntity().getId(), id);
    if (closedConvo == null) {
      chatClosedConvoDAO.create(sessionController.getLoggedUserEntity().getId(), id);
    }
    return Response.status(Status.NO_CONTENT).build();
  }
  
  @Path("/messages/{IDENTIFIER}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listMessages(@PathParam("IDENTIFIER") String identifier, @QueryParam("count") @DefaultValue ("25") Integer count, @QueryParam("earlierThan") ISO8601UTCTimestamp earlierThanISO) {
    List<ChatMessage> messages;
    Long id = extractId(identifier);
    if (isUserIdentifier(identifier)) {
      
      // List private messages
      
      UserEntity targetUserEntity = userEntityController.findUserEntityById(id);
      if (targetUserEntity == null) {
        return Response.status(Status.NOT_FOUND).entity(String.format("User %d not found", id)).build();
      }
      Date earlierThan = earlierThanISO == null ? new Date() : earlierThanISO.getDate();
      messages = chatController.listMessages(sessionController.getLoggedUserEntity(), targetUserEntity, earlierThan, count);
    }
    else {
      
      // List public room messages
      
      ChatRoom chatRoom = chatController.findChatRoomByIdAndArchived(id, Boolean.FALSE);
      if (chatRoom == null) {
        return Response.status(Status.NOT_FOUND).entity(String.format("Room %d not found", id)).build();
      }
      if (!chatController.isInRoom(sessionController.getLoggedUserEntity(), chatRoom)) {
        return Response.status(Status.FORBIDDEN).build();
      }
      Date earlierThan = earlierThanISO == null ? new Date() : earlierThanISO.getDate();
      messages = chatController.listMessages(chatRoom, earlierThan, count);
    }
    
    // Convert to REST models
    
    List<ChatMessageRestModel> restMessages = new ArrayList<>();
    for (ChatMessage message : messages) {
      restMessages.add(chatController.toRestModel(message));
    }
    return Response.ok(restMessages).build();
  }

  @Path("/users/{ID}")
  @GET
  @RESTPermit(ChatPermissions.CHAT_USER_INFO)
  public Response getUserInfo(@PathParam("ID") Long id) {
    if (!chatController.isOnline(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    UserEntity userEntity = userEntityController.findUserEntityById(id);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("User %d not found", id)).build();
    }
    ChatUser chatUser = chatController.getChatUser(userEntity);
    UserEntityName userEntityName = userEntityController.getName(userEntity, true);
    ChatUserRestModel userInfo = new ChatUserRestModel();
    userInfo.setId(userEntity.getId());
    userInfo.setNick(chatUser == null ? null : chatUser.getNick());
    userInfo.setName(userEntityName.getDisplayNameWithLine());
    userInfo.setType(userEntityController.isStudent(userEntity) ? ChatUserType.STUDENT : ChatUserType.STAFF);
    userInfo.setHasImage(userProfilePictureController.hasProfilePicture(userEntity));
    userInfo.setPresence(chatController.getPresence(userEntity));
    return Response.ok(userInfo).build();
  }

  @Path("/settings")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getChatSettings() {
    return Response.ok(chatController.toRestModel(sessionController.getLoggedUserEntity())).build();
  }

  @Path("/settings")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateChatSettings(ChatUserRestModel payload) {
    String nick = StringUtils.replacePattern(StringUtils.trim(payload.getNick()), " +", " ");
    // Make sure nick exists when chat is on
    if (payload.getVisibility() != ChatUserVisibility.NONE && StringUtils.isEmpty(nick)) {
      if (!userEntityController.isStudent(sessionController.getLoggedUserEntity())) {
        nick = userEntityController.getName(sessionController.getLoggedUserEntity(), true).getDisplayName();
      }
      else {
        return Response.status(Status.BAD_REQUEST).entity("Nick is required").build();
      }
    }
    // Make sure nick is unique
    if (!StringUtils.isEmpty(nick)) {
      if (nick.length() > 64) {
        return Response.status(Status.BAD_REQUEST).entity("Nick too long").build();
      }
      ChatUser nickUser = chatController.getChatUser(nick);
      if (nickUser != null && !nickUser.getUserEntityId().equals(sessionController.getLoggedUserEntity().getId())) {
        return Response.status(Status.CONFLICT).entity("Nick already in use").build();
      }
    }
    // Let the controller figure out how settings have changed
    HttpSession session = httpRequest.getSession(false);
    chatController.handleSettingsChange(
        sessionController.getLoggedUserEntity(),
        payload.getVisibility(),
        nick,
        session == null ? null : session.getId());
    return Response.ok(chatController.toRestModel(sessionController.getLoggedUserEntity())).build();    
  }

  @GET
  @Path("/guidanceCounselors")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listGuidanceCounselors() {

    UserSchoolDataIdentifier loggedUser = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    if (loggedUser == null || !loggedUser.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      return Response.ok(Collections.emptyList()).build();
    }

    Predicate<UserEntity> userEntityFilter = userEntity -> {
      ChatUser chatUser = chatController.getChatUser(userEntity);
      return chatUser != null && chatUser.getVisibility() == ChatUserVisibility.ALL;
    };
    
    return Response.ok(guidanceCounselorRestModels.getGuidanceCounselorRestModels(sessionController.getLoggedUser(), null, userEntityFilter)).build();
  }

  private boolean isUserIdentifier(String identifier) {
    return StringUtils.startsWith(identifier, "user-");
  }
  
  private Long extractId(String identifier) {
    int i = identifier.indexOf('-');
    return Long.valueOf(identifier.substring(i + 1));
  }
  
}
