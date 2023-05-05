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
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.RolePermission;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataEnvironmentRoleDiscoveredEvent;

public class UserRolePermissionObserver {
  
  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private RolePermissionDAO rolePermissionDAO;

  @Inject
  private EnvironmentRoleEntityDAO environmentRoleEntityDAO; 
  
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
                if (archetype.equals(event.getArchetype())) {
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
