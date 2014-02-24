package fi.muikku.plugins.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.muikku.tranquil.UserEntityResolver;
import fi.tranquil.TranquilityEntityField;


@Entity
public class UserPendingEmailChange {

  public Long getId() {
    return id;
  }

  public Long getUser() {
    return user;
  }

  public void setUser(Long user) {
    this.user = user;
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

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @Column (name = "user_id")
  @TranquilityEntityField(UserEntityResolver.class)
  private Long user;

  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String newEmail;

  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String confirmationHash;
}
