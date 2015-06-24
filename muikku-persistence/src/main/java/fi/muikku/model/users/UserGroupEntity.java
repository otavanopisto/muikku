package fi.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.security.ContextReference;

@Entity
public class UserGroupEntity implements ContextReference {
  
  public Long getId() {
    return id;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public SchoolDataSource getSchoolDataSource() {
    return schoolDataSource;
  }

  public void setSchoolDataSource(SchoolDataSource schoolDataSource) {
    this.schoolDataSource = schoolDataSource;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private SchoolDataSource schoolDataSource;

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String identifier;

  @NotNull
  @Column(nullable = false)
  private Boolean archived;
}
