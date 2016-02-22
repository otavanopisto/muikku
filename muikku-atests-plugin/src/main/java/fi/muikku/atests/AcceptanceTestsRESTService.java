package fi.muikku.atests;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.controller.TagController;
import fi.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.muikku.model.base.Tag;
import fi.muikku.model.security.WorkspaceRolePermission;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.users.UserGroupUserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.notifier.NotifierController;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.announcer.AnnouncementController;
import fi.muikku.plugins.announcer.model.Announcement;
import fi.muikku.plugins.communicator.CommunicatorController;
import fi.muikku.plugins.communicator.CommunicatorNewInboxMessageNotification;
import fi.muikku.plugins.communicator.CommunicatorPermissionCollection;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.muikku.plugins.communicator.model.InboxCommunicatorMessage;
import fi.muikku.plugins.communicator.rest.CommunicatorMessageRESTModel;
import fi.muikku.plugins.forum.ForumController;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumAreaGroup;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.muikku.plugins.search.UserIndexer;
import fi.muikku.plugins.search.WorkspaceIndexer;
import fi.muikku.plugins.websocket.WebSocketMessenger;
import fi.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.rest.model.UserGroup;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.plugins.evaluation.EvaluationController;
import fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;
import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserGroupController;
import fi.muikku.users.UserGroupEntityController;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Path("/test")
@Stateful
@Produces("application/json")
@Consumes("application/json")
public class AcceptanceTestsRESTService extends PluginRESTService {

  private static final long serialVersionUID = 4192161644908642797L;

  @Inject
  @LocalSession
  private LocalSessionController localSessionController;
  
  @Inject
  private Logger logger;
  
  @Inject
  private CommunicatorController communicatorController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private PyramusUpdater pyramusUpdater;
  
  @Inject
  private HtmlMaterialController htmlMaterialController; 

  @Inject
  private WorkspaceMaterialController workspaceMaterialController; 

  @Inject
  private WorkspaceRolePermissionDAO workspaceRolePermissionDAO;

  @Inject
  private EvaluationController evaluationController;
  
  @Inject
  private ForumController forumController;

  @Inject
  private Event<SchoolDataWorkspaceDiscoveredEvent> schoolDataWorkspaceDiscoveredEvent;

  @Inject
  private UserIndexer userIndexer;
  
  @Inject
  private WorkspaceIndexer workspaceIndexer;

  @Inject
  private AnnouncementController announcementController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private TagController tagController;
  
  @Inject
  private NotifierController notifierController;
  
  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @Inject
  private CommunicatorNewInboxMessageNotification communicatorNewInboxMessageNotification;
  
  @GET
  @Path("/login")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_login(@QueryParam ("role") String role) {
    logger.log(Level.INFO, "Acceptance tests plugin logging in with role " + role);
    
    switch (role) {
      case "ENVIRONMENT-STUDENT":
        localSessionController.login("PYRAMUS", "STUDENT-1");
      break;
      case "ENVIRONMENT-TEACHER":
        localSessionController.login("PYRAMUS", "STAFF-2");
      break;
      case "ENVIRONMENT-MANAGER":
        localSessionController.login("PYRAMUS", "STAFF-3");
      break;
      case "ENVIRONMENT-ADMINISTRATOR":
        localSessionController.login("PYRAMUS", "STAFF-4");
      break;
      case "ENVIRONMENT-TRUSTED_SYSTEM":
        localSessionController.login("PYRAMUS", "STAFF-5");
      break;
      
      case "PSEUDO-EVERYONE":
        // Do nothing
      break;
      
    }
    
    return Response.ok().build();
  }
  
