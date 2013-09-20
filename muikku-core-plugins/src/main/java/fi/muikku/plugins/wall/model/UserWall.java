package fi.muikku.plugins.wall.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

import fi.muikku.tranquil.UserEntityResolver;
import fi.tranquil.TranquilityEntityField;

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
  
  @Column (name = "user_id")
  @TranquilityEntityField(UserEntityResolver.class)
  private Long user;
}
