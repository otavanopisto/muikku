package fi.otavanopisto.muikku.plugins.cleanup;

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
@Produces("text/plain")
public class CleanupRESTService {

  @Inject
  private SessionController sessionController;
  
  @Inject
  private SystemSettingsController systemSettingsController;

  @Inject
  private CleanupAnswersJob answersJob;
  
  @Inject
  private CleanupJournalJob journalJob;

  @Inject
  private CleanupEvaluationsJob evaluationsJob;
  
  @GET
  @Path("/stats")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response stats() {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    StringBuffer sb = new StringBuffer();

    sb.append(String.format("Answers enabled %s userEntityId %s batch size %s\n",
        systemSettingsController.getSetting(CleanupAnswersJob.SETTING_ENABLED),
        systemSettingsController.getSetting(CleanupAnswersJob.SETTING_USER),
        systemSettingsController.getSetting(CleanupAnswersJob.SETTING_BATCH)));

    sb.append(String.format("Evaluations enabled %s userEntityId %s batch size %s\n",
        systemSettingsController.getSetting(CleanupEvaluationsJob.SETTING_ENABLED),
        systemSettingsController.getSetting(CleanupEvaluationsJob.SETTING_USER),
        systemSettingsController.getSetting(CleanupEvaluationsJob.SETTING_BATCH)));

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
    StringBuffer sb = new StringBuffer();
    if (enabled != null) {
      sb.append(String.format("Journal cleanup enabled changed to %b\n", enabled));
      journalJob.toggleEnabled(enabled);
    }
    if (userEntityId != null && userEntityId >= 0) {
      sb.append(String.format("Journal cleanup userEntityId changed to %d\n", userEntityId));
      journalJob.changeUserEntityId(userEntityId);
    }
    return Response.ok(sb.toString()).build();
  }

  @GET
  @Path("/answers")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response answers(@QueryParam("batch") Integer batchSize, @QueryParam("enabled") Boolean enabled, @QueryParam("userEntityId") Long userEntityId) {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    StringBuffer sb = new StringBuffer();
    if (batchSize != null && batchSize > 0) {
      sb.append(String.format("Answers cleanup batch size changed to %d\n", batchSize));
      answersJob.changeBatchSize(batchSize);
    }
    if (enabled != null) {
      sb.append(String.format("Answers cleanup enabled changed to %b\n", enabled));
      answersJob.toggleEnabled(enabled);
    }
    if (userEntityId != null && userEntityId >= 0) {
      sb.append(String.format("Answers cleanup userEntityId changed to %d\n", userEntityId));
      answersJob.changeUserEntityId(userEntityId);
    }
    return Response.ok(sb.toString()).build();
  }

  @GET
  @Path("/evaluations")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response evaluations(@QueryParam("batch") Integer batchSize, @QueryParam("enabled") Boolean enabled, @QueryParam("userEntityId") Long userEntityId) {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    StringBuffer sb = new StringBuffer();
    if (batchSize != null && batchSize > 0) {
      sb.append(String.format("Evaluations cleanup batch size changed to %d\n", batchSize));
      evaluationsJob.changeBatchSize(batchSize);
    }
    if (enabled != null) {
      sb.append(String.format("Evaluations cleanup enabled changed to %b\n", enabled));
      evaluationsJob.toggleEnabled(enabled);
    }
    if (userEntityId != null && userEntityId >= 0) {
      sb.append(String.format("Evaluations cleanup userEntityId changed to %d\n", userEntityId));
      evaluationsJob.changeUserEntityId(userEntityId);
    }
    return Response.ok(sb.toString()).build();
  }

}
