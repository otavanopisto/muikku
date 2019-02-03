package fi.otavanopisto.muikku.plugins.chat;

import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;

public class WorkspaceChatSettingsRestModel {

  public WorkspaceChatSettingsRestModel() {
    
  }
  
  public WorkspaceChatSettingsRestModel(Long id, Long workspaceEntityId, WorkspaceChatStatus chatStatus) {
    this.id = id;
    this.workspaceEntityId = workspaceEntityId;
    this.chatStatus = chatStatus;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public WorkspaceChatStatus getChatStatus() {
    return chatStatus;
  }

  public void setChatStatus(WorkspaceChatStatus chatStatus) {
    this.chatStatus = chatStatus;
  }

  private Long id;

  private Long workspaceEntityId;

  private WorkspaceChatStatus chatStatus;

}
