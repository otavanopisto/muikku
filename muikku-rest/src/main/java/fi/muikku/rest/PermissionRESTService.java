package fi.muikku.rest;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import fi.muikku.controller.EnvironmentSettingsController;
import fi.muikku.controller.ResourceRightsController;
import fi.muikku.dao.security.CourseRolePermissionDAO;
import fi.muikku.dao.security.EnvironmentRolePermissionDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.ResourceRolePermissionDAO;
import fi.muikku.dao.users.RoleEntityDAO;
import fi.muikku.model.security.EnvironmentRolePermission;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.security.ResourceRolePermission;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.rest.security.AuthorizedResource;
import fi.muikku.security.Admin;
import fi.muikku.security.AuthorizationException;
import fi.muikku.session.SessionController;

@AuthorizedResource
@Path("/permission")
@Stateless
@Produces ("application/json")
public class PermissionRESTService extends AbstractRESTService {

  
  @Inject
  private EnvironmentRolePermissionDAO environmentUserRolePermissionDAO;

  @Inject
  private CourseRolePermissionDAO courseUserRolePermissionDAO;
  
  @Inject 
  private RoleEntityDAO userRoleDAO;

//  @Inject 
//  private CourseEntityDAO courseDAO;

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private ResourceRolePermissionDAO resourceUserRolePermissionDAO;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private ResourceRightsController resourceRightsController;
  
  @Inject
  private EnvironmentSettingsController environmentSettingsController;
  
  @POST
  @Path ("/addEnvironmentUserRolePermission")
  public Response addEnvironmentUserRolePermission(
      @FormParam ("environmentId") Long environmentId,
      @FormParam ("userRoleId") Long userRoleId,
      @FormParam ("permissionId") Long permissionId
   ) throws AuthorizationException {
    
    // TODO: Security

    RoleEntity userRole = userRoleDAO.findById(userRoleId);
    Permission permission = permissionDAO.findById(permissionId);

    if ((userRole == null) || (permission == null)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    try {
      environmentSettingsController.addEnvironmentUserRolePermission(userRole, permission);
      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }

  @POST
  @Path ("/deleteEnvironmentUserRolePermission")
  @Admin
//  @Permit (Permissions.MANAGE_SYSTEM_SETTINGS)
  public Response deleteEnvironmentUserRolePermission(
      @FormParam ("environmentId") Long environmentId,
      @FormParam ("userRoleId") Long userRoleId,
      @FormParam ("permissionId") Long permissionId
   ) {
    
    // TODO: Security

    RoleEntity userRole = userRoleDAO.findById(userRoleId);
    Permission permission = permissionDAO.findById(permissionId);

    if ((userRole == null) || (permission == null)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    try {
      EnvironmentRolePermission rolePermission = environmentUserRolePermissionDAO.findByUserRoleAndPermission(
          userRole, permission);

      environmentSettingsController.deleteEnvironmentUserRolePermission(rolePermission);
      
      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }

//  @POST
//  @Path ("/addCourseUserRolePermission")
//  @Admin
////  @Permit (Permissions.MANAGE_SYSTEM_SETTINGS)
//  public Response addCourseUserRolePermission(
//      @FormParam ("courseId") Long courseId,
//      @FormParam ("userRoleId") Long userRoleId,
//      @FormParam ("permissionId") Long permissionId
//   ) {
//    
//    // TODO: Security
//
//    UserRole userRole = userRoleDAO.findById(userRoleId);
//    Permission permission = permissionDAO.findById(permissionId);
//    WorkspaceEntity course = courseDAO.findById(courseId);
//
//    if ((userRole == null) || (permission == null)) {
//      return Response.status(Response.Status.NOT_FOUND).build();
//    }
//    
//    try {
//      environmentSettingsController.addCourseUserRolePermission(course, userRole, permission);
//
//      return Response.ok().build();
//    } catch (ConstraintViolationException violationException) {
//      return getConstraintViolations(violationException);
//    }
//  }

//  @POST
//  @Path ("/deleteCourseUserRolePermission")
//  @Admin
////  @Permit (Permissions.MANAGE_SYSTEM_SETTINGS)
//  public Response deleteCourseUserRolePermission(
//      @FormParam ("courseId") Long courseId,
//      @FormParam ("userRoleId") Long userRoleId,
//      @FormParam ("permissionId") Long permissionId
//   ) {
//    
//    // TODO: Security
//
//    UserRole userRole = userRoleDAO.findById(userRoleId);
//    Permission permission = permissionDAO.findById(permissionId);
//    WorkspaceEntity course = courseDAO.findById(courseId);
//
//    if ((userRole == null) || (permission == null)) {
//      return Response.status(Response.Status.NOT_FOUND).build();
//    }
//    
//    try {
//      CourseUserRolePermission rolePermission = courseUserRolePermissionDAO.findByUserRoleAndPermission(
//          course, userRole, permission);
//      
//      environmentSettingsController.deleteCourseUserRolePermission(rolePermission);
//      
//      return Response.ok().build();
//    } catch (ConstraintViolationException violationException) {
//      return getConstraintViolations(violationException);
//    }
//  }
  
  @POST
  @Path ("/addResourceUserRolePermission")
  @Admin
//  @Permit (Permissions.MANAGE_SYSTEM_SETTINGS)
  public Response addResourceUserRolePermission(
      @FormParam ("resourceRightsId") Long resourceRightsId,
      @FormParam ("userRoleId") Long userRoleId,
      @FormParam ("permissionId") Long permissionId
   ) {
    
    // TODO: Security

    RoleEntity userRole = userRoleDAO.findById(userRoleId);
    Permission permission = permissionDAO.findById(permissionId);
    ResourceRights resourceRights = resourceRightsController.findResourceRightsById(resourceRightsId);

    if ((userRole == null) || (permission == null)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    try {
      resourceRightsController.addResourceUserRolePermission(resourceRights, userRole, permission);
      
      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }

  @POST
  @Path ("/deleteResourceUserRolePermission")
  @Admin
//  @Permit (Permissions.MANAGE_SYSTEM_SETTINGS)
  public Response deleteResourceUserRolePermission(
      @FormParam ("resourceRightsId") Long resourceRightsId,
      @FormParam ("userRoleId") Long userRoleId,
      @FormParam ("permissionId") Long permissionId
   ) {
    
    // TODO: Security

    RoleEntity userRole = userRoleDAO.findById(userRoleId);
    Permission permission = permissionDAO.findById(permissionId);
    ResourceRights resourceRights = resourceRightsController.findResourceRightsById(resourceRightsId);

    if ((userRole == null) || (permission == null)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    try {
      ResourceRolePermission rolePermission = resourceUserRolePermissionDAO.findByUserRoleAndPermission(
          resourceRights, userRole, permission);
      
      resourceRightsController.deleteResourceUserRolePermission(rolePermission);
      
      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }
  
}
