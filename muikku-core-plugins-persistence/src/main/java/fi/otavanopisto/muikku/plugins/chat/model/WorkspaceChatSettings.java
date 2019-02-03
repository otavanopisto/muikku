package fi.otavanopisto.muikku.plugins.chat.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity

public class WorkspaceChatSettings {
  
  public WorkspaceChatSettings() {
    
  }
  
  public WorkspaceChatSettings(Long workspaceEntityId, WorkspaceChatStatus workspaceChatStatus) {
    super();
    this.workspaceEntityId = workspaceEntityId;
    this.status = workspaceChatStatus;
  }

  public Long getId() {
    return id;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public WorkspaceChatStatus getStatus() {
    return status;
  }

  public void setStatus(WorkspaceChatStatus status) {
    this.status = status;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Column(nullable = false, unique = true)
  private Long workspaceEntityId;

  @NotNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private WorkspaceChatStatus status;


}