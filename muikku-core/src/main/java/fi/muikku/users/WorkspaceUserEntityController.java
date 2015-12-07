package fi.muikku.users;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.dao.workspace.WorkspaceUserEntityDAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.schooldata.SchoolDataIdentifier;

public class WorkspaceUserEntityController {

  @Inject
  private Logger logger;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private WorkspaceUserEntityDAO workspaceUserEntityDAO;

  public WorkspaceUserEntity createWorkspaceUserEntity(UserSchoolDataIdentifier userSchoolDataIdentifier, WorkspaceEntity workspaceEntity, String identifier, WorkspaceRoleEntity workspaceUserRole) {
    return workspaceUserEntityDAO.create(userSchoolDataIdentifier, workspaceEntity, workspaceUserRole, identifier, Boolean.FALSE);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityById(Long id) {
    return workspaceUserEntityDAO.findById(id);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceUserIdentifier(SchoolDataIdentifier workspaceUserIdentifier) {
    return findWorkspaceUserEntityByWorkspaceUserIdentifierAndArchived(workspaceUserIdentifier, Boolean.FALSE);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceUserIdentifierAndArchived(SchoolDataIdentifier workspaceUserIdentifier, Boolean archived) {
    return workspaceUserEntityDAO.findByIdentifierAndArchived(workspaceUserIdentifier.getIdentifier(), archived);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(SchoolDataIdentifier workspaceUserIdentifier) {
    return workspaceUserEntityDAO.findByIdentifierIncludeArchived(workspaceUserIdentifier.getIdentifier());
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserIdentifier(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.
        findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    if (userSchoolDataIdentifier != null) {
      return findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifier(workspaceEntity, userSchoolDataIdentifier);
    }
    else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier by %s", userIdentifier));
      return null;
    }
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserIdentifierIncludeArchived(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.
        findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    if (userSchoolDataIdentifier != null) {
      return findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifierIncludeArchived(workspaceEntity, userSchoolDataIdentifier);
    }
    else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier by %s", userIdentifier));
      return null;
    }
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifier(WorkspaceEntity workspaceEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifierAndArchived(workspaceEntity, userSchoolDataIdentifier, Boolean.FALSE);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifierIncludeArchived(WorkspaceEntity workspaceEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifierIncludeArchived(workspaceEntity, userSchoolDataIdentifier);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntities(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceAndArchived(workspaceEntity, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesIncludeArchived(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceIncludeArchived(workspaceEntity);
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
  
  public WorkspaceUserEntity archiveWorkspaceUserEntity(WorkspaceUserEntity workspaceUserEntity) {
    return workspaceUserEntityDAO.updateArchived(workspaceUserEntity, Boolean.TRUE);
  }

  public WorkspaceUserEntity unarchiveWorkspaceUserEntity(WorkspaceUserEntity workspaceUserEntity) {
    return workspaceUserEntityDAO.updateArchived(workspaceUserEntity, Boolean.FALSE);
  }
  
  public WorkspaceUserEntity updateUserSchoolDataIdentifier(WorkspaceUserEntity workspaceUserEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return workspaceUserEntityDAO.updateUserSchoolDataIdentifier(workspaceUserEntity, userSchoolDataIdentifier);
  }

  public WorkspaceUserEntity updateIdentifier(WorkspaceUserEntity workspaceUserEntity, String identifier) {
    return workspaceUserEntityDAO.updateIdentifier(workspaceUserEntity, identifier);
  }

  public void deleteWorkspaceUserEntity(WorkspaceUserEntity workspaceUserEntity) {
    workspaceUserEntityDAO.delete(workspaceUserEntity);
  }
  
  public WorkspaceUserEntity findWorkspaceUserByWorkspaceEntityAndUserIdentifier(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    return findWorkspaceUserByWorkspaceEntityAndUserIdentifierAndArchived(workspaceEntity, userIdentifier, Boolean.FALSE);
  }

  public WorkspaceUserEntity findWorkspaceUserByWorkspaceEntityAndUserIdentifierAndArchived(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier, Boolean archived) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    if (userSchoolDataIdentifier == null) {
      return null;
    }
    
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifierAndArchived(workspaceEntity, userSchoolDataIdentifier, archived);
  }
  
  private WorkspaceUserEntity findWorkspaceUserByWorkspaceEntityAndUserEntity(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
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
