package fi.otavanopisto.muikku.plugins.chat;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
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
import com.fasterxml.jackson.databind.SerializationFeature;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.chat.dao.ChatBlockDAO;
import fi.otavanopisto.muikku.plugins.chat.dao.ChatMessageDAO;
import fi.otavanopisto.muikku.plugins.chat.dao.ChatRoomDAO;
import fi.otavanopisto.muikku.plugins.chat.dao.ChatUserDAO;
import fi.otavanopisto.muikku.plugins.chat.model.ChatBlock;
import fi.otavanopisto.muikku.plugins.chat.model.ChatBlockType;
import fi.otavanopisto.muikku.plugins.chat.model.ChatMessage;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRoom;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRoomType;
import fi.otavanopisto.muikku.plugins.chat.model.ChatUser;
import fi.otavanopisto.muikku.plugins.chat.model.ChatUserVisibility;
import fi.otavanopisto.muikku.plugins.chat.rest.ChatMessageRestModel;
import fi.otavanopisto.muikku.plugins.chat.rest.ChatRoomDeletedRestModel;
import fi.otavanopisto.muikku.plugins.chat.rest.ChatRoomRestModel;
import fi.otavanopisto.muikku.plugins.chat.rest.ChatSettingsRestModel;
import fi.otavanopisto.muikku.plugins.chat.rest.ChatUserLeftRestModel;
import fi.otavanopisto.muikku.plugins.chat.rest.ChatUserPresence;
import fi.otavanopisto.muikku.plugins.chat.rest.ChatUserRestModel;
import fi.otavanopisto.muikku.plugins.chat.rest.ChatUserType;
import fi.otavanopisto.muikku.plugins.chat.rest.NickChangeRestModel;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessenger;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserProfilePictureController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

@ApplicationScoped
@Singleton
public class ChatController {
  
  @Inject
  private Logger logger;
  
  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private UserProfilePictureController userProfilePictureController;

  @Inject
  private ChatMessageDAO chatMessageDAO;

  @Inject
  private ChatUserDAO chatUserDAO;

  @Inject
  private ChatRoomDAO chatRoomDAO;

  @Inject
  private ChatBlockDAO chatBlockDAO;

  @PostConstruct
  public void init() {
    mapper = new ObjectMapper();
    mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    roomUsers = new ConcurrentHashMap<>();
    users = new ConcurrentHashMap<>();
    sessionUsers = new ConcurrentHashMap<>();
    userSessions = new ConcurrentHashMap<>();
    softBlocks = new ConcurrentHashMap<>();
    hardBlocks = new ConcurrentHashMap<>();
    
    // Cache all chat users
    
    List<ChatUser> chatUsers = chatUserDAO.listAll();
    for (ChatUser chatUser : chatUsers) {
      users.put(chatUser.getUserEntityId(), toRestModel(chatUser));
    }
    
    // Cache blocks
    
    List<ChatBlock> blocks = chatBlockDAO.listAll();
    for (ChatBlock block : blocks) {
      ConcurrentHashMap<Long, Set<Long>> map = block.getBlockType() == ChatBlockType.SOFT ? softBlocks : hardBlocks;
      Set<Long> userEntityIds = map.get(block.getSourceUserEntityId());
      if (userEntityIds == null) {
        userEntityIds = new HashSet<Long>();
        map.put(block.getSourceUserEntityId(), userEntityIds);
      }
      userEntityIds.add(block.getTargetUserEntityId());
    }
  }
  
  public void processSessionCreated(UserEntity userEntity, String sessionId) {
    ChatUser chatUser = chatUserDAO.findByUserEntityId(userEntity.getId());
    if (chatUser != null) {
      handleUserEnter(userEntity, chatUser.getVisibility(), chatUser.getNick(), sessionId);
    }
  }

  public void processSessionDestroyed(String sessionId) {
    Long userEntityId = sessionUsers.get(sessionId);
    if (userEntityId != null) {
      Set<String> sessionIds = userSessions.get(userEntityId);
      if (sessionIds != null) {
        sessionIds.remove(sessionId);
        if (sessionIds.isEmpty()) {
          handleUserLeave(userEntityId, false);
        }
      }
    }
  }
  
