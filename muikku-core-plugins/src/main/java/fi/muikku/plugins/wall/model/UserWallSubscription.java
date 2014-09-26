package fi.muikku.plugins.wall.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class UserWallSubscription {

  public Wall getWall() {
    return wall;
  }

  public void setWall(Wall wall) {
    this.wall = wall;
  }

  public Long getId() {
    return id;
  }

  public Long getUser() {
    return user;
  }

  public void setUser(Long user) {
    this.user = user;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @Column (name = "user_id")
  private Long user;

  @ManyToOne
  private Wall wall;
}
