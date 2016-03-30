package fi.otavanopisto.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.otavanopisto.muikku.model.users.UserGroupEntity;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class UserGroupRolePermission extends RolePermission {

  // TODO: Unique all?

  public UserGroupEntity getUserGroup() {
    return userGroup;
  }

  public void setUserGroup(UserGroupEntity userGroup) {
    this.userGroup = userGroup;
  }

  @ManyToOne
  private UserGroupEntity userGroup;
}
