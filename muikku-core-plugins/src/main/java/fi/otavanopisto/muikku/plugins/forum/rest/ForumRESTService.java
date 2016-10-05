package fi.otavanopisto.muikku.plugins.forum.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.EntityTag;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.digest.DigestUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities.EscapeMode;
import org.jsoup.safety.Whitelist;

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.forum.ForumController;
import fi.otavanopisto.muikku.plugins.forum.ForumResourcePermissionCollection;
import fi.otavanopisto.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumAreaGroup;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThreadReply;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/forum")
@RequestScoped
@Stateful
@Produces ("application/json")
public class ForumRESTService extends PluginRESTService {

  private static final long serialVersionUID = 687114723532731651L;

  @Inject
  private Logger logger;
  
  @Inject
  private ForumController forumController;

  @Inject
  private SessionController sessionController;
  
  @GET
  @Path ("/areagroups")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_LIST_FORUMAREAGROUPS)
  public Response listForumAreaGroups() {
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
  public Response findAreaGroup(@PathParam ("AREAGROUPID") Long areaGroupId) {
    ForumAreaGroup forumArea = forumController.findForumAreaGroup(areaGroupId);
    
    ForumAreaGroupRESTModel result = new ForumAreaGroupRESTModel(forumArea.getId(), forumArea.getName()); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @POST
  @Path ("/areagroups")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_CREATEFORUMAREAGROUP)
  public Response createForumAreaGroup(ForumAreaGroupRESTModel newGroup) {
    ForumAreaGroup forumArea = forumController.createForumAreaGroup(newGroup.getName());
    
    ForumAreaGroupRESTModel result = new ForumAreaGroupRESTModel(forumArea.getId(), forumArea.getName()); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @DELETE
  @Path ("/areagroups/{AREAGROUPID}")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_DELETE_FORUMAREAGROUP)
  public Response deleteAreaGroup(@PathParam ("AREAGROUPID") Long areaGroupId) {
    ForumAreaGroup forumAreaGroup = forumController.findForumAreaGroup(areaGroupId);
    
    forumController.deleteAreaGroup(forumAreaGroup);
    
    return Response.noContent().build();
  }
  
  @GET
  @Path ("/areas")
  @RESTPermit(handling = Handling.INLINE)
  public Response listForumAreas() {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build(); 
    }
    
    if (!sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_ACCESSENVIRONMENTFORUM)) {
      return Response.status(Status.FORBIDDEN).entity("Forbidden").build(); 
    }
    
    // Permission to see the area is checked by controller here
    List<EnvironmentForumArea> forums = forumController.listEnvironmentForums();
    
    List<ForumAreaRESTModel> result = new ArrayList<ForumAreaRESTModel>();
    
    for (EnvironmentForumArea forum : forums) {
      Long numThreads = forumController.getThreadCount(forum);
      result.add(new ForumAreaRESTModel(forum.getId(), forum.getName(), forum.getGroup() != null ? forum.getGroup().getId() : null, numThreads));
    }
    
    return Response.ok(result).build();
  }
  
  @GET
  @Path ("/areas/{AREAID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response findArea(@Context Request request, @PathParam ("AREAID") Long areaId) {
    ForumArea forumArea = forumController.getForumArea(areaId);
    
    if (forumArea != null) {
      if (!(forumArea instanceof EnvironmentForumArea)) {
        logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
        return Response.status(Status.NOT_FOUND).build();
      }
      
      if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_ACCESSENVIRONMENTFORUM)) {
        Long numThreads = forumController.getThreadCount(forumArea);
        
        EntityTag tag = new EntityTag(DigestUtils.md5Hex(String.valueOf(forumArea.getVersion()) + String.valueOf(numThreads)));

        ResponseBuilder builder = request.evaluatePreconditions(tag);
        if (builder != null) {
          return builder.build();
        }

        CacheControl cacheControl = new CacheControl();
        cacheControl.setMustRevalidate(true);
        
        ForumAreaRESTModel result = new ForumAreaRESTModel(forumArea.getId(), forumArea.getName(), 
            forumArea.getGroup() != null ? forumArea.getGroup().getId() : null, numThreads); 
        
        return Response
            .ok(result)
            .cacheControl(cacheControl)
            .tag(tag)
            .build();
      } else {
        return Response.status(Status.FORBIDDEN).build();
      }
    } else {
      return Response.status(Status.NOT_FOUND).build();
    }
  }

  @PUT
  @Path ("/areas/{AREAID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateArea(@PathParam ("AREAID") Long areaId, ForumAreaRESTModel restModel) {
    ForumArea forumArea = forumController.getForumArea(areaId);
    
    if (forumArea != null) {
      if (!(forumArea instanceof EnvironmentForumArea)) {
        logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
        return Response.status(Status.NOT_FOUND).build();
      }

      if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_UPDATEENVIRONMENTFORUM)) {
        
        forumController.updateForumAreaName(forumArea, restModel.getName());
        
        return Response
            .noContent()
            .build();
      } else {
        return Response.status(Status.FORBIDDEN).build();
      }
    } else {
      return Response.status(Status.NOT_FOUND).build();
    }
  }
  
  @DELETE
  @Path ("/areas/{AREAID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response deleteEnvironmentForumArea(@PathParam ("AREAID") Long areaId) {
    ForumArea forumArea = forumController.getForumArea(areaId);
    if (forumArea == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!(forumArea instanceof EnvironmentForumArea)) {
      logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (sessionController.hasPermission(MuikkuPermissions.OWNER, forumArea) || sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_DELETEENVIRONMENTFORUM)) {
      forumController.deleteArea(forumArea);
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    return Response.noContent().build();
  }
  
  @POST
  @Path ("/areas")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_CREATEENVIRONMENTFORUM)
  public Response createForumArea(ForumAreaRESTModel newForum) {
    EnvironmentForumArea forumArea = forumController.createEnvironmentForumArea(newForum.getName(), newForum.getGroupId());
    
    ForumAreaRESTModel result = new ForumAreaRESTModel(forumArea.getId(), forumArea.getName(), forumArea.getGroup() != null ? forumArea.getGroup().getId() : null, 0l); 
    
    return Response.ok(result).build();
  }

  @GET
  @Path ("/areas/{AREAID}/threads")
  @RESTPermit(handling = Handling.INLINE)
  public Response listThreads(@PathParam ("AREAID") Long areaId, @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {
    
    ForumArea forumArea = forumController.getForumArea(areaId);
    if (forumArea == null) {
      return Response.status(Status.NOT_FOUND).entity("Forum area not found").build();
    }
    
    if (!(forumArea instanceof EnvironmentForumArea)) {
      logger.severe(String.format("Trying to list non environment forum area (%d) threads from environment endpoint", forumArea.getId()));
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_READ_ENVIRONMENT_MESSAGES)) {
      List<ForumThread> threads = forumController.listForumThreads(forumArea, firstResult, maxResults);
      
      List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();
      
      for (ForumThread thread : threads) {
        long numReplies = forumController.getThreadReplyCount(thread);
        result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated(), numReplies, thread.getLastModified()));
      }
      
      return Response.ok(result).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @GET
  @Path ("/areas/{AREAID}/threads/{THREADID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response findThread(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId) {
    ForumThread thread = forumController.getForumThread(threadId);
    if (thread == null) {
      return Response.status(Status.NOT_FOUND).entity("Forum thread not found").build();
    }
    
    if (!(thread.getForumArea() instanceof EnvironmentForumArea)) {
      logger.severe(String.format("Trying to list non environment forum thread messages (%d) from environment endpoint", thread.getId()));
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_READ_ENVIRONMENT_MESSAGES)) {
      long numReplies = forumController.getThreadReplyCount(thread);
      ForumThreadRESTModel result = new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated(), numReplies, thread.getLastModified());
      
      return Response.ok(result).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @PUT
  @Path ("/areas/{AREAID}/threads/{THREADID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateThread(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, ForumThreadRESTModel updThread) {
    ForumThread forumThread = forumController.getForumThread(threadId);
    if (forumThread == null) {
      return Response.status(Status.NOT_FOUND).entity("Forum thread not found").build();
    }
    
    ForumArea forumArea = forumController.getForumArea(areaId);
    if (forumArea == null) {
      return Response.status(Status.NOT_FOUND).entity("Forum area not found").build();
    }
    
    if (!(forumArea instanceof EnvironmentForumArea)) {
      logger.severe(String.format("Trying to update non environment forum thread (%d) from environment endpoint", forumThread.getId()));
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (!forumArea.getId().equals(forumThread.getForumArea().getId())) {
      return Response.status(Status.NOT_FOUND).entity("Forum thread not found from the specified area").build();
    }
    
    if (!forumThread.getId().equals(threadId)) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (sessionController.hasPermission(MuikkuPermissions.OWNER, forumThread) || sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_EDIT_ENVIRONMENT_MESSAGES)) {
      if (Boolean.TRUE.equals(updThread.getSticky()) || Boolean.TRUE.equals(updThread.getLocked())) {
        if (!sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_LOCK_OR_STICKIFY_MESSAGES))
          return Response.status(Status.BAD_REQUEST).build();
      }

      forumController.updateForumThread(forumThread, 
          updThread.getTitle(),
          updThread.getMessage(),
          updThread.getSticky(), 
          updThread.getLocked());
      
      long numReplies = forumController.getThreadReplyCount(forumThread);
      ForumThreadRESTModel result = new ForumThreadRESTModel(forumThread.getId(), forumThread.getTitle(), 
          forumThread.getMessage(), forumThread.getCreator(), forumThread.getCreated(), forumThread.getForumArea().getId(), 
          forumThread.getSticky(), forumThread.getLocked(), forumThread.getUpdated(), numReplies, forumThread.getLastModified());
      
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
  public Response deleteThread(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId) {
    ForumThread thread = forumController.getForumThread(threadId);
    if (thread == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Forum thread (%d) not found", threadId)).build();
    }
    
    if (!(thread.getForumArea() instanceof EnvironmentForumArea)) {
      logger.severe(String.format("Trying to delete non environment forum thread (%d) from environment endpoint", thread.getId()));
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_DELETE_ENVIRONMENT_MESSAGES)) {
      forumController.archiveThread(thread);
      return Response.noContent().build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @POST
  @Path ("/areas/{AREAID}/threads")
  @RESTPermit(handling = Handling.INLINE)
  public Response createThread(@PathParam ("AREAID") Long areaId, ForumThreadRESTModel newThread) {
    ForumArea forumArea = forumController.getForumArea(areaId);
    if (forumArea == null) {
      return Response.status(Status.NOT_FOUND).entity("Forum area not found").build();
    }
    
    if (!(forumArea instanceof EnvironmentForumArea)) {
      logger.severe(String.format("Trying to create new thread to non environment area (%d) from environment endpoint", forumArea.getId()));
      return Response.status(Status.BAD_REQUEST).build();
    }
   
    if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_WRITE_ENVIRONMENT_MESSAGES)) {
      if (Boolean.TRUE.equals(newThread.getSticky()) || Boolean.TRUE.equals(newThread.getLocked())) {
        if (!sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_LOCK_OR_STICKIFY_MESSAGES))
          return Response.status(Status.BAD_REQUEST).build();
      }
      
      Document message = Jsoup.parse(Jsoup.clean(newThread.getMessage(), Whitelist.relaxed().addAttributes("a", "target")));
      message.outputSettings().escapeMode(EscapeMode.xhtml);
      message.select("a[target]").attr("rel", "noopener noreferer");
      ForumThread thread = forumController.createForumThread(
          forumArea, 
          newThread.getTitle(),
          message.body().toString(), 
          newThread.getSticky(), 
          newThread.getLocked());
  
      ForumThreadRESTModel result = new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated(), 1l, thread.getLastModified());
      
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
      
      if (!(forumArea instanceof EnvironmentForumArea)) {
        logger.severe(String.format("Trying to create new thread to non environment area (%d) from environment endpoint", forumArea.getId()));
        return Response.status(Status.BAD_REQUEST).build();
      }
     
      if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_READ_ENVIRONMENT_MESSAGES)) {
        if (!forumArea.getId().equals(forumThread.getForumArea().getId())) {
          return Response.status(Status.NOT_FOUND).entity("Forum thread not found from the specified area").build();
        }
        
        List<ForumThreadReply> replies = forumController.listForumThreadReplies(forumThread, firstResult, maxResults);
        return Response.ok(createRestModel(replies.toArray(new ForumThreadReply[0]))).build();
      } else
        return Response.status(Status.FORBIDDEN).build();
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Listing forum thread replies failed", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  @GET
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies/{REPLYID}")
  @RESTPermit(handling = Handling.INLINE)
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
      
      if (!(forumArea instanceof EnvironmentForumArea)) {
        logger.severe(String.format("Trying to find thread reply for to non environment area (%d) from environment endpoint", forumArea.getId()));
        return Response.status(Status.BAD_REQUEST).build();
      }
      
      if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_READ_ENVIRONMENT_MESSAGES)) {
        return Response.ok(createRestModel(threadReply)).build();
      } else {
        return Response.status(Status.FORBIDDEN).build();
      }
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Finding forum thread reply failed", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  @PUT
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies/{REPLYID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateReply(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, @PathParam ("REPLYID") Long replyId, 
      ForumThreadReplyRESTModel reply) {
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
      
      if (!reply.getId().equals(replyId)) {
        return Response.status(Status.BAD_REQUEST).build();
      }
      
      if (!(forumArea instanceof EnvironmentForumArea)) {
        logger.severe(String.format("Trying to edit thread reply for non environment area (%d) from environment endpoint", forumArea.getId()));
        return Response.status(Status.BAD_REQUEST).build();
      }
      
      if (sessionController.hasPermission(MuikkuPermissions.OWNER, threadReply) ||
          sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_EDIT_ENVIRONMENT_MESSAGES)) {
        forumController.updateForumThreadReply(threadReply, reply.getMessage());
        return Response.ok(createRestModel(threadReply)).build();
      } else {
        return Response.status(Status.FORBIDDEN).build();
      }
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Finding forum thread reply failed", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  @DELETE
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies/{REPLYID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response deleteReply(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, @PathParam ("REPLYID") Long replyId) {
    ForumThreadReply reply = forumController.getForumThreadReply(replyId);
    if (reply == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Forum thread reply (%d) not found", replyId)).build();
    }
     
    if (!(reply.getForumArea() instanceof EnvironmentForumArea)) {
      logger.severe(String.format("Trying to delete non environment forum thread reply (%d) from environment endpoint", reply.getId()));
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_DELETE_ENVIRONMENT_MESSAGES)) {
      forumController.archiveReply(reply);
      return Response.noContent().build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @POST
  @Path ("/areas/{AREAID}/threads/{THREADID}/replies")
  @RESTPermit(handling = Handling.INLINE)
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
      
      if (!(forumArea instanceof EnvironmentForumArea)) {
        logger.severe(String.format("Trying to post thread reply for to non environment area (%d) from environment endpoint", forumArea.getId()));
        return Response.status(Status.BAD_REQUEST).build();
      }
      
      if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_WRITE_ENVIRONMENT_MESSAGES)) {
        ForumThreadReply parentReply = null;
        
        if (newReply.getParentReplyId() != null) {
          parentReply = forumController.getForumThreadReply(newReply.getParentReplyId());
          
          if (parentReply == null) {
            return Response.status(Status.BAD_REQUEST).entity("Invalid parent reply id").build();
          }
        
          if (!Objects.equals(parentReply.getThread().getId(), threadId)) {
            return Response.status(Status.BAD_REQUEST).entity("Parent reply is in wrong thread").build();
          }
        }
        
        return Response.ok(createRestModel(forumController.createForumThreadReply(forumThread, newReply.getMessage(), parentReply))).build();
      } else {
        return Response.status(Status.FORBIDDEN).build();
      }
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Failed to create new forum thread reply", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  @GET
  @Path ("/latest")
  @RESTPermit(handling = Handling.INLINE)
  public Response listLatestThreads(@QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    if (!sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_READ_ENVIRONMENT_MESSAGES)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    List<ForumThread> threads = forumController.listLatestForumThreads(firstResult, maxResults);
    
    List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();
    
    for (ForumThread thread : threads) {
      long numReplies = forumController.getThreadReplyCount(thread);
      result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated(), numReplies, thread.getLastModified()));
    }
    
    return Response.ok(result).build();
  }
  
  private ForumThreadReplyRESTModel createRestModel(ForumThreadReply entity) {
    Long parentReplyId = null;
    if (entity.getParentReply() != null) {
      parentReplyId = entity.getParentReply().getId();
    }
    return new ForumThreadReplyRESTModel(entity.getId(), entity.getMessage(), entity.getCreator(), entity.getCreated(), entity.getForumArea().getId(), parentReplyId, entity.getLastModified(), entity.getChildReplyCount());
  }
  
  private List<ForumThreadReplyRESTModel> createRestModel(ForumThreadReply... entries) {
    List<ForumThreadReplyRESTModel> result = new ArrayList<>();

    for (ForumThreadReply entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }
  
}