  public void postMessage(ChatRoom room, UserEntity userEntity, String message) {
    ChatMessage chatMessage = chatMessageDAO.create(userEntity.getId(), room.getId(), null, message);

    // Inform users about the new message (public room message to all users, workspace room message to room users)
    
    Set<Long> users = room.getType() == ChatRoomType.WORKSPACE ? roomUsers.get(room.getId()) : listOnlineUserEntityIds();
    if (users != null && !users.isEmpty()) {
      try {
        ChatMessageRestModel msg = toRestModel(chatMessage);
        webSocketMessenger.sendMessage("chat:message-sent", mapper.writeValueAsString(msg), users);
      }
      catch (JsonProcessingException e) {
        logger.severe(String.format("Message parse failure: %s", e.getMessage()));
      }
    }
  }
  
  public void postMessage(UserEntity targetUserEntity, UserEntity userEntity, String message) {
    
    // Handle soft and hard blocks
    
    ChatBlockType blockType = getBlockType(targetUserEntity.getId(), userEntity.getId());
    if (blockType == ChatBlockType.HARD) {
      return;
    }
    else if (blockType == ChatBlockType.SOFT) {
      removeBlock(targetUserEntity.getId(), userEntity.getId());
    }
    
    // Post message
    
    ChatMessage chatMessage = chatMessageDAO.create(userEntity.getId(), null, targetUserEntity.getId(), message);

    // Inform both parties of the private conversation about a new private message
    
    try {
      ChatMessageRestModel msg = toRestModel(chatMessage);
      webSocketMessenger.sendMessage("chat:message-sent", mapper.writeValueAsString(msg), Set.of(targetUserEntity.getId(), userEntity.getId()));
    }
    catch (JsonProcessingException e) {
      logger.severe(String.format("Message parse failure: %s", e.getMessage()));
    }
  }
  
  public void updateMessage(ChatMessage message, String content, UserEntity modifier) {
    ChatMessage chatMessage = chatMessageDAO.update(message, content, modifier.getId());
    
    // Inform suitable parties about updated message
    
    Set<Long> usersToInform;
    if (chatMessage.getTargetUserEntityId() != null) {
      usersToInform = Set.of(chatMessage.getSourceUserEntityId(), chatMessage.getTargetUserEntityId());
    }
    else {
      ChatRoom room = null;
      if (message.getTargetRoomId() != null) {
        room = chatRoomDAO.findById(chatMessage.getTargetRoomId());
      }
      usersToInform = room == null ? listOnlineUserEntityIds() : listRoomUserEntityIds(room);
    }
    try {
      ChatMessageRestModel msg = toRestModel(chatMessage);
      webSocketMessenger.sendMessage("chat:message-edited", mapper.writeValueAsString(msg), usersToInform);
    }
    catch (JsonProcessingException e) {
      logger.severe(String.format("Message parse failure: %s", e.getMessage()));
    }
  }
  
  public void deleteMessage(ChatMessage message, UserEntity modifier) {
    ChatMessage chatMessage = chatMessageDAO.archive(message, modifier.getId());
    
    // Inform suitable parties about deleted message
    
    Set<Long> usersToInform;
    if (chatMessage.getTargetUserEntityId() != null) {
      usersToInform = Set.of(chatMessage.getSourceUserEntityId(), chatMessage.getTargetUserEntityId());
    }
    else {
      ChatRoom room = null;
      if (message.getTargetRoomId() != null) {
        room = chatRoomDAO.findById(chatMessage.getTargetRoomId());
      }
      usersToInform = room == null ? listOnlineUserEntityIds() : listRoomUserEntityIds(room);
    }
    try {
      ChatMessageRestModel msg = toRestModel(chatMessage);
      webSocketMessenger.sendMessage("chat:message-deleted", mapper.writeValueAsString(msg), usersToInform);
    }
    catch (JsonProcessingException e) {
      logger.severe(String.format("Message parse failure: %s", e.getMessage()));
    }
  }

  public String getNick(Long userEntityId) {
    ChatUserRestModel chatUser = users.get(userEntityId);
    return chatUser == null ? null : chatUser.getNick();
  }

  public String getNick(UserEntity userEntity) {
    return getNick(userEntity.getId());
  }
  
