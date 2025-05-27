package fi.otavanopisto.muikku.rest;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.cache.CacheFlushEvent;
import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.search.SearchReindexEvent;
import fi.otavanopisto.muikku.search.SearchReindexEvent.Task;
import fi.otavanopisto.muikku.search.WorkspaceSignupPermissionsSynchronizeEvent;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/system")
@Produces("application/json")
public class SystemRESTService extends AbstractRESTService {
  
  @Inject
  private SystemSettingsController systemSettingsController;

  @Inject
  private SessionController sessionController;

  @Inject
  private Event<WorkspaceSignupPermissionsSynchronizeEvent> synchronizeEvent;

  @Inject
  private Event<CacheFlushEvent> cacheFlushEvent;

  @Inject
  private Event<SearchReindexEvent> reindexEvent;

  @GET
  @Path("/ping")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response ping() {
    return Response.ok("pong").build();
  }
  
  @GET
  @Path("/status")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response status() {
    String setting = systemSettingsController.getSetting("defaultOrganization");
    if (!StringUtils.equals(setting, "PYRAMUS-1")) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    return Response.ok("ok").build();
  }
  
  @GET
  @Path("/cacheFlush")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response cacheFlush() {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    cacheFlushEvent.fire(new CacheFlushEvent());
    return Response.noContent().build();
  }

  @GET
  @Path("/syncSignupPermissions")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response syncSignupPermissions(@QueryParam("resume") Boolean resume) {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    synchronizeEvent.fire(new WorkspaceSignupPermissionsSynchronizeEvent(resume != null ? resume : false));
    return Response.noContent().build();
  }

  @GET
  @Path("/search/reindex")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response searchReindex(@QueryParam("task") String task, @QueryParam("resume") Boolean resume) {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    List<Task> tasks = new ArrayList<>();
    if (StringUtils.isNotBlank(task)) {
      String[] tasksArray = task.split(",");
      for (String arrayTask : tasksArray) {
        Task taskObj = EnumUtils.getEnum(Task.class, arrayTask);
        if (taskObj == null) {
          return Response.status(Status.INTERNAL_SERVER_ERROR).build();
        }
        else {
          tasks.add(taskObj);
        }
      }
      reindexEvent.fire(new SearchReindexEvent(tasks, resume != null ? resume : false));
    }
    else {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    return Response.noContent().build();
  }

}
