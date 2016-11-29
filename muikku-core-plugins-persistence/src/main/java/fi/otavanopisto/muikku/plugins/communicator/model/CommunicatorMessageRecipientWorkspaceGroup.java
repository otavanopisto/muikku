package fi.otavanopisto.muikku.plugins.communicator.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class CommunicatorMessageRecipientWorkspaceGroup extends CommunicatorMessageRecipientGroup {

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

  @Column (nullable = false)
  @NotNull
  private Long workspaceEntityId;
  
  @Column (nullable = false)
  @Enumerated (EnumType.STRING)
  private WorkspaceRoleArchetype archetype;
}
