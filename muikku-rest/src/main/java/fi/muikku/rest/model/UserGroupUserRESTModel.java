package fi.muikku.rest.model;

import fi.muikku.model.users.UserGroupUser;

public class UserGroupUserRESTModel {
  public UserGroupUserRESTModel(Long id, Long userEntityId) {
    super();
    this.id = id;
    this.userEntityId = userEntityId;
  }
  public UserGroupUserRESTModel(UserGroupUser userGroupUser) {
    this(userGroupUser.getId(), userGroupUser.getUser().getId());
  }
  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public Long getUserEntityId() {
    return userEntityId;
  }
  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }
  private Long id;
  private Long userEntityId;
}
