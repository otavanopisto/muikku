package fi.otavanopisto.muikku.plugins.communicator.rest;

import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;

/**
 * REST model for workspace group message recipient.
 */
public class CommunicatorMessageRecipientWorkspaceGroupRESTModel {

  public CommunicatorMessageRecipientWorkspaceGroupRESTModel() {
  }
  
  public CommunicatorMessageRecipientWorkspaceGroupRESTModel(Long workspaceEntityId, WorkspaceRoleArchetype archetype, String workspaceName, String workspaceExtension) {
    this.workspaceEntityId = workspaceEntityId;
    this.archetype = archetype;
    this.workspaceName = workspaceName;
    this.workspaceExtension = workspaceExtension;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public WorkspaceRoleArchetype getArchetype() {
    return archetype;
  }

  public void setArchetype(WorkspaceRoleArchetype archetype) {
    this.archetype = archetype;
  }

  public String getWorkspaceName() {
    return workspaceName;
  }

  public void setWorkspaceName(String workspaceName) {
    this.workspaceName = workspaceName;
  }

  public String getWorkspaceExtension() {
    return workspaceExtension;
  }

  public void setWorkspaceExtension(String workspaceExtension) {
    this.workspaceExtension = workspaceExtension;
  }

  private Long workspaceEntityId;
  private WorkspaceRoleArchetype archetype;
  private String workspaceName;
  private String workspaceExtension;
}