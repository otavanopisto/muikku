package fi.muikku.plugins.forum.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.forum.ForumController;
import fi.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumAreaGroup;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.muikku.security.AuthorizationException;

@Path("/forum")
@RequestScoped
@Stateful
@Produces ("application/json")
public class ForumRESTService extends PluginRESTService {

  private static final long serialVersionUID = 8910816437728659987L;

  @Inject
  private ForumController forumController;
  
  @GET
  @Path ("/areagroups")
  public Response listForumAreaGroups() throws AuthorizationException {
    List<ForumAreaGroup> groups = forumController.listForumAreaGroups();
    
    List<ForumAreaGroupRESTModel> result = new ArrayList<ForumAreaGroupRESTModel>();
    
    for (ForumAreaGroup group : groups) {
      result.add(new ForumAreaGroupRESTModel(group.getId(), group.getName()));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/areagroups/{AREAGROUPID}")
  public Response findAreaGroup(@PathParam ("AREAGROUPID") Long areaGroupId) throws AuthorizationException {
    ForumAreaGroup forumArea = forumController.findForumAreaGroup(areaGroupId);
    
    ForumAreaGroupRESTModel result = new ForumAreaGroupRESTModel(forumArea.getId(), forumArea.getName()); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @POST
  @Path ("/areagroups")
  public Response createForumAreaGroup(ForumAreaGroupRESTModel newGroup) throws AuthorizationException {
    ForumAreaGroup forumArea = forumController.createForumAreaGroup(newGroup.getName());
    
    ForumAreaGroupRESTModel result = new ForumAreaGroupRESTModel(forumArea.getId(), forumArea.getName()); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/areas")
  public Response listForumAreas() throws AuthorizationException {
    List<EnvironmentForumArea> forums = forumController.listEnvironmentForums();
    
    List<ForumAreaRESTModel> result = new ArrayList<ForumAreaRESTModel>();
    
    for (EnvironmentForumArea forum : forums) {
      result.add(new ForumAreaRESTModel(forum.getId(), forum.getName(), forum.getGroup() != null ? forum.getGroup().getId() : null));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/areas/{AREAID}")
  public Response findArea(@PathParam ("AREAID") Long areaId) throws AuthorizationException {
    ForumArea forumArea = forumController.getForumArea(areaId);
    
    ForumAreaRESTModel result = new ForumAreaRESTModel(forumArea.getId(), forumArea.getName(), forumArea.getGroup() != null ? forumArea.getGroup().getId() : null); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @POST
  @Path ("/areas")
  public Response createForumArea(ForumAreaRESTModel newForum) throws AuthorizationException {
    EnvironmentForumArea forumArea = forumController.createEnvironmentForumArea(newForum.getName(), newForum.getGroupId());
    
    ForumAreaRESTModel result = new ForumAreaRESTModel(forumArea.getId(), forumArea.getName(), forumArea.getGroup() != null ? forumArea.getGroup().getId() : null); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/areas/{AREAID}/threads")
  public Response listThreads(@PathParam ("AREAID") Long areaId, @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) throws AuthorizationException {
    ForumArea forumArea = forumController.getForumArea(areaId);
    
    List<ForumThread> threads = forumController.listForumThreads(forumArea, firstResult, maxResults);
    
    List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();
    
    for (ForumThread thread : threads) {
      result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked()));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/areas/{AREAID}/threads/{THREADID}")
  public Response findThread(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId) throws AuthorizationException {
    ForumThread thread = forumController.getForumThread(threadId);

    ForumThreadRESTModel result = new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked());
    
    return Response.ok(
      result
    ).build();
  }
  
  @POST
  @Path ("/areas/{AREAID}/threads")
  public Response createThread(@PathParam ("AREAID") Long areaId, ForumThreadRESTModel newThread) throws AuthorizationException {
    ForumArea forumArea = forumController.getForumArea(areaId);
    ForumThread thread = forumController.createForumThread(forumArea, newThread.getTitle(), newThread.getMessage(), newThread.getSticky(), newThread.getLocked());

    ForumThreadRESTModel result = new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked());
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies")
  public Response listReplies(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, 
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) throws AuthorizationException {
    ForumThread forumThread = forumController.getForumThread(threadId);
    List<ForumThreadReply> replies = forumController.listForumThreadReplies(forumThread, firstResult, maxResults);
    
    List<ForumThreadReplyRESTModel> result = new ArrayList<ForumThreadReplyRESTModel>();
    
    for (ForumThreadReply reply : replies) {
      result.add(new ForumThreadReplyRESTModel(reply.getId(), reply.getMessage(), reply.getCreator(), reply.getCreated(), reply.getForumArea().getId()));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies/{REPLYID}")
  public Response findReply(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, @PathParam ("REPLYID") Long replyId) throws AuthorizationException {
    ForumThreadReply reply = forumController.getForumThreadReply(replyId);

    ForumThreadReplyRESTModel result = new ForumThreadReplyRESTModel(reply.getId(), reply.getMessage(), reply.getCreator(), reply.getCreated(), reply.getForumArea().getId());

    return Response.ok(
      result
    ).build();
  }
  
  @POST
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies")
  public Response createReply(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, ForumThreadReplyRESTModel newReply) throws AuthorizationException {
    ForumThread forumThread = forumController.getForumThread(threadId);
    ForumThreadReply reply = forumController.createForumThreadReply(forumThread, newReply.getMessage());
    
    ForumThreadReplyRESTModel result = new ForumThreadReplyRESTModel(reply.getId(), reply.getMessage(), reply.getCreator(), reply.getCreated(), reply.getForumArea().getId());
    
    return Response.ok(
      result
    ).build();
  }
  
  
  @GET
  @Path ("/latest")
  public Response listLatestThreads(@QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) throws AuthorizationException {
    List<ForumThread> threads = forumController.listLatestForumThreads(firstResult, maxResults);
    
    List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();
    
    for (ForumThread thread : threads) {
      result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked()));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
}
