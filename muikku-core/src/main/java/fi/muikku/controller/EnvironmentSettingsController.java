package fi.muikku.controller;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.inject.Model;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.security.CourseUserRolePermissionDAO;
import fi.muikku.dao.security.EnvironmentUserRolePermissionDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.users.EnvironmentUserRoleDAO;
import fi.muikku.dao.users.SystemUserRoleDAO;
import fi.muikku.dao.users.UserRoleDAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.security.CourseUserRolePermission;
import fi.muikku.model.security.EnvironmentUserRolePermission;
import fi.muikku.model.security.Permission;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.users.UserRole;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.Permit;
import fi.muikku.security.PermitContext;
import fi.muikku.session.SessionController;

@Stateful
@Model
@Named ("environmentSettings")
public class EnvironmentSettingsController {

  @Inject
  private SessionController sessionController;

  @Inject
  private UserRoleDAO userRoleDAO;

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private EnvironmentUserRoleDAO environmentUserRoleDAO;
  
  @Inject
  private SystemUserRoleDAO systemUserRoleDAO;
  
  @Inject
  private EnvironmentUserRolePermissionDAO environmentUserRolePermissionDAO;

  @Inject
  private CourseUserRolePermissionDAO courseUserRolePermissionDAO;
  
  public List<UserRole> listEnvironmentUserRoles() {
    List<UserRole> userRoles = new ArrayList<UserRole>();
    
    userRoles.addAll(environmentUserRoleDAO.listAll());
    userRoles.addAll(systemUserRoleDAO.listAll());
    
    return userRoles;
  }
  
  public List<Permission> listEnvironmentPermissions() {
    return permissionDAO.listByScope(PermissionScope.ENVIRONMENT);
  }

  public List<UserRole> listCourseUserRoles() {
    List<UserRole> userRoles = userRoleDAO.listAll();
    
    return userRoles;
  }

  public List<Permission> listCoursePermissions() {
    return permissionDAO.listByScope(PermissionScope.COURSE);
  }
  
  public boolean hasEnvironmentRolePermission(UserRole userRole, Permission permission) {
    return environmentUserRolePermissionDAO.hasEnvironmentPermissionAccess(sessionController.getEnvironment(), userRole, permission);
  }

  public boolean hasCourseRolePermission(@PermitContext CourseEntity course, UserRole userRole, Permission permission) {
    return courseUserRolePermissionDAO.hasCoursePermissionAccess(course, userRole, permission);
  }
  
  @Permit(MuikkuPermissions.MANAGE_SETTINGS)
  public EnvironmentUserRolePermission addEnvironmentUserRolePermission(@PermitContext Environment environment, UserRole userRole, Permission permission) {
    return environmentUserRolePermissionDAO.create(
        environment, userRole, permission);
  }
  
  @Permit(MuikkuPermissions.MANAGE_SETTINGS)
  public void deleteEnvironmentUserRolePermission(@PermitContext EnvironmentUserRolePermission rolePermission) {
    environmentUserRolePermissionDAO.delete(rolePermission);
  }
  
  @Permit(MuikkuPermissions.COURSE_MANAGECOURSESETTINGS)
  public CourseUserRolePermission addCourseUserRolePermission(@PermitContext CourseEntity course, UserRole userRole, Permission permission) {
    return courseUserRolePermissionDAO.create(
        course, userRole, permission);
  }
  
  @Permit(MuikkuPermissions.COURSE_MANAGECOURSESETTINGS)
  public void deleteCourseUserRolePermission(@PermitContext CourseUserRolePermission rolePermission) {
    courseUserRolePermissionDAO.delete(rolePermission);
  }
  
}
