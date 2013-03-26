package fi.muikku.plugins.calendar.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class LocalEvent extends Event {

  public LocalEventType getType() {
    return type;
  }

  public void setType(LocalEventType type) {
    this.type = type;
  }
  
  @ManyToOne
  private LocalEventType type;
}
