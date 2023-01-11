package fi.otavanopisto.muikku.events;

import java.io.Serializable;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class LogoutEvent implements Serializable {

  private static final long serialVersionUID = 5856268846540953913L;

  public LogoutEvent(Long userEntityId, SchoolDataIdentifier userIdentifier) {
    this.userEntityId = userEntityId;
    this.userIdentifier = userIdentifier;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public SchoolDataIdentifier getUserIdentifier() {
    return userIdentifier;
  }

  private final Long userEntityId;
  private final SchoolDataIdentifier userIdentifier;
}
