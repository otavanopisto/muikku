package fi.otavanopisto.muikku.plugins.activitylog.rest;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

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

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLog;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Path("/activitylogs")
@Produces("application/json")

public class ActivityLogRESTService extends PluginRESTService {
  
  private static final long serialVersionUID = 6892435956970819197L;
  
  @Inject
  private Logger logger;
  
  @Inject
  private ActivityLogController activityLogController;
  
  //TODO permissions? which ones?
  @GET
  @Path("/user/{USERENTITYID}/workspace/")
  @RESTPermit(handling=Handling.INLINE)
  public Response listWorkspaceActivityLogs(@PathParam("USERENTITYID") Long userEntityId,
      @QueryParam("workspaceEntityId") Long workspaceEntityId,
      @QueryParam("from") String from,
      @QueryParam("to") String to) {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    Date beginDate;
    Date endDate;
    try {
      beginDate = sdf.parse(from);
      endDate = sdf.parse(to);
    }
    catch (ParseException e) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    List<ActivityLog> workspaceActivityLogs = activityLogController.listActivityLogsByUserEntityIdAndworkspaceEntityId(userEntityId, workspaceEntityId, beginDate, endDate);
    return Response.ok(workspaceActivityLogs).build();
  }
}
