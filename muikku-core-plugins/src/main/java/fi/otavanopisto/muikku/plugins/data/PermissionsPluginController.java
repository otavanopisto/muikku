package fi.otavanopisto.muikku.plugins.data;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Event;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.security.EnvironmentRolePermissionDAO;
import fi.otavanopisto.muikku.dao.security.PermissionDAO;
import fi.otavanopisto.muikku.dao.security.UserGroupRolePermissionDAO;
import fi.otavanopisto.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.otavanopisto.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.otavanopisto.muikku.dao.users.RoleEntityDAO;
import fi.otavanopisto.muikku.dao.users.SystemRoleEntityDAO;
import fi.otavanopisto.muikku.dao.users.UserGroupEntityDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceRoleEntityDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceSettingsTemplateDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceSettingsTemplateRolePermissionDAO;
import fi.otavanopisto.muikku.model.security.EnvironmentRolePermission;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.RolePermission;
import fi.otavanopisto.muikku.model.security.WorkspaceRolePermission;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.SystemRoleType;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceSettingsTemplate;
import fi.otavanopisto.muikku.security.MuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.PermissionScope;

public class PermissionsPluginController {
	
  @Inject
  private Logger logger;
  
	@Inject
	private PermissionDAO permissionDAO;
	
	@Inject
	private EnvironmentRolePermissionDAO environmentRolePermissionDAO;

	@Inject
	private RoleEntityDAO roleEntityDAO;

	@Inject
	private EnvironmentRoleEntityDAO environmentRoleEntityDAO; 
	
  @Inject
  private WorkspaceRoleEntityDAO workspaceRoleEntityDAO; 
  
  @Inject
  private WorkspaceEntityDAO workspaceEntityDAO;
	
	@Inject
	private WorkspaceSettingsTemplateRolePermissionDAO workspaceSettingsTemplateRolePermissionDAO; 

	@Inject
	private WorkspaceSettingsTemplateDAO workspaceSettingsTemplateDAO;
	
	@Inject
	private WorkspaceRolePermissionDAO workspaceRolePermissionDAO;

	@Inject
	private UserGroupEntityDAO userGroupDAO;
	
  @Inject
  private UserGroupRolePermissionDAO userGroupRolePermissionDAO;

  @Inject
  private SystemRoleEntityDAO systemRoleEntityDAO;
  
  @Inject
  @Any
  private Instance<MuikkuPermissionCollection> permissionCollections;
  
  @Inject
  private Event<PermissionDiscoveredEvent> permissionDiscoveredEvent;
  
