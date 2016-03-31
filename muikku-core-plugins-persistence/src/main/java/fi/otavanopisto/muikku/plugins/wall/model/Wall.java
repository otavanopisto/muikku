package fi.otavanopisto.muikku.plugins.wall.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Transient;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public class Wall {

  public Long getId() {
    return id;
  }

  @Transient
  public WallType getWallType() {
    return null;
  }
  
  @Transient
  public String getTypeId() {
    return null;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
}
