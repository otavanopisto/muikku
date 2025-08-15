package fi.otavanopisto.muikku.plugins.pedagogy.rest;

public class PedagogyFormLockRestModel {
  
  public PedagogyFormLockRestModel() {
  }
  
  public PedagogyFormLockRestModel(boolean locked, Long userEntityId, String userName) {
    this.locked = locked;
    this.userEntityId = userEntityId;
    this.userName = userName;
  }

  public boolean isLocked() {
    return locked;
  }

  public void setLocked(boolean locked) {
    this.locked = locked;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  private boolean locked;
  private Long userEntityId;
  private String userName;

}
