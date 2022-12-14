package fi.otavanopisto.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
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

  @Transient
  public SchoolDataIdentifier schoolDataIdentifier() {
    return new SchoolDataIdentifier(getIdentifier(), getSchoolDataSource().getIdentifier());
  }
  
  public OrganizationEntity getOrganization() {
    return organization;
  }

  public void setOrganization(OrganizationEntity organization) {
    this.organization = organization;
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

  @ManyToOne
  private OrganizationEntity organization;

  @NotNull
  @Column(nullable = false)
  private Boolean archived;
}
