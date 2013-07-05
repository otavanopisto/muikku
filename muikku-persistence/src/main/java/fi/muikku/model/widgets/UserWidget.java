package fi.muikku.model.widgets;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import fi.muikku.model.users.UserEntity;

@Entity
public class UserWidget extends LocatedWidget {
  
  public UserEntity getUser() {
    return user;
  }
  
  public void setUser(UserEntity user) {
    this.user = user;
  }

  @ManyToOne
  private UserEntity user;
}