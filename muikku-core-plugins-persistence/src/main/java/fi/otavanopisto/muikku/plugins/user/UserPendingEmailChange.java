package fi.otavanopisto.muikku.plugins.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;


@Entity
public class UserPendingEmailChange {

  public Long getId() {
    return id;
  }

  public String getNewEmail() {
    return newEmail;
  }

  public void setNewEmail(String newEmail) {
    this.newEmail = newEmail;
  }

  public String getConfirmationHash() {
    return confirmationHash;
  }

  public void setConfirmationHash(String confirmationHash) {
    this.confirmationHash = confirmationHash;
  }

  public Long getUserEmailEntity() {
    return userEmailEntity;
  }

  public void setUserEmailEntity(Long userEmailEntity) {
    this.userEmailEntity = userEmailEntity;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @Column (name = "userEmailEntity_id")
  private Long userEmailEntity;

  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String newEmail;

  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String confirmationHash;
}