  public List<ChatUserRestModel> getBlockList(Long sourceUserEntityId) {
    Set<Long> userEntityIds = listHardBlockedUserEntityIds(sourceUserEntityId);
    List<ChatUserRestModel> chatUsers = new ArrayList<>();
    for (Long userEntityId : userEntityIds) {
      ChatUserRestModel chatUser = getChatUserRestModel(userEntityId);
      if (chatUser != null) {
        chatUsers.add(chatUser);
      }
    }
    return chatUsers;
  }
  
  public List<ChatUserRestModel> listChatUsers(boolean onlyOnline) {
    // Return a copy of our cache as the caller is likely to modify the result set
    List<ChatUserRestModel> chatUsers = new ArrayList<>();
    for (ChatUserRestModel chatUser : users.values()) {
      if (onlyOnline && !isOnline(chatUser.getId())) {
        continue;
      }
      chatUsers.add(new ChatUserRestModel(chatUser));
    }
    return chatUsers;
  }
  
  public Set<Long> listOnlineUserEntityIds() {
    return new HashSet<>(userSessions.keySet());
  }
  
  public Set<Long> listRoomUserEntityIds(ChatRoom chatRoom) {
    if (chatRoom.getType() == ChatRoomType.PUBLIC) {
      return listOnlineUserEntityIds();
    }
    Set<Long> users = roomUsers.get(chatRoom.getId());
    return users == null ? Collections.emptySet() : Collections.unmodifiableSet(users);
  }
  
  public ChatUserPresence getPresence(UserEntity userEntity) {
    return getPresence(userEntity.getId());
  }

  public ChatUserPresence getPresence(long userEntityId) {
    return users.containsKey(userEntityId) ? isOnline(userEntityId) ? ChatUserPresence.ONLINE : ChatUserPresence.OFFLINE : ChatUserPresence.DISABLED;
  }

  public boolean isOnline(UserEntity userEntity) {
    return userSessions.containsKey(userEntity.getId());
  }
  
  public boolean isOnline(long userEntityId) {
    return userSessions.containsKey(userEntityId);
  }
  
  public boolean isInRoom(UserEntity userEntity, ChatRoom chatRoom) {
    if (chatRoom.getType() == ChatRoomType.PUBLIC) {
      return true;
    }
    Set<Long> users = roomUsers.get(chatRoom.getId()) ;
    return users != null && users.contains(userEntity.getId());
  }
  
  public void createPublicRoom(String name, String description, UserEntity creator) {
    ChatRoom chatRoom = chatRoomDAO.create(name, description, creator.getId());
    ChatRoomRestModel room = toRestModel(chatRoom);
    
    // Inform all active chat users of a new public room
    
    try {
      webSocketMessenger.sendMessage("chat:room-created", mapper.writeValueAsString(room), listOnlineUserEntityIds());
    }
    catch (JsonProcessingException e) {
      logger.severe(String.format("Message parse failure: %s", e.getMessage()));
    }
  }
  
  public ChatRoom findChatRoomByIdAndArchived(Long roomId, Boolean archived) {
    return chatRoomDAO.findByIdAndArchived(roomId, archived);
  }
  
  public ChatMessage findChatMessageByIdAndArchived(Long messageId, Boolean archived) {
    return chatMessageDAO.findByIdAndArchived(messageId, archived);
  }

  public void updatePublicRoom(ChatRoom chatRoom, String name, String description, UserEntity modifier) {
    chatRoom = chatRoomDAO.update(chatRoom, name, description, modifier.getId());
    ChatRoomRestModel room = new ChatRoomRestModel("room-" + chatRoom.getId(), chatRoom.getName(), chatRoom.getDescription());
    
    // Inform all active chat users of an updated public room
    
    try {
      webSocketMessenger.sendMessage("chat:room-updated", mapper.writeValueAsString(room), listOnlineUserEntityIds());
    }
    catch (JsonProcessingException e) {
      logger.severe(String.format("Message parse failure: %s", e.getMessage()));
    }
  }
  
  public void deleteRoom(ChatRoom chatRoom, UserEntity remover) {
    
    // Remove
    
    chatRoomDAO.remove(chatRoom, remover.getId());
    roomUsers.remove(chatRoom.getId());

    // Inform all active chat users of a removed room 
    
    try {
      webSocketMessenger.sendMessage("chat:room-deleted", mapper.writeValueAsString(new ChatRoomDeletedRestModel("room-" + chatRoom.getId())), listOnlineUserEntityIds());
    }
    catch (JsonProcessingException e) {
      logger.severe(String.format("Message parse failure: %s", e.getMessage()));
    }
  }
  