  public void resetPermissions() {
    // TODO Only handles environment and workspace scopes
    for (MuikkuPermissionCollection collection : permissionCollections) {
      logger.log(Level.INFO, "Processing permission collection " + collection.getClass().getSimpleName());
      List<String> permissions = collection.listPermissions();
      for (String permissionName : permissions) {
        Permission permission = permissionDAO.findByName(permissionName);
        if (permission != null) {
          try {
            String permissionScope = collection.getPermissionScope(permissionName);
            if (permissionScope != null) {
              if (!PermissionScope.PERSONAL.equals(permissionScope)) {

                // Current roles
                
                String[] pseudoRoles = collection.getDefaultPseudoRoles(permissionName);
                EnvironmentRoleArchetype[] environmentRoles = collection.getDefaultEnvironmentRoles(permissionName);
                WorkspaceRoleArchetype[] workspaceRoles = collection.getDefaultWorkspaceRoles(permissionName);
                List<RoleEntity> currentRoles = new ArrayList<RoleEntity>();
                if (pseudoRoles != null) {
                  for (String pseudoRole : pseudoRoles) {
                    RoleEntity roleEntity = roleEntityDAO.findByName(pseudoRole);
                    if (roleEntity != null) {
                      currentRoles.add(roleEntity);
                    }
                  }
                }
                if (environmentRoles != null) {
                  for (EnvironmentRoleArchetype environmentRole : environmentRoles) {
                    List<EnvironmentRoleEntity> envRoles = environmentRoleEntityDAO.listByArchetype(environmentRole);
                    currentRoles.addAll(envRoles);
                  }
                }
                if (workspaceRoles != null) {
                  for (WorkspaceRoleArchetype workspaceRole : workspaceRoles) {
                    List<WorkspaceRoleEntity> wsRoles = workspaceRoleEntityDAO.listByArchetype(workspaceRole);
                    currentRoles.addAll(wsRoles);
                  }
                }
                
                logger.info(String.format("Permission %s applies to %d roles", permissionName, currentRoles.size()));
                
                if (PermissionScope.ENVIRONMENT.equals(permissionScope)) {
                  List<EnvironmentRolePermission> databasePermissions = environmentRolePermissionDAO.listByPermission(permission);
                  for (EnvironmentRolePermission databasePermission : databasePermissions) {
                    int index = indexOfRoleEntity(currentRoles, databasePermission);
                    if (index >= 0) {
                      currentRoles.remove(index);
                    }
                    else {
                      logger.info(String.format("Removing %s from %s", databasePermission.getRole().getName(), permission.getName()));
                      environmentRolePermissionDAO.delete(databasePermission);
                    }
                  }
                  for (RoleEntity currentRole : currentRoles) {
                    logger.info(String.format("Adding environment role %s for %s", currentRole.getName(), permission.getName()));
                    environmentRolePermissionDAO.create(currentRole, permission);
                  }
                }
                else if (PermissionScope.WORKSPACE.equals(permissionScope)) {
                  List<WorkspaceEntity> workspaces = workspaceEntityDAO.listAll();
                  List<WorkspaceRolePermission> databasePermissions = workspaceRolePermissionDAO.listByPermission(permission);
                  List<RoleEntity> newRoles = new ArrayList<RoleEntity>();
                  for (int i = 0; i < currentRoles.size(); i++) {
                    boolean roleFound = false;
                    for (int j = databasePermissions.size() - 1; j >= 0; j--) {
                      roleFound = databasePermissions.get(j).getRole().getId().equals(currentRoles.get(i).getId());
                      if (roleFound) {
                        break;
                      }
                    }
                    if (!roleFound) {
                      newRoles.add(currentRoles.get(i));
                    }
                  }
                  for (int j = databasePermissions.size() - 1; j >= 0; j--) {
                    WorkspaceRolePermission workspaceRolePermission = databasePermissions.get(j);
                    int index = indexOfRoleEntity(currentRoles, workspaceRolePermission);
                    if (index == -1) {
                      logger.info(String.format("Removing %s from %s in %s", workspaceRolePermission.getRole().getName(), permission.getName(), workspaceRolePermission.getWorkspace().getUrlName()));
                      workspaceRolePermissionDAO.delete(workspaceRolePermission);
                      databasePermissions.remove(j);
                    }
                  }
                  for (RoleEntity newRole : newRoles) {
                    for (WorkspaceEntity workspace: workspaces) {                    
                      logger.info(String.format("Adding workspace role %s for %s in %s", newRole.getName(), permission.getName(), workspace.getUrlName()));
                      workspaceRolePermissionDAO.create(workspace, newRole, permission);
                    }
                  }
                }
                
              }
            }
          }
          catch (Exception e) {
            logger.log(Level.SEVERE, "Permission handling failed for " + permissionName);
          }
        }
      }
    }
  }
  
  private int indexOfRoleEntity(List<RoleEntity> roleEntities, RolePermission databasePermission) {
    for (int i = 0; i < roleEntities.size(); i++) {
      if (roleEntities.get(i).getId().equals(databasePermission.getRole().getId())) {
        return i;
      }
    }
    return -1;
  }
	
