package fi.otavanopisto.muikku.plugins.chat;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.chat.dao.ChatBlockDAO;
import fi.otavanopisto.muikku.plugins.chat.model.ChatBlock;
import fi.otavanopisto.muikku.plugins.chat.model.ChatBlockType;

public class ChatBlockHandler {
  
  @Inject
  private ChatBlockDAO chatBlockDAO;
  
  public ChatBlockHandler() {
    softBlocks = new ConcurrentHashMap<>();
    hardBlocks = new ConcurrentHashMap<>();
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
  
  public Set<Long> listHardBlockedUserEntityIds(Long sourceUserEntityId) {
    return hardBlocks.contains(sourceUserEntityId) ? Collections.unmodifiableSet(hardBlocks.get(sourceUserEntityId)) : Collections.emptySet();
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

  // UserEntityId -> Set<UserEntityId>
  private ConcurrentHashMap<Long, Set<Long>> softBlocks;

  // UserEntityId -> UserEntityId
  private ConcurrentHashMap<Long, Set<Long>> hardBlocks;

}
