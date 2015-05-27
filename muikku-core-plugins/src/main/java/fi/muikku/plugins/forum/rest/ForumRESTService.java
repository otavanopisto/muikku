package fi.muikku.plugins.forum.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.forum.ForumController;
import fi.muikku.plugins.forum.ForumResourcePermissionCollection;
import fi.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumAreaGroup;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.session.SessionController;
import fi.otavanopisto.security.AuthorizationException;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/forum")
@RequestScoped
@Stateful
@Produces ("application/json")
public class ForumRESTService extends PluginRESTService {

  private static final long serialVersionUID = 8910816437728659987L;

  @Inject
  private ForumController forumController;
  
  @Inject
  private SessionController sessionController;
  
  @GET
  @Path ("/areagroups")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_LIST_FORUMAREAGROUPS)
  public Response listForumAreaGroups() throws AuthorizationException {
    List<ForumAreaGroup> groups = forumController.listForumAreaGroups();
    
    if (groups.size() > 0) {
      List<ForumAreaGroupRESTModel> result = new ArrayList<ForumAreaGroupRESTModel>();
      
      for (ForumAreaGroup group : groups) {
        result.add(new ForumAreaGroupRESTModel(group.getId(), group.getName()));
      }
      
      return Response.ok(
        result
      ).build();
    } else {
      return Response.noContent().build();
    }
  }
  
  @GET
  @Path ("/areagroups/{AREAGROUPID}")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_FIND_FORUMAREAGROUP)
  public Response findAreaGroup(@PathParam ("AREAGROUPID") Long areaGroupId) throws AuthorizationException {
    ForumAreaGroup forumArea = forumController.findForumAreaGroup(areaGroupId);
    
    ForumAreaGroupRESTModel result = new ForumAreaGroupRESTModel(forumArea.getId(), forumArea.getName()); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @POST
  @Path ("/areagroups")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_CREATEFORUMAREAGROUP)
  public Response createForumAreaGroup(ForumAreaGroupRESTModel newGroup) throws AuthorizationException {
    ForumAreaGroup forumArea = forumController.createForumAreaGroup(newGroup.getName());
    
    ForumAreaGroupRESTModel result = new ForumAreaGroupRESTModel(forumArea.getId(), forumArea.getName()); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @DELETE
  @Path ("/areagroups/{AREAGROUPID}")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_DELETE_FORUMAREAGROUP)
  public Response deleteAreaGroup(@PathParam ("AREAGROUPID") Long areaGroupId) throws AuthorizationException {
    ForumAreaGroup forumAreaGroup = forumController.findForumAreaGroup(areaGroupId);
    
    forumController.deleteAreaGroup(forumAreaGroup);
    
    return Response.noContent().build();
  }
  
  @GET
  @Path ("/areas")
  @RESTPermit(handling = Handling.UNSECURED)
  public Response listForumAreas() throws AuthorizationException {
    // Permission to see the area is checked by controller here
    List<EnvironmentForumArea> forums = forumController.listEnvironmentForums();
    
    if (forums.size() > 0) {
      List<ForumAreaRESTModel> result = new ArrayList<ForumAreaRESTModel>();
      
      for (EnvironmentForumArea forum : forums) {
        result.add(new ForumAreaRESTModel(forum.getId(), forum.getName(), forum.getGroup() != null ? forum.getGroup().getId() : null));
      }
      
      return Response.ok(
        result
      ).build();
    } else {
      return Response.noContent().build();
    }
  }
  
  @GET
  @Path ("/areas/{AREAID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response findArea(@PathParam ("AREAID") Long areaId) throws AuthorizationException {
    ForumArea forumArea = forumController.getForumArea(areaId);
    
    if (forumArea != null) {
      if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_LISTFORUM, forumArea)) {
    
        ForumAreaRESTModel result = new ForumAreaRESTModel(forumArea.getId(), forumArea.getName(), forumArea.getGroup() != null ? forumArea.getGroup().getId() : null); 
        
        return Response.ok(
          result
        ).build();
      } else {
        return Response.status(Status.FORBIDDEN).build();
      }
    } else {
      return Response.status(Status.NOT_FOUND).build();
    }
  }
  
  @DELETE
  @Path ("/areas/{AREAID}")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_DELETEENVIRONMENTFORUM)
  public Response deleteArea(@PathParam ("AREAID") Long areaId) throws AuthorizationException {
    System.out.println("Deleting area " + areaId);
    ForumArea forumArea = forumController.getForumArea(areaId);

    forumController.deleteArea(forumArea);
    
    return Response.noContent().build();
  }
  
  @POST
  @Path ("/areas")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_CREATEENVIRONMENTFORUM)
  public Response createForumArea(ForumAreaRESTModel newForum) throws AuthorizationException {
    EnvironmentForumArea forumArea = forumController.createEnvironmentForumArea(newForum.getName(), newForum.getGroupId());
    
    ForumAreaRESTModel result = new ForumAreaRESTModel(forumArea.getId(), forumArea.getName(), forumArea.getGroup() != null ? forumArea.getGroup().getId() : null); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/areas/{AREAID}/threads")
  @RESTPermit(handling = Handling.INLINE)
  public Response listThreads(@PathParam ("AREAID") Long areaId, @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) throws AuthorizationException {
    ForumArea forumArea = forumController.getForumArea(areaId);
    
    if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_READMESSAGES, forumArea)) {
      List<ForumThread> threads = forumController.listForumThreads(forumArea, firstResult, maxResults);
      
      List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();
      
      for (ForumThread thread : threads) {
        result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated()));
      }
      
      return Response.ok(
        result
      ).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @GET
  @Path ("/areas/{AREAID}/threads/{THREADID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response findThread(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId) throws AuthorizationException {
    ForumThread thread = forumController.getForumThread(threadId);

    if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_READMESSAGES, thread)) {
      ForumThreadRESTModel result = new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated());
      
      return Response.ok(
        result
      ).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @DELETE
  @Path ("/areas/{AREAID}/threads/{THREADID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response deleteThread(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId) throws AuthorizationException {
    System.out.println("Deleting thread " + areaId + "/" + threadId);
    ForumThread thread = forumController.getForumThread(threadId);

    if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_DELETEMESSAGES, thread)) {
      forumController.deleteThread(thread);
      
      return Response.noContent().build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @POST
  @Path ("/areas/{AREAID}/threads")
  @RESTPermit(handling = Handling.INLINE)
  public Response createThread(@PathParam ("AREAID") Long areaId, ForumThreadRESTModel newThread) throws AuthorizationException {
    ForumArea forumArea = forumController.getForumArea(areaId);
    
    if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_WRITEMESSAGES, forumArea)) {
      ForumThread thread = forumController.createForumThread(
          forumArea, 
          newThread.getTitle(),
          Jsoup.clean(newThread.getMessage(), Whitelist.basic()), 
          newThread.getSticky(), 
          newThread.getLocked());
  
      ForumThreadRESTModel result = new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated());
      
      return Response.ok(
        result
      ).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @GET
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies")
  @RESTPermit(handling = Handling.INLINE)
  public Response listReplies(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, 
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) throws AuthorizationException {
    ForumThread forumThread = forumController.getForumThread(threadId);

    if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_READMESSAGES, forumThread)) {
      List<ForumThreadReply> replies = forumController.listForumThreadReplies(forumThread, firstResult, maxResults);
      
      List<ForumThreadReplyRESTModel> result = new ArrayList<ForumThreadReplyRESTModel>();
      
      for (ForumThreadReply reply : replies) {
        result.add(new ForumThreadReplyRESTModel(reply.getId(), reply.getMessage(), reply.getCreator(), reply.getCreated(), reply.getForumArea().getId()));
      }
      
      return Response.ok(
        result
      ).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @GET
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies/{REPLYID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response findReply(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, @PathParam ("REPLYID") Long replyId) throws AuthorizationException {
    ForumThreadReply reply = forumController.getForumThreadReply(replyId);

    if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_READMESSAGES, reply.getForumArea())) {
      ForumThreadReplyRESTModel result = new ForumThreadReplyRESTModel(reply.getId(), reply.getMessage(), reply.getCreator(), reply.getCreated(), reply.getForumArea().getId());
  
      return Response.ok(
        result
      ).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @DELETE
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies/{REPLYID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response deleteReply(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, @PathParam ("REPLYID") Long replyId) throws AuthorizationException {
    System.out.println("Deleting reply " + areaId + "/" + threadId + "/" + replyId);
    ForumThreadReply reply = forumController.getForumThreadReply(replyId);

    if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_DELETEMESSAGES, reply.getForumArea())) {
      forumController.deleteReply(reply);
      
      return Response.noContent().build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @POST
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies")
  @RESTPermit(handling = Handling.INLINE)
  public Response createReply(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, ForumThreadReplyRESTModel newReply) throws AuthorizationException {
    ForumThread forumThread = forumController.getForumThread(threadId);

    if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_WRITEMESSAGES, forumThread)) {
      ForumThreadReply reply = forumController.createForumThreadReply(forumThread, Jsoup.clean(newReply.getMessage(), Whitelist.basic()));
      
      ForumThreadReplyRESTModel result = new ForumThreadReplyRESTModel(reply.getId(), reply.getMessage(), reply.getCreator(), reply.getCreated(), reply.getForumArea().getId());
      
      return Response.ok(
        result
      ).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  
  @GET
  @Path ("/latest")
  @RESTPermit(handling = Handling.INLINE)
  public Response listLatestThreads(@QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) throws AuthorizationException {
    List<ForumThread> threads = forumController.listLatestForumThreads(firstResult, maxResults);
    
    List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();
    
    for (ForumThread thread : threads) {
      result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated()));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
}
