package fi.muikku.plugins.wall.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;


@Entity
@PrimaryKeyJoinColumn(name="id")
public class UserWallSubscription extends WallSubscription {

  @Override
  public WallSubscriptionType getType() {
    return WallSubscriptionType.WALL;
  }

  public Wall getWall() {
    return wall;
  }

  public void setWall(Wall wall) {
    this.wall = wall;
  }

  @ManyToOne
  private Wall wall;
}
