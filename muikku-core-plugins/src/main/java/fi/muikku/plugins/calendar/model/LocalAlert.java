package fi.muikku.plugins.calendar.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class LocalAlert {
  
  public Long getId() {
    return id;
  }
  
  public Long getMillisecondsBefore() {
    return millisecondsBefore;
  }
  
  public LocalAlertType getType() {
    return type;
  }
  
  public void setMillisecondsBefore(Long millisecondsBefore) {
    this.millisecondsBefore = millisecondsBefore;
  }
  
  public void setType(LocalAlertType type) {
    this.type = type;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Enumerated (EnumType.STRING)
  private LocalAlertType type;
  
  @Column (nullable = false)
  private Long millisecondsBefore;
}