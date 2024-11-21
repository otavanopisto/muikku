package fi.otavanopisto.muikku.plugins.languageprofile.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@Entity
public class LanguageProfile {

  public Long getId() {
    return id;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getFormData() {
    return formData;
  }

  public void setFormData(String formData) {
    this.formData = formData;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Column (nullable = false)
  private Long userEntityId;

  @Lob
  @NotNull
  @Column(nullable = false)
  private String formData;

  @NotNull
  @Column(nullable = false)
  @Temporal(value = TemporalType.TIMESTAMP)
  private Date lastModified;

}
