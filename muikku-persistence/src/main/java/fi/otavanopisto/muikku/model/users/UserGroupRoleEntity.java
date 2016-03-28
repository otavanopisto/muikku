package fi.otavanopisto.muikku.model.users;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class UserGroupRoleEntity extends RoleEntity {

  @Override
  public UserRoleType getType() {
    return UserRoleType.GROUP;
  }

}
