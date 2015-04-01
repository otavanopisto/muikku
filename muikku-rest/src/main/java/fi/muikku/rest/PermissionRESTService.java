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
import fi.muikku.dao.security.EnvironmentRolePermissionDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.ResourceRolePermissionDAO;
import fi.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.muikku.dao.users.RoleEntityDAO;
import fi.muikku.model.security.EnvironmentRolePermission;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.security.ResourceRolePermission;
import fi.muikku.model.security.WorkspaceRolePermission;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.security.Admin;
import fi.otavanopisto.security.AuthorizationException;
import fi.otavanopisto.security.rest.AuthorizedResource;

@AuthorizedResource
@Path("/permission")
@Stateless
@Produces ("application/json")
public class PermissionRESTService extends AbstractRESTService {

  @Inject
  private EnvironmentRolePermissionDAO environmentUserRolePermissionDAO;

  @Inject
  private WorkspaceRolePermissionDAO workspaceUserRolePermissionDAO;
  
  @Inject 
  private RoleEntityDAO userRoleDAO;

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private ResourceRolePermissionDAO resourceUserRolePermissionDAO;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private ResourceRightsController resourceRightsController;
  
  @Inject
  private EnvironmentSettingsController environmentSettingsController;
  
  @POST
  @Path ("/addEnvironmentUserRolePermission")
  public Response addEnvironmentUserRolePermission(
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

  @POST
  @Path ("/addCourseUserRolePermission")
  @Admin
//  @Permit (Permissions.MANAGE_SYSTEM_SETTINGS)
  public Response addWorkspaceUserRolePermission(
      @FormParam ("workspaceId") Long workspaceId,
      @FormParam ("userRoleId") Long userRoleId,
      @FormParam ("permissionId") Long permissionId
   ) {
    
    // TODO: Security

    RoleEntity userRole = userRoleDAO.findById(userRoleId);
    Permission permission = permissionDAO.findById(permissionId);
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceId);

    if ((userRole == null) || (permission == null)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    try {
      environmentSettingsController.addWorkspaceUserRolePermission(workspaceEntity, userRole, permission);

      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }

  @POST
  @Path ("/deleteCourseUserRolePermission")
  @Admin
//  @Permit (Permissions.MANAGE_SYSTEM_SETTINGS)
  public Response deleteWorkspaceUserRolePermission(
      @FormParam ("workspaceId") Long workspaceId,
      @FormParam ("userRoleId") Long userRoleId,
      @FormParam ("permissionId") Long permissionId
   ) {
    
    // TODO: Security

    RoleEntity userRole = userRoleDAO.findById(userRoleId);
    Permission permission = permissionDAO.findById(permissionId);
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceId);

    if ((userRole == null) || (permission == null)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    try {
      WorkspaceRolePermission rolePermission = workspaceUserRolePermissionDAO.findByRoleAndPermission(
          workspaceEntity, userRole, permission);
      
      environmentSettingsController.deleteWorkspaceUserRolePermission(rolePermission);
      
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
