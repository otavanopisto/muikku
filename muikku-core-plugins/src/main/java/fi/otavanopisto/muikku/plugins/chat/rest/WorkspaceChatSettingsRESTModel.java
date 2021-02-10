package fi.otavanopisto.muikku.plugins.chat.rest;

import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;

public class WorkspaceChatSettingsRESTModel {

  public WorkspaceChatSettingsRESTModel() {
    
  }
  
  public WorkspaceChatSettingsRESTModel(Long workspaceEntityId, WorkspaceChatStatus chatStatus) {
    this.workspaceEntityId = workspaceEntityId;
    this.chatStatus = chatStatus;
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

  private Long workspaceEntityId;

  private WorkspaceChatStatus chatStatus;

}
