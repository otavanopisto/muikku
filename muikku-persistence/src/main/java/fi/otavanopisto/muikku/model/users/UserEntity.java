package fi.otavanopisto.muikku.model.users;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.util.ArchivableEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.User;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public class UserEntity implements ArchivableEntity, User, ContextReference {
  
  public Long getId() {
    return id;
  }

  @Transient
  public SchoolDataIdentifier defaultSchoolDataIdentifier() {
    return new SchoolDataIdentifier(getDefaultIdentifier(), getDefaultSchoolDataSource().getIdentifier());
  }
  
  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public Date getLastLogin() {
    return lastLogin;
  }

  public void setLastLogin(Date lastLogin) {
    this.lastLogin = lastLogin;
  }
  
  public String getLocale() {
    return locale;
  }
  
  public void setLocale(String locale) {
    this.locale = locale;
  }
  
  public String getDefaultIdentifier() {
    return defaultIdentifier;
  }
  
  public void setDefaultIdentifier(String defaultIdentifier) {
    this.defaultIdentifier = defaultIdentifier;
  }
  
  public SchoolDataSource getDefaultSchoolDataSource() {
    return defaultSchoolDataSource;
  }
  
  public void setDefaultSchoolDataSource(SchoolDataSource defaultSchoolDataSource) {
    this.defaultSchoolDataSource = defaultSchoolDataSource;
  }
  
  public Long getVersion() {
    return version;
  }

  public void setVersion(Long version) {
    this.version = version;
  }
  
  public void setUpdatedByStudent(Boolean updatedByStudent) {
    this.updatedByStudent = updatedByStudent;
  }
  
  public Boolean getUpdatedByStudent() {
    return updatedByStudent;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
  
  @NotNull
  @Column(nullable = false)
  private Boolean updatedByStudent = Boolean.FALSE;
  
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date lastLogin;
  
  @Column (length = 8)
  private String locale;
  
  private String defaultIdentifier;
  
  @ManyToOne
  private SchoolDataSource defaultSchoolDataSource;

  @Version
  @Column(nullable = false)
  private Long version;
}