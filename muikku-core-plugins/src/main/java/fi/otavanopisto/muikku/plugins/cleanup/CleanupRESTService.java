package fi.otavanopisto.muikku.plugins.cleanup;

import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Path("/cleanup")
public class CleanupRESTService {
  
  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private SystemSettingsController systemSettingsController;

  @Inject
  private CleanupAnswersJob answersJob;
  
  @Inject
  private CleanupJournalJob journalJob;
  
  @GET
  @Path("/stats")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response stats() {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    StringBuffer sb = new StringBuffer();

    sb.append(String.format("Answers enabled %s userEntityId %s\n",
        systemSettingsController.getSetting(CleanupAnswersJob.SETTING_ENABLED),
        systemSettingsController.getSetting(CleanupAnswersJob.SETTING_USER)));

    sb.append(String.format("Journal enabled %s userEntityId %s\n",
        systemSettingsController.getSetting(CleanupJournalJob.SETTING_ENABLED),
        systemSettingsController.getSetting(CleanupJournalJob.SETTING_USER)));

    return Response.ok(sb.toString()).build();
  }

  @GET
  @Path("/journal")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response journal(@QueryParam("enabled") Boolean enabled, @QueryParam("userEntityId") Long userEntityId) {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    if (enabled != null) {
      logger.info(String.format("Journal cleanup enabled changed to %s", enabled));
      journalJob.toggleEnabled(enabled);
    }
    if (userEntityId != null && userEntityId >= 0) {
      logger.info(String.format("Journal cleanup userEntityId changed to %d", userEntityId));
      journalJob.changeUserEntityId(userEntityId);
    }
    return Response.noContent().build();
  }

  @GET
  @Path("/answers")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response answers(@QueryParam("batch") Integer batchSize, @QueryParam("enabled") Boolean enabled, @QueryParam("userEntityId") Long userEntityId) {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    if (batchSize != null && batchSize > 0) {
      logger.info(String.format("Answer cleanup batch size changed to %d", batchSize));
      answersJob.changeBatchSize(batchSize);
    }
    if (enabled != null) {
      logger.info(String.format("Answer cleanup enabled changed to %s", enabled));
      answersJob.toggleEnabled(enabled);
    }
    if (userEntityId != null && userEntityId >= 0) {
      logger.info(String.format("Answer cleanup userEntityId changed to %d", userEntityId));
      answersJob.changeUserEntityId(userEntityId);
    }
    return Response.noContent().build();
  }

}
