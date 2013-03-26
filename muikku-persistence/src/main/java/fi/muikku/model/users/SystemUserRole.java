package fi.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;


@Entity
@PrimaryKeyJoinColumn(name="id")
public class SystemUserRole extends UserRole {

  @Override
  public UserRoleType getType() {
    return UserRoleType.SYSTEM;
  }
  
  public void setSystemUserRoleType(SystemUserRoleType type) {
    this.systemUserRoleType = type;
  }

  public SystemUserRoleType getSystemUserRoleType() {
    return systemUserRoleType;
  }

  @NotNull
  @Column (nullable = false)
  @Enumerated (EnumType.STRING)
  private SystemUserRoleType systemUserRoleType;
}
