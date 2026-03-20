package fi.otavanopisto.muikku.plugins.event.rest;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

public class MuikkuEventRestModel {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getEventId() {
    return eventId;
  }

  public void setEventId(Long eventId) {
    this.eventId = eventId;
  }

  public Long getEventContainerId() {
    return eventContainerId;
  }

  public void setEventContainerId(Long eventContainerId) {
    this.eventContainerId = eventContainerId;
  }

  public boolean isInvitation() {
    return invitation;
  }

  public void setInvitation(boolean invitation) {
    this.invitation = invitation;
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

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Long getCreator() {
    return creator;
  }

  public void setCreator(Long creator) {
    this.creator = creator;
  }

  public List<MuikkuEventParticipantRestModel> getParticipants() {
    return participants;
  }

  public void setParticipants(List<MuikkuEventParticipantRestModel> participants) {
    this.participants = participants;
  }
  
  public void addParticipant(MuikkuEventParticipantRestModel participant) {
    this.participants.add(participant);
  }

  public List<MuikkuEventPropertyRestModel> getProperties() {
    return properties;
  }

  public void setProperties(List<MuikkuEventPropertyRestModel> properties) {
    this.properties = properties;
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

  public boolean isPrivate() {
    return isPrivate;
  }

  public void setPrivate(boolean isPrivate) {
    this.isPrivate = isPrivate;
  }

  private Long id;
  private Long eventId;
  private Long eventContainerId;
  private boolean invitation;
  private OffsetDateTime start;
  private OffsetDateTime end;
  private boolean allDay;
  private String title;
  private String description;
  private String type;
  private boolean isPrivate;
  private Long userEntityId;
  private Long creator;
  private List<MuikkuEventParticipantRestModel> participants = new ArrayList<>();
  private List<MuikkuEventPropertyRestModel> properties = new ArrayList<>();
  private boolean editable;
  private boolean removable;

}
