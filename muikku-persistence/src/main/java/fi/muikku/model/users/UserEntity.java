package fi.muikku.model.users;

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
import javax.persistence.Version;
import javax.validation.constraints.NotNull;

import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.util.ArchivableEntity;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.User;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public class UserEntity implements ArchivableEntity, User, ContextReference {
  
  public Long getId() {
    return id;
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

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
  
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date lastLogin;
  
  private String defaultIdentifier;
  
  @ManyToOne
  private SchoolDataSource defaultSchoolDataSource;

  @Version
  @Column(nullable = false)
  private Long version;
}