  @GET
  @Path("/reindex")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_reindex() {
    logger.log(Level.INFO, "Acceptance tests plugin reindex task started.");

    List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listWorkspaceEntities();
    for (int i = 0; i < workspaceEntities.size(); i++) {
      WorkspaceEntity workspaceEntity = workspaceEntities.get(i);
      
      workspaceIndexer.indexWorkspace(workspaceEntity);
    }

    logger.log(Level.INFO, "Reindexed " + workspaceEntities.size() + " workspaces");
   
    List<UserEntity> users = userEntityController.listUserEntities();
    for (int i = 0; i < users.size(); i++) {
      UserEntity userEntity = users.get(i);
      
      userIndexer.indexUser(userEntity);
    }
    
    logger.log(Level.INFO, "Reindexed " + users.size() + " users");
    
    return Response.ok().build();
  }

  @GET
  @Path("/mockimport")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_importmock() {
    pyramusUpdater.updateUserRoles();
    pyramusUpdater.updateCourses(0, 100);
    pyramusUpdater.updatePersons(0, 200);
    
    return Response.ok().build();
  }

  @DELETE
  @Path("/communicator/messages")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteCommunicatorMessages() {
    for (CommunicatorMessageRecipient x : communicatorController.listAllRecipients())
      communicatorController.delete(x);

    for (InboxCommunicatorMessage message : communicatorController.listAllInboxMessages())
      communicatorController.delete(message);
    
    for (CommunicatorMessageId x : communicatorController.listAllMessageIds())
      communicatorController.delete(x);
    
    return Response.noContent().build();
  }
  
  @POST
  @Path("/communicator/messages")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createCommunicatorMessage(fi.muikku.atests.CommunicatorMessage payload) {
    UserEntity user = userEntityController.findUserEntityById(payload.getSenderId());
//      sessionController.getLoggedUserEntity();
    
    CommunicatorMessageId communicatorMessageId = communicatorController.createMessageId();
    
    Set<Tag> tagList = parseTags(payload.getTags());
    List<UserEntity> recipients = new ArrayList<UserEntity>();
    
    for (Long recipientId : payload.getRecipientIds()) {
      UserEntity recipient = userEntityController.findUserEntityById(recipientId);
  
      if (recipient != null)
        recipients.add(recipient);
    }
    
    // TODO: Duplicates
    
    for (Long groupId : payload.getRecipientGroupIds()) {
      UserGroupEntity group = userGroupEntityController.findUserGroupEntityById(groupId);
      List<UserGroupUserEntity> groupUsers = userGroupEntityController.listUserGroupUserEntitiesByUserGroupEntity(group);
      
      for (UserGroupUserEntity groupUser : groupUsers) {
        UserSchoolDataIdentifier userSchoolDataIdentifier = groupUser.getUserSchoolDataIdentifier();
        UserEntity userEntity = userSchoolDataIdentifier.getUserEntity();
        
        recipients.add(userEntity);
      }
    }
  
    // Workspace members
  
    for (Long workspaceId : payload.getRecipientStudentsWorkspaceIds()) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
      List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByRoleArchetype(
          workspaceEntity, WorkspaceRoleArchetype.STUDENT);
      
      for (WorkspaceUserEntity wosu : workspaceUsers) {
        recipients.add(wosu.getUserSchoolDataIdentifier().getUserEntity());
      }
    }      
  
    for (Long workspaceId : payload.getRecipientTeachersWorkspaceIds()) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
        List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByRoleArchetype(
            workspaceEntity, WorkspaceRoleArchetype.TEACHER);
        
