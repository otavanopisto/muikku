package fi.muikku.plugins.wall.model;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class EnvironmentWall extends Wall {

  @Override
  @Transient
  public WallType getWallType() {
    return WallType.ENVIRONMENT;
  }
}
