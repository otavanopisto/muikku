package fi.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class EnvironmentRoleEntity extends RoleEntity {

  @Override
  public UserRoleType getType() {
    return UserRoleType.ENVIRONMENT;
  }

  public EnvironmentRoleType getEnvironmentRoleType() {
		return environmentRoleType;
	}
  
  public void setEnvironmentRoleType(EnvironmentRoleType environmentRoleType) {
		this.environmentRoleType = environmentRoleType;
	}

  @NotNull
  @Column (nullable = false)
  @Enumerated (EnumType.STRING)
  private EnvironmentRoleType environmentRoleType;
}
