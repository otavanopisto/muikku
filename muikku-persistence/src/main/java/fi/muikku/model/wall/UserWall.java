package fi.muikku.model.wall;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

import fi.muikku.model.stub.users.UserEntity;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class UserWall extends Wall {

  public UserEntity getUser() {
    return user;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  @Override
  @Transient
  public WallType getWallType() {
    return WallType.USER;
  }
  
  @ManyToOne
  private UserEntity user;
}
