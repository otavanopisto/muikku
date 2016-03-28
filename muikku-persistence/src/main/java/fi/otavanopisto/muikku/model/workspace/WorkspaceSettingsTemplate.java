package fi.otavanopisto.muikku.model.workspace;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class WorkspaceSettingsTemplate {

  public Long getId() {
    return id;
  }

  public WorkspaceRoleEntity getDefaultWorkspaceUserRole() {
    return defaultWorkspaceUserRole;
  }

  public void setDefaultWorkspaceUserRole(WorkspaceRoleEntity defaultWorkspaceUserRole) {
    this.defaultWorkspaceUserRole = defaultWorkspaceUserRole;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceRoleEntity defaultWorkspaceUserRole;
}
