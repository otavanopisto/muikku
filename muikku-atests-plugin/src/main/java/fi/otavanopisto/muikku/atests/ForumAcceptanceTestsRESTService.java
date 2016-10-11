package fi.otavanopisto.muikku.atests;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.forum.ForumController;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThreadReply;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.session.local.LocalSessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Path("/test_forum")
@Stateful
@Produces("application/json")
@Consumes("application/json")
public class ForumAcceptanceTestsRESTService extends PluginRESTService {

  private static final long serialVersionUID = 4192161644908642797L;

  @Inject
  @LocalSession
  private LocalSessionController localSessionController;

  @Inject
  private ForumController forumController;

  @DELETE
  @Path("/areas/{AREAID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteForumArea(@PathParam ("AREAID") Long forumAreaId) {
    ForumArea forumArea = forumController.findForumAreaById(forumAreaId);
    if (forumArea == null) {
      return Response.status(Status.NOT_FOUND).entity("ForumArea not found").build();
    }
    
    forumController.deleteArea(forumArea);
    
    return Response.noContent().build();
  }  

  @DELETE
  @Path("/areas/{AREAID}/threads/{THREADID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteForumThread(
      @PathParam ("AREAID") Long forumAreaId,
      @PathParam ("THREADID") Long forumThreadId) {
    ForumThread forumThread = forumController.getForumThread(forumThreadId);
    if (forumThread == null) {
      return Response.status(Status.NOT_FOUND).entity("ForumThread not found").build();
    }
    
    forumController.deleteThread(forumThread);
    
    return Response.noContent().build();
  }  

  @DELETE
  @Path("/areas/{AREAID}/threads/{THREADID}/replies/{REPLYID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteForumThreadReply(
      @PathParam ("AREAID") Long forumAreaId,
      @PathParam ("THREADID") Long forumThreadId,
      @PathParam ("REPLYID") Long forumThreadReplyId) {
    ForumThreadReply forumThreadReply = forumController.getForumThreadReply(forumThreadReplyId);
    if (forumThreadReply == null) {
      return Response.status(Status.NOT_FOUND).entity("ForumThreadReply not found").build();
    }
    
    forumController.deleteReply(forumThreadReply);
    
    return Response.noContent().build();
  }  
  
}
