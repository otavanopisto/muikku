package fi.otavanopisto.muikku.plugins.calendar.rest;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventVisibility;

public class CalendarEventRestModel {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public OffsetDateTime getBegins() {
    return begins;
  }

  public void setBegins(OffsetDateTime begins) {
    this.begins = begins;
  }

  public OffsetDateTime getEnds() {
    return ends;
  }

  public void setEnds(OffsetDateTime ends) {
    this.ends = ends;
  }

  public boolean isAllDay() {
    return allDay;
  }

  public void setAllDay(boolean allDay) {
    this.allDay = allDay;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public CalendarEventVisibility getVisibility() {
    return visibility;
  }

  public void setVisibility(CalendarEventVisibility visibility) {
    this.visibility = visibility;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public List<CalendarEventParticipantRestModel> getParticipants() {
    return participants;
  }

  public void setParticipants(List<CalendarEventParticipantRestModel> participants) {
    this.participants = participants;
  }
  
  public void addParticipant(CalendarEventParticipantRestModel participant) {
    this.participants.add(participant);
  }

  public boolean isEditable() {
    return editable;
  }

  public void setEditable(boolean editable) {
    this.editable = editable;
  }

  public boolean isRemovable() {
    return removable;
  }

  public void setRemovable(boolean removable) {
    this.removable = removable;
  }

  private Long id;
  private OffsetDateTime begins;
  private OffsetDateTime ends;
  private boolean allDay;
  private String title;
  private String description;
  private CalendarEventVisibility visibility;
  private Long userEntityId;
  private List<CalendarEventParticipantRestModel> participants = new ArrayList<>();
  private boolean editable;
  private boolean removable;

}
