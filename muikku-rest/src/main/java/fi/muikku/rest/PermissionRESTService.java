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
import fi.muikku.dao.courses.CourseEntityDAO;
import fi.muikku.dao.security.CourseUserRolePermissionDAO;
import fi.muikku.dao.security.EnvironmentUserRolePermissionDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.ResourceUserRolePermissionDAO;
import fi.muikku.dao.users.UserRoleDAO;
import fi.muikku.model.security.CourseUserRolePermission;
import fi.muikku.model.security.EnvironmentUserRolePermission;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.security.ResourceUserRolePermission;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.users.UserRole;
import fi.muikku.security.Admin;
import fi.muikku.session.SessionController;

@Path("/permission")
@Stateless
@Produces ("application/json")
public class PermissionRESTService extends AbstractRESTService {

  
  @Inject
  private EnvironmentUserRolePermissionDAO environmentUserRolePermissionDAO;

  @Inject
  private CourseUserRolePermissionDAO courseUserRolePermissionDAO;
  
  @Inject 
  private UserRoleDAO userRoleDAO;

  @Inject 
  private CourseEntityDAO courseDAO;

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private ResourceUserRolePermissionDAO resourceUserRolePermissionDAO;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private ResourceRightsController resourceRightsController;
  
  @Inject
  private EnvironmentSettingsController environmentSettingsController;
  
  @POST
  @Path ("/addEnvironmentUserRolePermission")
  @Admin
//  @Permit (Permissions.MANAGE_SYSTEM_SETTINGS)
  public Response addEnvironmentUserRolePermission(
      @FormParam ("environmentId") Long environmentId,
      @FormParam ("userRoleId") Long userRoleId,
      @FormParam ("permissionId") Long permissionId
   ) {
    
    // TODO: Security

    UserRole userRole = userRoleDAO.findById(userRoleId);
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

    UserRole userRole = userRoleDAO.findById(userRoleId);
    Permission permission = permissionDAO.findById(permissionId);

    if ((userRole == null) || (permission == null)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    try {
      EnvironmentUserRolePermission rolePermission = environmentUserRolePermissionDAO.findByUserRoleAndPermission(
          userRole, permission);

      environmentSettingsController.deleteEnvironmentUserRolePermission(rolePermission);
      
      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }

  @POST
  @Path ("/addCourseUserRolePermission")
  @Admin
//  @Permit (Permissions.MANAGE_SYSTEM_SETTINGS)
  public Response addCourseUserRolePermission(
      @FormParam ("courseId") Long courseId,
      @FormParam ("userRoleId") Long userRoleId,
      @FormParam ("permissionId") Long permissionId
   ) {
    
    // TODO: Security

    UserRole userRole = userRoleDAO.findById(userRoleId);
    Permission permission = permissionDAO.findById(permissionId);
    CourseEntity course = courseDAO.findById(courseId);

    if ((userRole == null) || (permission == null)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    try {
      environmentSettingsController.addCourseUserRolePermission(course, userRole, permission);

      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }

  @POST
  @Path ("/deleteCourseUserRolePermission")
  @Admin
//  @Permit (Permissions.MANAGE_SYSTEM_SETTINGS)
  public Response deleteCourseUserRolePermission(
      @FormParam ("courseId") Long courseId,
      @FormParam ("userRoleId") Long userRoleId,
      @FormParam ("permissionId") Long permissionId
   ) {
    
    // TODO: Security

    UserRole userRole = userRoleDAO.findById(userRoleId);
    Permission permission = permissionDAO.findById(permissionId);
    CourseEntity course = courseDAO.findById(courseId);

    if ((userRole == null) || (permission == null)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    try {
      CourseUserRolePermission rolePermission = courseUserRolePermissionDAO.findByUserRoleAndPermission(
          course, userRole, permission);
      
      environmentSettingsController.deleteCourseUserRolePermission(rolePermission);
      
      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }
  
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

    UserRole userRole = userRoleDAO.findById(userRoleId);
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

    UserRole userRole = userRoleDAO.findById(userRoleId);
    Permission permission = permissionDAO.findById(permissionId);
    ResourceRights resourceRights = resourceRightsController.findResourceRightsById(resourceRightsId);

    if ((userRole == null) || (permission == null)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    try {
      ResourceUserRolePermission rolePermission = resourceUserRolePermissionDAO.findByUserRoleAndPermission(
          resourceRights, userRole, permission);
      
      resourceRightsController.deleteResourceUserRolePermission(rolePermission);
      
      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }
  
}
