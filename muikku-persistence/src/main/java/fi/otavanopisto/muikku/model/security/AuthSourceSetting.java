package fi.otavanopisto.muikku.model.security;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class AuthSourceSetting {

  public Long getId() {
    return id;
  }
  
  public AuthSource getAuthSource() {
    return authSource;
  }

  public void setAuthSource(AuthSource authSource) {
    this.authSource = authSource;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private AuthSource authSource;

  @NotBlank
  @NotEmpty
  @Column (name = "settingKey", nullable = false)
  private String key;

  @NotBlank
  @NotEmpty
  @Column (nullable = false)
  private String value;

}
