package fi.otavanopisto.muikku.plugins.forum.rest;

import java.util.ArrayList;
import java.util.List;
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
import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.forum.ForumController;
import fi.otavanopisto.muikku.plugins.forum.ForumResourcePermissionCollection;
import fi.otavanopisto.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumAreaGroup;
import fi.otavanopisto.muikku.plugins.forum.model.ForumMessage;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThreadReply;
import fi.otavanopisto.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.otavanopisto.muikku.plugins.forum.rest.ForumAreaGroupRESTModel;
import fi.otavanopisto.muikku.plugins.forum.rest.ForumAreaRESTModel;
import fi.otavanopisto.muikku.plugins.forum.rest.ForumThreadRESTModel;
import fi.otavanopisto.muikku.plugins.forum.rest.ForumThreadReplyRESTModel;
import fi.otavanopisto.muikku.plugins.forum.rest.WorkspaceForumAreaRESTModel;
import fi.otavanopisto.muikku.plugins.forum.rest.WorkspaceForumUserStatisticsRESTModel;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
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
  private Logger logger;
  
  @Inject
  private ForumController forumController;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private UserEntityController userEntityController;
  
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
        Long numThreads = forumController.getThreadCount(forum);

        result.add(new ForumAreaRESTModel(forum.getId(), forum.getName(), forum.getGroup() != null ? forum.getGroup().getId() : null, numThreads));
      }
      
      return Response.ok(
        result
      ).build();
    } else {
      return Response.noContent().build();
    }
  }

  @GET
  @Path ("/workspace/{WORKSPACEID}/areas")
  @RESTPermit(handling = Handling.INLINE)
  public Response listWorkspaceForumAreas(@PathParam ("WORKSPACEID") Long workspaceId) throws AuthorizationException {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
    
    List<WorkspaceForumArea> workspaceForumAreas = forumController.listCourseForums(workspaceEntity);
    
    List<WorkspaceForumAreaRESTModel> result = new ArrayList<WorkspaceForumAreaRESTModel>();
    
    for (WorkspaceForumArea forum : workspaceForumAreas) {
      Long numThreads = forumController.getThreadCount(forum);

      result.add(new WorkspaceForumAreaRESTModel(forum.getId(), forum.getWorkspace(), forum.getName(), 
          forum.getGroup() != null ? forum.getGroup().getId() : null, numThreads));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/areas/{AREAID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response findArea(@Context Request request, @PathParam ("AREAID") Long areaId) throws AuthorizationException {
    ForumArea forumArea = forumController.getForumArea(areaId);
    
    if (forumArea != null) {
      if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_LISTFORUM, forumArea)) {
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
  public Response updateArea( 
      @PathParam ("AREAID") Long areaId,
      ForumAreaRESTModel restModel) {
    ForumArea forumArea = forumController.getForumArea(areaId);
    
    if (forumArea != null) {
      if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_UPDATEFORUM, forumArea)) {
        
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
  public Response deleteEnvironmentForumArea(@PathParam ("AREAID") Long areaId) throws AuthorizationException {
    ForumArea forumArea = forumController.getForumArea(areaId);
    if (sessionController.hasPermission(MuikkuPermissions.OWNER, forumArea) || sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_DELETEENVIRONMENTFORUM, forumArea)) {
      forumController.deleteArea(forumArea);
    }
    else {
      return Response.status(Status.FORBIDDEN).build();
    }
    return Response.noContent().build();
  }

  @DELETE
  @Path ("/workspace/{WORKSPACEENTITYID}/areas/{AREAID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response deleteWorkspaceForumArea(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId) throws AuthorizationException {
    ForumArea forumArea = forumController.getForumArea(areaId);
    if (sessionController.hasPermission(MuikkuPermissions.OWNER, forumArea) || sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_DELETEWORKSPACEFORUM, forumArea)) {
      forumController.deleteArea(forumArea);
    }
    else {
      return Response.status(Status.FORBIDDEN).build();
    }
    return Response.noContent().build();
  }
  
  @POST
  @Path ("/areas")
  @RESTPermit(ForumResourcePermissionCollection.FORUM_CREATEENVIRONMENTFORUM)
  public Response createForumArea(ForumAreaRESTModel newForum) throws AuthorizationException {
    EnvironmentForumArea forumArea = forumController.createEnvironmentForumArea(newForum.getName(), newForum.getGroupId());
    
    ForumAreaRESTModel result = new ForumAreaRESTModel(forumArea.getId(), forumArea.getName(), forumArea.getGroup() != null ? forumArea.getGroup().getId() : null, 0l); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @POST
  @Path ("/workspace/{WORKSPACEENTITYID}/areas")
  @RESTPermit(handling = Handling.INLINE)
  public Response createWorkspaceForumArea(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @QueryParam ("sourceWorkspaceEntityId") Long sourceWorkspaceEntityId, ForumAreaRESTModel newForum) {
    if (sourceWorkspaceEntityId == null) {
      // Create workspace forum area
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      if (workspaceEntity == null) {
        return Response.status(Status.NOT_FOUND).build();
      }
      
      if (!sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_CREATEWORKSPACEFORUM, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
      
      if (StringUtils.isBlank(newForum.getName())) {
        return Response.status(Status.BAD_REQUEST).entity("Name is required").build();
      }
      
      WorkspaceForumArea workspaceForumArea = forumController.createWorkspaceForumArea(workspaceEntity, newForum.getName(), newForum.getGroupId());
      
      Long numThreads = forumController.getThreadCount(workspaceForumArea);
      
      WorkspaceForumAreaRESTModel result = new WorkspaceForumAreaRESTModel(
          workspaceForumArea.getId(), workspaceForumArea.getWorkspace(), workspaceForumArea.getName(), 
          workspaceForumArea.getGroup() != null ? workspaceForumArea.getGroup().getId() : null, numThreads); 
      
      return Response.ok(result).build();
    }
    else {

      // Copy workspace areas from source
      
      // Access
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.COPY_WORKSPACE)) {
        return Response.status(Status.FORBIDDEN).build();
      }
      
      // Source
      
      WorkspaceEntity sourceWorkspace = workspaceEntityController.findWorkspaceEntityById(sourceWorkspaceEntityId);
      if (sourceWorkspace == null) {
        return Response.status(Status.BAD_REQUEST).entity("null source workspace").build();
      }
      
      // Target

      WorkspaceEntity targetWorkspace = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      if (targetWorkspace == null) {
        return Response.status(Status.BAD_REQUEST).entity("null target workspace").build();
      }
      
      // Copy
      
      forumController.copyWorkspaceForumAreas(sourceWorkspace, targetWorkspace);
      
      // Done
      
      return Response.noContent().build();
    }
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
        long numReplies = forumController.getThreadReplyCount(thread);
        result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated(), numReplies));
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
      long numReplies = forumController.getThreadReplyCount(thread);
      ForumThreadRESTModel result = new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated(), numReplies);
      
      return Response.ok(
        result
      ).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @PUT
  @Path ("/areas/{AREAID}/threads/{THREADID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateThread(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, ForumThreadRESTModel updThread) throws AuthorizationException {
    ForumThread forumThread = forumController.getForumThread(threadId);
    
    ForumArea forumArea = forumController.getForumArea(areaId);
    if (forumArea == null) {
      return Response.status(Status.NOT_FOUND).entity("Forum area not found").build();
    }

    if (forumThread == null) {
      return Response.status(Status.NOT_FOUND).entity("Forum thread not found").build();
    }
    
    if (!forumArea.getId().equals(forumThread.getForumArea().getId())) {
      return Response.status(Status.NOT_FOUND).entity("Forum thread not found from the specified area").build();
    }
    
    if (!forumThread.getId().equals(threadId)) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (sessionController.hasPermission(MuikkuPermissions.OWNER, forumThread) ||
        sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_EDITMESSAGES, forumThread)) {
      forumController.updateForumThread(forumThread, 
          updThread.getTitle(),
          updThread.getMessage(),
          updThread.getSticky(), 
          updThread.getLocked());
      
      long numReplies = forumController.getThreadReplyCount(forumThread);
      ForumThreadRESTModel result = new ForumThreadRESTModel(forumThread.getId(), forumThread.getTitle(), 
          forumThread.getMessage(), forumThread.getCreator(), forumThread.getCreated(), forumThread.getForumArea().getId(), 
          forumThread.getSticky(), forumThread.getLocked(), forumThread.getUpdated(), numReplies);
      
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
          Jsoup.clean(newThread.getMessage(), Whitelist.relaxed()), 
          newThread.getSticky(), 
          newThread.getLocked());
  
      ForumThreadRESTModel result = new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated(), 1l);
      
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
//    ForumThread forumThread = forumController.getForumThread(threadId);
//
//    if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_READMESSAGES, forumThread)) {
//      List<ForumThreadReply> replies = forumController.listForumThreadReplies(forumThread, firstResult, maxResults);
//      
//      List<ForumThreadReplyRESTModel> result = new ArrayList<ForumThreadReplyRESTModel>();
//      
//      for (ForumThreadReply reply : replies) {
//        result.add(new ForumThreadReplyRESTModel(reply.getId(), reply.getMessage(), reply.getCreator(), reply.getCreated(), reply.getForumArea().getId()));
//      }
//      
//      return Response.ok(
//        result
//      ).build();
//    } else {
//      return Response.status(Status.FORBIDDEN).build();
    try {
      ForumArea forumArea = forumController.getForumArea(areaId);
      if (forumArea == null) {
        return Response.status(Status.NOT_FOUND).entity("Forum area not found").build();
      }
      
      ForumThread forumThread = forumController.getForumThread(threadId);
      if (forumThread == null) {
        return Response.status(Status.NOT_FOUND).entity("Forum thread not found").build();
      }
      
      if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_READMESSAGES, forumThread)) {
        if (!forumArea.getId().equals(forumThread.getForumArea().getId())) {
          return Response.status(Status.NOT_FOUND).entity("Forum thread not found from the specified area").build();
        }
        
        List<ForumThreadReply> replies = forumController.listForumThreadReplies(forumThread, firstResult, maxResults);
        if (replies.isEmpty()) {
          return Response.noContent().build();
        }
        
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
  public Response findReply(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, @PathParam ("REPLYID") Long replyId) throws AuthorizationException {
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
      
      if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_READMESSAGES, threadReply.getForumArea())) {
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
      ForumThreadReplyRESTModel reply) throws AuthorizationException {
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
      
      if (sessionController.hasPermission(MuikkuPermissions.OWNER, threadReply) ||
          sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_EDITMESSAGES, threadReply.getForumArea())) {
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
  public Response deleteReply(@PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, @PathParam ("REPLYID") Long replyId) throws AuthorizationException {
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
      if (sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_WRITEMESSAGES, forumThread)) {      
        ForumThreadReply parentReply = null;
        
        if (newReply.getParentReplyId() != null) {
          parentReply = forumController.getForumThreadReply(newReply.getParentReplyId());
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
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) throws AuthorizationException {
    List<ForumThread> threads = forumController.listLatestForumThreads(firstResult, maxResults);
    
    List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();
    
    for (ForumThread thread : threads) {
      long numReplies = forumController.getThreadReplyCount(thread);
      result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated(), numReplies));
    }
    
    return Response.ok(
      result
    ).build();
  }

  @GET
  @Path ("/workspace/{WORKSPACEID}/latest")
  @RESTPermit(handling = Handling.INLINE)
  public Response listLatestThreadsFromWorkspace(
      @PathParam ("WORKSPACEID") Long workspaceId, 
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) throws AuthorizationException {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
    
    List<ForumThread> threads = forumController.listLatestForumThreadsFromWorkspace(workspaceEntity, firstResult, maxResults);
    
    List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();
    
    for (ForumThread thread : threads) {
      long numReplies = forumController.getThreadReplyCount(thread);
      result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated(), numReplies));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/workspace/{WORKSPACEENTITYID}/statistics")
  @RESTPermit(handling = Handling.INLINE)
  public Response getWorkspaceForumStatistics(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @QueryParam ("userIdentifier") String userId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d could not be found", workspaceEntityId)).build();
    }

    SchoolDataIdentifier userIdentifier = null;
    
    if (StringUtils.isNotBlank(userId)) {
      userIdentifier = SchoolDataIdentifier.fromId(userId);
    }
    
    if (userIdentifier == null) {
      return Response.status(Status.NOT_IMPLEMENTED).entity("Listing forum statistics for all users is not implemented yet").build();
    }
    
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(userIdentifier);
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid userIdentifier").build();
    }
    
    if (!sessionController.hasCoursePermission(ForumResourcePermissionCollection.FORUM_FINDWORKSPACE_USERSTATISTICS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    Long messageCount = forumController.countUserEntityWorkspaceMessages(workspaceEntity, userEntity);
    ForumMessage latestMessage = forumController.findUserEntitysLatestWorkspaceMessage(workspaceEntity, userEntity);
    
    return Response
      .ok(new WorkspaceForumUserStatisticsRESTModel(messageCount, latestMessage != null ? latestMessage.getCreated() : null))
      .build();
  }
  
  private ForumThreadReplyRESTModel createRestModel(ForumThreadReply entity) {
    Long parentReplyId = null;
    if (entity.getParentReply() != null) {
      parentReplyId = entity.getParentReply().getId();
    }
    return new ForumThreadReplyRESTModel(entity.getId(), entity.getMessage(), entity.getCreator(), entity.getCreated(), entity.getForumArea().getId(), parentReplyId);
  }
  
  private List<ForumThreadReplyRESTModel> createRestModel(ForumThreadReply... entries) {
    List<ForumThreadReplyRESTModel> result = new ArrayList<>();

    for (ForumThreadReply entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }
  
}
