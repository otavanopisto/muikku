package fi.otavanopisto.muikku.plugins.cleaner;

import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Path("/cleaner")
public class CleanerRESTService {
  
  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;

  @Inject
  private CleanerAnswersController answersCleaner;
  
  @GET
  @Path("/answers")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response answers(@QueryParam("batch") Integer batchSize, @QueryParam("enabled") Boolean enabled) {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    if (batchSize != null && batchSize > 0) {
      logger.info(String.format("User %d changing answer cleaner batch size %d", batchSize));
      answersCleaner.changeBatchSize(batchSize);
    }
    if (enabled != null) {
      logger.info(String.format("User %d changing answer cleaner enabled %s", enabled));
      answersCleaner.toggleEnabled(enabled);
    }
    return Response.noContent().build();
  }

}
