package fi.otavanopisto.muikku.plugins.me;

import fi.otavanopisto.muikku.model.users.UserOnlineStatus;

public class OnlineStatusSelectionRestModel {

  public OnlineStatusSelectionRestModel() {
  }
  
  public UserOnlineStatus getOnlineStatus() {
    return onlineStatus;
  }

  public void setOnlineStatus(UserOnlineStatus onlineStatus) {
    this.onlineStatus = onlineStatus;
  }

  private UserOnlineStatus onlineStatus;
}
