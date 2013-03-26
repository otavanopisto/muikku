package fi.muikku.model.wall.subscription;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.model.wall.Wall;

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
