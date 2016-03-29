package fi.otavanopisto.muikku.model.workspace;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.UserRoleType;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceRoleEntity extends RoleEntity {

  @Override
  public UserRoleType getType() {
    return UserRoleType.WORKSPACE;
  }
  
  public WorkspaceRoleArchetype getArchetype() {
    return archetype;
  }
  
  public void setArchetype(WorkspaceRoleArchetype archetype) {
    this.archetype = archetype;
  }
  
  @Column (nullable = false)
  @Enumerated (EnumType.STRING)
  private WorkspaceRoleArchetype archetype;
}
