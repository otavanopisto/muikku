package fi.muikku.security;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.enterprise.event.TransactionPhase;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.security.EnvironmentRolePermissionDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.muikku.dao.workspace.WorkspaceRoleEntityDAO;
import fi.muikku.dao.workspace.WorkspaceSettingsTemplateDAO;
import fi.muikku.dao.workspace.WorkspaceSettingsTemplateRolePermissionDAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceSettingsTemplate;
import fi.muikku.model.workspace.WorkspaceSettingsTemplateRolePermission;
import fi.muikku.schooldata.events.SchoolDataEnvironmentRoleDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;
import fi.muikku.schooldata.events.SchoolDataWorkspaceRoleDiscoveredEvent;

public class UserRolePermissionObserver {

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private EnvironmentRolePermissionDAO environmentRolePermissionDAO;

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
  
  /*

  @Inject
  private UserGroupEntityDAO userGroupDAO;
  
  @Inject
  private UserGroupRolePermissionDAO userGroupRolePermissionDAO;
  
  */

  @Inject
  @Any
  private Instance<MuikkuPermissionCollection> permissionCollections;
  
  // TODO: roolit workspacen luonnissa
  
  public void onEnvironmentRoleDiscoveredEvent(@Observes (during = TransactionPhase.BEFORE_COMPLETION) SchoolDataEnvironmentRoleDiscoveredEvent event) {
    for (MuikkuPermissionCollection collection : permissionCollections) {
      List<String> permissions = collection.listPermissions();

      for (String permissionName : permissions) {
        Permission permission = permissionDAO.findByName(permissionName);
        
        if (permission != null) {
          try {
            String permissionScope = collection.getPermissionScope(permissionName);

            RoleEntity role = environmentRoleEntityDAO.findById(event.getDiscoveredEnvironmentRoleEntityId());
            
            EnvironmentRoleArchetype[] archetypes = collection.getDefaultEnvironmentRoles(permissionName);

            if (archetypes != null) {
              // Check if event role archetype exists
              
              for (EnvironmentRoleArchetype archetype : archetypes) {
                if (archetype.equals(translateArchetype(event.getArchetype()))) {
                  applyPermission(permissionScope, role, permission);
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

  public void onWorkspaceRoleDiscoveredEvent(@Observes (during = TransactionPhase.BEFORE_COMPLETION) SchoolDataWorkspaceRoleDiscoveredEvent event) {
    for (MuikkuPermissionCollection collection : permissionCollections) {
      List<String> permissions = collection.listPermissions();

      for (String permissionName : permissions) {
        Permission permission = permissionDAO.findByName(permissionName);
        
        if (permission != null) {
          try {
            String permissionScope = collection.getPermissionScope(permissionName);

            RoleEntity role = workspaceRoleEntityDAO.findById(event.getDiscoveredWorkspaceRoleEntityId());

            WorkspaceRoleArchetype[] archetypes = collection.getDefaultWorkspaceRoles(permissionName);

            if (archetypes != null) {
              // Check if event role archetype exists
              
              for (WorkspaceRoleArchetype archetype : archetypes) {
                if (archetype.equals(translateArchetype(event.getArchetype()))) {
                  applyPermission(permissionScope, role, permission);
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
  
  public void onWorkspaceDiscoveredEvent(@Observes (during = TransactionPhase.BEFORE_COMPLETION) SchoolDataWorkspaceDiscoveredEvent event) {
    WorkspaceSettingsTemplate workspaceSettingsTemplate = workspaceSettingsTemplateDAO.findById(1l);
    List<WorkspaceSettingsTemplateRolePermission> roleTemplate = workspaceSettingsTemplateRolePermissionDAO.listByTemplate(workspaceSettingsTemplate);

    WorkspaceEntity workspace = workspaceEntityDAO.findById(event.getDiscoveredWorkspaceEntityId());

    for (WorkspaceSettingsTemplateRolePermission rp : roleTemplate) {
      workspaceRolePermissionDAO.create(workspace, rp.getRole(), rp.getPermission());
    }
  }
  
  private EnvironmentRoleArchetype translateArchetype(fi.muikku.schooldata.entity.EnvironmentRoleArchetype archetype) {
    switch (archetype) {
      case ADMINISTRATOR:
        return EnvironmentRoleArchetype.ADMINISTRATOR;
      case MANAGER:
        return EnvironmentRoleArchetype.MANAGER;
      case TEACHER:
        return EnvironmentRoleArchetype.TEACHER;
      case STUDENT:
        return EnvironmentRoleArchetype.STUDENT;
      default:
        return EnvironmentRoleArchetype.CUSTOM;
    }
  }
  
  private WorkspaceRoleArchetype translateArchetype(fi.muikku.schooldata.entity.WorkspaceRoleArchetype archetype) {
    switch (archetype) {
      case TEACHER:
        return WorkspaceRoleArchetype.TEACHER;
      case STUDENT:
        return WorkspaceRoleArchetype.STUDENT;
      default:
        return WorkspaceRoleArchetype.CUSTOM;
    }
  }
  
  private void applyPermission(String permissionScope, RoleEntity role, Permission permission) {
    switch (permissionScope) {
      case PermissionScope.ENVIRONMENT:
        environmentRolePermissionDAO.create(role, permission);
      break;
      
      case PermissionScope.WORKSPACE:
        List<WorkspaceEntity> workspaces = workspaceEntityDAO.listAll();
        WorkspaceSettingsTemplate workspaceSettingsTemplate = workspaceSettingsTemplateDAO.findById(1l); 
        
        workspaceSettingsTemplateRolePermissionDAO.create(workspaceSettingsTemplate, role, permission);

        // TODO Workspace creation & templates - is this necessary and bulletproof?
        for (WorkspaceEntity workspace: workspaces) {
          workspaceRolePermissionDAO.create(workspace, role, permission);
        }
      break;
      
      case PermissionScope.USERGROUP:
        /*
        List<UserGroup> userGroups = userGroupDAO.listAll();
        
        // TODO Workspace creation & templates - is this necessary and bulletproof?
        for (UserGroup userGroup: userGroups) {
          userGroupRolePermissionDAO.create(userGroup, role, permission);
        }
        */
      break;
    }
  }
}
