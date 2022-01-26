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

  public Date getBegins() {
    return begins;
  }

  public void setBegins(Date begins) {
    this.begins = begins;
  }

  public Date getEnds() {
    return ends;
  }

  public void setEnds(Date ends) {
    this.ends = ends;
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
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Column (nullable = false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date begins;

  @NotNull
  @Column (nullable = false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date ends;

  @NotNull
  @Column (nullable = false)
  private Boolean allDay;
  
  @NotNull
  @Column(nullable = false)
  private String title;

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
