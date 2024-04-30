package fi.otavanopisto.muikku.plugins.workspace.rest;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

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

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceSignupMessage;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceSignupMessageRestModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceSignupUserGroup;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceSignupUserGroupListRestModel;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceSignupGroupController;
import fi.otavanopisto.muikku.schooldata.WorkspaceSignupMessageController;
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
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceSignupGroupController workspaceSignupGroupController;
  
  @Inject
  private WorkspaceSignupMessageController workspaceSignupMessageController;
  
  @Inject
  private UserGroupController userGroupController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
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
    
    List<UserGroupEntity> userGroupEntities = workspaceSignupGroupController.listAvailableWorkspaceSignupGroups();
    
    Set<SchoolDataIdentifier> workspaceSignupGroups = workspaceController.listWorkspaceSignupGroups(workspaceEntity);
    List<WorkspaceSignupUserGroup> userGroupRestModels = new ArrayList<>();
    
    for (UserGroupEntity userGroupEntity : userGroupEntities) {
      UserGroup userGroup = userGroupController.findUserGroup(userGroupEntity);

      if (userGroup != null) {
        boolean canSignup = workspaceSignupGroups.contains(userGroupEntity.schoolDataIdentifier());
        
        WorkspaceSignupMessage groupSignupMessage = workspaceSignupMessageController.findGroupSignupMessage(workspaceEntity, userGroupEntity);
        WorkspaceSignupMessageRestModel signupMessageRestModel = groupSignupMessage != null
            ? new WorkspaceSignupMessageRestModel(groupSignupMessage.isEnabled(), groupSignupMessage.getCaption(), groupSignupMessage.getContent()) : null;
        
        userGroupRestModels.add(new WorkspaceSignupUserGroup(workspaceEntityId, userGroupEntity.getId(), userGroup.getName(), canSignup, signupMessageRestModel));
      }
    }
    
    userGroupRestModels.sort(Comparator.comparing(WorkspaceSignupUserGroup::getUserGroupName));
    
    return Response.ok(userGroupRestModels).build();
  }

  @PUT
  @Path ("/workspaces/{WORKSPACEENTITYID}/signupGroups")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response setWorkspaceSettingsUserGroups(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId,
      WorkspaceSignupUserGroupListRestModel payload) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.hasPermission(MuikkuPermissions.WORKSPACE_MANAGEWORKSPACESETTINGS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Payload validation

    if (payload == null || payload.getWorkspaceSignupGroups() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing payload or groups list").build();
    }
    
    List<UserGroupEntity> userGroupEntities = workspaceSignupGroupController.listAvailableWorkspaceSignupGroups();
    Set<Long> availableUserGroupEntityIds = userGroupEntities.stream().map(UserGroupEntity::getId).collect(Collectors.toSet());

    for (WorkspaceSignupUserGroup signupGroup : payload.getWorkspaceSignupGroups()) {
      if (!Objects.equals(workspaceEntityId, signupGroup.getWorkspaceEntityId())) {
        return Response.status(Status.BAD_REQUEST).entity("Workspace id mismatch").build();
      }

      if (!availableUserGroupEntityIds.contains(signupGroup.getUserGroupEntityId())) {
        return Response.status(Status.BAD_REQUEST).entity("User group not available").build();
      }
      
      if (signupGroup.getSignupMessage() != null && StringUtils.isAnyBlank(signupGroup.getSignupMessage().getCaption(), signupGroup.getSignupMessage().getContent())) {
        return Response.status(Status.BAD_REQUEST).entity("Signup message missing mandatory fields.").build();
      }
    }

    // Save the settings
    
    Set<SchoolDataIdentifier> workspaceSignupGroups = workspaceController.listWorkspaceSignupGroups(workspaceEntity);

    for (WorkspaceSignupUserGroup signupGroup : payload.getWorkspaceSignupGroups()) {
      UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(signupGroup.getUserGroupEntityId());

      if (userGroupEntity == null) {
        return Response.status(Response.Status.NOT_FOUND).build();
      }

      boolean permitted = Boolean.TRUE.equals(signupGroup.getCanSignup());
      
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

      if (signupGroup.getSignupMessage() != null) {
        WorkspaceSignupMessage signupMessage = workspaceSignupMessageController.findGroupSignupMessage(workspaceEntity, userGroupEntity);
        if (signupMessage == null) {
          signupMessage = workspaceSignupMessageController.createWorkspaceSignupMessage(
              workspaceEntity, 
              userGroupEntity, 
              signupGroup.getSignupMessage().isEnabled(),
              signupGroup.getSignupMessage().getCaption(),
              signupGroup.getSignupMessage().getContent());
        } else {
          signupMessage = workspaceSignupMessageController.updateWorkspaceSignupMessage(
              signupMessage, 
              signupGroup.getSignupMessage().isEnabled(),
              signupGroup.getSignupMessage().getCaption(),
              signupGroup.getSignupMessage().getContent());
        }
      }
    }
    
    return Response.noContent().build();
  }

  @PUT
  @Path ("/workspaces/{WORKSPACEENTITYID}/signupGroups/{USERGROUPID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response setWorkspaceSettingsUserGroup(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId,
      @PathParam("USERGROUPID") Long userGroupEntityId, WorkspaceSignupUserGroup payload) {
    if (!Objects.equals(workspaceEntityId, payload.getWorkspaceEntityId()) || !Objects.equals(userGroupEntityId, payload.getUserGroupEntityId())) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (payload.getSignupMessage() != null && StringUtils.isAnyBlank(payload.getSignupMessage().getCaption(), payload.getSignupMessage().getContent())) {
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

    if (payload.getSignupMessage() != null) {
      WorkspaceSignupMessage signupMessage = workspaceSignupMessageController.findGroupSignupMessage(workspaceEntity, userGroupEntity);
      if (signupMessage == null) {
        signupMessage = workspaceSignupMessageController.createWorkspaceSignupMessage(
            workspaceEntity, 
            userGroupEntity, 
            payload.getSignupMessage().isEnabled(),
            payload.getSignupMessage().getCaption(),
            payload.getSignupMessage().getContent());
      } else {
        signupMessage = workspaceSignupMessageController.updateWorkspaceSignupMessage(
            signupMessage, 
            payload.getSignupMessage().isEnabled(),
            payload.getSignupMessage().getCaption(),
            payload.getSignupMessage().getContent());
      }
    }
    
    return Response.noContent().build();
  }

  
}