  public List<ChatRoom> listRooms(UserEntity userEntity) {
    List<ChatRoom> userRooms = new ArrayList<>();
    List<ChatRoom> rooms = chatRoomDAO.listByArchived(Boolean.FALSE);
    for (ChatRoom room : rooms) {
      if (room.getType() == ChatRoomType.WORKSPACE) {
        WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(room.getWorkspaceEntityId());
        if (workspaceEntity == null || !workspaceUserEntityController.isWorkspaceMember(userEntity.defaultSchoolDataIdentifier(), workspaceEntity)) {
          continue;
        }
        else {
          // Ensure that the workspace user is in workspace room  
          addRoomUser(room.getId(), userEntity.getId());
        }
      }
      userRooms.add(room);
    }
    return userRooms;
  }
  
  public List<ChatMessage> listMessages(UserEntity sourceUserEntity, UserEntity targetUserEntity, Date earlierThan, Integer count) {
    List<ChatMessage> messages = chatMessageDAO.listBySourceUserAndTargetUserAndEarlierThan(sourceUserEntity.getId(), targetUserEntity.getId(), earlierThan, count);
    Collections.reverse(messages);
    return messages;
  }

  public List<ChatMessage> listMessages(ChatRoom chatRoom, Date earlierThan, Integer count) {
    List<ChatMessage> messages = chatMessageDAO.listByTargetRoomAndDate(chatRoom.getId(), earlierThan, count);
    Collections.reverse(messages);
    return messages;
  }
  
  public boolean isStaffMember(UserEntity userEntity) {
    ChatUserRestModel chatUser = users.get(userEntity.getId());
    return chatUser != null && chatUser.getType() == ChatUserType.STAFF;
  }

  public boolean isStudent(UserEntity userEntity) {
    ChatUserRestModel chatUser = users.get(userEntity.getId());
    return chatUser != null && chatUser.getType() == ChatUserType.STUDENT;
  }
  
  public boolean isChatEnabled(UserEntity userEntity) {
    return userEntity == null ? false : chatUserDAO.findByUserEntityId(userEntity.getId()) != null;
  }
  
  public void addBlock(Long sourceUserEntityId, Long targetUserEntityId, ChatBlockType blockType) {
    ConcurrentHashMap<Long, Set<Long>> map = blockType == ChatBlockType.SOFT ? softBlocks : hardBlocks;
    Set<Long> userEntityIds = map.get(sourceUserEntityId);
    if (userEntityIds == null) {
      userEntityIds = new HashSet<Long>();
      map.put(sourceUserEntityId, userEntityIds);
    }
    userEntityIds.add(targetUserEntityId);
    ChatBlock chatBlock = chatBlockDAO.findBySourceUserEntityIdAndTargetUserEntityId(sourceUserEntityId, targetUserEntityId);
    if (chatBlock == null) {
      chatBlock = chatBlockDAO.create(sourceUserEntityId, targetUserEntityId, blockType);
    }
    else {
      chatBlock = chatBlockDAO.update(chatBlock, blockType);
    }
  }
  
  public void removeBlock(Long sourceUserEntityId, Long targetUserEntityId) {
    ChatBlockType type = getBlockType(sourceUserEntityId, targetUserEntityId);
    ConcurrentHashMap<Long, Set<Long>> map = type == ChatBlockType.SOFT ? softBlocks : hardBlocks;
    Set<Long> blocks = map.get(sourceUserEntityId);
    if (blocks != null && blocks.contains(targetUserEntityId)) {
      blocks.remove(targetUserEntityId);
      ChatBlock chatBlock = chatBlockDAO.findBySourceUserEntityIdAndTargetUserEntityId(sourceUserEntityId, targetUserEntityId);
      if (chatBlock != null) {
        chatBlockDAO.delete(chatBlock);
      }
    }
  }
  
  public ChatBlockType getBlockType(Long sourceUserEntityId, Long targetUserEntityId) {
    Set<Long> blocks = softBlocks.get(sourceUserEntityId);
    if (blocks != null && blocks.contains(targetUserEntityId)) {
      return ChatBlockType.SOFT;
    }
    blocks = hardBlocks.get(sourceUserEntityId);
    if (blocks != null && blocks.contains(targetUserEntityId)) {
      return ChatBlockType.HARD;
    }
    return ChatBlockType.NONE;
  }
  
