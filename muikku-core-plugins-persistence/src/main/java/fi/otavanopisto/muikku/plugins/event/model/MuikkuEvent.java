package fi.otavanopisto.muikku.plugins.event.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@Entity
@Table(
    indexes = {
        @Index(columnList = "start, end, type, userEntityId")
    }
)
public class MuikkuEvent {

  public Long getId() {
    return id;
  }

  public MuikkuEventContainer getEventContainer() {
    return eventContainer;
  }

  public void setEventContainer(MuikkuEventContainer eventContainer) {
    this.eventContainer = eventContainer;
  }

  public Long getEventId() {
    return eventId;
  }

  public void setEventId(Long eventId) {
    this.eventId = eventId;
  }

  public Date getStart() {
    return start;
  }

  public void setStart(Date start) {
    this.start = start;
  }

  public Date getEnd() {
    return end;
  }

  public void setEnd(Date end) {
    this.end = end;
  }

  public Boolean getAllDay() {
    return allDay;
  }

  public void setAllDay(Boolean allDay) {
    this.allDay = allDay;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public EventType getType() {
    return type;
  }

  public void setType(EventType type) {
    this.type = type;
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

  public Long getCreatorEntityId() {
    return creatorEntityId;
  }

  public void setCreatorEntityId(Long creatorEntityId) {
    this.creatorEntityId = creatorEntityId;
  }

  public boolean isPrivate() {
    return isPrivate;
  }

  public void setPrivate(boolean isPrivate) {
    this.isPrivate = isPrivate;
  }

  public boolean isEditableByUser() {
    return editableByUser;
  }

  public void setEditableByUser(boolean editableByUser) {
    this.editableByUser = editableByUser;
  }

  public boolean isRemovableByUser() {
    return removableByUser;
  }

  public void setRemovableByUser(boolean removableByUser) {
    this.removableByUser = removableByUser;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "eventContainerId")
  private MuikkuEventContainer eventContainer;
  
  @Column
  private Long eventId;
  
  @NotNull
  @Column(nullable = false)
  @Temporal(value=TemporalType.TIMESTAMP)
  private Date start;

  @NotNull
  @Column(nullable = false)
  @Temporal(value=TemporalType.TIMESTAMP)
  private Date end;

  @NotNull
  @Column(nullable = false)
  private Boolean allDay;
  
  @NotNull
  @Column(nullable = false)
  private String title;
  
  @NotNull
  @Column(nullable = false)
  private EventType type;

  @Lob
  @Column
  private String description;
  
  @NotNull
  @Column(nullable = false)
  private Long userEntityId;
  
  @NotNull
  @Column(nullable = false)
  private Long creatorEntityId;
  
  @NotNull
  @Column(nullable = false)
  private boolean isPrivate;
  
  @NotNull
  @Column(nullable = false)
  private boolean editableByUser;
  
  @NotNull
  @Column(nullable = false)
  private boolean removableByUser;

}
