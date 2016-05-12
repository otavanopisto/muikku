package fi.otavanopisto.muikku.rest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.dao.security.PermissionDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.WorkspaceGroupPermission;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.rest.model.WorkspaceUserGroupPermission;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Stateful
@RequestScoped
@Path("/permission")
@Produces ("application/json")
public class PermissionRESTService extends AbstractRESTService {

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private PermissionController permissionController;
  
  @Inject
  private SessionController sessionController;
  
  @PUT
  @Path ("/workspaceUserGroupPermissions")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response setWorkspaceUserGroupPermission(WorkspaceUserGroupPermission payload) {
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(payload.getUserGroupId());
    Permission permission = permissionDAO.findById(payload.getPermissionId());
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(payload.getWorkspaceId());

    if (!sessionController.hasPermission(MuikkuPermissions.WORKSPACE_MANAGEWORKSPACESETTINGS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if ((userGroupEntity == null) || (permission == null)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    try {
      if (payload.getPermitted())
        permissionController.addWorkspaceGroupPermission(workspaceEntity, userGroupEntity, permission);
      else {
        WorkspaceGroupPermission workspaceGroupPermission = permissionController.findWorkspaceGroupPermission(workspaceEntity, userGroupEntity, permission);
        
        if (workspaceGroupPermission != null)
          permissionController.removeWorkspaceGroupPermission(workspaceGroupPermission);
        else
          return Response.status(Response.Status.NOT_FOUND).build();
      }

      return Response.noContent().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }
  
}
