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
import fi.otavanopisto.muikku.model.security.Permission;
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
