package fi.otavanopisto.muikku.plugins.calendar.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@Entity
public class CalendarEvent {

  public Long getId() {
    return id;
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

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Column (nullable = false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date start;

  @NotNull
  @Column (nullable = false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date end;

  @NotNull
  @Column (nullable = false)
  private Boolean allDay;
  
  @NotNull
  @Column(nullable = false)
  private String title;
  
  @Column
  private String type;

  @Lob
  @Column
  private String description;
  
  @NotNull
  @Column(nullable = false)
  @Enumerated (EnumType.STRING)
  private CalendarEventVisibility visibility;
  
  @NotNull
  @Column(nullable = false)
  private Long userEntityId;

}
