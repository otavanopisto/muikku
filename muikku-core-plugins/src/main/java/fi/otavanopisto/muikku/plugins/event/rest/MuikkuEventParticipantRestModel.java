package fi.otavanopisto.muikku.plugins.event.rest;

import fi.otavanopisto.muikku.plugins.event.model.EventAttendance;

public class MuikkuEventParticipantRestModel {

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

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public EventAttendance getAttendance() {
    return attendance;
  }

  public void setAttendance(EventAttendance attendance) {
    this.attendance = attendance;
  }

  private Long userEntityId;
  private String userName;
  private String name;
  private EventAttendance attendance;

}
