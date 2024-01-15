package fi.otavanopisto.muikku.plugins.chat.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

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

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.chat.ChatController;
import fi.otavanopisto.muikku.plugins.chat.ChatPermissions;
import fi.otavanopisto.muikku.plugins.chat.dao.ChatMessageDAO;
import fi.otavanopisto.muikku.plugins.chat.model.ChatBlockType;
import fi.otavanopisto.muikku.plugins.chat.model.ChatMessage;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRoom;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRoomType;
import fi.otavanopisto.muikku.plugins.chat.model.ChatUser;
import fi.otavanopisto.muikku.plugins.chat.model.ChatUserVisibility;
import fi.otavanopisto.muikku.rest.ISO8601UTCTimestamp;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserProfilePictureController;
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
  private ChatMessageDAO chatMessageDAO;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserProfilePictureController userProfilePictureController;

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
    
    // Action
    
    List<ChatUserRestModel> restUsers = chatController.listChatUsers(onlyOnline);
    boolean isStudent = userEntityController.isStudent(sessionController.getLoggedUserEntity());
    for (int i = restUsers.size() - 1; i >= 0; i--) {
      // Don't list ourselves 
      if (restUsers.get(i).getId().equals(sessionController.getLoggedUserEntity().getId())) {
        restUsers.remove(i);
        continue;
      }
      // For students, strip other students only visible to staff
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

  @Path("/blocklist")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listBlockedUsers() {
    
    // Validation
    
    if (!chatController.isOnline(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Action
    
    List<ChatUserRestModel> restUsers = chatController.getBlockList(sessionController.getLoggedUserEntity().getId());
    boolean isStudent = userEntityController.isStudent(sessionController.getLoggedUserEntity());
    for (int i = restUsers.size() - 1; i >= 0; i--) {
      // Don't list ourselves 
      if (restUsers.get(i).getId().equals(sessionController.getLoggedUserEntity().getId())) {
        restUsers.remove(i);
        continue;
      }
      // For students, strip other students only visible to staff
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
  
  @Path("/block")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateBlock(ChatBlockRestModel payload) {
    if (payload.getBlockType() == ChatBlockType.NONE) {
      chatController.removeBlock(sessionController.getLoggedUserEntity().getId(), payload.getTargetUserEntityId());
    }
    else {
      chatController.addBlock(sessionController.getLoggedUserEntity().getId(), payload.getTargetUserEntityId(), payload.getBlockType());
    }
    return Response.noContent().build();
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
      ChatBlockType blockType = chatController.getBlockType(sessionController.getLoggedUserEntity().getId(), userEntityId);
      if (blockType != ChatBlockType.NONE) {
        continue;
      }
      ChatUserRestModel chatUser = chatController.getChatUserRestModel(userEntityId); 
      if (chatUser != null) {
        restUsers.add(chatUser);
      }
    }

    boolean isStudent = userEntityController.isStudent(sessionController.getLoggedUserEntity());
    for (ChatUserRestModel restUser : restUsers) {
      // Don't list ourselves 
      if (restUser.getId().equals(sessionController.getLoggedUserEntity().getId())) {
        restUsers.remove(restUser);
        continue;
      }
      // For students, strip other students only visible to staff
      if (isStudent && restUser.getVisibility() == ChatUserVisibility.STAFF) {
        restUsers.remove(restUser);
        continue;
      }
      // Students may not know each others' names
      if (isStudent && restUser.getType() == ChatUserType.STUDENT) {
        restUser.setName(null);
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
      
      // For the time being, we do not support private messaging between students
      
      if (chatController.isStudent(sessionController.getLoggedUserEntity()) && chatController.isStudent(targetUserEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
      
      // Check that the target user has not blocked us
      
      if (chatController.getBlockType(sessionController.getLoggedUserEntity().getId(), targetUserEntity.getId()) == ChatBlockType.HARD) {
        return Response.status(Status.FORBIDDEN).build();
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

  @Path("/messages/{ID}/authorInfo")
  @GET
  @RESTPermit(ChatPermissions.CHAT_MESSAGE_AUTHOR_INFO)
  public Response getMessageAuthorInfo(@PathParam("ID") Long id) {
    if (!chatController.isOnline(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    ChatMessage chatMessage = chatController.findChatMessageByIdAndArchived(id, Boolean.FALSE);
    if (chatMessage == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Message %d not found", id)).build();
    }
    UserEntity userEntity = userEntityController.findUserEntityById(chatMessage.getSourceUserEntityId());
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("User %d not found", chatMessage.getSourceUserEntityId())).build();
    }
    ChatUser chatUser = chatController.getChatUser(userEntity);
    UserEntityName userEntityName = userEntityController.getName(userEntity, true);
    ChatUserRestModel userInfo = new ChatUserRestModel();
    userInfo.setId(userEntity.getId());
    userInfo.setNick(chatUser.getNick());
    userInfo.setName(userEntityName.getDisplayNameWithLine());
    userInfo.setType(chatController.isStaffMember(userEntity) ? ChatUserType.STAFF : ChatUserType.STUDENT);
    userInfo.setHasImage(userProfilePictureController.hasProfilePicture(userEntity));
    userInfo.setIsOnline(chatController.isOnline(userEntity));
    return Response.ok(userInfo).build();
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
    userInfo.setNick(chatUser.getNick());
    userInfo.setName(userEntityName.getDisplayNameWithLine());
    userInfo.setType(userEntityController.isStudent(userEntity) ? ChatUserType.STUDENT : ChatUserType.STAFF);
    userInfo.setHasImage(userProfilePictureController.hasProfilePicture(userEntity));
    userInfo.setIsOnline(chatController.isOnline(userEntity));
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
    // Make sure nick is unique
    if (!StringUtils.isEmpty(payload.getNick())) {
      ChatUser nickUser = chatController.getChatUser(payload.getNick());
      if (nickUser != null && !nickUser.getUserEntityId().equals(sessionController.getLoggedUserEntity().getId())) {
        return Response.status(Status.CONFLICT).entity("Nick already in use").build();
      }
    }
    // Let the controller figure out how settings have changed
    HttpSession session = httpRequest.getSession(false);
    chatController.handleSettingsChange(
        sessionController.getLoggedUserEntity(),
        payload.getVisibility(),
        payload.getNick(),
        session == null ? null : session.getId());
    return Response.ok(chatController.toRestModel(sessionController.getLoggedUserEntity())).build();    
  }
  
  private boolean isUserIdentifier(String identifier) {
    return StringUtils.startsWith(identifier, "user-");
  }
  
  private Long extractId(String identifier) {
    int i = identifier.indexOf('-');
    return Long.valueOf(identifier.substring(i + 1));
  }
  
}
