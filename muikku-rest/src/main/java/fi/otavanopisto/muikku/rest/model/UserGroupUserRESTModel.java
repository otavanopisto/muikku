package fi.otavanopisto.muikku.rest.model;

public class UserGroupUserRESTModel {
  public UserGroupUserRESTModel(Long id, Long userEntityId) {
    super();
    this.id = id;
    this.userEntityId = userEntityId;
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