  public void toggleWorkspaceChatRoom(WorkspaceEntity workspaceEntity, String roomName, boolean enabled, UserEntity modifier) {
    ChatRoom room = chatRoomDAO.findByWorkspaceEntityId(workspaceEntity.getId());
    
    // Handle no change situations
    
    if (!enabled && (room == null || room.getArchived())) {
      return;
    }
    else if (enabled && (room != null && !room.getArchived() && StringUtils.equals(room.getName(), roomName))) {
      return;
    }
    
    // Toggle accordingly
    
    boolean created = false;
    boolean updated = false;
    boolean deleted = false;
    if (enabled) {
      if (room ==  null) {
        room = chatRoomDAO.create(roomName, workspaceEntity.getId(), modifier.getId());
        created = true;
      }
      else if (room.getArchived()) {
        room = chatRoomDAO.update(room, roomName, Boolean.FALSE, modifier.getId());
        created = true;
      }
      else if (!StringUtils.equals(room.getName(), roomName)) {
        room = chatRoomDAO.update(room, roomName, room.getDescription(), modifier.getId());
        updated = true;
      }
    }
    else {
      room = chatRoomDAO.update(room, room.getName(), Boolean.TRUE, modifier.getId());
      deleted = true;
    }
    
    // Figure out which of the active chat users need to be informed
    
    Set<Long> userIds = new HashSet<>();
    List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listActiveWorkspaceStudents(workspaceEntity);
    userIds = workspaceUsers.stream().map(wue -> wue.getUserSchoolDataIdentifier().getUserEntity().getId()).collect(Collectors.toSet());
    workspaceUsers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
    userIds.addAll(workspaceUsers.stream().map(wue -> wue.getUserSchoolDataIdentifier().getUserEntity().getId()).collect(Collectors.toSet()));
    
    // userIds now contains all workspace students and teachers, so narrow it down to only those currently in chat
    
    userIds.retainAll(listOnlineUserEntityIds());
    if (!userIds.isEmpty()) {
      
      // Add chat using workspace users to the newly created workspace room 
      
      if (created) {
        for (Long userId : userIds) {
          addRoomUser(room.getId(), userId);
        }
      }
      
      // Notify the people about the room having been created, updated, or deleted
      
      try {
        if (created) {
          webSocketMessenger.sendMessage("chat:room-created", mapper.writeValueAsString(toRestModel(room)), userIds);
        }
        else if (updated) {
          webSocketMessenger.sendMessage("chat:room-updated", mapper.writeValueAsString(toRestModel(room)), userIds);
        }
        else if (deleted) {
          roomUsers.remove(room.getId());
          webSocketMessenger.sendMessage("chat:room-deleted", mapper.writeValueAsString(new ChatRoomDeletedRestModel("room-" + room.getId())), userIds);
        }
      }
      catch (JsonProcessingException e) {
        logger.severe(String.format("Message parse failure: %s", e.getMessage()));
      }
    }
  }
  
  public boolean isChatEnabled(WorkspaceEntity workspaceEntity) {
    return workspaceEntity == null ? false : chatRoomDAO.findByWorkspaceEntityIdAndArchived(workspaceEntity.getId(), Boolean.FALSE) != null;
  }
  
  public ChatUser getChatUser(UserEntity userEntity) {
    return chatUserDAO.findByUserEntityId(userEntity.getId());
  }

  public ChatUser getChatUser(String nick) {
    return chatUserDAO.findByNick(nick);
  }
  
  public ChatUserRestModel getChatUserRestModel(Long userEntityId) {
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    return userEntity == null ? null : toRestModel(userEntity);
  }
  
