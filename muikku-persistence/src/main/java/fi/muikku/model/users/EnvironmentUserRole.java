package fi.muikku.model.users;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class EnvironmentUserRole extends UserRole {

  @Override
  public UserRoleType getType() {
    return UserRoleType.ENVIRONMENT;
  }

}
