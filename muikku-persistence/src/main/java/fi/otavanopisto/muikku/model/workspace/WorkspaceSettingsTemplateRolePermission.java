package fi.otavanopisto.muikku.model.workspace;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.otavanopisto.muikku.model.security.RolePermission;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceSettingsTemplateRolePermission extends RolePermission {

  // TODO: Unique all?
  
  public WorkspaceSettingsTemplate getWorkspaceSettingsTemplate() {
    return workspaceSettingsTemplate;
  }

  public void setWorkspaceSettingsTemplate(WorkspaceSettingsTemplate workspaceSettingsTemplate) {
    this.workspaceSettingsTemplate = workspaceSettingsTemplate;
  }

  @ManyToOne
  private WorkspaceSettingsTemplate workspaceSettingsTemplate;
}