  public void handleSettingsChange(UserEntity userEntity, ChatUserVisibility visibility, String nick, String sessionId) {
    boolean modified = false;
    ChatUser chatUser = chatUserDAO.findByUserEntityId(userEntity.getId());
    if (chatUser == null && visibility == ChatUserVisibility.NONE) {
      // Chat is off, nothing has changed
      return;
    }
    else if (chatUser == null && visibility != ChatUserVisibility.NONE) {
      // Chat has been turned on
      chatUser = chatUserDAO.create(userEntity.getId(), visibility, nick);
      handleUserEnter(userEntity, visibility, nick, sessionId);
      modified = true;
    }
    else if (chatUser != null && visibility == ChatUserVisibility.NONE) {
      // Chat has been turned off
      chatUserDAO.delete(chatUser);
      handleUserLeave(userEntity.getId(), true);
      modified = true;
    }
    else if (chatUser != null && (visibility != chatUser.getVisibility() || !StringUtils.equals(chatUser.getNick(), nick))) {
      // Chat is on but visibility or nick has changed
      if (visibility != chatUser.getVisibility()) {
        handleVisibilityChange(userEntity.getId(), visibility);
      }
      if (!StringUtils.equals(chatUser.getNick(), nick)) {
        handleNickChange(userEntity.getId(), visibility, nick);
      }
      chatUser = chatUserDAO.update(chatUser, visibility, nick);
      modified = true;
    }
    
    // Notify the user about settings change
    
    if (modified) {
      ChatSettingsRestModel settingsRestModel = new ChatSettingsRestModel();
      settingsRestModel.setNick(nick);
      settingsRestModel.setVisibility(visibility);
      try {
        webSocketMessenger.sendMessage("chat:settings-change", mapper.writeValueAsString(settingsRestModel), Set.of(userEntity.getId()));
      }
      catch (JsonProcessingException e) {
        logger.severe(String.format("Message parse failure: %s", e.getMessage()));
      }
    }
  }
  
  private void handleUserEnter(UserEntity userEntity, ChatUserVisibility visibility, String nick, String sessionId) {

    // Add session data for the user
    
    sessionUsers.put(sessionId, userEntity.getId());
    Set<String> sessions;
    if (userSessions.containsKey(userEntity.getId())) {
      sessions = userSessions.get(userEntity.getId());
      sessions.add(sessionId);
    }
    else {
      sessions = new HashSet<>();
      userSessions.put(userEntity.getId(), sessions);
    }
    sessions.add(sessionId);
    
    // Update user cache
    
    ChatUserRestModel chatUser = users.get(userEntity.getId());
    if (chatUser == null) {
      users.put(userEntity.getId(), toRestModel(chatUserDAO.findByUserEntityId(userEntity.getId())));
    }
    else {
      chatUser.setPresence(ChatUserPresence.ONLINE);
    }
    
    // Add user to their workspace rooms
    
    List<ChatRoom> rooms = listRooms(userEntity);
    for (ChatRoom room : rooms) {
      if (room.getType() == ChatRoomType.WORKSPACE) {
        addRoomUser(room.getId(), userEntity.getId());
      }
    }
    
    // Notify everyone of a new user
    
    String name = userEntityController.getName(userEntity.defaultSchoolDataIdentifier(), true).getDisplayNameWithLine();
    ChatUserRestModel userRestModel = new ChatUserRestModel(
        userEntity.getId(),
        nick,
        null,
        getUserType(userEntity),
        visibility,
        userProfilePictureController.hasProfilePicture(userEntity),
        ChatUserPresence.ONLINE);
    try {
      if (isStaffMember(userEntity)) {

        // If the new user is staff, everyone may know their real name

        userRestModel.setName(name);
        Set<Long> userEntityIds = visibility == ChatUserVisibility.STAFF ? listOnlineUserEntityIds(ChatUserType.STAFF) : listOnlineUserEntityIds();
        userEntityIds.remove(userEntity.getId()); // don't send message to ourselves
        webSocketMessenger.sendMessage("chat:user-joined", mapper.writeValueAsString(userRestModel), userEntityIds);
      }
      else {

        // If the new user is student, only staff may know their real name

        if (visibility == ChatUserVisibility.ALL) {
          Set<Long> userEntityIds = listOnlineUserEntityIds(ChatUserType.STUDENT);
          userEntityIds.remove(userEntity.getId()); // don't send message to ourselves
          if (!userEntityIds.isEmpty()) {
            webSocketMessenger.sendMessage("chat:user-joined", mapper.writeValueAsString(userRestModel), userEntityIds);
          }
        }
        Set<Long> userEntityIds = listOnlineUserEntityIds(ChatUserType.STAFF);
        userEntityIds.remove(userEntity.getId()); // don't send message to ourselves
        if (!userEntityIds.isEmpty()) {
          userRestModel.setName(name);
          webSocketMessenger.sendMessage("chat:user-joined", mapper.writeValueAsString(userRestModel), userEntityIds);
        }
      }
    }
    catch (JsonProcessingException e) {
      logger.severe(String.format("Message parse failure: %s", e.getMessage()));
    }
  }

