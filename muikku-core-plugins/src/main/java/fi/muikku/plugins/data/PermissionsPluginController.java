package fi.muikku.plugins.data;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.security.EnvironmentRolePermissionDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.UserGroupRolePermissionDAO;
import fi.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.muikku.dao.users.RoleEntityDAO;
import fi.muikku.dao.users.UserGroupDAO;
import fi.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.muikku.dao.workspace.WorkspaceRoleEntityDAO;
import fi.muikku.dao.workspace.WorkspaceSettingsTemplateDAO;
import fi.muikku.dao.workspace.WorkspaceSettingsTemplateRolePermissionDAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.UserGroup;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceSettingsTemplate;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.muikku.security.PermissionScope;

@Dependent
@Stateful
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
	private UserGroupDAO userGroupDAO;
	
  @Inject
  private UserGroupRolePermissionDAO userGroupRolePermissionDAO;

  @Inject
  @Any
  private Instance<MuikkuPermissionCollection> permissionCollections;
  
  @Inject
  private Event<PermissionDiscoveredEvent> permissionDiscoveredEvent;
	
  public void processPermissions() {
    for (MuikkuPermissionCollection collection : permissionCollections) {
      List<String> permissions = collection.listPermissions();

      for (String permissionName : permissions) {
        Permission permission = permissionDAO.findByName(permissionName);
        
        if (permission == null) {
          try {
            final String permissionScope = collection.getPermissionScope(permissionName);
            
            if (permissionScope != null) {
              if (!PermissionScope.PERSONAL.equals(permissionScope)) {
                permission = permissionDAO.create(permissionName, permissionScope);
  
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
                        workspaceRolePermissionDAO.create(workspace, role, permission);
                      }
                    }
                  break;
                  
                  case PermissionScope.USERGROUP:
                    List<UserGroup> userGroups = userGroupDAO.listAll();
                    
                    for (RoleEntity role : roles) {
                      // TODO Workspace creation & templates - is this necessary and bulletproof?
                      for (UserGroup userGroup: userGroups) {
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
  } 
	
}