  public void processPermissions() {
    logger.log(Level.INFO, "Starting permission gathering");
    
    // Ensure the system roles exist
    
    for (SystemRoleType systemRoleType : SystemRoleType.values()) {
      if (systemRoleEntityDAO.findByRoleType(systemRoleType) == null)
        systemRoleEntityDAO.create(systemRoleType.name(), systemRoleType);
    }
    
    // Process permissions
    
    for (MuikkuPermissionCollection collection : permissionCollections) {
      logger.log(Level.INFO, "Processing permission collection " + collection.getClass().getSimpleName());

      List<String> permissions = collection.listPermissions();

      for (String permissionName : permissions) {
        Permission permission = permissionDAO.findByName(permissionName);
        
        if (permission == null) {
          logger.log(Level.INFO, "Recording new permission " + permissionName);

          try {
            final String permissionScope = collection.getPermissionScope(permissionName);
            
            if (permissionScope != null) {
              permission = permissionDAO.create(permissionName, permissionScope);
  
              if (!PermissionScope.PERSONAL.equals(permissionScope)) {
                String[] pseudoRoles = collection.getDefaultPseudoRoles(permissionName);
                EnvironmentRoleArchetype[] environmentRoles = collection.getDefaultEnvironmentRoles(permissionName);
                WorkspaceRoleArchetype[] workspaceRoles = collection.getDefaultWorkspaceRoles(permissionName);
  
                List<RoleEntity> roles = new ArrayList<RoleEntity>();
                
                if (pseudoRoles != null) {
                  for (String pseudoRole : pseudoRoles) {
                    RoleEntity roleEntity = roleEntityDAO.findByName(pseudoRole);
                    
                    if (roleEntity != null)
                      roles.add(roleEntity);
                  }
                }
  
                if (environmentRoles != null) {
                  for (EnvironmentRoleArchetype envRole : environmentRoles) {
                    List<EnvironmentRoleEntity> envRoles = environmentRoleEntityDAO.listByArchetype(envRole);
                    roles.addAll(envRoles);
                  }
                }
  
                if (workspaceRoles != null) {
                  for (WorkspaceRoleArchetype arc : workspaceRoles) {
                    List<WorkspaceRoleEntity> wsRoles = workspaceRoleEntityDAO.listByArchetype(arc);
                    roles.addAll(wsRoles);
                  }
                }
                
                switch (permissionScope) {
                  case PermissionScope.ENVIRONMENT:
                    for (RoleEntity role : roles) {
                      environmentRolePermissionDAO.create(role, permission);
                    }
                  break;
                  
                  case PermissionScope.WORKSPACE:
                    List<WorkspaceEntity> workspaces = workspaceEntityDAO.listAll();
                    WorkspaceSettingsTemplate workspaceSettingsTemplate = workspaceSettingsTemplateDAO.findById(1l); 
                    
                    for (RoleEntity role : roles) {
                      workspaceSettingsTemplateRolePermissionDAO.create(workspaceSettingsTemplate, role, permission);
  
                      // TODO Workspace creation & templates - is this necessary and bulletproof?
                      for (WorkspaceEntity workspace: workspaces) {
                        logger.log(Level.INFO, "Adding workspace role permission for workspace " + workspace.getId() + " role: " + role.getName());
                        
                        workspaceRolePermissionDAO.create(workspace, role, permission);
                      }
                    }
                  break;
                  
                  case PermissionScope.USERGROUP:
                    List<UserGroupEntity> userGroups = userGroupDAO.listAll();
                    
                    for (RoleEntity role : roles) {
                      // TODO Workspace creation & templates - is this necessary and bulletproof?
                      for (UserGroupEntity userGroup: userGroups) {
                        userGroupRolePermissionDAO.create(userGroup, role, permission);
                      }
                    }
                  break;
                  
                  default:
                    
                    permissionDiscoveredEvent.select(new PermissionScopeBinding() {
                      private static final long serialVersionUID = 9009824962970938515L;

                      @Override
                      public String value() {
                        return permissionScope;
                      }
                    }).fire(new PermissionDiscoveredEvent(permission));
                  break;
                }
              }
            }
            else
              logger.log(Level.WARNING, "PermissionScope null for " + permissionName);
          } catch (Exception e) {
            logger.log(Level.SEVERE, "Permission handling failed for " + permissionName);
          }
        }
      }
    }

    logger.log(Level.INFO, "Finished permission gathering");
  } 
	
}
