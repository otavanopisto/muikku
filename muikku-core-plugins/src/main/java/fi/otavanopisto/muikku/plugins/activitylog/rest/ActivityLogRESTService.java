package fi.otavanopisto.muikku.plugins.activitylog.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLog;
import fi.otavanopisto.muikku.rest.ISO8601UTCTimestamp;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Path("/activitylogs")
@Produces("application/json")

public class ActivityLogRESTService extends PluginRESTService {
  
  private static final long serialVersionUID = 6892435956970819197L;
  
  @Inject
  private ActivityLogController activityLogController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @GET
  @Path("/user/{USERID}/workspace/")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserWorkspaceActivityLogs(@PathParam ("USERID") String userId,
      @QueryParam("workspaceEntityId") Long workspaceEntityId,
      @QueryParam("from") ISO8601UTCTimestamp fromISO,
      @QueryParam("to") ISO8601UTCTimestamp toISO) {
    
    if (fromISO == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing or invalid query parameter (from)").build();
    }

    if (toISO == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing or invalid query parameter (to)").build();
    }
    
    Date from = fromISO.getDate();
    Date to = toISO.getDate();
    
    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(userId);
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(userIdentifier);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!userEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
      if(workspaceEntityId == null) {
        if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_USER_STATISTICS))
          return Response.status(Status.FORBIDDEN).build();
      }
      else {
        WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
        if (!sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_USER_WORKSPACE_ACTIVITY, workspaceEntity))
          return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    List<ActivityLog> userWorkspaceActivityLogs = activityLogController.listActivityLogsByUserEntityIdAndWorkspaceEntityId(userEntity.getId(), workspaceEntityId, from, to);
    return Response.ok(createRestModel(userWorkspaceActivityLogs)).build();
  }
  
  @GET
  @Path("/user/{USERID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserActivityLogs(@PathParam("USERID") String userId,
      @QueryParam("from") ISO8601UTCTimestamp fromISO,
      @QueryParam("to") ISO8601UTCTimestamp toISO) {

    if (fromISO == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing or invalid query parameter (from)").build();
    }

    if (toISO == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing or invalid query parameter (to)").build();
    }
    
    Date from = fromISO.getDate();
    Date to = toISO.getDate();
    
    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(userId);
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(userIdentifier);
    
    List<Long> userWorkspacesWithActivities = activityLogController.listWorkspacesWithActivityLogsByUserId(userEntity.getId());
    Map<String, List<LogDataEntryRESTModel>> userActivities = new HashMap<String, List<LogDataEntryRESTModel>>();
    
    for(Long workspaceEntityId: userWorkspacesWithActivities) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      if (userEntity.getId().equals(sessionController.getLoggedUserEntity().getId()) ||
          sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_USER_WORKSPACE_ACTIVITY, workspaceEntity )) {
        List<ActivityLog> userWorkspaceActivityLogs = activityLogController.listActivityLogsByUserEntityIdAndWorkspaceEntityId(userEntity.getId(), workspaceEntityId, from, to);
        userActivities.put(workspaceEntityId.toString(), createRestModel(userWorkspaceActivityLogs));
      }
    }
    
    if (userActivities.size() == 0 &&
        !userEntity.getId().equals(sessionController.getLoggedUserEntity().getId()) &&
        !sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_USER_STATISTICS))
      return Response.status(Status.FORBIDDEN).build();
    
    List<ActivityLog> userGeneralActivityLogs = activityLogController.listActivityLogsByUserEntityIdAndWorkspaceEntityId(userEntity.getId(), null, from, to);
    userActivities.put("general", createRestModel(userGeneralActivityLogs));
    
    return Response.ok(userActivities).build();
  }
  
  private List<LogDataEntryRESTModel> createRestModel(List<ActivityLog> activityLogs) {
    List<LogDataEntryRESTModel> restlogs = new ArrayList<LogDataEntryRESTModel>();
    for (ActivityLog activityLog: activityLogs) {
      restlogs.add(new LogDataEntryRESTModel(activityLog.getActivityLogType(), activityLog.getTimestamp(), activityLog.getContextId()));
    }
    return restlogs;
  }
}
