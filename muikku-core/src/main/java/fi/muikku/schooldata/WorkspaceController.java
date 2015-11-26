package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.muikku.dao.users.RoleSchoolDataIdentifierDAO;
import fi.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.muikku.dao.workspace.WorkspaceSettingsDAO;
import fi.muikku.dao.workspace.WorkspaceUserEntityDAO;
import fi.muikku.dao.workspace.WorkspaceUserSignupDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.security.WorkspaceRolePermission;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.RoleSchoolDataIdentifier;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserRoleType;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceSettings;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.model.workspace.WorkspaceUserSignup;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceType;
import fi.muikku.schooldata.entity.WorkspaceUser;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.WorkspaceUserEntityController;

@Dependent
@Stateless
public class WorkspaceController {
  
  // TODO: Why not fi.muikku.workspaces ?

  @Inject
  private Logger logger;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private RoleController roleController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private WorkspaceSchoolDataController workspaceSchoolDataController;

  @Inject
  private WorkspaceEntityDAO workspaceEntityDAO;

  @Inject
  private WorkspaceUserEntityDAO workspaceUserEntityDAO;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private WorkspaceSettingsDAO workspaceSettingsDAO;

  @Inject
  private WorkspaceUserSignupDAO workspaceUserSignupDAO;

  @Inject
  private WorkspaceRolePermissionDAO workspaceRolePermissionDAO;

  @Inject
  private RoleSchoolDataIdentifierDAO roleSchoolDataIdentifierDAO;
  
  /* Workspace */

  public Workspace createWorkspace(String schoolDataSource, String name, String description, WorkspaceType type,
      String courseIdentifierIdentifier) {
    return workspaceSchoolDataController.createWorkspace(schoolDataSource, name, description, type,
        courseIdentifierIdentifier);
  }

  public Workspace findWorkspace(WorkspaceEntity workspaceEntity) {
    return workspaceSchoolDataController.findWorkspace(workspaceEntity);
  }

