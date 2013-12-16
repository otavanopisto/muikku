package fi.muikku.plugins.data;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.security.EnvironmentRolePermissionDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.users.RoleEntityDAO;
import fi.muikku.dao.workspace.WorkspaceSettingsTemplateDAO;
import fi.muikku.dao.workspace.WorkspaceSettingsTemplateRolePermissionDAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.workspace.WorkspaceSettingsTemplate;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.muikku.security.PermissionScope;

@Dependent
@Stateful
public class PermissionsPluginController {
	
	@Inject
	private PermissionDAO permissionDAO;
	
	@Inject
	private EnvironmentRolePermissionDAO environmentRolePermissionDAO;

	@Inject
	private RoleEntityDAO roleEntityDAO;
	
	@Inject
	private WorkspaceSettingsTemplateRolePermissionDAO workspaceSettingsTemplateRolePermissionDAO; 

	@Inject
	private WorkspaceSettingsTemplateDAO workspaceSettingsTemplateDAO;
	
  @Inject
  @Any
  private Instance<MuikkuPermissionCollection> permissionCollections;
	
  public void processPermissions() {
    for (MuikkuPermissionCollection collection : permissionCollections) {
      List<String> permissions = collection.listPermissions();

      for (String permissionName : permissions) {
        Permission permission = permissionDAO.findByName(permissionName);
        
        if (permission == null) {
          try {
            String permissionScope = collection.getPermissionScope(permissionName);

            if (!PermissionScope.PERSONAL.equals(permissionScope)) {
              permission = permissionDAO.create(permissionName, permissionScope);
              
              String[] defaultRoles = collection.getDefaultRoles(permissionName);
              
              if (defaultRoles != null) {
                switch (permissionScope) {
                  case PermissionScope.ENVIRONMENT:
                    for (int i = 0; i < defaultRoles.length; i++) {
                      String roleName = defaultRoles[i];
                      RoleEntity roleEntity = roleEntityDAO.findByName(roleName);
                      
                      environmentRolePermissionDAO.create(roleEntity, permission);
                    }
                  break;
                  
                  case PermissionScope.WORKSPACE:
                    WorkspaceSettingsTemplate workspaceSettingsTemplate = workspaceSettingsTemplateDAO.findById(1l); 
                    
                    for (int i = 0; i < defaultRoles.length; i++) {
                      String roleName = defaultRoles[i];
                      RoleEntity roleEntity = roleEntityDAO.findByName(roleName);

                      workspaceSettingsTemplateRolePermissionDAO.create(workspaceSettingsTemplate, roleEntity, permission);
                    }
                  break;
                }
              }
            }
            
          } catch (Exception e) {
            e.printStackTrace();
          }
        }
      }
    }
  } 
	
}
