package fi.muikku.schooldata.events;

import java.io.Serializable;

public class UserEvent implements Serializable {

  private static final long serialVersionUID = -7621446771299606028L;

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  private Long userEntityId;
}
