package fi.otavanopisto.muikku.model.security;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.users.UserEntity;


@Entity
public class UserIdentification {

  /**
   * Returns internal unique id
   * 
   * @return Internal unique id
   */
  public Long getId() {
    return id;
  }

  public void setExternalId(String externalId) {
    this.externalId = externalId;
  }

  public String getExternalId() {
    return externalId;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  public UserEntity getUser() {
    return user;
  }

  public AuthSource getAuthSource() {
    return authSource;
  }

  public void setAuthSource(AuthSource authSource) {
    this.authSource = authSource;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private UserEntity user;
  
  @NotNull
  @Column (nullable = false)
  @NotEmpty
  private String externalId;
  
  @ManyToOne
  private AuthSource authSource;

}