        for (WorkspaceUserEntity wosu : workspaceUsers) {
          recipients.add(wosu.getUserSchoolDataIdentifier().getUserEntity());
        }
    }      
    
    // TODO Category not existing at this point would technically indicate an invalid state
    CommunicatorMessageCategory categoryEntity = communicatorController.persistCategory(payload.getCategoryName());
    
    CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId, user, recipients, categoryEntity, 
      payload.getCaption(), payload.getContent(), tagList);
      
    notifierController.sendNotification(communicatorNewInboxMessageNotification, user, recipients);
    webSocketMessenger.sendMessage2("Communicator:newmessagereceived", null, recipients);
    
    return Response.ok(
      message
    ).build();
  }
  
  @POST
  @Path("/workspaces")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createWorkspace(fi.muikku.atests.Workspace payload) {
    SchoolDataWorkspaceDiscoveredEvent event = new SchoolDataWorkspaceDiscoveredEvent(payload.getSchoolDataSource(), payload.getIdentifier(), payload.getName(), null);
    schoolDataWorkspaceDiscoveredEvent.fire(event);

    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(event.getDiscoveredWorkspaceEntityId());
    if (payload.getPublished() != null) {
      workspaceEntityController.updatePublished(workspaceEntity, payload.getPublished());
    }
    
    return Response.ok(createRestEntity(workspaceEntity, payload.getName())).build();
  }
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/publish")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response publishWorkspace(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(404).entity("Not found").build();
    }

    workspaceEntityController.updatePublished(workspaceEntity, true);
    
    return Response.noContent().build();
  }

  @DELETE
  @Path("/workspaces/{WORKSPACEENTITYID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteWorkspace(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(404).entity("Not found").build();
    }
    
    List<WorkspaceRolePermission> permissions = workspaceRolePermissionDAO.listByWorkspaceEntity(workspaceEntity);
    for (WorkspaceRolePermission permission : permissions) {
      workspaceRolePermissionDAO.delete(permission);
    }
    
    try {
      workspaceMaterialController.deleteAllWorkspaceNodes(workspaceEntity);
    } catch (WorkspaceMaterialContainsAnswersExeption e) {
      return Response.status(500).entity(e.getMessage()).build();
    }
    
    List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listWorkspaceUserEntitiesIncludeArchived(workspaceEntity);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      workspaceUserEntityController.deleteWorkspaceUserEntity(workspaceUserEntity);
    }
    
    workspaceEntityController.deleteWorkspaceEntity(workspaceEntity);
    
    return Response.noContent().build();
  }

  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/folders")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createWorkspaceMaterial(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, fi.muikku.atests.WorkspaceFolder payload) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Workspace entity not found").build(); 
    }

    WorkspaceNode parentNode = null;
    
    if (payload.getParentId() != null) {
      parentNode = workspaceMaterialController.findWorkspaceNodeById(payload.getParentId());
      if (parentNode == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid parentId").build(); 
      }
    } else {
      parentNode = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
      if (parentNode == null) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Could not find workspace root entity").build(); 
      }
    }
    
    WorkspaceFolder workspaceFolder = workspaceMaterialController.createWorkspaceFolder(parentNode, payload.getTitle());
    if (workspaceFolder == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Could not create workspace folder").build(); 
    }
    
    return Response.ok(createRestEntity(workspaceFolder)).build();
  }

  @POST
  @Path("/workspaces/{WORKSPACEID}/htmlmaterials")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createWorkspaceMaterial(fi.muikku.atests.WorkspaceHtmlMaterial payload) {
    if (payload.getParentId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Mandatory parentId is missing").build(); 
    }

    HtmlMaterial htmlMaterial = htmlMaterialController.createHtmlMaterial(payload.getTitle(), payload.getHtml(), payload.getContentType(), payload.getRevisionNumber());
    WorkspaceNode parent = workspaceMaterialController.findWorkspaceNodeById(payload.getParentId());
    if (parent == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid parentId").build();
    }
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.createWorkspaceMaterial(parent, htmlMaterial);
    String assignmentType = payload.getAssignmentType();
    if (StringUtils.isNotBlank(assignmentType)) {
      WorkspaceMaterialAssignmentType workspaceMaterialAssignmentType = WorkspaceMaterialAssignmentType.valueOf(assignmentType);
      if (workspaceMaterialAssignmentType == null) {
        return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid assignmentType '%s'", assignmentType)).build();
      }
      
      workspaceMaterialController.updateWorkspaceMaterialAssignmentType(workspaceMaterial, workspaceMaterialAssignmentType);
    }
    
    return Response.ok(createRestEntity(workspaceMaterial, htmlMaterial)).build();
  }

  @DELETE
  @Path("/workspaces/{WORKSPACEENTITYID}/htmlmaterials/{WORKSPACEMATERIALID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteWorkspaceMaterial(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("WORKSPACEMATERIALID") Long workspaceMaterialId) {
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("Not Found").build();
    }
    
    HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(workspaceMaterial.getMaterialId());
    if (htmlMaterial == null) {
      return Response.status(Status.BAD_REQUEST).entity("Not a html material").build();
    }
    
    try {
      workspaceMaterialController.deleteWorkspaceMaterial(workspaceMaterial, true);
    } catch (WorkspaceMaterialContainsAnswersExeption e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
    
    List<WorkspaceMaterialEvaluation> evaluations = evaluationController.listWorkspaceMaterialEvaluationsByWorkspaceMaterialId(workspaceMaterialId);
    for (WorkspaceMaterialEvaluation evaluation : evaluations) {
      evaluationController.deleteWorkspaceMaterialEvaluation(evaluation);
    }
    
    htmlMaterialController.deleteHtmlMaterial(htmlMaterial);
    
    return Response.noContent().build();
  }
  
  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/discussiongroups")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createWorkspaceDiscussionGroup(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, fi.muikku.atests.WorkspaceDiscussionGroup payload) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceEntity not found").build();
    }
    
    if (StringUtils.isBlank(payload.getName())) {
      return Response.status(Status.BAD_REQUEST).entity("Mandatory name is missing").build(); 
    }
    
    return Response.ok(createRestEntity(forumController.createForumAreaGroup(payload.getName()))).build();
  }  
  
  @DELETE
  @Path("/workspaces/{WORKSPACEENTITYID}/discussiongroups/{GROUPID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteWorkspaceDiscussionGroup(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("GROUPID") Long groupId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceEntity not found").build();
    }
    
    ForumAreaGroup group = forumController.findForumAreaGroup(groupId);
    if (group == null) {
      return Response.status(Status.NOT_FOUND).entity("Group not found").build();
    }
    
    forumController.deleteAreaGroup(group);;
    
    return Response.noContent().build();
  }  

  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/discussiongroups/{GROUPID}/discussions")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createWorkspaceDiscussion(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("GROUPID") Long groupId, fi.muikku.atests.WorkspaceDiscussion payload) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceEntity not found").build();
    }
    
    ForumAreaGroup group = forumController.findForumAreaGroup(groupId);
    if (group == null) {
      return Response.status(Status.NOT_FOUND).entity("Group not found").build();
    }
    
    if (StringUtils.isBlank(payload.getName())) {
      return Response.status(Status.BAD_REQUEST).entity("Mandatory name is missing").build(); 
    }
    
    return Response.ok(createRestEntity(forumController.createWorkspaceForumArea(workspaceEntity, payload.getName(), group.getId()))).build();
  }

  @DELETE
  @Path("/workspaces/{WORKSPACEENTITYID}/discussiongroups/{GROUPID}/discussions/{DISCUSSIONID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteWorkspaceDiscussion(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("GROUPID") Long groupId, @PathParam ("DISCUSSIONID") Long discussionId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceEntity not found").build();
    }
    
    ForumAreaGroup group = forumController.findForumAreaGroup(groupId);
    if (group == null) {
      return Response.status(Status.NOT_FOUND).entity("Group not found").build();
    }
    
    ForumArea forumArea = forumController.getForumArea(discussionId);
    if (forumArea == null) {
      return Response.status(Status.NOT_FOUND).entity("Discussion not found").build();
    }
    
    List<ForumThread> threads = forumController.listForumThreads(forumArea, 0, Integer.MAX_VALUE);
    for (ForumThread thread : threads) {
      List<ForumThreadReply> replies = forumController.listForumThreadReplies(thread, 0, Integer.MAX_VALUE);
      for (ForumThreadReply reply : replies) {
        forumController.deleteReply(reply); 
      }
      
      forumController.deleteThread(thread);
    }
    
    forumController.deleteArea(forumArea);
    
    return Response.noContent().build();
  }

  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/discussiongroups/{GROUPID}/discussions/{DISCUSSIONID}/threads")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createWorkspaceDiscussionThread(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("GROUPID") Long groupId, @PathParam ("DISCUSSIONID") Long discussionId, fi.muikku.atests.WorkspaceDiscussionThread payload) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceEntity not found").build();
    }
    
    ForumAreaGroup group = forumController.findForumAreaGroup(groupId);
    if (group == null) {
      return Response.status(Status.NOT_FOUND).entity("Group not found").build();
    }
    
    ForumArea discussion = forumController.getForumArea(discussionId);
    if (discussion == null) {
      return Response.status(Status.NOT_FOUND).entity("Discussion not found").build();
    }
    
    return Response.ok(createRestEntity(forumController.createForumThread(discussion, payload.getTitle(), payload.getMessage(), payload.getSticky(), payload.getLocked()))).build();
  }

  @DELETE
  @Path("/announcements")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteAnnouncements() {
    for(Announcement announcement : announcementController.listAll()) {
      announcementController.deleteAnnouncementTargetGroups(announcement);
      announcementController.delete(announcement);
    }

    return Response.noContent().build();
  }
  
  @POST
  @Path("/announcements")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createAnnouncement(fi.muikku.atests.Announcement payload) {
    UserEntity user = userEntityController.findUserEntityById(payload.getPublisherUserEntityId());
    Announcement announcement = announcementController.create(user, payload.getCaption(), payload.getContent(), payload.getStartDate(), payload.getEndDate(), payload.getPubliclyVisible());
    if(payload.getUserGroupEntityIds() != null) {
      List<Long> userGroups = payload.getUserGroupEntityIds();
      for (Long userGroupId : userGroups) {
        UserGroupEntity userGroup = userGroupEntityController.findUserGroupEntityById(userGroupId);
        announcementController.addAnnouncementTargetGroup(announcement, userGroup);
      }
    }
    return Response.noContent().build();
  }

  @DELETE
  @Path("/userGroups/{USERGROUPID}/{USERID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteUserGroupUser(@PathParam ("USERGROUPID") Long userGroupId, @PathParam ("USERID") Long userId) {
    UserGroupUserEntity userGroupUser = userGroupEntityController.findUserGroupUserEntityById(userId);
    userGroupEntityController.deleteUserGroupUserEntity(userGroupUser);
    return Response.noContent().build();
  }
  
  @DELETE
  @Path("/userGroups/{USERGROUPID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteUserGroup(@PathParam ("USERGROUPID") Long userGroupId) {
    UserGroupEntity userGroup = userGroupEntityController.findUserGroupEntityById(userGroupId);
    for(UserGroupUserEntity userGroupUser : userGroupEntityController.listUserGroupUserEntitiesByUserGroupEntity(userGroup)) {
      userGroupEntityController.deleteUserGroupUserEntity(userGroupUser);
    }
    userGroupEntityController.deleteUserGroupEntity(userGroup);
    return Response.noContent().build();
  }
  
  @DELETE
  @Path("/workspaces/{WORKSPACEENTITYID}/discussiongroups/{GROUPID}/discussions/{DISCUSSIONID}/threads/{ID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteWorkspaceDiscussionThread(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("GROUPID") Long groupId, @PathParam ("DISCUSSIONID") Long discussionId, @PathParam ("ID") Long id) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceEntity not found").build();
    }
    
    ForumAreaGroup group = forumController.findForumAreaGroup(groupId);
    if (group == null) {
      return Response.status(Status.NOT_FOUND).entity("Group not found").build();
    }
    
    ForumArea forumArea = forumController.getForumArea(discussionId);
    if (forumArea == null) {
      return Response.status(Status.NOT_FOUND).entity("Discussion not found").build();
    }
    
    ForumThread thread = forumController.getForumThread(id);
    if (thread == null) {
      return Response.status(Status.NOT_FOUND).entity("Thread not found").build();
    }

    forumController.deleteThread(thread);
    
    return Response.noContent().build();
  }
  
  private fi.muikku.atests.Workspace createRestEntity(WorkspaceEntity workspaceEntity, String name) {
    return new fi.muikku.atests.Workspace(workspaceEntity.getId(), 
        name, 
        workspaceEntity.getUrlName(), 
        workspaceEntity.getDataSource().getIdentifier(), 
        workspaceEntity.getIdentifier(), 
        workspaceEntity.getPublished());
  }

  private WorkspaceDiscussionGroup createRestEntity(ForumAreaGroup entity) {
    return new WorkspaceDiscussionGroup(entity.getId(), entity.getName());
  }

  private fi.muikku.atests.WorkspaceDiscussion createRestEntity(WorkspaceForumArea entity) {
    return new fi.muikku.atests.WorkspaceDiscussion(entity.getId(), entity.getName(), entity.getGroup().getId());
  }

  private fi.muikku.atests.WorkspaceHtmlMaterial createRestEntity(WorkspaceMaterial workspaceMaterial, HtmlMaterial htmlMaterial) {
    return new fi.muikku.atests.WorkspaceHtmlMaterial(workspaceMaterial.getId(), 
        workspaceMaterial.getParent() != null ? workspaceMaterial.getParent().getId() : null, 
        workspaceMaterial.getTitle(), 
        htmlMaterial.getContentType(), 
        htmlMaterial.getHtml(), 
        htmlMaterial.getRevisionNumber(), 
        workspaceMaterial.getAssignmentType() != null ? workspaceMaterial.getAssignmentType().toString() : null);
  }

  private fi.muikku.atests.WorkspaceFolder createRestEntity(WorkspaceFolder workspaceFolder) {
    return new fi.muikku.atests.WorkspaceFolder(workspaceFolder.getId(), 
        workspaceFolder.getHidden(),
        workspaceFolder.getOrderNumber(),
        workspaceFolder.getUrlName(),
        workspaceFolder.getTitle(),
        workspaceFolder.getParent() != null ? workspaceFolder.getParent().getId() : null);
  }

  private fi.muikku.atests.WorkspaceDiscussionThread createRestEntity(ForumThread entity) {
    return new fi.muikku.atests.WorkspaceDiscussionThread(entity.getId(), 
        entity.getTitle(), 
        entity.getMessage(), 
        entity.getSticky(), 
        entity.getLocked());
  }
  
