package fi.otavanopisto.muikku.plugins.data;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Event;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.dao.security.PermissionDAO;
import fi.otavanopisto.muikku.dao.security.RolePermissionDAO;
import fi.otavanopisto.muikku.dao.security.UserGroupRolePermissionDAO;
import fi.otavanopisto.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.otavanopisto.muikku.dao.users.RoleEntityDAO;
import fi.otavanopisto.muikku.dao.users.SystemRoleEntityDAO;
import fi.otavanopisto.muikku.dao.users.UserGroupEntityDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceRoleEntityDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.RolePermission;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.SystemRoleType;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.security.MuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.PermissionScope;

public class PermissionsPluginController {
	
  private static final String PLUGIN_NAME = PermissionDataPluginDescriptor.PLUGIN_NAME;
  private static final String RESET_ROLES_SETTING = "startupResetRoles";
  
  @Inject
  private Logger logger;
  
	@Inject
	private PermissionDAO permissionDAO;
	
	@Inject
	private RolePermissionDAO rolePermissionDAO;

	@Inject
	private RoleEntityDAO roleEntityDAO;

	@Inject
	private EnvironmentRoleEntityDAO environmentRoleEntityDAO; 
	
  @Inject
  private WorkspaceRoleEntityDAO workspaceRoleEntityDAO; 
  
	@Inject
	private UserGroupEntityDAO userGroupDAO;
	
  @Inject
  private UserGroupRolePermissionDAO userGroupRolePermissionDAO;

  @Inject
  private SystemRoleEntityDAO systemRoleEntityDAO;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  @Any
  private Instance<MuikkuPermissionCollection> permissionCollections;
  
  @Inject
  private Event<PermissionDiscoveredEvent> permissionDiscoveredEvent;

  public void resetPermissions() {
    resetPermissions(new HashSet<>(roleEntityDAO.listAll()));
  }
  
  public void resetPermissions(Set<RoleEntity> resetRoleEntities) {
    if (CollectionUtils.isEmpty(resetRoleEntities))
      return;
    
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
                    WorkspaceRoleEntity wsRole = workspaceRoleEntityDAO.findByArchetype(workspaceRole);
                    currentRoles.add(wsRole);
                  }
                }
                
                logger.info(String.format("Permission %s applies to %d roles", permissionName, currentRoles.size()));
                
                if (PermissionScope.ENVIRONMENT.equals(permissionScope) || PermissionScope.WORKSPACE.equals(permissionScope)) {
                  List<RolePermission> databasePermissions = rolePermissionDAO.listByPermission(permission);
                  
                  removeNonHandledRoles(currentRoles, databasePermissions, resetRoleEntities);
                  for (RolePermission databasePermission : databasePermissions) {
                    int index = indexOfRoleEntity(currentRoles, databasePermission);
                    if (index >= 0) {
                      currentRoles.remove(index);
                    }
                    else {
                      logger.info(String.format("Removing %s from %s", databasePermission.getRole().getName(), permission.getName()));
                      rolePermissionDAO.delete(databasePermission);
                    }
                  }
                  for (RoleEntity currentRole : currentRoles) {
                    logger.info(String.format("Adding environment role %s for %s", currentRole.getName(), permission.getName()));
                    rolePermissionDAO.create(currentRole, permission);
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

  private void removeNonHandledRoles(List<RoleEntity> defaultRoles, List<RolePermission> databaseRoles,
      Set<RoleEntity> resetRoles) {
    for (int i = defaultRoles.size() - 1; i >= 0; i--) {
      boolean found = false;
      for (RoleEntity re : resetRoles) {
        if (re.getId().equals(defaultRoles.get(i).getId())) {
          found = true;
          break;
        }
      }
      if (!found) {
        defaultRoles.remove(i);
      }
    }
    for (int i = databaseRoles.size() - 1; i >= 0; i--) {
      boolean found = false;
      for (RoleEntity re : resetRoles) {
        if (re.getId().equals(databaseRoles.get(i).getRole().getId())) {
          found = true;
          break;
        }
      }
      if (!found) {
        databaseRoles.remove(i);
      }
    }
  }

  public void checkForResetPermissions() {
    String resetRoles = pluginSettingsController.getPluginSetting(PLUGIN_NAME, RESET_ROLES_SETTING);
    
    if (StringUtils.isNotBlank(resetRoles)) {
      try {
        String[] roles = resetRoles.split(",");

        Set<RoleEntity> resetRoleEntities = new HashSet<>();
        
        for (String role : roles) {
          long roleId = Long.parseLong(role);
          
          RoleEntity roleEntity = roleEntityDAO.findById(roleId);
          
          if (roleEntity != null)
            resetRoleEntities.add(roleEntity);
          else
            logger.log(Level.SEVERE, String.format("RoleEntity not found (%d)", roleId));
        }

        resetPermissions(resetRoleEntities);
      } finally {
        pluginSettingsController.setPluginSetting(PLUGIN_NAME, RESET_ROLES_SETTING, "");
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
    
    // Ensure the workspace roles exist
    
    for (WorkspaceRoleArchetype workspaceRoleArchetype : WorkspaceRoleArchetype.values()) {
      if (workspaceRoleEntityDAO.findByArchetype(workspaceRoleArchetype) == null) {
        String name = StringUtils.capitalize(StringUtils.lowerCase(workspaceRoleArchetype.name()));
        workspaceRoleEntityDAO.create(workspaceRoleArchetype, name);
      }
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
                    WorkspaceRoleEntity wsRole = workspaceRoleEntityDAO.findByArchetype(arc);
                    roles.add(wsRole);
                  }
                }
                
                switch (permissionScope) {
                  case PermissionScope.ENVIRONMENT:
                  case PermissionScope.WORKSPACE:
                    for (RoleEntity role : roles) {
                      rolePermissionDAO.create(role, permission);
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
