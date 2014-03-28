package fi.muikku.plugins.forgotpassword.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
public class PasswordResetRequest {
  
  public Long getId() {
    return id;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getResetHash() {
    return resetHash;
  }

  public void setResetHash(String resetHash) {
    this.resetHash = resetHash;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Column (nullable = false)
  private Long userEntityId;
  
  @NotNull
  @Column (nullable = false)
  private String resetHash;
  
}
