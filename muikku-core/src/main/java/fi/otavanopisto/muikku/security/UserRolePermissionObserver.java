package fi.otavanopisto.muikku.security;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.enterprise.event.TransactionPhase;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.security.EnvironmentRolePermissionDAO;
import fi.otavanopisto.muikku.dao.security.PermissionDAO;
import fi.otavanopisto.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.otavanopisto.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceRoleEntityDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceSettingsTemplateDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceSettingsTemplateRolePermissionDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.WorkspaceRolePermission;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceSettingsTemplate;
import fi.otavanopisto.muikku.model.workspace.WorkspaceSettingsTemplateRolePermission;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataEnvironmentRoleDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceRoleDiscoveredEvent;

public class UserRolePermissionObserver {
  
  @Inject
  private Logger logger;

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
    if (event.getDiscoveredWorkspaceEntityId() != null) {
      WorkspaceEntity workspace = workspaceEntityDAO.findById(event.getDiscoveredWorkspaceEntityId());
  
      for (WorkspaceSettingsTemplateRolePermission rp : roleTemplate) {
        WorkspaceRolePermission workspaceRolePermission = workspaceRolePermissionDAO.findByRoleAndPermission(workspace, rp.getRole(), rp.getPermission());
        if (workspaceRolePermission != null) {
          logger.severe(String.format("WorkspaceRolePermission#%d already exists", workspaceRolePermission.getId()));
        } else {      
          workspaceRolePermissionDAO.create(workspace, rp.getRole(), rp.getPermission());
        }
      }
    } else {
      logger.log(Level.SEVERE, "Could not create workspace role permissions because workspaceEntityiId was not defined");
    }
  }
  
  private EnvironmentRoleArchetype translateArchetype(fi.otavanopisto.muikku.schooldata.entity.EnvironmentRoleArchetype archetype) {
    switch (archetype) {
      case ADMINISTRATOR:
        return EnvironmentRoleArchetype.ADMINISTRATOR;
      case MANAGER:
        return EnvironmentRoleArchetype.MANAGER;
      case TEACHER:
        return EnvironmentRoleArchetype.TEACHER;
      case STUDENT:
        return EnvironmentRoleArchetype.STUDENT;
      case STUDY_PROGRAMME_LEADER:
        return EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER;
      default:
        return EnvironmentRoleArchetype.CUSTOM;
    }
  }
  
  private WorkspaceRoleArchetype translateArchetype(fi.otavanopisto.muikku.schooldata.entity.WorkspaceRoleArchetype archetype) {
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