//  private fi.muikku.atests.Announcement createRestEntity(Announcement entity) {
//    return new fi.muikku.atests.Announcement(entity.getId(), null,
//        entity.getPublisherUserEntityId(), 
//        entity.getCaption(), 
//        entity.getContent(), 
//        entity.getCreated(),
//        entity.getStartDate(),
//        entity.getEndDate(),
//        entity.isArchived(),
//        entity.isPubliclyVisible());
//  }
  
  private Set<Tag> parseTags(Set<String> tags) {
    Set<Tag> result = new HashSet<Tag>();
    
    for (String t : tags) {
      Tag tag = tagController.findTag(t);
      
      if (tag == null)
        tag = tagController.createTag(t);
      
      result.add(tag);
    }
    
    return result;
  }
  private Set<String> tagIdsToStr(Set<Long> tagIds) {
    Set<String> tagsStr = new HashSet<String>();
    for (Long tagId : tagIds) {
      Tag tag = tagController.findTagById(tagId);
      if (tag != null)
        tagsStr.add(tag.getText());
    }
    return tagsStr;
  }
  private List<Long> getMessageRecipientIdList(CommunicatorMessage msg) {
    List<CommunicatorMessageRecipient> messageRecipients = communicatorController.listCommunicatorMessageRecipients(msg);
    List<Long> recipients = new ArrayList<Long>();
    for (CommunicatorMessageRecipient messageRecipient : messageRecipients) {
      recipients.add(messageRecipient.getId());
    }

    return recipients;
  }
}
