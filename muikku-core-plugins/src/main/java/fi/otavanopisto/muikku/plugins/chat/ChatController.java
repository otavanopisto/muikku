package fi.otavanopisto.muikku.plugins.chat;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.codec.binary.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.chat.dao.ChatRoomDAO;
import fi.otavanopisto.muikku.plugins.chat.dao.ChatUserDAO;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRoom;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRoomType;
import fi.otavanopisto.muikku.plugins.chat.model.ChatUser;
import fi.otavanopisto.muikku.plugins.chat.rest.ChatRoomRestModel;
import fi.otavanopisto.muikku.plugins.chat.rest.ChatSettingsRestModel;
import fi.otavanopisto.muikku.plugins.chat.rest.DeletedChatRoomRestModel;
import fi.otavanopisto.muikku.plugins.chat.rest.NickChangeRestModel;
import fi.otavanopisto.muikku.plugins.chat.rest.RoomJoinedRestModel;
import fi.otavanopisto.muikku.plugins.chat.rest.RoomLeftRestModel;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessenger;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

@ApplicationScoped
@Singleton
public class ChatController {
  
  @Inject
  private Logger logger;
  
  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private ChatUserDAO chatUserDAO;

  @Inject
  private ChatRoomDAO chatRoomDAO;

  @PostConstruct
  public void init() {
    roomUsers = new ConcurrentHashMap<>();
    userNicks = new ConcurrentHashMap<>();
    sessionUsers = new ConcurrentHashMap<>();
    userSessions = new ConcurrentHashMap<>();
  }
  
  public void processSessionCreated(UserEntity userEntity, String sessionId) {
    ChatUser chatUser = chatUserDAO.findByUserEntityId(userEntity.getId());
    if (chatUser != null && !chatUser.getArchived()) {
      handleUserEnter(userEntity.getId(), sessionId, chatUser.getNick());
    }
  }

  public void processSessionDestroyed(String sessionId) {
    Long userEntityId = sessionUsers.get(sessionId);
    if (userEntityId != null) {
      Set<String> sessionIds = userSessions.get(userEntityId);
      if (sessionIds != null) {
        sessionIds.remove(sessionId);
        if (sessionIds.isEmpty()) {
          handleUserLeave(userEntityId);
        }
      }
    }
  }
  
  public void joinRoom(UserEntity userEntity, ChatRoom chatRoom) {
    Set<Long> users = roomUsers.get(chatRoom.getId());
    if (users == null) {
      users = new HashSet<>();
      users.add(userEntity.getId());
      roomUsers.put(chatRoom.getId(), users);
    }
    if (!users.contains(userEntity.getId())) {
      users.add(userEntity.getId());

      // Inform all room users of the new user
      
      ObjectMapper mapper = new ObjectMapper();
      try {
        RoomJoinedRestModel roomJoined = new RoomJoinedRestModel(chatRoom.getId(), userEntity.getId(), userNicks.get(userEntity.getId()));
        webSocketMessenger.sendMessage("chat:room-joined", mapper.writeValueAsString(roomJoined), users);
      }
      catch (JsonProcessingException e) {
        logger.severe(String.format("Message parse failure: %s", e.getMessage()));
      }
      
    }
  }
  
  public String getNick(UserEntity userEntity) {
    return userNicks.get(userEntity.getId());
  }
  
  public Set<Long> listRoomUsers(ChatRoom chatRoom) {
    Set<Long> users = roomUsers.get(chatRoom.getId());
    return users == null ? Collections.emptySet() : Collections.unmodifiableSet(users);
  }
  
  public boolean isInRoom(UserEntity userEntity, ChatRoom chatRoom) {
    Set<Long> users = roomUsers.get(chatRoom.getId()) ;
    return users != null && users.contains(userEntity.getId());
  }
  
  public void leaveRoom(UserEntity userEntity, ChatRoom chatRoom) {
    Set<Long> users = roomUsers.get(chatRoom.getId());
    if (users != null && users.contains(userEntity.getId())) {

      // Inform all room users of the user that has left (including the leaving user)
      
      ObjectMapper mapper = new ObjectMapper();
      try {
        RoomLeftRestModel roomLeft = new RoomLeftRestModel(chatRoom.getId(), userEntity.getId());
        webSocketMessenger.sendMessage("chat:room-joined", mapper.writeValueAsString(roomLeft), users);
      }
      catch (JsonProcessingException e) {
        logger.severe(String.format("Message parse failure: %s", e.getMessage()));
      }

      users.remove(userEntity.getId());
    }
  }
  
