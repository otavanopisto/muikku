package fi.otavanopisto.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class EnvironmentRoleEntity extends RoleEntity {

  @Override
  public UserRoleType getType() {
    return UserRoleType.ENVIRONMENT;
  }
  
  public EnvironmentRoleArchetype getArchetype() {
    return archetype;
  }
  
  public void setArchetype(EnvironmentRoleArchetype archetype) {
    this.archetype = archetype;
  }
  
  @Column (nullable = false)
  @Enumerated (EnumType.STRING)
  private EnvironmentRoleArchetype archetype;

}
