package fi.muikku.plugins.forum.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

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
import javax.ws.rs.core.Response.Status;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.forum.ForumController;
import fi.muikku.plugins.forum.ForumResourcePermissionCollection;
import fi.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumAreaGroup;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.session.SessionController;
import fi.otavanopisto.security.AuthorizationException;

@Path("/forum")
@RequestScoped
@Stateful
@Produces ("application/json")
public class ForumRESTService extends PluginRESTService {

  private static final long serialVersionUID = 8910816437728659987L;

  @Inject
  private Logger logger;
  
  @Inject
  private ForumController forumController;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @GET
  @Path ("/areagroups")
//  @Permit(ForumResourcePermissionCollection.FORUM_LIST_FORUMAREAGROUPS)
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
//  @Permit(ForumResourcePermissionCollection.FORUM_FIND_FORUMAREAGROUP)
  public Response findAreaGroup(@PathParam ("AREAGROUPID") Long areaGroupId) throws AuthorizationException {
    ForumAreaGroup forumArea = forumController.findForumAreaGroup(areaGroupId);
    
    ForumAreaGroupRESTModel result = new ForumAreaGroupRESTModel(forumArea.getId(), forumArea.getName()); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @POST
  @Path ("/areagroups")
//  @Permit(ForumResourcePermissionCollection.FORUM_CREATEFORUMAREAGROUP)
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
//  @Permit(ForumResourcePermissionCollection.FORUM_CREATEENVIRONMENTFORUM)
  public Response createForumArea(ForumAreaRESTModel newForum) throws AuthorizationException {
    EnvironmentForumArea forumArea = forumController.createEnvironmentForumArea(newForum.getName(), newForum.getGroupId());
    
    ForumAreaRESTModel result = new ForumAreaRESTModel(forumArea.getId(), forumArea.getName(), forumArea.getGroup() != null ? forumArea.getGroup().getId() : null); 
    
    return Response.ok(
      result
    ).build();
  }

  @POST
  @Path ("/workspace/{WORKSPACEID}/areas")
  public Response createWorkspaceForumArea(@PathParam ("WORKSPACEID") Long workspaceId, ForumAreaRESTModel newForum) throws AuthorizationException {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);

    if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_CREATEWORKSPACEFORUM, workspaceEntity)) {
      WorkspaceForumArea workspaceForumArea = forumController.createWorkspaceForumArea(workspaceEntity, newForum.getName(), newForum.getGroupId());

      WorkspaceForumAreaRESTModel result = new WorkspaceForumAreaRESTModel(
          workspaceForumArea.getId(), workspaceForumArea.getWorkspace(), workspaceForumArea.getName(), workspaceForumArea.getGroup() != null ? workspaceForumArea.getGroup().getId() : null);

      return Response.ok(
        result
      ).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }

  @GET
  @Path ("/areas/{AREAID}/threads")
  public Response listThreads(@PathParam ("AREAID") Long areaId, @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) throws AuthorizationException {
    ForumArea forumArea = forumController.getForumArea(areaId);
    
    List<ForumThread> threads = forumController.listForumThreads(forumArea, firstResult, maxResults);
    
    List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();
    
    for (ForumThread thread : threads) {
      result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated()));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/areas/{AREAID}/threads/{THREADID}")
  public Response findThread(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId) throws AuthorizationException {
    ForumThread thread = forumController.getForumThread(threadId);

    ForumThreadRESTModel result = new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated());
    
    return Response.ok(
      result
    ).build();
  }
  
  @POST
  @Path ("/areas/{AREAID}/threads")
  public Response createThread(@PathParam ("AREAID") Long areaId, ForumThreadRESTModel newThread) throws AuthorizationException {
    ForumArea forumArea = forumController.getForumArea(areaId);
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
  }
  
  @GET
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies")
  public Response listReplies(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, 
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {
    try {
      ForumArea forumArea = forumController.getForumArea(areaId);
      if (forumArea == null) {
        return Response.status(Status.NOT_FOUND).entity("Forum area not found").build();
      }
      
      ForumThread forumThread = forumController.getForumThread(threadId);
      if (forumThread == null) {
        return Response.status(Status.NOT_FOUND).entity("Forum thread not found").build();
      }
      
      if (!forumArea.getId().equals(forumThread.getForumArea().getId())) {
        return Response.status(Status.NOT_FOUND).entity("Forum thread not found from the specified area").build();
      }
      
      List<ForumThreadReply> replies = forumController.listForumThreadReplies(forumThread, firstResult, maxResults);
      if (replies.isEmpty()) {
        return Response.noContent().build();
      }
      
      return Response.ok(createRestModel(replies.toArray(new ForumThreadReply[0]))).build();
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Listing forum thread replies failed", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  @GET
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies/{REPLYID}")
  public Response findReply(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, @PathParam ("REPLYID") Long replyId) {
    try {
      ForumArea forumArea = forumController.getForumArea(areaId);
      if (forumArea == null) {
        return Response.status(Status.NOT_FOUND).entity("Forum area not found").build();
      }
      
      ForumThread forumThread = forumController.getForumThread(threadId);
      if (forumThread == null) {
        return Response.status(Status.NOT_FOUND).entity("Forum thread not found").build();
      }
      
      if (!forumArea.getId().equals(forumThread.getForumArea().getId())) {
        return Response.status(Status.NOT_FOUND).entity("Forum thread not found from the specified area").build();
      }
      
      ForumThreadReply threadReply = forumController.getForumThreadReply(replyId);
      if (threadReply == null) {
        return Response.status(Status.NOT_FOUND).entity("Forum thread reply not found").build();
      }
      
      if (!threadReply.getThread().getId().equals(forumThread.getId())) {
        return Response.status(Status.NOT_FOUND).entity("Forum thread reply not found from the specified thread").build();
      }
      
      return Response.ok(createRestModel(threadReply)).build();
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Finding forum thread reply failed", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  @POST
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies")
  // @Permit(ForumResourcePermissionCollection.FORUM_WRITEMESSAGES)
  public Response createReply(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, ForumThreadReplyRESTModel newReply) {
    try {
      ForumArea forumArea = forumController.getForumArea(areaId);
      if (forumArea == null) {
        return Response.status(Status.NOT_FOUND).entity("Forum area not found").build();
      }
      
      ForumThread forumThread = forumController.getForumThread(threadId);
      if (forumThread == null) {
        return Response.status(Status.NOT_FOUND).entity("Forum thread not found").build();
      }
      
      if (!forumArea.getId().equals(forumThread.getForumArea().getId())) {
        return Response.status(Status.NOT_FOUND).entity("Forum thread not found from the specified area").build();
      }
      
      if (forumThread.getLocked()) {
        return Response.status(Status.BAD_REQUEST).entity("Forum thread is locked").build();
      }
      
      return Response.ok(createRestModel(forumController.createForumThreadReply(forumThread, Jsoup.clean(newReply.getMessage(), Whitelist.basic())))).build();
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Failed to create new forum thread reply", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  
  @GET
  @Path ("/latest")
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
  
  @GET
  @Path ("/workspace/{WORKSPACEID}/latest")
  public Response listLatestThreadsFromWorkspace(
      @PathParam ("WORKSPACEID") Long workspaceId,
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) throws AuthorizationException {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);

    List<ForumThread> threads = forumController.listLatestForumThreadsFromWorkspace(workspaceEntity, firstResult, maxResults);

    List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();

    for (ForumThread thread : threads) {
      result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated()));
    }

    return Response.ok(
      result
    ).build();
  }
  
  private ForumThreadReplyRESTModel createRestModel(ForumThreadReply entity) {
    return new ForumThreadReplyRESTModel(entity.getId(), entity.getMessage(), entity.getCreator(), entity.getCreated(), entity.getForumArea().getId()); 
  }
  
  private List<ForumThreadReplyRESTModel> createRestModel(ForumThreadReply... entries) {
    List<ForumThreadReplyRESTModel> result = new ArrayList<>();

    for (ForumThreadReply entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }
  
}
