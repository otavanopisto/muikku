package fi.otavanopisto.muikku.plugins.calendar.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Entity
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "event_id", "userEntityId" }) })
public class CalendarEventParticipant {
  
  public CalendarEventParticipant() {
  }

  public CalendarEventParticipant(Long userEntityId, CalendarEventAttendance attendance) {
    this.userEntityId = userEntityId;
    this.attendance = attendance;
  }

  public Long getId() {
    return id;
  }

  public CalendarEvent getEvent() {
    return event;
  }

  public void setEvent(CalendarEvent event) {
    this.event = event;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public CalendarEventAttendance getAttendance() {
    return attendance;
  }

  public void setAttendance(CalendarEventAttendance attendance) {
    this.attendance = attendance;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof CalendarEventParticipant)) {
      return false;
    }
    return id != null && id.equals(((CalendarEventParticipant) o).getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  private CalendarEvent event;

  @NotNull
  @Column(nullable = false)
  private Long userEntityId;

  @NotNull
  @Column(nullable = false)
  @Enumerated (EnumType.STRING)
  private CalendarEventAttendance attendance;

}