  private void handleUserLeave(Long userEntityId, boolean permanent) {
    
    // Remove all session data related to the user
    
    Set<String> sessionIds = userSessions.get(userEntityId);
    if (sessionIds != null) {
      for (String sessionId : sessionIds) {
        sessionUsers.remove(sessionId);
      }
    }
    userSessions.remove(userEntityId);
    Set<Long> roomIds = roomUsers.keySet();
    for (Long roomId : roomIds) {
      Set<Long> users = roomUsers.get(roomId);
      if (users != null && users.contains(userEntityId)) {
        users.remove(userEntityId);
      }
    }
    
    // Update user cache
    
    ChatUserRestModel chatUser = users.get(userEntityId);
    if (chatUser != null) {
      if (permanent) {
        users.remove(userEntityId);
      }
      else {
        chatUser.setPresence(ChatUserPresence.OFFLINE);
      }
    }
    
    // Notify the remaining users that the user has left
    
    if (!userSessions.isEmpty()) {
      try {
        ChatUserLeftRestModel userLeft = new ChatUserLeftRestModel(userEntityId, permanent);
        webSocketMessenger.sendMessage("chat:user-left", mapper.writeValueAsString(userLeft), listOnlineUserEntityIds());
      }
      catch (JsonProcessingException e) {
        logger.severe(String.format("Message parse failure: %s", e.getMessage()));
      }
    }
  }
  
  private void handleVisibilityChange(Long userEntityId, ChatUserVisibility visibility) {
    ChatUserRestModel chatUser = users.get(userEntityId);
    if (chatUser != null) {
      chatUser.setVisibility(visibility);
    }
    if (visibility == ChatUserVisibility.ALL) {
      // Visible to all, so let other students know the person is now around
      Set<Long> userEntityIds = listOnlineUserEntityIds(ChatUserType.STUDENT);
      userEntityIds.remove(userEntityId); // don't send message to ourselves
      if (!userEntityIds.isEmpty()) {
        try {
          webSocketMessenger.sendMessage("chat:user-joined", mapper.writeValueAsString(chatUser), userEntityIds);
        }
        catch (JsonProcessingException e) {
          logger.severe(String.format("Message parse failure: %s", e.getMessage()));
        }
      }
    }
    else if (visibility == ChatUserVisibility.STAFF) {
      // Visible to staff, so let other students know the person not around
      Set<Long> userEntityIds = listOnlineUserEntityIds(ChatUserType.STUDENT);
      userEntityIds.remove(userEntityId); // don't send message to ourselves
      if (!userEntityIds.isEmpty()) {
        try {
          ChatUserLeftRestModel userLeft = new ChatUserLeftRestModel(userEntityId, true);
          webSocketMessenger.sendMessage("chat:user-left", mapper.writeValueAsString(userLeft), userEntityIds);
        }
        catch (JsonProcessingException e) {
          logger.severe(String.format("Message parse failure: %s", e.getMessage()));
        }
      }
    }
    else {
      
    }
  }
  
  private void handleNickChange(Long userEntityId, ChatUserVisibility visibility, String nick) {
    ChatUserRestModel chatUser = users.get(userEntityId);
    if (chatUser != null) {
      chatUser.setNick(nick);
    }
    try {
      NickChangeRestModel nickChange = new NickChangeRestModel(userEntityId, nick); 
      if (visibility == ChatUserVisibility.STAFF) {
        webSocketMessenger.sendMessage("chat:nick-change", mapper.writeValueAsString(nickChange), listOnlineUserEntityIds(ChatUserType.STAFF));
      }
      else {
        webSocketMessenger.sendMessage("chat:nick-change", mapper.writeValueAsString(nickChange), listOnlineUserEntityIds());
      }
    }
    catch (JsonProcessingException e) {
      logger.severe(String.format("Message parse failure: %s", e.getMessage()));
    }
  }
  
