package fi.otavanopisto.muikku.security;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.enterprise.event.TransactionPhase;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.security.PermissionDAO;
import fi.otavanopisto.muikku.dao.security.RolePermissionDAO;
import fi.otavanopisto.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceRoleEntityDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.RolePermission;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataEnvironmentRoleDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceRoleDiscoveredEvent;

public class UserRolePermissionObserver {
  
  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private RolePermissionDAO rolePermissionDAO;

  @Inject
  private EnvironmentRoleEntityDAO environmentRoleEntityDAO; 
  
  @Inject
  private WorkspaceRoleEntityDAO workspaceRoleEntityDAO; 
  
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
      case PermissionScope.WORKSPACE:
        RolePermission rolePermission = rolePermissionDAO.findByUserRoleAndPermission(role, permission);
        if (rolePermission == null) {
          rolePermissionDAO.create(role, permission);
        }
      break;
    }
  }
}
