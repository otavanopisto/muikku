package fi.otavanopisto.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.users.UserEntity;

@Entity
public class UserContact {

  public Long getId() {
    return id;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public UserContactType getType() {
    return type;
  }

  public void setType(UserContactType type) {
    this.type = type;
  }

  public UserEntity getUser() {
    return user;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  public Boolean getHidden() {
    return hidden;
  }

  public void setHidden(Boolean hidden) {
    this.hidden = hidden;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private UserEntity user;
  
  @NotNull
  @Column (nullable = false)
  @Enumerated (EnumType.STRING)
  private UserContactType type;
  
  @NotNull
  @Column (nullable = false)
  @NotEmpty
  private String value;
  
  @NotNull
  @Column (nullable = false)
  private Boolean hidden;
}
