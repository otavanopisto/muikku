package fi.otavanopisto.muikku.plugins.event.model;

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
@Table
public class MuikkuEventParticipant {
  
  public MuikkuEventParticipant() {
  }

  public MuikkuEventParticipant(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Long getId() {
    return id;
  }

  public MuikkuEvent getEvent() {
    return muikkuEvent;
  }

  public void setEvent(MuikkuEvent muikkuEvent) {
    this.muikkuEvent = muikkuEvent;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public EventAttendance getAttendance() {
    return attendance;
  }

  public void setAttendance(EventAttendance attendance) {
    this.attendance = attendance;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @NotNull
  private MuikkuEvent muikkuEvent;

  @NotNull
  @Column(nullable = false)
  private Long userEntityId;

  @NotNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private EventAttendance attendance;

}