  public Workspace findWorkspace(String schoolDataSourceName, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSourceName);
    // TODO: Error handling
    return findWorkspace(schoolDataSource, identifier);
  }

  public Workspace findWorkspace(SchoolDataSource schoolDataSource, String identifier) {
    return workspaceSchoolDataController.findWorkspace(schoolDataSource, identifier);
  }

  public List<Workspace> listWorkspaces() {
    return workspaceSchoolDataController.listWorkspaces();
  }

  public List<Workspace> listWorkspacesByCourseIdentifier(CourseIdentifier courseIdentifier) {
    return workspaceSchoolDataController.listWorkspacesByCourseIdentifier(courseIdentifier);
  }

  public List<Workspace> listWorkspaces(String schoolDataSource) {
    return workspaceSchoolDataController.listWorkspaces(schoolDataSource);
  }

  public Workspace updateWorkspace(Workspace workspace) {
    return workspaceSchoolDataController.updateWorkspace(workspace);
  }
  
  public void updateWorkspaceStudentActivity(WorkspaceUser workspaceUser, boolean active) {
    workspaceSchoolDataController.updateWorkspaceStudentActivity(workspaceUser, active);
  }

  public void archiveWorkspace(Workspace workspace) {
    WorkspaceEntity workspaceEntity = workspaceSchoolDataController.findWorkspaceEntity(workspace);
    if (workspaceEntity != null) {
      archiveWorkspaceEntity(workspaceEntity);
    }

    workspaceSchoolDataController.removeWorkspace(workspace);
  }

  public void deleteWorkspace(Workspace workspace) {
    WorkspaceEntity workspaceEntity = workspaceSchoolDataController.findWorkspaceEntity(workspace);
    if (workspaceEntity != null) {
      deleteWorkspaceEntity(workspaceEntity);
    }

    workspaceSchoolDataController.removeWorkspace(workspace);
  }
  
  /* WorkspaceType */

  public WorkspaceType findWorkspaceType(String schoolDataSource, String identifier) {
    return workspaceSchoolDataController.findWorkspaceTypeByDataSourceAndIdentifier(schoolDataSource, identifier);
  }

  /* Workspace Entity */

  public WorkspaceEntity findWorkspaceEntity(Workspace workspace) {
    return workspaceSchoolDataController.findWorkspaceEntity(workspace);
  }

  public WorkspaceEntity findWorkspaceEntityById(Long workspaceId) {
    return workspaceEntityDAO.findById(workspaceId);
  }

  public WorkspaceEntity findWorkspaceEntityByUrlName(String urlName) {
    return workspaceEntityDAO.findByUrlName(urlName);
  }

  public WorkspaceEntity findWorkspaceEntityByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
    return workspaceEntityDAO.findByDataSourceAndIdentifier(dataSource, identifier);
  }

  public WorkspaceEntity findWorkspaceEntityByDataSourceAndIdentifier(String schoolDataSource, String identifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource != null) {
      return findWorkspaceEntityByDataSourceAndIdentifier(dataSource, identifier);
    } else {
      logger.log(Level.SEVERE, "Could not find school data source '" + schoolDataSource + "'");
      return null;
    }
  }

  public List<WorkspaceEntity> listWorkspaceEntities() {
    return workspaceEntityDAO.listAll();
  }

  public List<WorkspaceEntity> listWorkspaceEntitiesByUser(UserEntity userEntity) {
    return listWorkspaceEntitiesByUser(userEntity, false);
  }
  
  public List<WorkspaceEntity> listWorkspaceEntitiesByUser(UserEntity userEntity, boolean includeUnpublished) {
    List<WorkspaceEntity> result = new ArrayList<>();
    
    List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listWorkspaceUserEntitiesByUserEntity(userEntity);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      if (includeUnpublished || workspaceUserEntity.getWorkspaceEntity().getPublished()) {
        if (!result.contains(workspaceUserEntity.getWorkspaceEntity())) {
          result.add(workspaceUserEntity.getWorkspaceEntity());
        }
      }
    }
    
    return result;
  }

  public List<WorkspaceUserEntity> listWorkspaceUserEnitiesByWorkspaceRoleArchetype(WorkspaceEntity workspaceEntity, WorkspaceRoleArchetype archtype, Integer firstResult, Integer maxResults) {
    List<WorkspaceRoleEntity> workspaceRoles = roleController.listWorkspaceRoleEntitiesByArchetype(archtype);
    if (workspaceRoles.isEmpty()) {
      return Collections.emptyList();
    }
    
    return workspaceUserEntityController.listWorkspaceUserEntitiesByRoles(workspaceEntity, workspaceRoles, firstResult, maxResults);
  }
  
  public Long countWorkspaceUserEntitiesByWorkspaceRoleArchetype(WorkspaceEntity workspaceEntity, WorkspaceRoleArchetype archtype) {
    List<WorkspaceRoleEntity> workspaceRoles = roleController.listWorkspaceRoleEntitiesByArchetype(archtype);
    if (workspaceRoles.isEmpty()) {
      return 0l;
    }
    
    return workspaceUserEntityController.countWorkspaceUserEntitiesByRoles(workspaceEntity, workspaceRoles);
  }
  
  
  public List<WorkspaceEntity> listWorkspaceEntitiesBySchoolDataSource(String schoolDataSource) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource != null) {
      return listWorkspaceEntitiesBySchoolDataSource(dataSource);
    } else {
      logger.log(Level.SEVERE, "Could not find school data source '" + schoolDataSource
          + "' while listing workspaceEntities by school data source");
      return null;
    }
  }

  public List<WorkspaceEntity> listWorkspaceEntitiesBySchoolDataSource(SchoolDataSource schoolDataSource) {
    return workspaceEntityDAO.listByDataSource(schoolDataSource);
  }

  public WorkspaceEntity archiveWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    return workspaceEntityDAO.updateArchived(workspaceEntity, Boolean.TRUE);
  }

  private void deleteWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    // Delete role permissions

    List<WorkspaceRolePermission> workspaceRolePermissions = workspaceRolePermissionDAO
        .listByWorkspaceEntity(workspaceEntity);
    for (WorkspaceRolePermission workspaceRolePermission : workspaceRolePermissions) {
      workspaceRolePermissionDAO.delete(workspaceRolePermission);
    }

    // Delete settings

    WorkspaceSettings workspaceSettings = findWorkspaceSettings(workspaceEntity);
    if (workspaceSettings != null) {
      workspaceSettingsDAO.delete(workspaceSettings);
    }

    // Workspace Users

    List<WorkspaceUser> workspaceUsers = listWorkspaceUsers(workspaceEntity);
    for (WorkspaceUser workspaceUser : workspaceUsers) {
      deleteWorkspaceUser(workspaceUser);
    }

    workspaceEntityDAO.delete(workspaceEntity);
  }

  /* WorkspaceUsers */

  public WorkspaceUser createWorkspaceUser(Workspace workspace, User user, Role role) {
    return workspaceSchoolDataController.createWorkspaceUser(workspace, user, role.getSchoolDataSource(),
        role.getIdentifier());
  }

  public WorkspaceUserEntity findWorkspaceUserEntity(WorkspaceUser workspaceUser) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(
        workspaceUser.getWorkspaceSchoolDataSource(),
        workspaceUser.getWorkspaceIdentifier());
    return findWorkspaceUserEntity(workspaceUser, workspaceEntity); 
  }

  public WorkspaceUserEntity findWorkspaceUserEntity(WorkspaceUser workspaceUser, WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndIdentifier(
        workspaceEntity,
        workspaceUser.getIdentifier());
  }

  @Deprecated
  public List<WorkspaceUser> listWorkspaceUsers(Workspace workspace) {
    return workspaceSchoolDataController.listWorkspaceUsers(workspace);
  }

  @Deprecated
  public List<WorkspaceUser> listWorkspaceUsers(WorkspaceEntity workspaceEntity) {
    Workspace workspace = findWorkspace(workspaceEntity);
    if (workspace != null) {
      return workspaceSchoolDataController.listWorkspaceUsers(workspace);
    }

    return null;
  }
  
  public List<WorkspaceUser> listWorkspaceStudents(WorkspaceEntity workspaceEntity, Boolean active) {
    Workspace workspace = findWorkspace(workspaceEntity);
    if (workspace != null) {
      return workspaceSchoolDataController.listWorkspaceStudents(workspace, active);      
    }
    return null;
  }

  public List<WorkspaceUser> listWorkspaceStaffMembers(WorkspaceEntity workspaceEntity) {
    Workspace workspace = findWorkspace(workspaceEntity);
    if (workspace != null) {
      return workspaceSchoolDataController.listWorkspaceStaffMembers(workspace);      
    }
    return null;
  }
  
  public WorkspaceUser findWorkspaceUser(WorkspaceUserEntity workspaceUserEntity) {
    return workspaceSchoolDataController.findWorkspaceUser(workspaceUserEntity);
  }
  
  private void deleteWorkspaceUser(WorkspaceUser workspaceUser) {
    // TODO: Remove users via bridge also
    WorkspaceUserEntity workspaceUserEntity = findWorkspaceUserEntity(workspaceUser);
    if (workspaceUserEntity != null) {
      workspaceUserEntityDAO.delete(workspaceUserEntity);
    }
  }

  public int countWorkspaceUsers(WorkspaceEntity workspaceEntity) {
    // TODO Optimize
    return listWorkspaceUsers(workspaceEntity).size();
  }
  
  public List<WorkspaceUserEntity> listWorkspaceUserEntitiesByWorkspaceEntityAndRoleArchetype(WorkspaceEntity workspaceEntity, WorkspaceRoleArchetype roleArchetype) {
    List<WorkspaceRoleEntity> workspaceRoles = roleController.listWorkspaceRoleEntitiesByArchetype(roleArchetype);
    if (workspaceRoles.isEmpty()) {
      return Collections.emptyList();
    }
    
    return workspaceUserEntityController.listWorkspaceUserEntitiesByRoles(workspaceEntity, workspaceRoles);
  }
  
  public List<User> listUsersByWorkspaceEntityAndRoleArchetype(WorkspaceEntity workspaceEntity, WorkspaceRoleArchetype roleArchetype) {
    List<WorkspaceUserEntity> workspaceUserEntities = listWorkspaceUserEntitiesByWorkspaceEntityAndRoleArchetype(workspaceEntity, roleArchetype);
    List<User> result = new ArrayList<>(workspaceUserEntities.size());
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      User user = userController.findUserByDataSourceAndIdentifier(workspaceEntity.getDataSource().getIdentifier(), workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
      if (user != null) {
        result.add(user);
      }
    }
    
    return result;
  }

  public List<UserEntity> listUserEntitiesByWorkspaceEntityAndRoleArchetype(WorkspaceEntity workspaceEntity, WorkspaceRoleArchetype roleArchetype) {
    List<User> users = listUsersByWorkspaceEntityAndRoleArchetype(workspaceEntity, roleArchetype);
    List<UserEntity> result = new ArrayList<>();
    for (User user : users) {
      UserEntity userEntity = userEntityController.findUserEntityByUser(user);
      if (userEntity != null) {
        result.add(userEntity);
      }
    }
    
    return result;
  }
  
  /* WorkspaceRoleEntity */

  public WorkspaceRoleEntity findWorkspaceRoleEntityByDataSourceAndIdentifier(String schoolDataSource,
      String roleIdentifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource == null) {
      logger.log(Level.SEVERE, "Could not find school data source '" + schoolDataSource + "'");
      return null;
    }

    RoleSchoolDataIdentifier roleSchoolDataIdentifier = roleSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(
        dataSource, roleIdentifier);
    if (roleSchoolDataIdentifier != null) {
      RoleEntity roleEntity = roleSchoolDataIdentifier.getRoleEntity();
      if (roleEntity.getType() == UserRoleType.WORKSPACE) {
        return (WorkspaceRoleEntity) roleEntity;
      }
    }

    return null;
  }

  /* WorkspaceSettings */

  public WorkspaceSettings findWorkspaceSettings(WorkspaceEntity workspaceEntity) {
    return workspaceSettingsDAO.findByWorkspaceEntity(workspaceEntity);
  }

  /* WorkspaceUserSignup */

  public WorkspaceUserSignup createWorkspaceUserSignup(WorkspaceEntity workspaceEntity, UserEntity userEntity,
      Date date, String message) {
    return workspaceUserSignupDAO.create(workspaceEntity, userEntity, date, message);
  }

}
