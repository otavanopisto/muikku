package fi.muikku.model.wall.subscription;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;

import fi.muikku.model.stub.users.UserEntity;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public abstract class WallSubscription {

  public abstract WallSubscriptionType getType();
  
  public Long getId() {
    return id;
  }

  public UserEntity getUser() {
    return user;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private UserEntity user;
}
