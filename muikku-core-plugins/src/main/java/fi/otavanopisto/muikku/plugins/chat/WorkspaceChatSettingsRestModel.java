package fi.otavanopisto.muikku.plugins.chat;

import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;

public class WorkspaceChatSettingsRestModel {

  public WorkspaceChatSettingsRestModel() {
    
  }
  
  public WorkspaceChatSettingsRestModel(Long id, Long workspaceEntityId, WorkspaceChatStatus status) {
    this.id = id;
    this.workspaceEntityId = workspaceEntityId;
    this.status = status;
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
    return status;
  }

  public void setChatStatus(WorkspaceChatStatus status) {
    this.status = status;
  }

  private Long id;

  private Long workspaceEntityId;

  private WorkspaceChatStatus status;

}
