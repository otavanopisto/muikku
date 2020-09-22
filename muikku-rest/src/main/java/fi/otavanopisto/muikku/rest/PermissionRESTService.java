package fi.otavanopisto.muikku.rest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.dao.security.PermissionDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.WorkspaceGroupPermission;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.rest.model.PermissionRestModel;
import fi.otavanopisto.muikku.rest.model.WorkspaceSettingsUserGroup;
import fi.otavanopisto.muikku.rest.model.WorkspaceUserGroupPermission;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserGroupController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Stateful
@RequestScoped
@Path("/permission")
@Produces ("application/json")
public class PermissionRESTService extends AbstractRESTService {

  @Inject
  private Logger logger;
  
  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private UserGroupController userGroupController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private PermissionController permissionController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private SessionController sessionController;

  @GET
  @Path ("/workspaceSettings/{WORKSPACEENTITYID}/permissions")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceSettingsPermissions(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (!sessionController.hasPermission(MuikkuPermissions.WORKSPACE_MANAGEWORKSPACESETTINGS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    List<Permission> permissions = listWorkspaceSettingsPermissions();
    List<PermissionRestModel> permissionRestModels = new ArrayList<>();
    for (Permission permission : permissions) {
      permissionRestModels.add(new PermissionRestModel(permission.getId(), permission.getName(), permission.getScope()));
    }
    return Response.ok(permissionRestModels).build();
  }

  @GET
  @Path ("/workspaceSettings/{WORKSPACEENTITYID}/userGroups")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceSettingsUserGroups(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (!sessionController.hasPermission(MuikkuPermissions.WORKSPACE_MANAGEWORKSPACESETTINGS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    List<UserGroupEntity> userGroupEntities;
    
    String permissionGroupIds = pluginSettingsController.getPluginSetting("workspace", "permission-group-ids");
    if (permissionGroupIds == null) {
      userGroupEntities = userGroupEntityController.listUserGroupEntities();
    }
    else {
      userGroupEntities = new ArrayList<UserGroupEntity>();
      String[] idArray = permissionGroupIds.split(",");
      for (int i = 0; i < idArray.length; i++) {
        Long groupId = NumberUtils.createLong(idArray[i]);

        if (groupId != null) {
          UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(groupId);
          if (userGroupEntity == null) {
            logger.warning(String.format("Missing group %d in plugin setting workspace.permission-group-ids", groupId));
          }
          else {
            userGroupEntities.add(userGroupEntity);
          }
        }
        else {
          logger.warning(String.format("Malformatted plugin setting workspace.permission-group-ids %s", permissionGroupIds));
        }
      }
    }

    List<Permission> permissions = listWorkspaceSettingsPermissions();
    List<WorkspaceSettingsUserGroup> userGroupRestModels = new ArrayList<>();
    
    for (UserGroupEntity userGroupEntity : userGroupEntities) {
      UserGroup userGroup = userGroupController.findUserGroup(userGroupEntity);

      if (userGroup != null) {
        WorkspaceSettingsUserGroup workspaceSettingsUserGroup = new WorkspaceSettingsUserGroup(workspaceEntityId, userGroupEntity.getId(), userGroup.getName());
        
        for (Permission permission : permissions) {
          WorkspaceGroupPermission workspaceGroupPermission = permissionController.findWorkspaceGroupPermission(workspaceEntity, userGroupEntity, permission);
          if (workspaceGroupPermission != null) {
            workspaceSettingsUserGroup.addPermission(permission.getName());
          }
        }
        
        userGroupRestModels.add(workspaceSettingsUserGroup);
      }
    }
    
    userGroupRestModels.sort(Comparator.comparing(WorkspaceSettingsUserGroup::getUserGroupName));
    
    return Response.ok(userGroupRestModels).build();
  }

  @PUT
  @Path ("/workspaceSettings/{WORKSPACEENTITYID}/userGroups/{USERGROUPID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response setWorkspaceSettingsUserGroup(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId,
      @PathParam("USERGROUPID") Long userGroupEntityId, WorkspaceSettingsUserGroup payload) {
    if (!Objects.equals(workspaceEntityId, payload.getWorkspaceEntityId()) || !Objects.equals(userGroupEntityId, payload.getUserGroupEntityId())) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(userGroupEntityId);
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);

    if ((userGroupEntity == null) || (workspaceEntity == null)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    if (!sessionController.hasPermission(MuikkuPermissions.WORKSPACE_MANAGEWORKSPACESETTINGS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    try {
      List<Permission> permissions = listWorkspaceSettingsPermissions();
      
      for (Permission permission : permissions) {
        boolean permitted = payload.getPermissions().contains(permission.getName());
        WorkspaceGroupPermission workspaceGroupPermission = permissionController.findWorkspaceGroupPermission(workspaceEntity, userGroupEntity, permission);

        if (permitted) {
          if (workspaceGroupPermission == null) {
            workspaceController.addWorkspaceSignupGroup(workspaceEntity, userGroupEntity);
            permissionController.addWorkspaceGroupPermission(workspaceEntity, userGroupEntity, permission);
          }
        } else {
          if (workspaceGroupPermission != null) {
            workspaceController.removeWorkspaceSignupGroup(workspaceEntity, userGroupEntity);
            permissionController.removeWorkspaceGroupPermission(workspaceGroupPermission);
          } else {
            return Response.status(Response.Status.NOT_FOUND).build();
          }
        }
      }

      return Response.noContent().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }

  @PUT
  @Path ("/workspaceUserGroupPermissions")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  @Deprecated
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

  private List<Permission> listWorkspaceSettingsPermissions() {
    // TODO: no permissions are supported by the permission rest service at this time 
    return Collections.emptyList();
  }
  
}
