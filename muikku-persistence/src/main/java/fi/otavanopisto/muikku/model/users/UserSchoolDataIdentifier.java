package fi.otavanopisto.muikku.model.users;

import java.util.Arrays;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

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
    List<EnvironmentRoleEntity> roleEntities = getRoles();
    if (roleEntities != null) {
      List<EnvironmentRoleArchetype> rolesAsList = Arrays.asList(roles);
      return roleEntities.stream().map(EnvironmentRoleEntity::getArchetype).anyMatch(rolesAsList::contains);
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
  
  public List<EnvironmentRoleEntity> getRoles() {
    return roles;
  }

  public void setRoles(List<EnvironmentRoleEntity> roles) {
    this.roles = roles;
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

  @ManyToMany (fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinTable (name = "UserSchoolDataIdentifierRoles", joinColumns = @JoinColumn(name = "userSchoolDataIdentifier_id"), inverseJoinColumns = @JoinColumn(name = "role"))
  private List<EnvironmentRoleEntity> roles;

  @ManyToOne
  private OrganizationEntity organization;

  @NotNull
  @Column(nullable = false)
  private Boolean archived;
}