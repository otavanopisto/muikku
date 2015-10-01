package fi.muikku.plugins.wall.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class UserWall extends Wall {

  public Long getUser() {
    return user;
  }

  public void setUser(Long user) {
    this.user = user;
  }

  @Override
  @Transient
  public WallType getWallType() {
    return WallType.USER;
  }
  
  @Override
  @Transient
  public String getTypeId() {
    return getUser().toString();
  }
  
  @Column (name = "user_id")
  private Long user;
}