  public void createPublicRoom(String name, String description, UserEntity creator) {
    ChatRoom chatRoom = chatRoomDAO.create(name, description, creator.getId());
    ChatRoomRestModel room = new ChatRoomRestModel(chatRoom.getId(), chatRoom.getName(), chatRoom.getDescription());
    
    // Inform all active chat users of a new public room
    
    ObjectMapper mapper = new ObjectMapper();
    try {
      webSocketMessenger.sendMessage("chat:room-created", mapper.writeValueAsString(room), getActiveUsers());
    }
    catch (JsonProcessingException e) {
      logger.severe(String.format("Message parse failure: %s", e.getMessage()));
    }
  }
  
  public ChatRoom findChatRoomByIdAndArchived(Long roomId, Boolean archived) {
    return chatRoomDAO.findByIdAndArchived(roomId, archived);
  }

  public void updatePublicRoom(ChatRoom chatRoom, String name, String description, UserEntity modifier) {
    chatRoom = chatRoomDAO.update(chatRoom, name, description, modifier.getId());
    ChatRoomRestModel room = new ChatRoomRestModel(chatRoom.getId(), chatRoom.getName(), chatRoom.getDescription());
    
    // Inform all active chat users of a modified public room
    
    ObjectMapper mapper = new ObjectMapper();
    try {
      webSocketMessenger.sendMessage("chat:room-modified", mapper.writeValueAsString(room), getActiveUsers());
    }
    catch (JsonProcessingException e) {
      logger.severe(String.format("Message parse failure: %s", e.getMessage()));
    }
  }
  
  public void createWorkspaceRoom(String name, Long workspaceEntityId, UserEntity creator) {
    
    // Basic validation
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      logger.severe(String.format("Workspace %d not found", workspaceEntityId));
      return;
    }
    
    // Room creation
    
    ChatRoom chatRoom = chatRoomDAO.create(name, workspaceEntityId, creator.getId());
    ChatRoomRestModel room = new ChatRoomRestModel(chatRoom.getId(), chatRoom.getName(), chatRoom.getWorkspaceEntityId());
    
    // Figure out which of the active chat users need to be informed
    
    Set<Long> userIds = new HashSet<>();
    List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listActiveWorkspaceStudents(workspaceEntity);
    userIds = workspaceUsers.stream().map(wue -> wue.getUserSchoolDataIdentifier().getUserEntity().getId()).collect(Collectors.toSet());
    workspaceUsers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
    userIds.addAll(workspaceUsers.stream().map(wue -> wue.getUserSchoolDataIdentifier().getUserEntity().getId()).collect(Collectors.toSet()));
    userIds.retainAll(getActiveUsers());
    
    // Inform relevant users of a new workspace room
    
