package fi.otavanopisto.muikku.plugins.online;

public class OnlineStatusChange {

  public OnlineStatusChange() {
  }
  
  public OnlineStatusChange(Long userEntityId, OnlineStatus status) {
    this.userEntityId = userEntityId;
    this.status = status;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public OnlineStatus getStatus() {
    return status;
  }

  public void setStatus(OnlineStatus status) {
    this.status = status;
  }

  private Long userEntityId;
  private OnlineStatus status;
}
