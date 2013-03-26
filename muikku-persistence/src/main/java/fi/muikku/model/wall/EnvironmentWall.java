package fi.muikku.model.wall;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

import fi.muikku.model.base.Environment;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class EnvironmentWall extends Wall {

  public Environment getEnvironment() {
    return environment;
  }

  public void setEnvironment(Environment environment) {
    this.environment = environment;
  }

  @Override
  @Transient
  public WallType getWallType() {
    return WallType.ENVIRONMENT;
  }
  
  @ManyToOne
  private Environment environment;
}
