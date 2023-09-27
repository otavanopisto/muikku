package fi.otavanopisto.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import org.apache.commons.lang3.ArrayUtils;

import javax.validation.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

@Entity
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "dataSource_id", "identifier" }) })
public class UserSchoolDataIdentifier {

  public Long getId() {
    return id;
  }

  @Transient
  public SchoolDataIdentifier schoolDataIdentifier() {
    return new SchoolDataIdentifier(getIdentifier(), getDataSource().getIdentifier());
  }
  
  public SchoolDataSource getDataSource() {
    return dataSource;
  }

  public void setDataSource(SchoolDataSource dataSource) {
    this.dataSource = dataSource;
  }

  public UserEntity getUserEntity() {
    return userEntity;
  }

  public void setUserEntity(UserEntity userEntity) {
    this.userEntity = userEntity;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public EnvironmentRoleEntity getRole() {
    return role;
  }

  public void setRole(EnvironmentRoleEntity role) {
    this.role = role;
  }

  public OrganizationEntity getOrganization() {
    return organization;
  }

  public void setOrganization(OrganizationEntity organization) {
    this.organization = organization;
  }

  @Transient
  public boolean hasRole(EnvironmentRoleArchetype role) {
    return hasAnyRole(role);
  }
  
  @Transient
  public boolean hasAnyRole(EnvironmentRoleArchetype ... roles) {
    if (getRole() != null) {
      EnvironmentRoleArchetype userRole = getRole().getArchetype();
      
      return userRole != null && ArrayUtils.contains(roles, userRole);
    }
    
    return false;
  }
  
  @Transient
  public boolean isStaff() {
    return hasAnyRole(
        EnvironmentRoleArchetype.TEACHER,
        EnvironmentRoleArchetype.ADMINISTRATOR,
        EnvironmentRoleArchetype.MANAGER,
        EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER,
        EnvironmentRoleArchetype.STUDY_GUIDER
    );
  }
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String identifier;

  @ManyToOne
  private SchoolDataSource dataSource;

  @ManyToOne
  private UserEntity userEntity;

  @ManyToOne
  private EnvironmentRoleEntity role;

  @ManyToOne
  private OrganizationEntity organization;

  @NotNull
  @Column(nullable = false)
  private Boolean archived;
}