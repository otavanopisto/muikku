package fi.otavanopisto.muikku.plugins.chat.rest;

import fi.otavanopisto.muikku.plugins.chat.model.ChatRoomType;

public class ChatRoomRestModel {
  
  public ChatRoomRestModel() {
  }

  public ChatRoomRestModel(Long id, String name, String description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = ChatRoomType.PUBLIC;
  }

  public ChatRoomRestModel(Long id, String name, Long workspaceEntityId) {
    this.id = id;
    this.name = name;
    this.workspaceEntityId = workspaceEntityId;
    this.type = ChatRoomType.WORKSPACE;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public String getDescription() {
    return description;
  }
  
  public void setDescription(String description) {
    this.description = description;
  }
  
  public ChatRoomType getType() {
    return type;
  }
  
  public void setType(ChatRoomType type) {
    this.type = type;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }
  
  private Long id;
  private String name;
  private String description;
  private ChatRoomType type;
  private Long workspaceEntityId;
  
}
