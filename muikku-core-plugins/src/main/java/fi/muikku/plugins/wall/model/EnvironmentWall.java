package fi.muikku.plugins.wall.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class EnvironmentWall extends Wall {

  public Long getEnvironment() {
    return environment;
  }

  public void setEnvironment(Long environment) {
    this.environment = environment;
  }

  @Override
  @Transient
  public WallType getWallType() {
    return WallType.ENVIRONMENT;
  }
  
  @Column (name = "environment_id")
  private Long environment;
}
