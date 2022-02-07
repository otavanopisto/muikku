package fi.otavanopisto.muikku.plugins.calendar.rest;

import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventAttendance;

public class CalendarEventParticipantRestModel {

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public CalendarEventAttendance getAttendance() {
    return attendance;
  }

  public void setAttendance(CalendarEventAttendance attendance) {
    this.attendance = attendance;
  }

  private Long userEntityId;
  private String name;
  private CalendarEventAttendance attendance;

}
