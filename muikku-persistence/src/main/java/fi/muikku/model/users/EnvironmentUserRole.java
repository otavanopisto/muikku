package fi.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class EnvironmentUserRole extends UserRole {

  @Override
  public UserRoleType getType() {
    return UserRoleType.ENVIRONMENT;
  }

  public EnvironmentUserRoleType getEnvironmentUserRoleType() {
		return environmentUserRoleType;
	}
  
  public void setEnvironmentUserRoleType(EnvironmentUserRoleType environmentUserRoleType) {
		this.environmentUserRoleType = environmentUserRoleType;
	}

  @NotNull
  @Column (nullable = false)
  @Enumerated (EnumType.STRING)
  private EnvironmentUserRoleType environmentUserRoleType;
}
