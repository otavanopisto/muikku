package fi.otavanopisto.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.security.ContextReference;

@Entity
public class UserGroupUserEntity implements ContextReference {

  public Long getId() {
    return id;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public UserGroupEntity getUserGroupEntity() {
    return userGroupEntity;
  }

  public void setUserGroupEntity(UserGroupEntity userGroupEntity) {
    this.userGroupEntity = userGroupEntity;
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

  public UserSchoolDataIdentifier getUserSchoolDataIdentifier() {
    return userSchoolDataIdentifier;
  }

  public void setUserSchoolDataIdentifier(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    this.userSchoolDataIdentifier = userSchoolDataIdentifier;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private UserGroupEntity userGroupEntity;

  @ManyToOne
  private SchoolDataSource schoolDataSource;

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String identifier;

  @ManyToOne
  private UserSchoolDataIdentifier userSchoolDataIdentifier;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
}
