package fi.otavanopisto.muikku.plugins.chat.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.chat.ChatController;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRoom;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRoomType;
import fi.otavanopisto.muikku.plugins.chat.model.ChatUser;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
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
  private SessionController sessionController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private HttpServletRequest httpRequest;
  
  // TODO Permissions
  
  @Path("/room")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
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

  @Path("/room/{ID}")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateRoom(@PathParam("ID") Long id, ChatRoomRestModel payload) {
    
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
  
  @Path("/room/{ID}/join")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response joinRoom(@PathParam("ID") Long id) {
    
    // Validation
    
    ChatRoom room = chatController.findChatRoomByIdAndArchived(id, Boolean.FALSE);
    if (room == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Room %d not found", id)).build();
    }
    if (room.getType() == ChatRoomType.WORKSPACE) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(room.getWorkspaceEntityId());
      if (workspaceEntity == null) {
        return Response.status(Status.NOT_FOUND).entity(String.format("Workspace %d not found", room.getWorkspaceEntityId())).build();
      }
      if (!workspaceUserEntityController.isWorkspaceMember(sessionController.getLoggedUser(), workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    // Action
    
    chatController.joinRoom(sessionController.getLoggedUserEntity(), room);
    
    // Response
    
    return Response.status(Status.NO_CONTENT).build();
  }

  @Path("/room/{ID}/leave")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response leaveRoom(@PathParam("ID") Long id) {
    
    // Validation
    
    ChatRoom room = chatController.findChatRoomByIdAndArchived(id, Boolean.FALSE);
    if (room == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Room %d not found", id)).build();
    }
    
    // Action
    
    chatController.leaveRoom(sessionController.getLoggedUserEntity(), room);
    
    // Response
    
    return Response.status(Status.NO_CONTENT).build();
  }

  @Path("/room/{ID}/users")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listRoomUsers(@PathParam("ID") Long id) {
    
    // Validation
    
    ChatRoom room = chatController.findChatRoomByIdAndArchived(id, Boolean.FALSE);
    if (room == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Room %d not found", id)).build();
    }
    if (chatController.isInRoom(sessionController.getLoggedUserEntity(), room)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Action
    
    List<ChatUserRestModel> restUsers = new ArrayList<>();
    Set<Long> userEntityIds = chatController.listRoomUsers(room);
    for (Long userEntityId : userEntityIds) {
      UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
      if (userEntity != null) {
        restUsers.add(new ChatUserRestModel(
            userEntityId,
            chatController.getNick(userEntity),
            userEntityController.isStudent(userEntity) ? ChatUserType.STUDENT : ChatUserType.STAFF));
      }
    }
    
    // Response
    
    return Response.ok(restUsers).build();
  }

  @Path("/room/{ID}")
  @DELETE
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteRoom(@PathParam("ID") Long id) {
    
    // Validation
    
    ChatRoom chatRoom = chatController.findChatRoomByIdAndArchived(id,  Boolean.FALSE);
    if (chatRoom == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Room %d not found", id)).build();
    }
    if (chatRoom.getType() != ChatRoomType.PUBLIC) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Room %d is not public", id)).build();
    }
    
    // Remove
    
    chatController.removeRoom(chatRoom, sessionController.getLoggedUserEntity());
    
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
      restRoom.setId(room.getId());
      restRoom.setName(room.getName());
      restRoom.setDescription(room.getDescription());
      restRoom.setType(room.getType());
      restRoom.setWorkspaceEntityId(room.getWorkspaceEntityId());
    }
    return Response.ok(restRooms).build();
  }
  
  @Path("/settings")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getChatSettings() {
    ChatSettingsRestModel settings = new ChatSettingsRestModel();
    ChatUser chatUser = chatController.getChatUser(sessionController.getLoggedUserEntity());
    if (chatUser == null) {
      settings.setEnabled(Boolean.FALSE);
      settings.setNick(null);
    }
    else {
      settings.setEnabled(Boolean.FALSE.equals(chatUser.getArchived()));
      settings.setNick(chatUser.getNick());
    }
    return Response.ok(settings).build();
  }

  @Path("/settings")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateChatSettings(ChatSettingsRestModel payload) {
    if (StringUtils.isEmpty(payload.getNick())) {
      return Response.status(Status.BAD_REQUEST).entity("Nick not specified").build();
    }
    ChatUser nickUser = chatController.getChatUser(payload.getNick());
    if (nickUser != null && !nickUser.getUserEntityId().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.CONFLICT).entity("Nick already in use").build();
    }
    ChatUser chatUser = chatController.getChatUser(sessionController.getLoggedUserEntity());
    HttpSession session = httpRequest.getSession(false);
    chatController.handleSettingsChange(
        chatUser,
        payload.getEnabled(),
        payload.getNick(),
        sessionController.getLoggedUserEntity(),
        session == null ? null : session.getId());
    return Response.status(Status.NO_CONTENT).build();    
  }

}
