package fi.muikku.model.workspace;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotEmpty;

import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.util.ArchivableEntity;

@Entity
@Table (
  uniqueConstraints = {
    @UniqueConstraint (columnNames = {"userSchoolDataIdentifier_id", "workspaceEntity_id"})
  }    
)
@Cacheable
@Cache (usage = CacheConcurrencyStrategy.TRANSACTIONAL)
public class WorkspaceUserEntity implements ArchivableEntity {

  public Long getId() {
    return id;
  }
  
  public String getIdentifier() {
    return identifier;
  }
  
  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public WorkspaceEntity getWorkspaceEntity() {
    return workspaceEntity;
  }

  public void setWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    this.workspaceEntity = workspaceEntity;
  }
  
  public UserSchoolDataIdentifier getUserSchoolDataIdentifier() {
    return userSchoolDataIdentifier;
  }
  
  public void setUserSchoolDataIdentifier(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    this.userSchoolDataIdentifier = userSchoolDataIdentifier;
  }

  public WorkspaceRoleEntity getWorkspaceUserRole() {
    return workspaceUserRole;
  }

  public void setWorkspaceUserRole(WorkspaceRoleEntity workspaceUserRole) {
    this.workspaceUserRole = workspaceUserRole;
  }
  
  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String identifier;

  @ManyToOne
  private WorkspaceEntity workspaceEntity;
  
  @ManyToOne
  private UserSchoolDataIdentifier userSchoolDataIdentifier;
  
  @ManyToOne
  private WorkspaceRoleEntity workspaceUserRole;

  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
}
