package fi.otavanopisto.muikku.plugins.settings;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.SystemRoleEntity;
import fi.otavanopisto.muikku.plugins.data.PermissionsPluginController;
import fi.otavanopisto.muikku.schooldata.RoleController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.security.PermissionScope;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/permissions", to = "/jsf/system/permissions.jsf")
@LoggedIn
public class EnvironmentPermissionsManagementBackingBean {

  @Inject
  private PermissionController permissionController;
  
  @Inject
  private PermissionsPluginController permissionsPluginController;

  @Inject
  private RoleController roleController;

  @Inject
  private SessionController sessionController;
  
  @RequestAction
  public String init() {
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.MANAGE_PERMISSIONS)) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    permissions = permissionController.listPermissionsByScope(PermissionScope.ENVIRONMENT);
    
    Collections.sort(permissions, new Comparator<Permission>() {
      @Override
      public int compare(Permission o1, Permission o2) {
        return o1.getName().compareTo(o2.getName());
      }
    });
    
    roleEntities = new ArrayList<RoleEntity>();
    
    List<SystemRoleEntity> systemRoleEntities = roleController.listSystemRoleEntities();
    List<EnvironmentRoleEntity> environmentRoleEntities = roleController.listEnvironmentRoleEntities();
    
    Collections.sort(environmentRoleEntities, new Comparator<EnvironmentRoleEntity>() {
      @Override
      public int compare(EnvironmentRoleEntity o1, EnvironmentRoleEntity o2) {
        return o1.getArchetype().compareTo(o2.getArchetype());
      }
    });

    for (SystemRoleEntity systemRoleEntity : systemRoleEntities) {
      roleEntities.add(systemRoleEntity);
    }
    
    for (EnvironmentRoleEntity environmentRoleEntity : environmentRoleEntities) {
      roleEntities.add(environmentRoleEntity);
    }
    
    return null;
  }
  
  public void resetPermissions() {
    permissionsPluginController.resetPermissions();
  }

  public List<Permission> getPermissions() {
    return permissions;
  }
  
  public List<RoleEntity> getRoleEntities() {
    return roleEntities;
  }
  
  public boolean hasRolePermission(RoleEntity role, Permission permission) {
    return permissionController.hasPermission(role, permission);
  }
  
  private List<RoleEntity> roleEntities;
  private List<Permission> permissions;
}