  private void addRoomUser(Long roomId, Long userEntityId) {
    Set<Long> users = roomUsers.get(roomId);
    if (users == null) {
      users = new HashSet<>();
      users.add(userEntityId);
      roomUsers.put(roomId, users);
    }
    if (!users.contains(userEntityId)) {
      users.add(userEntityId);
    }
  }
  
  private ChatUserType getUserType(UserEntity userEntity) {
    return isStaffMember(userEntity) ? ChatUserType.STAFF : ChatUserType.STUDENT;
  }
  
  public ChatMessageRestModel toRestModel(ChatMessage message) {
    ChatMessageRestModel msg = new ChatMessageRestModel();
    msg.setId(message.getId());
    msg.setSourceUserEntityId(message.getSourceUserEntityId());
    if (message.getTargetRoomId() != null) {
      msg.setTargetIdentifier("room-" + message.getTargetRoomId());
    }
    else {
      msg.setTargetIdentifier("user-" + message.getTargetUserEntityId());
    }
    msg.setNick(getNick(message.getSourceUserEntityId()));
    msg.setHasImage(userProfilePictureController.hasProfilePicture(message.getSourceUserEntityId()));
    msg.setMessage(message.getArchived() ? null : message.getMessage());
    msg.setSentDateTime(message.getSent());
    msg.setEditedDateTime(message.getEdited());
    msg.setArchived(message.getArchived());
    return msg;
  }
  
  public ChatRoomRestModel toRestModel(ChatRoom room) {
    ChatRoomRestModel restRoom = new ChatRoomRestModel();
    restRoom.setIdentifier("room-" + room.getId());
    restRoom.setName(room.getName());
    restRoom.setDescription(room.getDescription());
    restRoom.setType(room.getType());
    restRoom.setWorkspaceEntityId(room.getWorkspaceEntityId());
    return restRoom;
  }
  
  public ChatUserRestModel toRestModel(UserEntity userEntity) {
    ChatUser chatUser = chatUserDAO.findByUserEntityId(userEntity.getId());
    return new ChatUserRestModel(
        userEntity.getId(),
        chatUser == null ? null : chatUser.getNick(),
        userEntityController.getName(userEntity.defaultSchoolDataIdentifier(), true).getDisplayNameWithLine(),
        userEntityController.isStudent(userEntity) ? ChatUserType.STUDENT : ChatUserType.STAFF,
        chatUser == null ? ChatUserVisibility.NONE : chatUser.getVisibility(),
        userProfilePictureController.hasProfilePicture(userEntity),
        chatUser == null ? ChatUserPresence.DISABLED : isOnline(userEntity) ? ChatUserPresence.ONLINE : ChatUserPresence.OFFLINE);
  }

  public ChatUserRestModel toRestModel(ChatUser chatUser) {
    UserEntity userEntity = userEntityController.findUserEntityById(chatUser.getUserEntityId());
    return userEntity == null ? null : toRestModel(userEntity);
  }
  
  private Set<Long> listOnlineUserEntityIds(ChatUserType type) {
    Set<Long> userEntityIds = new HashSet<>();
    for (ChatUserRestModel chatUser : users.values()) {
      if (chatUser.getType() == type) {
        userEntityIds.add(chatUser.getId());
      }
    }
    return userEntityIds;
  }

  private Set<Long> listHardBlockedUserEntityIds(Long sourceUserEntityId) {
    return hardBlocks.containsKey(sourceUserEntityId) ? Collections.unmodifiableSet(hardBlocks.get(sourceUserEntityId)) : Collections.emptySet();
  }

  // UserEntityId -> ChatUserRestModel
  private ConcurrentHashMap<Long, ChatUserRestModel> users;

  // ChatRoomId -> Set<UserEntityId>
  private ConcurrentHashMap<Long, Set<Long>> roomUsers;
  
  // HttpSessionId -> UserEntityId
  private ConcurrentHashMap<String, Long> sessionUsers;
  
  // UserEntityId -> List<HttpSessionId>
  private ConcurrentHashMap<Long, Set<String>> userSessions;
  
  // UserEntityId -> Set<UserEntityId>
  private ConcurrentHashMap<Long, Set<Long>> softBlocks;

  // UserEntityId -> Set<UserEntityId>
  private ConcurrentHashMap<Long, Set<Long>> hardBlocks;
  
  private ObjectMapper mapper;

}
