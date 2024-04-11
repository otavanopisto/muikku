package fi.otavanopisto.muikku.plugins.forum.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Event;
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
import org.jsoup.safety.Safelist;

import fi.otavanopisto.muikku.model.forum.LockForumThread;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.forum.ForumAreaSubsciptionController;
import fi.otavanopisto.muikku.plugins.forum.ForumController;
import fi.otavanopisto.muikku.plugins.forum.ForumResourcePermissionCollection;
import fi.otavanopisto.muikku.plugins.forum.ForumThreadSubsciptionController;
import fi.otavanopisto.muikku.plugins.forum.events.ForumMessageSent;
import fi.otavanopisto.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumAreaGroup;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThreadReply;
import fi.otavanopisto.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumAreaSubscription;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumThreadSubscription;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.servlet.BaseUrl;
import fi.otavanopisto.muikku.session.CurrentUserSession;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/forum")
@RequestScoped
@Stateful
@Produces ("application/json")
public class ForumRESTService extends PluginRESTService {

  private static final long serialVersionUID = 687114723532731651L;

  @Inject
  @BaseUrl
  private String baseUrl;
  
  @Inject
  private Logger logger;
  
  @Inject
  private ForumController forumController;
  
  @Inject
  private ForumAreaSubsciptionController forumAreaSubscriptionController;
  
  @Inject
  private ForumThreadSubsciptionController forumThreadSubscriptionController;

  @Inject
  private SessionController sessionController;

  @Inject
  private CurrentUserSession currentUserSession;

  @Inject
  private ForumRESTModels restModels;
  
