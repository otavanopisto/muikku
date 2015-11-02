package fi.muikku.controller;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.inject.Model;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;

import fi.muikku.dao.security.EnvironmentRolePermissionDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.muikku.dao.users.RoleEntityDAO;
import fi.muikku.model.security.EnvironmentRolePermission;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.WorkspaceRolePermission;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.security.PermissionScope;
import fi.otavanopisto.security.Permit;
import fi.otavanopisto.security.PermitContext;

@Stateful
@Model
@Named ("environmentSettings")
public class EnvironmentSettingsController {

  @Inject
  private RoleEntityDAO userEntityDAO;

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private EnvironmentRoleEntityDAO environmentRoleDAO;
  
  @Inject
  private EnvironmentRolePermissionDAO environmentUserRolePermissionDAO;

  @Inject
  private WorkspaceRolePermissionDAO courseUserRolePermissionDAO;
  
  @Inject
  private SystemSettingsController systemSettingsController;
  
  public String getBaseUrl() {
    HttpServletRequest request = (HttpServletRequest) FacesContext.getCurrentInstance().getExternalContext().getRequest();

    if ((request.getServerPort() != 80) && (request.getServerPort() != 443))
      return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    else
      return request.getScheme() + "://" + request.getServerName() + request.getContextPath();
  }
  
  public String getSystemEmailSenderAddress() {
    return systemSettingsController.getSystemEmailSenderAddress();
  }
  
  public List<RoleEntity> listEnvironmentUserRoles() {
    List<RoleEntity> roles = new ArrayList<RoleEntity>();
    
    roles.addAll(environmentRoleDAO.listAll());
    
    return roles;
  }
  
  public List<Permission> listEnvironmentPermissions() {
    return permissionDAO.listByScope(PermissionScope.ENVIRONMENT);
  }

  public List<RoleEntity> listWorkspaceUserRoles() {
    List<RoleEntity> userRoles = userEntityDAO.listAll();
    
    return userRoles;
  }

  public List<Permission> listWorkspacePermissions() {
    return permissionDAO.listByScope(PermissionScope.WORKSPACE);
  }
  
  public boolean hasEnvironmentRolePermission(RoleEntity role, Permission permission) {
    return environmentUserRolePermissionDAO.hasEnvironmentPermissionAccess(role, permission);
  }

  public boolean hasWorkspaceRolePermission(@PermitContext WorkspaceEntity course, RoleEntity role, Permission permission) {
    return courseUserRolePermissionDAO.hasWorkspacePermissionAccess(course, role, permission);
  }
  
  @Permit(MuikkuPermissions.MANAGE_SETTINGS)
  public EnvironmentRolePermission addEnvironmentUserRolePermission(RoleEntity role, Permission permission) {
    return environmentUserRolePermissionDAO.create(role, permission);
  }
  
  @Permit(MuikkuPermissions.MANAGE_SETTINGS)
  public void deleteEnvironmentUserRolePermission(@PermitContext EnvironmentRolePermission rolePermission) {
    environmentUserRolePermissionDAO.delete(rolePermission);
  }
  
  @Permit(MuikkuPermissions.WORKSPACE_MANAGEWORKSPACESETTINGS)
  public WorkspaceRolePermission addWorkspaceUserRolePermission(@PermitContext WorkspaceEntity course, RoleEntity role, Permission permission) {
    return courseUserRolePermissionDAO.create(course, role, permission);
  }
  
  @Permit(MuikkuPermissions.WORKSPACE_MANAGEWORKSPACESETTINGS)
  public void deleteWorkspaceUserRolePermission(@PermitContext WorkspaceRolePermission rolePermission) {
    courseUserRolePermissionDAO.delete(rolePermission);
  }
  
}
