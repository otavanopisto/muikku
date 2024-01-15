package fi.otavanopisto.muikku.plugins.chat.rest;

import fi.otavanopisto.muikku.plugins.chat.model.ChatBlockType;

public class ChatBlockRestModel {

  public Long getTargetUserEntityId() {
    return targetUserEntityId;
  }

  public void setTargetUserEntityId(Long targetUserEntityId) {
    this.targetUserEntityId = targetUserEntityId;
  }

  public ChatBlockType getBlockType() {
    return blockType;
  }

  public void setBlockType(ChatBlockType blockType) {
    this.blockType = blockType;
  }

  private Long targetUserEntityId;
  private ChatBlockType blockType;

}
