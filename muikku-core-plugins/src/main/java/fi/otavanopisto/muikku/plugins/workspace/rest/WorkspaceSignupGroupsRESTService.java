package fi.otavanopisto.muikku.plugins.workspace.rest;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.rest.model.WorkspaceSignupUserGroup;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
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
@Path("/workspace")
@Produces ("application/json")
public class WorkspaceSignupGroupsRESTService extends PluginRESTService {

  private static final long serialVersionUID = -7157979598203757010L;

  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private UserGroupController userGroupController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private SessionController sessionController;

  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/signupGroups")
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

    Set<SchoolDataIdentifier> workspaceSignupGroups = workspaceController.listWorkspaceSignupGroups(workspaceEntity);
    List<WorkspaceSignupUserGroup> userGroupRestModels = new ArrayList<>();
    
    for (UserGroupEntity userGroupEntity : userGroupEntities) {
      UserGroup userGroup = userGroupController.findUserGroup(userGroupEntity);

      if (userGroup != null) {
        boolean canSignup = workspaceSignupGroups.contains(userGroupEntity.schoolDataIdentifier());
        userGroupRestModels.add(new WorkspaceSignupUserGroup(workspaceEntityId, userGroupEntity.getId(), userGroup.getName(), canSignup));
      }
    }
    
    userGroupRestModels.sort(Comparator.comparing(WorkspaceSignupUserGroup::getUserGroupName));
    
    return Response.ok(userGroupRestModels).build();
  }

  @PUT
  @Path ("/workspaces/{WORKSPACEENTITYID}/signupGroups/{USERGROUPID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response setWorkspaceSettingsUserGroup(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId,
      @PathParam("USERGROUPID") Long userGroupEntityId, WorkspaceSignupUserGroup payload) {
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

    Set<SchoolDataIdentifier> workspaceSignupGroups = workspaceController.listWorkspaceSignupGroups(workspaceEntity);
    
    boolean permitted = Boolean.TRUE.equals(payload.getCanSignup());
    
    if (permitted) {
      if (!workspaceSignupGroups.contains(userGroupEntity.schoolDataIdentifier())) {
        workspaceController.addWorkspaceSignupGroup(workspaceEntity, userGroupEntity);
      } else {
        return Response.status(Response.Status.BAD_REQUEST).entity("Signup Group already exists").build();
      }
    } else {
      if (workspaceSignupGroups.contains(userGroupEntity.schoolDataIdentifier())) {
        workspaceController.removeWorkspaceSignupGroup(workspaceEntity, userGroupEntity);
      } else {
        return Response.status(Response.Status.NOT_FOUND).build();
      }
    }

    return Response.noContent().build();
  }

  
}
