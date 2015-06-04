package fi.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import fi.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.security.ContextReference;

@Entity
public class UserGroupEntity implements ContextReference {
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
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

  @ManyToOne
  private SchoolDataSource defaultSchoolDataSource;

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
  
  private String defaultIdentifier;
  
}
