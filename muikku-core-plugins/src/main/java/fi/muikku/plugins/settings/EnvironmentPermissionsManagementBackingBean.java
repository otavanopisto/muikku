package fi.muikku.plugins.settings;

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

import fi.muikku.controller.PermissionController;
import fi.muikku.model.security.Permission;
import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.SystemRoleEntity;
import fi.muikku.schooldata.RoleController;
import fi.muikku.security.PermissionScope;
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
  private RoleController roleController;

  @RequestAction
  public String init() {
    permissions = permissionController.listPermissionsByScope(PermissionScope.ENVIRONMENT);
    
    Collections.sort(permissions, new Comparator<Permission>() {
      @Override
      public int compare(Permission o1, Permission o2) {
        return o1.getName().compareTo(o2.getName());
      }
    });
    
    roles = new ArrayList<RoleEntity>();
    
    List<SystemRoleEntity> systemRoles = roleController.listSystemRoleEntities();
    List<EnvironmentRoleEntity> envRoles = roleController.listEnvironmentRoleEntities();
    
    Collections.sort(envRoles, new Comparator<EnvironmentRoleEntity>() {
      @Override
      public int compare(EnvironmentRoleEntity o1, EnvironmentRoleEntity o2) {
        return o1.getArchetype().compareTo(o2.getArchetype());
      }
    });

    for (SystemRoleEntity sre : systemRoles)
      roles.add(sre);
    for (EnvironmentRoleEntity ere : envRoles)
      roles.add(ere);
    
    return null;
  }

  public List<Permission> getPermissions() {
    return permissions;
  }
  
  public List<? extends RoleEntity> getRoles() {
    return roles;
  }
  
  public boolean hasRolePermission(RoleEntity role, Permission permission) {
    return permissionController.hasEnvironmentPermission(role, permission);
  }
  
  private List<RoleEntity> roles;
  private List<Permission> permissions;
}