    if (!userIds.isEmpty()) {
      ObjectMapper mapper = new ObjectMapper();
      try {
        webSocketMessenger.sendMessage("chat:room-created", mapper.writeValueAsString(room), userIds);
      }
      catch (JsonProcessingException e) {
        logger.severe(String.format("Message parse failure: %s", e.getMessage()));
      }
    }
  }

  public void removeRoom(ChatRoom chatRoom, UserEntity remover) {
    
    // Remove
    
    chatRoomDAO.remove(chatRoom, remover.getId());
    roomUsers.remove(chatRoom.getId());

    // Inform all active chat users of a removed room 
    
    ObjectMapper mapper = new ObjectMapper();
    try {
      webSocketMessenger.sendMessage("chat:room-deleted", mapper.writeValueAsString(new DeletedChatRoomRestModel(chatRoom.getId())), getActiveUsers());
    }
    catch (JsonProcessingException e) {
      logger.severe(String.format("Message parse failure: %s", e.getMessage()));
    }
  }
  
  public List<ChatRoom> listRooms(UserEntity userEntity) {
    List<ChatRoom> rooms = chatRoomDAO.listByArchived(Boolean.FALSE);
    for (ChatRoom room : rooms) {
      if (room.getType() == ChatRoomType.WORKSPACE) {
        WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(room.getWorkspaceEntityId());
        if (workspaceEntity == null || !workspaceUserEntityController.isWorkspaceMember(userEntity.defaultSchoolDataIdentifier(), workspaceEntity)) {
          rooms.remove(room);
        }
      }
    }
    return rooms;
  }
  
  public boolean isChatEnabled(UserEntity userEntity) {
    return userEntity == null ? false : chatUserDAO.findByUserEntityIdAndArchived(userEntity.getId(), false) != null;
  }
  
  public ChatUser getChatUser(UserEntity userEntity) {
    return chatUserDAO.findByUserEntityId(userEntity.getId());
  }

  public ChatUser getChatUser(String nick) {
    return chatUserDAO.findByNick(nick);
  }
  
  public void handleSettingsChange(ChatUser chatUser, boolean enabled, String nick, UserEntity userEntity, String sessionId) {
    boolean wasEnabled = chatUser != null && !chatUser.getArchived();
    String previousNick = chatUser != null ? chatUser.getNick() : null;
    if (chatUser == null) {
      chatUser = chatUserDAO.create(enabled, nick, userEntity.getId()); 
    }
    
    // Broadcast presence and nick changes to other chat users
    
    if (enabled && !wasEnabled) {
      chatUser = chatUserDAO.update(chatUser, enabled, nick);
      handleUserEnter(userEntity.getId(), sessionId, nick);
    }
    else if (!enabled && wasEnabled) {
      chatUser = chatUserDAO.update(chatUser, enabled, nick);
      handleUserLeave(userEntity.getId());
    }
    else if (enabled && previousNick != null && !StringUtils.equals(previousNick, nick)) {
      handleNickChange(userEntity.getId(), nick);
    }
    
    // Inform the user of the changed settings

    ObjectMapper mapper = new ObjectMapper();
    try {
      ChatSettingsRestModel settings = new ChatSettingsRestModel(enabled, nick); 
      webSocketMessenger.sendMessage("chat:settings-change", mapper.writeValueAsString(settings), Set.of(userEntity.getId()));
    }
    catch (JsonProcessingException e) {
      logger.severe(String.format("Message parse failure: %s", e.getMessage()));
    }
  }
  
  private void handleUserEnter(Long userEntityId, String sessionId, String nick) {
    
    // Add session data for the user
    
    sessionUsers.put(sessionId, userEntityId);
    Set<String> sessions;
    if (userSessions.containsKey(userEntityId)) {
      sessions = userSessions.get(userEntityId);
      sessions.add(sessionId);
    }
    else {
      sessions = new HashSet<>();
      userSessions.put(userEntityId, sessions);
    }
    sessions.add(sessionId);
    
    // Make note of the user's nick
    
    userNicks.put(userEntityId, nick);
  }

  private void handleUserLeave(Long userEntityId) {
    
    // Remove all session data related to the user
    
    Set<String> sessionIds = userSessions.get(userEntityId);
    if (sessionIds != null) {
      for (String sessionId : sessionIds) {
        sessionUsers.remove(sessionId);
      }
    }
    userSessions.remove(userEntityId);
    
    // If the user was in any room, notify room participants about leaving
    
    Set<Long> roomIds = roomUsers.keySet();
    for (Long roomId : roomIds) {
      Set<Long> users = roomUsers.get(roomId);
      if (users != null && users.contains(userEntityId)) {
        users.remove(userEntityId);
        if (!users.isEmpty()) {
          ObjectMapper mapper = new ObjectMapper();
          try {
            RoomLeftRestModel roomLeft = new RoomLeftRestModel(roomId, userEntityId);
            webSocketMessenger.sendMessage("chat:room-left", mapper.writeValueAsString(roomLeft), users);
          }
          catch (JsonProcessingException e) {
            logger.severe(String.format("Message parse failure: %s", e.getMessage()));
          }
        }
      }
    }
  }
  
  private void handleNickChange(Long userEntityId, String nick) {
    userNicks.put(userEntityId,  nick);
    ObjectMapper mapper = new ObjectMapper();
    try {
      NickChangeRestModel nickChange = new NickChangeRestModel(userEntityId, nick); 
      webSocketMessenger.sendMessage("chat:nick-change", mapper.writeValueAsString(nickChange), getActiveUsers());
    }
    catch (JsonProcessingException e) {
      logger.severe(String.format("Message parse failure: %s", e.getMessage()));
    }
  }
  
  private Set<Long> getActiveUsers() {
    return Collections.unmodifiableSet(userSessions.keySet());
  }
  
  // ChatRoomId -> Set<UserEntityId>
  private ConcurrentHashMap<Long, Set<Long>> roomUsers;
  
  // UserEntityId -> Nick
  private ConcurrentHashMap<Long, String> userNicks;
  
  // HttpSessionId -> UserEntityId
  private ConcurrentHashMap<String, Long> sessionUsers;
  
  // UserEntityId -> List<HttpSessionId>
  private ConcurrentHashMap<Long, Set<String>> userSessions;

}