  @Inject
  private Event<ForumMessageSent> forumMessageSent;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  /**
   * GET mapi().forum.isAvailable
   * 
   * Returns whether environment level forum functionality is active and available for the currently logged in user.
   * 
   * Output: true|false
   */
  @GET
  @Path("/isAvailable")
  @RESTPermit(handling = Handling.INLINE)
  public Response getIsActive() {
    boolean available = forumController.isEnvironmentForumActive() && sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_ACCESSENVIRONMENTFORUM);
    return Response.ok(available).build();
  }

  @GET
  @Path ("/areagroups")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_LIST_FORUMAREAGROUPS)
  public Response listForumAreaGroups() {
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    List<ForumAreaGroup> groups = forumController.listForumAreaGroups();
    
    if (!groups.isEmpty()) {
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
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

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
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    ForumAreaGroup forumArea = forumController.createForumAreaGroup(newGroup.getName());
    
    ForumAreaGroupRESTModel result = new ForumAreaGroupRESTModel(forumArea.getId(), forumArea.getName()); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @DELETE
  @Path ("/areagroups/{AREAGROUPID}")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_DELETE_FORUMAREAGROUP)
  public Response archiveAreaGroup(@PathParam ("AREAGROUPID") Long areaGroupId) {
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    ForumAreaGroup forumAreaGroup = forumController.findForumAreaGroup(areaGroupId);
    
    forumController.archiveAreaGroup(forumAreaGroup);
    
    return Response.noContent().build();
  }
  
  @GET
  @Path ("/areas")
  @RESTPermit(handling = Handling.INLINE)
  public Response listForumAreas() {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build(); 
    }
    
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_ACCESSENVIRONMENTFORUM)) {
      return Response.status(Status.FORBIDDEN).entity("Forbidden").build(); 
    }
    
    // Permission to see the area is checked by controller here
    List<EnvironmentForumArea> forums = forumController.listEnvironmentForums();
    
    List<ForumAreaRESTModel> result = new ArrayList<ForumAreaRESTModel>();
    
    for (EnvironmentForumArea forum : forums) {
      Long numThreads = forumController.getThreadCount(forum);
      result.add(new ForumAreaRESTModel(forum.getId(), forum.getName(), forum.getDescription(), forum.getGroup() != null ? forum.getGroup().getId() : null, numThreads));
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
      
      if (!forumController.isEnvironmentForumActive()) {
        return Response.status(Status.FORBIDDEN).build();
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
            forumArea.getDescription(), forumArea.getGroup() != null ? forumArea.getGroup().getId() : null, numThreads); 
        
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

      if (!forumController.isEnvironmentForumActive()) {
        return Response.status(Status.FORBIDDEN).build();
      }

      if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_UPDATEENVIRONMENTFORUM)) {
        forumController.updateForumAreaName(forumArea, restModel.getName());
        forumController.updateForumAreaDescription(forumArea, restModel.getDescription());
        
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
  public Response archiveEnvironmentForumArea(@PathParam ("AREAID") Long areaId) {
    ForumArea forumArea = forumController.getForumArea(areaId);
    if (forumArea == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!(forumArea instanceof EnvironmentForumArea)) {
      logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (sessionController.hasPermission(MuikkuPermissions.OWNER, forumArea) || sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_DELETEENVIRONMENTFORUM)) {
      forumController.archiveArea(forumArea);
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    return Response.noContent().build();
  }
  
  @POST
  @Path ("/areas")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_CREATEENVIRONMENTFORUM)
  public Response createForumArea(ForumAreaRESTModel newForum) {
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    EnvironmentForumArea forumArea = forumController.createEnvironmentForumArea(newForum.getName(), newForum.getDescription(), newForum.getGroupId());
    
    ForumAreaRESTModel result = new ForumAreaRESTModel(forumArea.getId(), forumArea.getName(), forumArea.getDescription(), forumArea.getGroup() != null ? forumArea.getGroup().getId() : null, 0l); 
    
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
    
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_READ_ENVIRONMENT_MESSAGES)) {
      List<ForumThread> threads = forumController.listForumThreads(forumArea, firstResult, maxResults);
      
      List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();
      threads.forEach(thread -> result.add(restModels.restModel(thread)));
      
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
    
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_READ_ENVIRONMENT_MESSAGES)) {
      return Response.ok(restModels.restModel(thread)).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @GET
  @Path("/environmentAreaPermissions")
  @RESTPermit(handling = Handling.INLINE)
  public Response getEnvironmentAreaPermissions() {
    Object permissionObject = null; 
    if (sessionController.isLoggedIn()) {
      if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_ACCESSENVIRONMENTFORUM) && currentUserSession.isActive()) {
        List<EnvironmentForumArea> forumAreas = forumController.listEnvironmentForums();
        Map<Long, AreaPermission> areaPermissions = new HashMap<>();
        for (EnvironmentForumArea forumArea : forumAreas) {
          AreaPermission areaPermission = new AreaPermission(
              sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_EDIT_ENVIRONMENT_MESSAGES, forumArea),
              sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_DELETE_ENVIRONMENT_MESSAGES, forumArea));
          areaPermissions.put(forumArea.getId(), areaPermission);
        }
        permissionObject = areaPermissions;
      }
    }
    return Response.ok(permissionObject).build();
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
    
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    LockForumThread updThreadLock = updThread.getLock() != null ? LockForumThread.valueOf(updThread.getLock()) : null;
    if (sessionController.hasPermission(MuikkuPermissions.OWNER, forumThread) || sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_EDIT_ENVIRONMENT_MESSAGES)) {
      // User needs permission to change the value of these parameters
      if (!forumThread.getSticky().equals(updThread.getSticky()) || forumThread.getLocked() != updThreadLock) {
        if (!sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_LOCK_OR_STICKIFY_MESSAGES))
          return Response.status(Status.BAD_REQUEST).build();
      }
      
      forumController.updateForumThread(forumThread, 
          updThread.getTitle(),
          updThread.getMessage(),
          updThread.getSticky(), 
          updThreadLock);
      
      
      return Response.ok(
        restModels.restModel(forumThread)
      ).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @DELETE
  @Path ("/areas/{AREAID}/threads/{THREADID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response archiveThread(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId) {
    ForumThread thread = forumController.getForumThread(threadId);
    if (thread == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Forum thread (%d) not found", threadId)).build();
    }
    
    if (!(thread.getForumArea() instanceof EnvironmentForumArea)) {
      logger.severe(String.format("Trying to delete non environment forum thread (%d) from environment endpoint", thread.getId()));
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (sessionController.hasPermission(MuikkuPermissions.OWNER, thread) || sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_DELETE_ENVIRONMENT_MESSAGES)) {
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
   
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_WRITE_ENVIRONMENT_MESSAGES)) {
      LockForumThread lock = newThread.getLock() != null ? LockForumThread.valueOf(newThread.getLock()) : null;

      if (Boolean.TRUE.equals(newThread.getSticky()) || lock != null) {
        if (lock == LockForumThread.STUDENTS && userEntityController.isStudent(sessionController.getLoggedUserEntity())){
          return Response.status(Status.FORBIDDEN).build();
        }
        
        if (!sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_LOCK_OR_STICKIFY_MESSAGES))
          return Response.status(Status.BAD_REQUEST).build();
      }
      
      Document message = Jsoup.parse(Jsoup.clean(newThread.getMessage(), Safelist.relaxed().addTags("s")
              .addAttributes("a", "target")
              .addAttributes("img", "width", "height", "style")
              .addAttributes("i", "class")
              .addAttributes("span", "style")));
      message.outputSettings().escapeMode(EscapeMode.xhtml);
      message.select("a[target]").attr("rel", "noopener noreferer");

      ForumThread thread = forumController.createForumThread(
          forumArea, 
          newThread.getTitle(),
          message.body().toString(), 
          newThread.getSticky(), 
          lock);

      forumMessageSent.fire(new ForumMessageSent(forumArea.getId(), thread.getId(), null, sessionController.getLoggedUserEntity().getId(), baseUrl, null));
      
      return Response.ok(
        restModels.restModel(thread)
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
     
      if (!forumController.isEnvironmentForumActive()) {
        return Response.status(Status.FORBIDDEN).build();
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
      
      if (!forumController.isEnvironmentForumActive()) {
        return Response.status(Status.FORBIDDEN).build();
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
      
      if (!forumController.isEnvironmentForumActive()) {
        return Response.status(Status.FORBIDDEN).build();
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
  public Response archiveReply(
      @PathParam ("AREAID") Long areaId, 
      @PathParam ("THREADID") Long threadId, 
      @PathParam ("REPLYID") Long replyId,
      @DefaultValue ("false") @QueryParam ("permanent") Boolean permanent) {
    ForumThreadReply reply = forumController.getForumThreadReply(replyId);
    if (reply == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Forum thread reply (%d) not found", replyId)).build();
    }
    
    if (!(reply.getForumArea() instanceof EnvironmentForumArea)) {
      logger.severe(String.format("Trying to delete non environment forum thread reply (%d) from environment endpoint", reply.getId()));
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!permanent) {
      if (sessionController.hasPermission(MuikkuPermissions.OWNER, reply) || sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_DELETE_ENVIRONMENT_MESSAGES)) {
        forumController.updateReplyDeleted(reply, true);
        
        return Response.noContent().build();
      }
    } else {
      if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_DELETE_ENVIRONMENT_MESSAGES)) {
        forumController.archiveReply(reply);
        
        return Response.noContent().build();
      }
    }
    
    return Response.status(Status.FORBIDDEN).build();
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
      
      if (forumThread.getLocked() == LockForumThread.ALL || (forumThread.getLocked() == LockForumThread.STUDENTS && userEntityController.isStudent(sessionController.getLoggedUserEntity()))) {
        return Response.status(Status.BAD_REQUEST).entity("Forum thread is locked").build();
      }
      
      if (!(forumArea instanceof EnvironmentForumArea)) {
        logger.severe(String.format("Trying to post thread reply for to non environment area (%d) from environment endpoint", forumArea.getId()));
        return Response.status(Status.BAD_REQUEST).build();
      }
      
      if (!forumController.isEnvironmentForumActive()) {
        return Response.status(Status.FORBIDDEN).build();
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
        ForumThreadReply reply = forumController.createForumThreadReply(forumThread, newReply.getMessage(), parentReply);
        if (reply == null) {
          return Response.status(Status.BAD_REQUEST).entity("Couldn't create new reply").build();
        }
        forumMessageSent.fire(new ForumMessageSent(forumArea.getId(), forumThread.getId(), reply.getId(), sessionController.getLoggedUserEntity().getId(), baseUrl, null));

        return Response.ok(createRestModel(reply)).build();
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
    
    if (!forumController.isEnvironmentForumActive()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_READ_ENVIRONMENT_MESSAGES)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    List<ForumThread> threads = forumController.listLatestForumThreads(firstResult, maxResults);
    
    List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();
    
    for (ForumThread thread : threads) {
      String lock = thread.getLocked() != null ? thread.getLocked().name() : null;
      long numReplies = forumController.getThreadReplyCount(thread);
      ForumMessageUserRESTModel userRestModel = restModels.createUserRESTModel(thread.getCreator());
      result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), userRestModel, thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), lock, thread.getLockBy(), thread.getLockDate() ,thread.getUpdated(), numReplies, thread.getLastModified()));
    }
    
    return Response.ok(result).build();
  }
  
  private ForumThreadReplyRESTModel createRestModel(ForumThreadReply entity) {
    Long parentReplyId = null;
    String message = entity.getMessage();
    if (entity.getParentReply() != null) {
      parentReplyId = entity.getParentReply().getId();
    }
    
    if (entity.getDeleted()) {
      message = null;
    }
    
    ForumMessageUserRESTModel creatorRestModel = restModels.createUserRESTModel(entity.getCreator());
    return new ForumThreadReplyRESTModel(entity.getId(), message, creatorRestModel, entity.getCreated(), 
        entity.getForumArea().getId(), parentReplyId, entity.getLastModified(), entity.getChildReplyCount(), entity.getDeleted());
  }
  
  private List<ForumThreadReplyRESTModel> createRestModel(ForumThreadReply... entries) {
    List<ForumThreadReplyRESTModel> result = new ArrayList<>();

    for (ForumThreadReply entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }
  
  /**
   * mApi().forum.areas.toggleSubscription.create(2)
   * 
   * @param areaId
   * @return
   */
  @POST
  @Path("/areas/{AREAID}/toggleSubscription")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response toggleForumAreaSubscription(@PathParam ("AREAID") Long areaId) {
    try {
      ForumArea forumArea = forumController.getForumArea(areaId);
      if (forumArea == null) {
        return Response.status(Status.NOT_FOUND).entity("Forum area not found").build();
      }
      
      UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();
      ForumAreaSubscription forumAreaSubscription = forumAreaSubscriptionController.findByAreaAndUserEntity(forumArea, loggedUserEntity);
      if (forumAreaSubscription == null) {
        ForumAreaSubscription subscription = forumAreaSubscriptionController.createForumAreaSubsciption(forumArea, loggedUserEntity);
        return Response.ok(createAreaSubscriptionRestModel(subscription)).build();
      } else {
        forumAreaSubscriptionController.deleteSubscription(forumAreaSubscription);
        return Response.noContent().build();
      }
      
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Failed to create forum area subscription", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  /**
   * mApi().forum.subscriptionAreas.read(13)
   * 
   * @param userEntityId
   * @return
   * 
   * returns a list of user's subscripted threads
   */
  @GET
  @Path ("/subscriptionAreas/{USERID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listAreaSubscriptionsByUser(@PathParam("USERID") Long userId) {
    
    UserEntity userEntity = userEntityController.findUserEntityById(userId);
    
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("User entity not found").build();
    }
    
    if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_READ_ENVIRONMENT_MESSAGES)) {
      if (userEntityController.isStudent(sessionController.getLoggedUserEntity()) && !sessionController.getLoggedUserEntity().getId().equals(userEntity.getId())) {
        return Response.status(Status.FORBIDDEN).entity("You can list your own subscriptions only").build();
      }
      return Response.ok(createAreaSubscriptionRestModel(forumAreaSubscriptionController.listByUser(userEntity).toArray(new ForumAreaSubscription[0]))).build();
    } else
      return Response.status(Status.FORBIDDEN).build();
  }
  
  private ForumAreaSubscriptionRESTModel createAreaSubscriptionRestModel(ForumAreaSubscription entity) {
    
    Long workspaceEntityId = null;
    String workspaceUrlName = null;
    String workspaceName = null;
    
    WorkspaceForumArea workspaceForumArea = forumController.findByAreaId(entity.getForumArea().getId());

    if (workspaceForumArea != null) {
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceForumArea.getWorkspace());
      if (workspaceEntity != null) {
        workspaceEntityId = workspaceEntity.getId();
        workspaceUrlName = workspaceEntity.getUrlName();
        workspaceName = workspaceEntityController.getName(workspaceEntity).getDisplayName();
      }
    }
    ForumArea forumArea = entity.getForumArea();
    Long numThreads = forumController.getThreadCount(forumArea);
    
    ForumAreaRESTModel area = new ForumAreaRESTModel(forumArea.getId(), forumArea.getName(), 
        forumArea.getDescription(), forumArea.getGroup() != null ? forumArea.getGroup().getId() : null, numThreads); 
    
    return new ForumAreaSubscriptionRESTModel(entity.getId(), entity.getForumArea().getId(), entity.getUser(), area, workspaceEntityId, workspaceUrlName, workspaceName);
  }
  
  private List<ForumAreaSubscriptionRESTModel> createAreaSubscriptionRestModel(ForumAreaSubscription... entries) {
    List<ForumAreaSubscriptionRESTModel> result = new ArrayList<>();

    for (ForumAreaSubscription entry : entries) {
      result.add(createAreaSubscriptionRestModel(entry));
    }

    return result;
  }
  
  /**
   * mApi().forum.areas.threads.toggleSubscription.create(2,5)
   * 
   * @param areaId
   * @param threadId
   * @return
   */
  @POST
  @Path("/areas/{AREAID}/threads/{THREADID}/toggleSubscription")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response toggleForumThreadSubscription(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId) {
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
      
      UserEntity loggedUSerEntity = sessionController.getLoggedUserEntity();
      ForumThreadSubscription forumThreadSubscription = forumThreadSubscriptionController.findByThreadAndUserEntity(forumThread, loggedUSerEntity);
      if (forumThreadSubscription == null) {
        ForumThreadSubscription forumSubscription = forumThreadSubscriptionController.createForumThreadSubsciption(forumThread, loggedUSerEntity);
        return Response.ok(createThreadSubscriptionRestModel(forumSubscription)).build();
      } else {
        forumThreadSubscriptionController.deleteSubscription(forumThreadSubscription);
        return Response.noContent().build();
      }
      
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Failed to create forum thread subscription", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  /**
   * mApi().forum.subscriptions.threads.read(13)
   * 
   * @param userEntityId
   * @return
   * 
   * returns a list of user's subscripted threads
   */
  @GET
  @Path ("/subscriptionThreads/{USERID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listThreadSubscriptionsByUser(@PathParam("USERID") Long userId) {
    
    UserEntity userEntity = userEntityController.findUserEntityById(userId);
    
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("User entity not found").build();
    }
    
    if (sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_READ_ENVIRONMENT_MESSAGES)) {
      if (userEntityController.isStudent(sessionController.getLoggedUserEntity()) && !sessionController.getLoggedUserEntity().getId().equals(userEntity.getId())) {
        return Response.status(Status.FORBIDDEN).entity("You can list your own subscriptions only").build();
      }
      return Response.ok(createThreadSubscriptionRestModel(forumThreadSubscriptionController.listByUser(userEntity).toArray(new ForumThreadSubscription[0]))).build();
    } else
      return Response.status(Status.FORBIDDEN).build();
  }
  
  private ForumThreadSubscriptionRESTModel createThreadSubscriptionRestModel(ForumThreadSubscription entity) {
    Long workspaceEntityId = null;
    String workspaceUrlName = null;
    String workspaceName = null;
    
    WorkspaceForumArea workspaceForumArea = forumController.findByAreaId(entity.getForumThread().getForumArea().getId());

    if (workspaceForumArea != null) {
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceForumArea.getWorkspace());
      if (workspaceEntity != null) {
        workspaceEntityId = workspaceEntity.getId();
        workspaceUrlName = workspaceEntity.getUrlName();
        workspaceName = workspaceEntityController.getName(workspaceEntity).getDisplayName();
      }
    }
    ForumThreadRESTModel threadRest = restModels.restModel(entity.getForumThread());
    
    return new ForumThreadSubscriptionRESTModel(entity.getId(), entity.getForumThread().getId(), entity.getUser(), threadRest, workspaceEntityId, workspaceUrlName, workspaceName);
  }
  
  private List<ForumThreadSubscriptionRESTModel> createThreadSubscriptionRestModel(ForumThreadSubscription... entries) {
    List<ForumThreadSubscriptionRESTModel> result = new ArrayList<>();

    for (ForumThreadSubscription entry : entries) {
      result.add(createThreadSubscriptionRestModel(entry));
    }

    return result;
  }

  public static class AreaPermission {

    public AreaPermission(Boolean editMessages, Boolean removeThread) {
      this.editMessages = editMessages;
      this.removeThread = removeThread;
    }

    public Boolean getRemoveThread() {
      return removeThread;
    }

    public Boolean getEditMessages() {
      return editMessages;
    }

    private final Boolean editMessages;
    private final Boolean removeThread;
  }
}
