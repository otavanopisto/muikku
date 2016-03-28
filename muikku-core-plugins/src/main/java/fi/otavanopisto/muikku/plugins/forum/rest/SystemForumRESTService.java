package fi.otavanopisto.muikku.plugins.forum.rest;

import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.controller.ResourceRightsController;
import fi.otavanopisto.muikku.model.security.ResourceRights;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.forum.ForumController;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/system/forum")
@RequestScoped
@Stateful
@Produces ("application/json")
public class SystemForumRESTService extends PluginRESTService {

  private static final long serialVersionUID = -5686464213259396234L;

  @Inject
  private Logger logger;

  @Inject
  private ForumController forumController;

  @Inject
  private ResourceRightsController resourceRightsController;

  @Inject
  private SessionController sessionController;

  @GET
  @Path("/resetForumAreaRights/{FORUMAREAID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)  
  public Response resetForumAreaRights(@PathParam("FORUMAREAID") Long forumAreaId, @Context Request request) {
    logger.info(String.format("Resetting rights of forum area %d", forumAreaId));
    if (sessionController.hasPermission(MuikkuPermissions.ADMIN, null)) {
      ForumArea forumArea = forumController.findForumAreaById(forumAreaId);
      if (forumArea != null) {
        Long resourceRightsIds = forumArea.getRights();
        if (resourceRightsIds != null) {
          ResourceRights resourceRights = resourceRightsController.findResourceRightsById(resourceRightsIds);
          resourceRightsController.deleteByResourceRights(resourceRights);
          forumController.createDefaultForumPermissions(forumArea, resourceRights);
        }
        else {
          return Response.status(Status.NOT_FOUND).entity(String.format("Forum area %d has no rights", forumAreaId)).build();
        }
      }
      else {
        return Response.status(Status.NOT_FOUND).entity(String.format("Forum area %d not found", forumAreaId)).build();
      }
    }
    else {
      return Response.status(Status.FORBIDDEN).entity("Not admin").build();
    }
    return Response.status(Status.OK).entity(String.format("Forum area %d rights reset", forumAreaId)).build();
  }
  
}
