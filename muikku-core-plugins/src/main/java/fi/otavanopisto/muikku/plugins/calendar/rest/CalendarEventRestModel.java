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

  public OffsetDateTime getStart() {
    return start;
  }

  public void setStart(OffsetDateTime start) {
    this.start = start;
  }

  public OffsetDateTime getEnd() {
    return end;
  }

  public void setEnd(OffsetDateTime end) {
    this.end = end;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  private Long id;
  private OffsetDateTime start;
  private OffsetDateTime end;
  private boolean allDay;
  private String title;
  private String description;
  private CalendarEventVisibility visibility;
  private String type;
  private Long userEntityId;
  private List<CalendarEventParticipantRestModel> participants = new ArrayList<>();
  private boolean editable;
  private boolean removable;

}
