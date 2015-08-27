package fi.muikku.plugins.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;


@Entity
public class UserPendingPasswordChange {

  public Long getId() {
    return id;
  }

  public String getConfirmationHash() {
    return confirmationHash;
  }

  public void setConfirmationHash(String confirmationHash) {
    this.confirmationHash = confirmationHash;
  }

  public Long getUserEntity() {
    return userEntity;
  }

  public void setUserEntity(Long userEntity) {
    this.userEntity = userEntity;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @Column (name = "userEntity_id")
  private Long userEntity;

  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String confirmationHash;
}
