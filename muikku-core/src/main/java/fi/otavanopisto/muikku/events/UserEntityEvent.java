package fi.otavanopisto.muikku.events;

import java.io.Serializable;

public class UserEntityEvent implements Serializable {

  private static final long serialVersionUID = 7196867806966120737L;

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  private Long userEntityId;
}
