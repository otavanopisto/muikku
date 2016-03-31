package fi.otavanopisto.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.otavanopisto.muikku.dao.users.RoleSchoolDataIdentifierDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceSettingsDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceUserEntityDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceUserSignupDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.security.WorkspaceRolePermission;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.RoleSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserRoleType;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceSettings;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserSignup;
import fi.otavanopisto.muikku.schooldata.entity.CourseIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.Role;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceType;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class WorkspaceController {
  
  // TODO: Why not fi.otavanopisto.muikku.workspaces ?

  @Inject
  private Logger logger;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;

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

  public Workspace findWorkspace(SchoolDataIdentifier workspaceIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(workspaceIdentifier.getDataSource());
    if (schoolDataSource == null) {
      logger.severe(String.format("Could not find school data source %s", workspaceIdentifier.getDataSource()));
      return null;
    }
    
    return findWorkspace(schoolDataSource, workspaceIdentifier.getIdentifier());
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
  
  public Workspace copyWorkspace(SchoolDataIdentifier workspaceIdentifier, String name, String nameExtension, String description) {
    return workspaceSchoolDataController.copyWorkspace(workspaceIdentifier, name, nameExtension, description);
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
    
    List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityDAO.listByWorkspaceIncludeArchived(workspaceEntity);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      workspaceUserEntityDAO.delete(workspaceUserEntity);
    }

    workspaceEntityDAO.delete(workspaceEntity);
  }

  /* WorkspaceUsers */

  public WorkspaceUser createWorkspaceUser(Workspace workspace, User user, Role role) {
    return workspaceSchoolDataController.createWorkspaceUser(workspace, user, role.getSchoolDataSource(),
        role.getIdentifier());
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
  
  public List<WorkspaceUser> listWorkspaceStudents(WorkspaceEntity workspaceEntity) {
    Workspace workspace = findWorkspace(workspaceEntity);
    if (workspace != null) {
      return workspaceSchoolDataController.listWorkspaceStudents(workspace);      
    }
    return null;
  }

  public List<WorkspaceUser> listWorkspaceStudents(WorkspaceEntity workspaceEntity, boolean active) {
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
  
  public WorkspaceUser findWorkspaceUserByWorkspaceAndUser(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier userIdentifier) {
    return workspaceSchoolDataController.findWorkspaceUserByWorkspaceAndUser(workspaceIdentifier, userIdentifier);
  }
  
  public WorkspaceUser findWorkspaceUserByWorkspaceEntityAndUser(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
    return findWorkspaceUserByWorkspaceAndUser(workspaceIdentifier, userIdentifier);
  }
  
  public WorkspaceUser findWorkspaceUser(WorkspaceUserEntity workspaceUserEntity) {
    return workspaceSchoolDataController.findWorkspaceUser(workspaceUserEntity);
  }
  
  public WorkspaceUser findWorkspaceUser(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier workspaceUserIdentifier) {
    return workspaceSchoolDataController.findWorkspaceUser(workspaceIdentifier, workspaceUserIdentifier);
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
