package fi.muikku.users;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.workspace.WorkspaceUserEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;

public class WorkspaceUserEntityController {

  @Inject
  private Logger logger;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  @Inject
  private WorkspaceUserEntityDAO workspaceUserEntityDAO;

  public WorkspaceUserEntity createWorkspaceUserEntity(UserSchoolDataIdentifier userSchoolDataIdentifier, WorkspaceEntity workspaceEntity, String identifier, WorkspaceRoleEntity workspaceUserRole) {
    return workspaceUserEntityDAO.create(userSchoolDataIdentifier, workspaceEntity, workspaceUserRole, identifier, Boolean.FALSE);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityById(Long id) {
    return workspaceUserEntityDAO.findById(id);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndIdentifier(WorkspaceEntity workspaceEntity, String identifier) {
    return workspaceUserEntityDAO.findByWorkspaceAndIdentifierAndArchived(workspaceEntity, identifier, Boolean.FALSE);
  }
  
  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifierIncludeArchived(WorkspaceEntity workspaceEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifierIncludeArchived(workspaceEntity, userSchoolDataIdentifier);
  }
  
  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifier(WorkspaceEntity workspaceEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifierAndArchived(workspaceEntity, userSchoolDataIdentifier, Boolean.FALSE);
  }
  
  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserDataSourceAndUserIdentifier(WorkspaceEntity workspaceEntity, String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return findWorkspaceUserEntityByWorkspaceAndUserDataSourceAndUserIdentifier(workspaceEntity, schoolDataSource, identifier);
  }
  
  public WorkspaceUserEntity findWorkspaceUserEntityByIdentifier(String identifier) {
    return workspaceUserEntityDAO.findByIdentifier(identifier);
  }
  
  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserDataSourceAndUserIdentifier(WorkspaceEntity workspaceEntity,
      SchoolDataSource schoolDataSource, String identifier) {
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(schoolDataSource, identifier);
    if (userSchoolDataIdentifier == null) {
      return null;
    }
    
    return findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifier(workspaceEntity, userSchoolDataIdentifier);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntities(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceAndArchived(workspaceEntity, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByRole(WorkspaceEntity workspaceEntity, WorkspaceRoleEntity role) {
    return workspaceUserEntityDAO.listByWorkspaceAndRole(workspaceEntity, role);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByRoleArchetype(WorkspaceEntity workspaceEntity, WorkspaceRoleArchetype archetype) {
    return workspaceUserEntityDAO.listByWorkspaceAndRoleArchetype(workspaceEntity, archetype);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByRoles(WorkspaceEntity workspaceEntity, List<WorkspaceRoleEntity> roles) {
    return listWorkspaceUserEntitiesByRoles(workspaceEntity, roles, null, null);
  }
  
  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByRoles(WorkspaceEntity workspaceEntity, List<WorkspaceRoleEntity> roles, Integer firstResult, Integer maxResults) {
    return workspaceUserEntityDAO.listByWorkspaceAndRoles(workspaceEntity, roles, firstResult, maxResults);
  }
  
  public Long countWorkspaceUserEntitiesByRoles(WorkspaceEntity workspaceEntity, List<WorkspaceRoleEntity> roles) {
    if ((roles == null)||(roles.isEmpty())) {
      return 0l;
    }
    
    return workspaceUserEntityDAO.countByWorkspaceAndRoles(workspaceEntity, roles);
  }
  
  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByUserEntity(UserEntity userEntity) {
    return workspaceUserEntityDAO.listByUserEntityAndArchived(userEntity, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByWorkspaceAndUser(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndUserEntityAndArchived(workspaceEntity, userEntity, Boolean.FALSE);
  }
  
  public void archiveWorkspaceUserEntity(WorkspaceUserEntity workspaceUserEntity) {
    workspaceUserEntityDAO.updateArchived(workspaceUserEntity, Boolean.TRUE);
  }

  public void unArchiveWorkspaceUserEntity(WorkspaceUserEntity workspaceUserEntity) {
    workspaceUserEntityDAO.updateArchived(workspaceUserEntity, Boolean.FALSE);
  }

  public void deleteWorkspaceUserEntity(WorkspaceUserEntity workspaceUserEntity) {
    workspaceUserEntityDAO.delete(workspaceUserEntity);
  }
  
  public WorkspaceUserEntity findWorkspaceUserByWorkspaceEntityAndUserEntity(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(userEntity.getDefaultSchoolDataSource(), userEntity.getDefaultIdentifier());
    if (userSchoolDataIdentifier == null) {
      return null;
    }
    
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifierAndArchived(workspaceEntity, userSchoolDataIdentifier, Boolean.FALSE);
  }
  
  public WorkspaceRoleEntity findWorkspaceUserRoleByWorkspaceEntityAndUserEntity(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    WorkspaceUserEntity workspaceUserEntity = findWorkspaceUserByWorkspaceEntityAndUserEntity(workspaceEntity, userEntity);
    if (workspaceUserEntity != null) {
      return workspaceUserEntity.getWorkspaceUserRole();
    }
    
    return null;
  }

  public List<WorkspaceEntity> listWorkspaceEntitiesByUserEntity(UserEntity userEntity) {
    List<WorkspaceEntity> result = new ArrayList<>();
    
    List<WorkspaceUserEntity> workspaceUserEntities = listWorkspaceUserEntitiesByUserEntity(userEntity);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      result.add(workspaceUserEntity.getWorkspaceEntity());
    }
    
    return result;
  }
  
}
