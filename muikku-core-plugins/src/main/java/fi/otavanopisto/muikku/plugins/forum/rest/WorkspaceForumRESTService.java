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
import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities.EscapeMode;
import org.jsoup.safety.Whitelist;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.forum.ForumController;
import fi.otavanopisto.muikku.plugins.forum.ForumResourcePermissionCollection;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumMessage;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThreadReply;
import fi.otavanopisto.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path("/workspace")
public class WorkspaceForumRESTService extends PluginRESTService {

  private static final long serialVersionUID = 5295688968589424274L;

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
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas")
  @RESTPermit(handling = Handling.INLINE)
  public Response listWorkspaceForumAreas(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }
    
    if (!sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_LIST_WORKSPACE_FORUM, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN)
         .build();
    }
    
    List<WorkspaceForumArea> workspaceForumAreas = forumController.listWorkspaceForumAreas(workspaceEntity);
    
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
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas/{AREAID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response findWorkspaceArea(@Context Request request, @PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId) {
    ForumArea forumArea = forumController.getForumArea(areaId);
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }
    
    if (forumArea != null) {
      if (!(forumArea instanceof WorkspaceForumArea)) {
        logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
        return Response.status(Status.NOT_FOUND).build();
      }
      
      if (!workspaceEntity.getId().equals(((WorkspaceForumArea) forumArea).getWorkspace())) {
        return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceForumArea %d does not belong to workspace entity %d", forumArea.getId(), workspaceEntity.getId())).build();
      }
      
      if (sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_ACCESSWORKSPACEFORUMS, workspaceEntity)) {
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
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas/{AREAID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateArea(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId, ForumAreaRESTModel restModel) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }
    
    ForumArea forumArea = forumController.getForumArea(areaId);
    
    if (forumArea != null) {
      if (!(forumArea instanceof WorkspaceForumArea)) {
        logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
        return Response.status(Status.NOT_FOUND).build();
      }
      
      if (!workspaceEntity.getId().equals(((WorkspaceForumArea) forumArea).getWorkspace())) {
        return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceForumArea %d does not belong to workspace entity %d", forumArea.getId(), workspaceEntity.getId())).build();
      }

      if (sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_UPDATEWORKSPACEFORUM, workspaceEntity)) {
        forumController.updateForumAreaName(forumArea, restModel.getName());
        return Response.noContent().build();
      } else {
        return Response.status(Status.FORBIDDEN).build();
      }
    } else {
      return Response.status(Status.NOT_FOUND).build();
    }
  }
  
  @DELETE
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas/{AREAID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response deleteWorkspaceForumArea(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }
    
    ForumArea forumArea = forumController.getForumArea(areaId);
    if (!(forumArea instanceof WorkspaceForumArea)) {
      logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!workspaceEntity.getId().equals(((WorkspaceForumArea) forumArea).getWorkspace())) {
      return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceForumArea %d does not belong to workspace entity %d", forumArea.getId(), workspaceEntity.getId())).build();
    }

    if (sessionController.hasPermission(MuikkuPermissions.OWNER, forumArea) || sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_DELETEWORKSPACEFORUM, workspaceEntity)) {
      forumController.deleteArea(forumArea);
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    return Response.noContent().build();
  }
  
  @POST
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas")
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
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas/{AREAID}/threads")
  @RESTPermit(handling = Handling.INLINE)
  public Response listThreads(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId, @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {

    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }

    ForumArea forumArea = forumController.getForumArea(areaId);
    if (forumArea == null) {
      return Response.status(Status.NOT_FOUND).entity("Forum area not found").build();
    }
    
    if (!(forumArea instanceof WorkspaceForumArea)) {
      logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!workspaceEntity.getId().equals(((WorkspaceForumArea) forumArea).getWorkspace())) {
      return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceForumArea %d does not belong to workspace entity %d", forumArea.getId(), workspaceEntity.getId())).build();
    }

    if (sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_READ_WORKSPACE_MESSAGES, workspaceEntity)) {
      List<ForumThread> threads = forumController.listForumThreads(forumArea, firstResult, maxResults);
      
      List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();
      
      for (ForumThread thread : threads) {
        long numReplies = forumController.getThreadReplyCount(thread);
        result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated(), numReplies, thread.getLastModified()));
      }
      
      return Response.ok(
        result
      ).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @GET
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas/{AREAID}/threads/{THREADID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response findThread(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }

    ForumThread thread = forumController.getForumThread(threadId);
    if (thread == null) {
      return Response.status(Status.NOT_FOUND).entity("Forum thread not found").build();
    }
    
    ForumArea forumArea = thread.getForumArea();
    if (!(forumArea instanceof WorkspaceForumArea)) {
      logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!workspaceEntity.getId().equals(((WorkspaceForumArea) forumArea).getWorkspace())) {
      return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceForumArea %d does not belong to workspace entity %d", forumArea.getId(), workspaceEntity.getId())).build();
    }

    if (sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_READ_WORKSPACE_MESSAGES, workspaceEntity)) {
      long numReplies = forumController.getThreadReplyCount(thread);
      ForumThreadRESTModel result = new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated(), numReplies, thread.getLastModified());
      
      return Response.ok(
        result
      ).build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @PUT
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas/{AREAID}/threads/{THREADID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateThread(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, ForumThreadRESTModel updThread) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }

    ForumThread forumThread = forumController.getForumThread(threadId);
    if (forumThread == null) {
      return Response.status(Status.NOT_FOUND).entity("Forum thread not found").build();
    }
    
    ForumArea forumArea = forumController.getForumArea(areaId);
    if (forumArea == null) {
      return Response.status(Status.NOT_FOUND).entity("Forum area not found").build();
    }
    
    if (!(forumArea instanceof WorkspaceForumArea)) {
      logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!workspaceEntity.getId().equals(((WorkspaceForumArea) forumArea).getWorkspace())) {
      return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceForumArea %d does not belong to workspace entity %d", forumArea.getId(), workspaceEntity.getId())).build();
    }
    
    if (!forumArea.getId().equals(forumThread.getForumArea().getId())) {
      return Response.status(Status.NOT_FOUND).entity("Forum thread not found from the specified area").build();
    }
    
    if (!forumThread.getId().equals(threadId)) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (sessionController.hasPermission(MuikkuPermissions.OWNER, forumThread) || sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_EDIT_WORKSPACE_MESSAGES, workspaceEntity)) {
      if (Boolean.TRUE.equals(updThread.getSticky()) || Boolean.TRUE.equals(updThread.getLocked())) {
        if (!sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_LOCK_OR_STICKIFY_WORKSPACE_MESSAGES, workspaceEntity))
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
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas/{AREAID}/threads/{THREADID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response deleteThread(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }

    ForumThread thread = forumController.getForumThread(threadId);
    if (thread == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Forum thread (%d) not found", threadId)).build();
    }
    
    ForumArea forumArea = thread.getForumArea();
    if (!(forumArea instanceof WorkspaceForumArea)) {
      logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!workspaceEntity.getId().equals(((WorkspaceForumArea) forumArea).getWorkspace())) {
      return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceForumArea %d does not belong to workspace entity %d", forumArea.getId(), workspaceEntity.getId())).build();
    }

    if (sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_DELETE_WORKSPACE_MESSAGES, workspaceEntity)) {
      forumController.archiveThread(thread);
      return Response.noContent().build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @POST
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas/{AREAID}/threads")
  @RESTPermit(handling = Handling.INLINE)
  public Response createThread(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId, ForumThreadRESTModel newThread) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }

    ForumArea forumArea = forumController.getForumArea(areaId);
    if (forumArea == null) {
      return Response.status(Status.NOT_FOUND).entity("Forum area not found").build();
    } 
    
    if (!(forumArea instanceof WorkspaceForumArea)) {
      logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!workspaceEntity.getId().equals(((WorkspaceForumArea) forumArea).getWorkspace())) {
      return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceForumArea %d does not belong to workspace entity %d", forumArea.getId(), workspaceEntity.getId())).build();
    }

    if (sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_WRITE_WORKSPACE_MESSAGES, workspaceEntity)) {
      if (Boolean.TRUE.equals(newThread.getSticky()) || Boolean.TRUE.equals(newThread.getLocked())) {
        if (!sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_LOCK_OR_STICKIFY_WORKSPACE_MESSAGES, workspaceEntity))
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
  @Path ("/workspaces/{WORKSPACEID}/forumLatest")
  @RESTPermit(handling = Handling.INLINE)
  public Response listLatestThreadsFromWorkspace(
      @PathParam ("WORKSPACEID") Long workspaceEntityId, 
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }
    
    if (!sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_READ_WORKSPACE_MESSAGES, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    List<ForumThread> threads = forumController.listLatestForumThreadsFromWorkspace(workspaceEntity, firstResult, maxResults);
    
    List<ForumThreadRESTModel> result = new ArrayList<ForumThreadRESTModel>();
    
    for (ForumThread thread : threads) {
      long numReplies = forumController.getThreadReplyCount(thread);
      result.add(new ForumThreadRESTModel(thread.getId(), thread.getTitle(), thread.getMessage(), thread.getCreator(), thread.getCreated(), thread.getForumArea().getId(), thread.getSticky(), thread.getLocked(), thread.getUpdated(), numReplies, thread.getLastModified()));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas/{AREAID}/threads/{THREADID}/replies")
  @RESTPermit(handling = Handling.INLINE)
  public Response listReplies(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId,  
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }
    
    try {
      ForumArea forumArea = forumController.getForumArea(areaId);
      if (forumArea == null) {
        return Response.status(Status.NOT_FOUND).entity("Forum area not found").build();
      }
      
      ForumThread forumThread = forumController.getForumThread(threadId);
      if (forumThread == null) {
        return Response.status(Status.NOT_FOUND).entity("Forum thread not found").build();
      } 
      
      if (!(forumArea instanceof WorkspaceForumArea)) {
        logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
        return Response.status(Status.NOT_FOUND).build();
      }
      
      if (!workspaceEntity.getId().equals(((WorkspaceForumArea) forumArea).getWorkspace())) {
        return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceForumArea %d does not belong to workspace entity %d", forumArea.getId(), workspaceEntity.getId())).build();
      }
      
      if (sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_READ_WORKSPACE_MESSAGES, workspaceEntity)) {
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
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas/{AREAID}/threads/{THREADID}/replies/{REPLYID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response findReply(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, @PathParam ("REPLYID") Long replyId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }
    
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
      
      if (!(forumArea instanceof WorkspaceForumArea)) {
        logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
        return Response.status(Status.NOT_FOUND).build();
      }

      if (!workspaceEntity.getId().equals(((WorkspaceForumArea) forumArea).getWorkspace())) {
        return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceForumArea %d does not belong to workspace entity %d", forumArea.getId(), workspaceEntity.getId())).build();
      }

      if (sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_READ_WORKSPACE_MESSAGES, workspaceEntity)) {
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
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas/{AREAID}/threads/{THREADID}/replies/{REPLYID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateReply(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, @PathParam ("REPLYID") Long replyId, ForumThreadReplyRESTModel reply) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }
    
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
      
      if (!(forumArea instanceof WorkspaceForumArea)) {
        logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
        return Response.status(Status.NOT_FOUND).build();
      }

      if (!workspaceEntity.getId().equals(((WorkspaceForumArea) forumArea).getWorkspace())) {
        return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceForumArea %d does not belong to workspace entity %d", forumArea.getId(), workspaceEntity.getId())).build();
      }

      if (sessionController.hasPermission(MuikkuPermissions.OWNER, threadReply) ||
          sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_EDIT_WORKSPACE_MESSAGES, workspaceEntity)) {
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
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas/{AREAID}/threads/{THREADID}/replies/{REPLYID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response deleteReply(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, @PathParam ("REPLYID") Long replyId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }
    
    ForumThreadReply reply = forumController.getForumThreadReply(replyId); 

    ForumArea forumArea = reply.getForumArea();
    if (!(forumArea instanceof WorkspaceForumArea)) {
      logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!workspaceEntity.getId().equals(((WorkspaceForumArea) forumArea).getWorkspace())) {
      return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceForumArea %d does not belong to workspace entity %d", forumArea.getId(), workspaceEntity.getId())).build();
    }

    if (sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_DELETE_WORKSPACE_MESSAGES, workspaceEntity)) {
      forumController.archiveReply(reply);
      return Response.noContent().build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
  @POST
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumAreas/{AREAID}/threads/{THREADID}/replies")
  @RESTPermit(handling = Handling.INLINE)
  public Response createReply(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("AREAID") Long areaId, @PathParam ("THREADID") Long threadId, ForumThreadReplyRESTModel newReply) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }
    
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
      
      if (!(forumArea instanceof WorkspaceForumArea)) {
        logger.severe(String.format("Trying to access forum %d via incorrect REST endpoint", forumArea.getId()));
        return Response.status(Status.NOT_FOUND).build();
      }

      if (!workspaceEntity.getId().equals(((WorkspaceForumArea) forumArea).getWorkspace())) {
        return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceForumArea %d does not belong to workspace entity %d", forumArea.getId(), workspaceEntity.getId())).build();
      }

      if (sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_WRITE_WORKSPACE_MESSAGES, workspaceEntity)) {
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
  @Path ("/workspaces/{WORKSPACEENTITYID}/forumStatistics")
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
    
    if (!sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_FINDWORKSPACE_USERSTATISTICS, workspaceEntity)) {
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
