package fi.otavanopisto.muikku.users;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.dao.workspace.WorkspaceUserEntityDAO;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class WorkspaceUserEntityController {

  @Inject
  private Logger logger;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private WorkspaceUserEntityDAO workspaceUserEntityDAO;
  
  @Inject
  private UserEntityController userEntityController;

  public WorkspaceUserEntity createWorkspaceUserEntity(UserSchoolDataIdentifier userSchoolDataIdentifier, WorkspaceEntity workspaceEntity, String identifier, WorkspaceRoleEntity workspaceUserRole) {
    return workspaceUserEntityDAO.create(userSchoolDataIdentifier, workspaceEntity, workspaceUserRole, identifier, Boolean.TRUE, Boolean.FALSE);
  }

  public long countWorkspaceStudents(WorkspaceEntity workspaceEntity) {
    Long countWorkspaceStudents = workspaceUserEntityDAO.countByWorkspaceEntityAndRoleArchetypeAndArchived(workspaceEntity, WorkspaceRoleArchetype.STUDENT, Boolean.FALSE);
    return countWorkspaceStudents != null ? countWorkspaceStudents : 0;
  }

  public WorkspaceUserEntity findWorkspaceUserEntityById(Long id) {
    return workspaceUserEntityDAO.findById(id);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceUserIdentifier(SchoolDataIdentifier workspaceUserIdentifier) {
    return workspaceUserEntityDAO.findByIdentifierAndArchived(workspaceUserIdentifier.getIdentifier(), Boolean.FALSE);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceUserIdentifierAndArchived(SchoolDataIdentifier workspaceUserIdentifier, Boolean archived) {
    return workspaceUserEntityDAO.findByIdentifierAndArchived(workspaceUserIdentifier.getIdentifier(), archived);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(SchoolDataIdentifier workspaceUserIdentifier) {
    // #3746: If workspace user exists both as archived and unarchived, return unarchived
    List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityDAO.findByIdentifier(workspaceUserIdentifier.getIdentifier());
    if (CollectionUtils.isEmpty(workspaceUserEntities)) {
      return null;
    }
    else if (workspaceUserEntities.size() == 1) {
      return workspaceUserEntities.get(0);
    }
    else {
      for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
        if (Boolean.FALSE.equals(workspaceUserEntity.getArchived())) {
          return workspaceUserEntity;
        }
      }
      return workspaceUserEntities.get(0);
    }
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserIdentifier(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.
        findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    if (userSchoolDataIdentifier != null) {
      return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifierAndArchived(workspaceEntity, userSchoolDataIdentifier, Boolean.FALSE);
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

  public WorkspaceUserEntity findActiveWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifier(WorkspaceEntity workspaceEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifierAndActiveAndArchived(workspaceEntity, userSchoolDataIdentifier, Boolean.TRUE, Boolean.FALSE);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifierIncludeArchived(WorkspaceEntity workspaceEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifier(workspaceEntity, userSchoolDataIdentifier);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntities(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndArchived(workspaceEntity, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesIncludeArchived(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntity(workspaceEntity);
  }

  public List<WorkspaceUserEntity> listWorkspaceStaffMembers(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndRoleArchetypeAndArchived(workspaceEntity, WorkspaceRoleArchetype.TEACHER, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listActiveWorkspaceStaffMembers(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndRoleArchetypeAndActiveAndArchived(workspaceEntity, WorkspaceRoleArchetype.TEACHER, Boolean.TRUE, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listActiveWorkspaceStudents(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndRoleArchetypeAndActiveAndArchived(workspaceEntity, WorkspaceRoleArchetype.STUDENT, Boolean.TRUE, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listWorkspaceStudents(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndRoleArchetypeAndArchived(workspaceEntity, WorkspaceRoleArchetype.STUDENT, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listInactiveWorkspaceStudents(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndRoleArchetypeAndActiveAndArchived(workspaceEntity, WorkspaceRoleArchetype.STUDENT, Boolean.FALSE, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByRole(WorkspaceEntity workspaceEntity, WorkspaceRoleEntity role) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndRoleAndArchived(workspaceEntity, role, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listActiveWorkspaceUserEntitiesByRoleArchetype(WorkspaceEntity workspaceEntity, WorkspaceRoleArchetype archetype) {
    return workspaceUserEntityDAO.listByWorkspaceEntityAndRoleArchetypeAndActiveAndArchived(workspaceEntity, archetype, Boolean.TRUE, Boolean.FALSE);
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByUserIdentifier(SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.
        findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    
    if (userSchoolDataIdentifier != null) {
      return workspaceUserEntityDAO.listByUserSchoolDataIdentifierAndArchived(userSchoolDataIdentifier, Boolean.FALSE);
    }
    else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier by %s", userIdentifier));
      return Collections.emptyList();
    }
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByUserIdentifierIncludeArchived(SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.
        findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    
    if (userSchoolDataIdentifier != null) {
      return workspaceUserEntityDAO.listByUserSchoolDataIdentifier(userSchoolDataIdentifier);
    }
    else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier by %s", userIdentifier));
      return Collections.emptyList();
    }
  }

  public List<WorkspaceUserEntity> listActiveWorkspaceUserEntitiesByUserIdentifier(SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.
        findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    
    if (userSchoolDataIdentifier != null) {
      return workspaceUserEntityDAO.listByUserSchoolDataIdentifierAndActiveAndArchived(userSchoolDataIdentifier, Boolean.TRUE, Boolean.FALSE);
    }
    else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier by %s", userIdentifier));
      return Collections.emptyList();
    }
  }
  
  public List<WorkspaceUserEntity> listActiveWorkspaceUserEntitiesByUserIdentifiers(Collection<SchoolDataIdentifier> userIdentifiers) {
    Set<UserSchoolDataIdentifier> userSchoolDataIdentifiers = new HashSet<>();
    
    for (SchoolDataIdentifier userIdentifier : userIdentifiers) {
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.
          findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);
      if (userSchoolDataIdentifier == null) {
        logger.severe(String.format("Could not find UserSchoolDataIdentifier by %s", userIdentifier));
        return Collections.emptyList();
      }

      if (!userSchoolDataIdentifiers.stream().anyMatch(usdi -> usdi.getId().equals(userSchoolDataIdentifier.getId()))) {
        userSchoolDataIdentifiers.add(userSchoolDataIdentifier);
      }
    }

    return workspaceUserEntityDAO.listByUserSchoolDataIdentifiersAndActiveAndArchived(userSchoolDataIdentifiers, Boolean.TRUE, Boolean.FALSE);
  }
  
  public List<WorkspaceUserEntity> listInactiveWorkspaceUserEntitiesByUserIdentifier(SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.
        findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    
    if (userSchoolDataIdentifier != null) {
      return workspaceUserEntityDAO.listByUserSchoolDataIdentifierAndActiveAndArchived(userSchoolDataIdentifier, Boolean.FALSE, Boolean.FALSE);
    }
    else {
      logger.severe(String.format("Could not find UserSchoolDataIdentifier by %s", userIdentifier));
      return Collections.emptyList();
    }
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

  public WorkspaceUserEntity updateActive(WorkspaceUserEntity workspaceUserEntity, Boolean active) {
    if (Boolean.FALSE.equals(active)) {
      // #6620: Remove past workspaces from the list of student's last workspaces
      UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(
          workspaceUserEntity.getUserSchoolDataIdentifier().getDataSource(),
          workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
      UserEntityProperty lastWorkspaces = userEntityController.getUserEntityPropertyByKey(userEntity,
          "last-workspaces");

      if (lastWorkspaces != null) {
        if (StringUtils.isNotEmpty(lastWorkspaces.getValue())) {
          ObjectMapper objectMapper = new ObjectMapper();
          List<LastWorkspace> lastWorkspaceList = null;
          String lastWorkspaceJson = lastWorkspaces.getValue();

          try {
            lastWorkspaceList = objectMapper.readValue(lastWorkspaceJson,
                new TypeReference<ArrayList<LastWorkspace>>() {
                });

            if (lastWorkspaceList != null) {
              int lastWorkspaceListSize = lastWorkspaceList.size();
              Long workspaceEntityId = workspaceUserEntity.getWorkspaceEntity().getId();
              lastWorkspaceList.removeIf(item -> workspaceEntityId.equals(item.getWorkspaceId()));

              if (lastWorkspaceListSize != lastWorkspaceList.size()) {
                userEntityController.setUserEntityProperty(userEntity, "last-workspaces",
                    objectMapper.writeValueAsString(lastWorkspaceList));
              }
            }
          }
          catch (JsonProcessingException e) {
            logger.log(Level.WARNING,
                String.format("Parsing last workspaces of user %d failed: %s", userEntity.getId(), e.getMessage()));
          }
        }
      }
    }
    return workspaceUserEntityDAO.updateActive(workspaceUserEntity, active);
  }

  public WorkspaceUserEntity updateWorkspaceUserRole(WorkspaceUserEntity workspaceUserEntity, WorkspaceRoleEntity workspaceUserRole) {
    return workspaceUserEntityDAO.updateWorkspaceUserRole(workspaceUserEntity, workspaceUserRole);
  }

  public WorkspaceUserEntity findWorkspaceUserByWorkspaceEntityAndUserIdentifier(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    if (userSchoolDataIdentifier == null) {
      return null;
    }
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifierAndArchived(workspaceEntity, userSchoolDataIdentifier, Boolean.FALSE);
  }

  public WorkspaceUserEntity findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
    return findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, userSchoolDataIdentifier);
  }

  public WorkspaceUserEntity findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(WorkspaceEntity workspaceEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    if (userSchoolDataIdentifier == null) {
      return null;
    }
    return workspaceUserEntityDAO.findByWorkspaceEntityAndUserSchoolDataIdentifierAndActiveAndArchived(workspaceEntity, userSchoolDataIdentifier, Boolean.TRUE, Boolean.FALSE);
  }

  /**
   * Returns true if given userIdentifier is a user who is a member of given workspaceEntity.
   * 
   * @param userIdentifier user
   * @param workspaceEntity workspace
   * @return true if user is member of workspace, otherwise false
   */
  public boolean isWorkspaceMember(SchoolDataIdentifier userIdentifier, WorkspaceEntity workspaceEntity) {
    WorkspaceUserEntity workspaceUserEntity = findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, userIdentifier);
    return workspaceUserEntity != null;
  }
  
  public List<WorkspaceEntity> listActiveWorkspaceEntitiesByUserEntity(UserEntity userEntity) {
    SchoolDataIdentifier schoolDataIdentifier = toSchoolDataIdentifier(userEntity);
    List<WorkspaceEntity> result = new ArrayList<>();
    List<WorkspaceUserEntity> workspaceUserEntities = listActiveWorkspaceUserEntitiesByUserIdentifier(schoolDataIdentifier);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      result.add(workspaceUserEntity.getWorkspaceEntity());
    }
    return result;
  }

  public List<WorkspaceEntity> listInactiveWorkspaceEntitiesByUserEntity(UserEntity userEntity) {
    SchoolDataIdentifier schoolDataIdentifier = toSchoolDataIdentifier(userEntity);
    List<WorkspaceEntity> result = new ArrayList<>();
    List<WorkspaceUserEntity> workspaceUserEntities = listInactiveWorkspaceUserEntitiesByUserIdentifier(schoolDataIdentifier);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      result.add(workspaceUserEntity.getWorkspaceEntity());
    }
    return result;
  }

  public List<WorkspaceEntity> listWorkspaceEntitiesByUserEntity(UserEntity userEntity) {
    SchoolDataIdentifier schoolDataIdentifier = toSchoolDataIdentifier(userEntity);
    List<WorkspaceEntity> result = new ArrayList<>();
    List<WorkspaceUserEntity> workspaceUserEntities = listWorkspaceUserEntitiesByUserIdentifier(schoolDataIdentifier);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      result.add(workspaceUserEntity.getWorkspaceEntity());
    }
    return result;
  }
  
  public List<WorkspaceEntity> listWorkspaceEntitiesByUserIdentifier(SchoolDataIdentifier userIdentifier) {
    List<WorkspaceEntity> result = new ArrayList<>();
    
    List<WorkspaceUserEntity> workspaceUserEntities = listWorkspaceUserEntitiesByUserIdentifier(userIdentifier);

    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      result.add(workspaceUserEntity.getWorkspaceEntity());
    }
    
    return result;
  }

  public List<WorkspaceEntity> listWorkspaceEntitiesByUserIdentifierIncludeArchived(SchoolDataIdentifier userIdentifier) {
    List<WorkspaceEntity> result = new ArrayList<>();
    
    List<WorkspaceUserEntity> workspaceUserEntities = listWorkspaceUserEntitiesByUserIdentifierIncludeArchived(userIdentifier);

    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      result.add(workspaceUserEntity.getWorkspaceEntity());
    }
    
    return result;
  }

  public List<WorkspaceEntity> listActiveWorkspaceEntitiesByUserIdentifier(SchoolDataIdentifier userIdentifier) {
    List<WorkspaceEntity> result = new ArrayList<>();
    List<WorkspaceUserEntity> workspaceUserEntities = listActiveWorkspaceUserEntitiesByUserIdentifier(userIdentifier);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      result.add(workspaceUserEntity.getWorkspaceEntity());
    }
    return result;
  }
  
  public void deleteWorkspaceUserEntity(WorkspaceUserEntity workspaceUserEntity) {
    workspaceUserEntityDAO.delete(workspaceUserEntity);
  }
  
  private SchoolDataIdentifier toSchoolDataIdentifier(UserEntity userEntity) {
    return userEntity.defaultSchoolDataIdentifier();
  }

  /**
   * Returns true if user1 and user2 have any shared workspaces.
   * @param user1 User 1
   * @param user2 User 2
   * @return true if user1 and user2 have any shared workspaces
   */
  public boolean haveSharedWorkspaces(UserEntity user1, UserEntity user2) {
    return workspaceUserEntityDAO.haveSharedWorkspaces(user1, user2);
  }

}
