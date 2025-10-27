package fi.otavanopisto.muikku.atests;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
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
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.controller.TagController;
import fi.otavanopisto.muikku.dao.users.FlagDAO;
import fi.otavanopisto.muikku.dao.users.FlagStudentDAO;
import fi.otavanopisto.muikku.dao.users.UserPendingPasswordChangeDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.Flag;
import fi.otavanopisto.muikku.model.users.FlagShare;
import fi.otavanopisto.muikku.model.users.FlagStudent;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity;
import fi.otavanopisto.muikku.model.users.UserPendingPasswordChange;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialProducer;
import fi.otavanopisto.muikku.model.workspace.WorkspaceSignupMessage;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserSignup;
import fi.otavanopisto.muikku.notifier.NotifierController;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.announcer.AnnouncementController;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.UserRecipientList;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorNewInboxMessageNotification;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorUserLabel;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationDeleteController;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluation;
import fi.otavanopisto.muikku.plugins.forum.ForumController;
import fi.otavanopisto.muikku.plugins.forum.ForumThreadSubsciptionController;
import fi.otavanopisto.muikku.plugins.forum.dao.EnvironmentForumAreaDAO;
import fi.otavanopisto.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumAreaGroup;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThreadReply;
import fi.otavanopisto.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumThreadSubscription;
import fi.otavanopisto.muikku.plugins.material.HtmlMaterialController;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.otavanopisto.muikku.plugins.search.UserIndexer;
import fi.otavanopisto.muikku.plugins.search.WorkspaceIndexer;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceJournalController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalEntry;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.WorkspaceSignupMessageController;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.session.local.LocalSessionController;
import fi.otavanopisto.muikku.users.FlagController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
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
  private WorkspaceSignupMessageController workspaceSignupMessageController;

  @Inject
  private WorkspaceEntityDAO workspaceEntityDAO;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private PermissionController permissionController;
  
  @Inject
  private PyramusUpdater pyramusUpdater;
  
  @Inject
  private HtmlMaterialController htmlMaterialController; 

  @Inject
  private WorkspaceMaterialController workspaceMaterialController; 

  @Inject
  private UserPendingPasswordChangeDAO userPendingPasswordChangeDAO; 
  
  @Inject
  private EvaluationController evaluationController;

  @Inject
  private EvaluationDeleteController evaluationDeleteController;
  
  @Inject
  private ForumController forumController;
  
  @Inject
  private ForumThreadSubsciptionController forumThreadSubscriptionController;

  @Inject
  private FlagController flagController;
  
  @Inject
  private FlagDAO flagDAO;

  @Inject
  private FlagStudentDAO flagStudentDAO;
  
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
  private CommunicatorNewInboxMessageNotification communicatorNewInboxMessageNotification;
  
  @Inject
  private EnvironmentForumAreaDAO environmentForumAreaDAO;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private WorkspaceJournalController workspaceJournalController;
  
  @GET
  @Path("/login")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_login(@QueryParam ("role") String role) {
    logger.log(Level.INFO, "Acceptance tests plugin logging in with role " + role);

    switch (role) {
      case "ENVIRONMENT-STUDENT":
        localSessionController.login("internalauth", "PYRAMUS", "STUDENT-1");
      break;
      case "ENVIRONMENT-TEACHER":
        localSessionController.login("internalauth", "PYRAMUS", "STAFF-2");
      break;
      case "ENVIRONMENT-MANAGER":
        localSessionController.login("internalauth", "PYRAMUS", "STAFF-3");
      break;
      case "ENVIRONMENT-ADMINISTRATOR":
        localSessionController.login("internalauth", "PYRAMUS", "STAFF-4");
      break;
      case "ENVIRONMENT-TRUSTED_SYSTEM":
        localSessionController.login("internalauth", "PYRAMUS", "STAFF-5");
      break;
      
      case "PSEUDO-EVERYONE":
        // Do nothing
      break;
      
    }
    
    return Response.ok().build();
  }
  
  @GET
  @Path("/logout")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_logout() {
    logger.log(Level.INFO, "Acceptance tests plugin logout");
    localSessionController.logout();
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

  @GET
  @Path("/sdi_paramconverter/{SDI}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_schooldataidentifier_paramconverter_path(@PathParam("SDI") SchoolDataIdentifier sdi) {
    if (sdi != null) {
      Object sdi_capsule = new Object() {
        @SuppressWarnings("unused") public String identifier = sdi.getIdentifier();
        @SuppressWarnings("unused") public String datasource = sdi.getDataSource();
      };

      return Response.ok().entity(sdi_capsule).build();
    }
    else {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GET
  @Path("/sdi_paramconverter_queryparam")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_schooldataidentifier_paramconverter_query(@QueryParam("SDI") SchoolDataIdentifier sdi) {
    if (sdi != null) {
      Object sdi_capsule = new Object() {
        @SuppressWarnings("unused") public String identifier = sdi.getIdentifier();
        @SuppressWarnings("unused") public String datasource = sdi.getDataSource();
      };

      return Response.ok().entity(sdi_capsule).build();
    }
    else {
      return Response.noContent().build();
    }
  }

  @DELETE
  @Path("/communicator/messages")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteCommunicatorMessages() {
    for (CommunicatorMessageRecipient x : communicatorController.listAllRecipients())
      communicatorController.delete(x);

    for (fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage message : communicatorController.listAllMessages()) {
      communicatorController.delete(message);
    }
    
    for (CommunicatorMessageId x : communicatorController.listAllMessageIds())
      communicatorController.delete(x);
    
    return Response.noContent().build();
  }
  
  @POST
  @Path("/communicator/labels/user/{ID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createCommunicatorUserLabel(@PathParam ("ID") Long userId, fi.otavanopisto.muikku.atests.CommunicatorUserLabelRESTModel payload) {
    UserEntity userEntity = userEntityController.findUserEntityById(userId);
    CommunicatorUserLabelRESTModel newUserLabel = new CommunicatorUserLabelRESTModel(null, payload.getName(), payload.getColor());
    communicatorController.createUserLabel(newUserLabel.getName(), newUserLabel.getColor(), userEntity);
    return Response.ok().build();
  }
  
  @DELETE
  @Path("/communicator/labels/user/{ID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteCommunicatorUserLabels(@PathParam ("ID") Long userId) {
    UserEntity userEntity = userEntityController.findUserEntityById(userId);
    List<CommunicatorUserLabel> userLabels = communicatorController.listUserLabelsByUserEntity(userEntity);
    for (CommunicatorUserLabel communicatorUserLabel : userLabels) {
      communicatorController.delete(communicatorUserLabel);      
    }

    return Response.noContent().build();
  }
  
  @POST
  @Path("/communicator/messages")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createCommunicatorMessage(fi.otavanopisto.muikku.atests.CommunicatorMessage payload) {
    UserEntity user = userEntityController.findUserEntityById(payload.getSenderId());
    
    CommunicatorMessageId communicatorMessageId = communicatorController.createMessageId();
    
    Set<Tag> tagList = parseTags(payload.getTags());
    List<UserEntity> recipients = new ArrayList<UserEntity>();
    
    for (Long recipientId : payload.getRecipientIds()) {
      UserEntity recipient = userEntityController.findUserEntityById(recipientId);
  
      if (recipient != null)
        recipients.add(recipient);
    }
    
    for (Long groupId : payload.getRecipientGroupIds()) {
      UserGroupEntity group = userGroupEntityController.findUserGroupEntityById(groupId);
      List<UserGroupUserEntity> groupUsers = userGroupEntityController.listUserGroupUserEntitiesByUserGroupEntity(group);
      
      for (UserGroupUserEntity groupUser : groupUsers) {
        UserSchoolDataIdentifier userSchoolDataIdentifier = groupUser.getUserSchoolDataIdentifier();
        UserEntity userEntity = userSchoolDataIdentifier.getUserEntity();
        
        recipients.add(userEntity);
      }
    }
  
    for (Long workspaceId : payload.getRecipientStudentsWorkspaceIds()) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
      List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listActiveWorkspaceStudents(workspaceEntity);
      for (WorkspaceUserEntity wosu : workspaceUsers) {
        recipients.add(wosu.getUserSchoolDataIdentifier().getUserEntity());
      }
    }      
  
    for (Long workspaceId : payload.getRecipientTeachersWorkspaceIds()) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
      List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
      
      for (WorkspaceUserEntity wosu : workspaceUsers) {
        recipients.add(wosu.getUserSchoolDataIdentifier().getUserEntity());
      }
    }      

    CommunicatorMessageCategory categoryEntity = communicatorController.persistCategory(payload.getCategoryName());
    
    UserRecipientList recipientsList = new UserRecipientList();
    recipients.forEach(recipient -> recipientsList.addRecipient(recipient));

    fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId, user, recipientsList, 
        categoryEntity, payload.getCaption(), payload.getContent(), tagList);
    Long communicatorMessageId2 = message.getCommunicatorMessageId().getId();
    fi.otavanopisto.muikku.atests.CommunicatorMessage result = new fi.otavanopisto.muikku.atests.CommunicatorMessage(message.getId(), communicatorMessageId2, message.getSender(), payload.getCategoryName(), message.getCaption(), message.getContent(), message.getCreated(), payload.getTags(), payload.getRecipientIds(), payload.getRecipientGroupIds(), payload.getRecipientStudentsWorkspaceIds(), payload.getRecipientTeachersWorkspaceIds());
    
    Map<String, Object> params = new HashMap<String, Object>();
    params.put("sender", "Admin User");
    params.put("subject", message.getCaption());
    params.put("content", message.getContent());
    params.put("url", "https://dev.muikku.fi/communicator");

    notifierController.sendNotification(communicatorNewInboxMessageNotification, user, recipients, params);
    
    return Response.ok(
      result
    ).build();
  }
  
  @POST
  @Path("/workspaces")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createWorkspace(fi.otavanopisto.muikku.atests.Workspace payload) {
    SchoolDataWorkspaceDiscoveredEvent event = new SchoolDataWorkspaceDiscoveredEvent(payload.getSchoolDataSource(), payload.getIdentifier(), payload.getName(), null);
    schoolDataWorkspaceDiscoveredEvent.fire(event);

    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(event.getDiscoveredWorkspaceEntityId());
    if (payload.getPublished() != null) {
      workspaceEntityController.updatePublished(workspaceEntity, payload.getPublished());
    }
    
    workspaceIndexer.indexWorkspace(workspaceEntity);
    
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
    logger.info(String.format("TESTS Deleting workspace %d", workspaceEntityId));
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      logger.warning(String.format("TESTS Deleting workspace aborted, workspace %d not found.", workspaceEntityId));
      return Response.status(404).entity("Not found").build();
    }
    try{
      permissionController.removeWorkspaceGroupPermissions(workspaceEntity);
      List<WorkspaceMaterialProducer> workspaceMaterialProducers = workspaceController.listWorkspaceMaterialProducers(workspaceEntity);
      for (WorkspaceMaterialProducer workspaceMaterialProducer : workspaceMaterialProducers) {
        workspaceController.deleteWorkspaceMaterialProducer(workspaceMaterialProducer);
      }
    }catch (Exception e) {
      return Response.status(500).entity(e.getMessage()).build();
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
    
    List<WorkspaceUserSignup> workspaceUserSignups = workspaceController.listWorkspaceUserSignups();
    for (WorkspaceUserSignup workspaceUserSignup : workspaceUserSignups) {
      workspaceController.deleteWorkspaceUserSignup(workspaceUserSignup);
    }
    List<WorkspaceSignupMessage> signupMessages = workspaceSignupMessageController.listByWorkspaceEntity(workspaceEntity);
    for (WorkspaceSignupMessage signupMessage : signupMessages) {
      workspaceSignupMessageController.deleteWorkspaceSignupMessage(signupMessage);
    }
    
    SchoolDataIdentifier schoolDataIdentifier = workspaceEntity.schoolDataIdentifier();
    workspaceEntityController.deleteWorkspaceEntity(workspaceEntity);
    workspaceIndexer.removeWorkspace(schoolDataIdentifier);
    
    logger.info(String.format("TESTS Workspace %d deleted.", workspaceEntityId));

    return Response.noContent().build();
  }

  @DELETE
  @Path("/workspaces")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteWorkspaces() {
    logger.info(String.format("TESTS Deleting all workspaces"));

    List<WorkspaceEntity> workspaceEntities = workspaceEntityDAO.listAll();
    for (WorkspaceEntity workspaceEntity : workspaceEntities) {
      try{
        List<WorkspaceMaterialProducer> workspaceMaterialProducers = workspaceController.listWorkspaceMaterialProducers(workspaceEntity);
        for (WorkspaceMaterialProducer workspaceMaterialProducer : workspaceMaterialProducers) {
          workspaceController.deleteWorkspaceMaterialProducer(workspaceMaterialProducer);
        }
      }catch (Exception e) {
        return Response.status(500).entity(e.getMessage()).build();
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
      
      List<WorkspaceUserSignup> workspaceUserSignups = workspaceController.listWorkspaceUserSignups();
      for (WorkspaceUserSignup workspaceUserSignup : workspaceUserSignups) {
        workspaceController.deleteWorkspaceUserSignup(workspaceUserSignup);
      }
      List<WorkspaceSignupMessage> signupMessages = workspaceSignupMessageController.listByWorkspaceEntity(workspaceEntity);
      for (WorkspaceSignupMessage signupMessage : signupMessages) {
        workspaceSignupMessageController.deleteWorkspaceSignupMessage(signupMessage);
      }
      
      SchoolDataIdentifier schoolDataIdentifier = workspaceEntity.schoolDataIdentifier();
      workspaceEntityController.deleteWorkspaceEntity(workspaceEntity);  
      workspaceIndexer.removeWorkspace(schoolDataIdentifier);
    }
    
    logger.info(String.format("TESTS All workspaces deleted."));

    return Response.noContent().build();
  }
  
  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/folders")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createWorkspaceMaterial(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, fi.otavanopisto.muikku.atests.WorkspaceFolder payload) {
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
    
    WorkspaceFolder workspaceFolder = workspaceMaterialController.createWorkspaceFolder(parentNode, payload.getTitle(), null, false);
    if (workspaceFolder == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Could not create workspace folder").build(); 
    }
    
    return Response.ok(createRestEntity(workspaceFolder)).build();
  }

  @POST
  @Path("/workspaces/{WORKSPACEID}/htmlmaterials")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createWorkspaceMaterial(fi.otavanopisto.muikku.atests.WorkspaceHtmlMaterial payload) {
    if (payload.getParentId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Mandatory parentId is missing").build(); 
    }

    HtmlMaterial htmlMaterial = htmlMaterialController.createHtmlMaterial(payload.getTitle(), payload.getHtml(), payload.getContentType(), payload.getLicense());
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
    
    List<WorkspaceNodeEvaluation> evaluations = evaluationController.listWorkspaceNodeEvaluationsByWorkspaceNodeId(workspaceMaterialId);
    for (WorkspaceNodeEvaluation evaluation : evaluations) {
      evaluationDeleteController.deleteWorkspaceNodeEvaluation(evaluation);
    }
    
    htmlMaterialController.deleteHtmlMaterial(htmlMaterial);
    
    return Response.noContent().build();
  }
  
  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/discussiongroups")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createWorkspaceDiscussionGroup(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, fi.otavanopisto.muikku.atests.DiscussionGroup payload) {
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
    
    forumController.deleteAreaGroup(group);
    
    return Response.noContent().build();
  }  

  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/discussiongroups/{GROUPID}/discussions")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createWorkspaceDiscussion(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("GROUPID") Long groupId, fi.otavanopisto.muikku.atests.Discussion payload) {
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
    
    return Response.ok(createRestEntity(forumController.createWorkspaceForumArea(workspaceEntity, payload.getName(), payload.getDescription(), group.getId()))).build();
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

    List<ForumThread> threads = forumController.listForumThreads(forumArea, 0, Integer.MAX_VALUE, true);
    for (ForumThread thread : threads) {
      List<ForumThreadReply> replies = forumController.listForumThreadReplies(thread, 0, Integer.MAX_VALUE, true);
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
  public Response createWorkspaceDiscussionThread(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam ("GROUPID") Long groupId, @PathParam ("DISCUSSIONID") Long discussionId, fi.otavanopisto.muikku.atests.DiscussionThread payload) {
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
    
    return Response.ok(createRestEntity(forumController.createForumThread(discussion, payload.getTitle(), payload.getMessage(), payload.getSticky(), null))).build();
  }

  @DELETE
  @Path("/announcements")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteAnnouncements() {
    for(Announcement announcement : announcementController.listAll()) {
      announcementController.deleteAnnouncementWorkspaces(announcement);
      announcementController.deleteAnnouncementTargetGroups(announcement);
      announcementController.deleteAnnouncementRecipientsByAnnouncement(announcement);
      announcementController.delete(announcement);
    }

    return Response.noContent().build();
  }
  
  @POST
  @Path("/announcements")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createAnnouncement(fi.otavanopisto.muikku.atests.Announcement payload) {
    UserEntity user = userEntityController.findUserEntityById(payload.getPublisherUserEntityId());
    SchoolDataIdentifier schoolDataIdentifier = new SchoolDataIdentifier(user.getDefaultIdentifier(), user.getDefaultSchoolDataSource().getIdentifier());
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(schoolDataIdentifier);
    OrganizationEntity organizationEntity = userSchoolDataIdentifier.getOrganization();
    Announcement announcement = announcementController.createAnnouncement(user, organizationEntity, payload.getCaption(), payload.getContent(), payload.getStartDate(), payload.getEndDate(), payload.getPubliclyVisible(), false);
       
    if(payload.getWorkspaceEntityIds() != null) {
      List<Long> workspaceEntityIds = payload.getWorkspaceEntityIds();
      for (Long wsId : workspaceEntityIds) {
        announcementController.addAnnouncementWorkspace(announcement, workspaceEntityController.findWorkspaceEntityById(wsId));
      }
    }
    
    if(payload.getUserGroupEntityIds() != null) {
      List<Long> userGroups = payload.getUserGroupEntityIds();
      for (Long userGroupId : userGroups) {
        UserGroupEntity userGroup = userGroupEntityController.findUserGroupEntityById(userGroupId);
        announcementController.addAnnouncementTargetGroup(announcement, userGroup);
      }
    }
    return Response.ok(announcement.getId()).build();
  }
  
  @PUT
  @Path("/announcements/{ANNOUNCEMENTID}/workspace/{WORKSPACEID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response updateAnnouncementWorkspace(@PathParam ("ANNOUNCEMENTID") Long announcementId, @PathParam ("WORKSPACEID") Long workspaceId) {  
    Announcement newAnnouncement = announcementController.findById(announcementId);
    if (newAnnouncement == null) {
      return Response.status(Status.BAD_REQUEST).entity("Announcement not found").build();
    }
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("Workspace not found").build();
    }
    announcementController.addAnnouncementWorkspace(newAnnouncement, workspaceEntity);
    return Response.ok().build();
  }
  
  @POST
  @Path("/flags")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createFlag(fi.otavanopisto.muikku.atests.Flag payload) {
    if (StringUtils.isBlank(payload.getColor())) {
      return Response.status(Status.BAD_REQUEST).entity("color is missing").build();
    }

    if (StringUtils.isBlank(payload.getName())) {
      return Response.status(Status.BAD_REQUEST).entity("name is missing").build();
    }
// TODO: OwnerIdentifier from payload, please.
    Flag flag = flagController.createFlag(SchoolDataIdentifier.fromString("STAFF-1/PYRAMUS"), payload.getName(), payload.getColor(), payload.getDescription());
    
    return Response.ok(createRestEntity(flag)).build();

  }  

  @DELETE
  @Path("/flags/{FLAGID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteFlag(@PathParam ("FLAGID") Long flagId) {
    Flag flag = flagController.findFlagById(flagId);
    if (flag == null) {
      return Response.status(Status.BAD_REQUEST).entity("Flag not found").build();
    }
    flagController.deleteFlag(flag);
    
    return Response.noContent().build();
  }
  
  @POST
  @Path("/students/{ID}/flags/{FLAGID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createStudentFlag(@PathParam("ID") Long studentId, @PathParam("FLAGID") Long flagId) {
    SchoolDataIdentifier studentIdentifier = new SchoolDataIdentifier("STUDENT-" + studentId, "PYRAMUS");
    Flag flag = flagController.findFlagById(flagId);
    if (flag == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Flag #%d not found", flagId)).build();
    }
    
    return Response.ok(createRestEntity(flagController.flagStudent(flag, studentIdentifier))).build();
  }

  @DELETE
  @Path("/flags")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteStudentFlag() {   
    List<FlagStudent> flagStudents = flagStudentDAO.listAll();
    List<Flag> flags = flagDAO.listAll();

    for(FlagStudent flagStudent : flagStudents) {
      flagStudentDAO.delete(flagStudent);
    }
    
    for(Flag flag : flags) {
      flagDAO.delete(flag);
    }
    
    return Response.noContent().build();
  }
  
  @DELETE
  @Path("/students/flags/{ID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteStudentFlag(@PathParam("ID") Long id) {   
    FlagStudent flagStudent = flagController.findFlagStudentById(id);

    if (flagStudent == null) {
      return Response.status(Response.Status.NOT_FOUND).entity(String.format("Flag not found %d", id)).build();
    }

    flagController.unflagStudent(flagStudent);
    
    return Response.noContent().build();
  }

  @DELETE
  @Path("/flags/share/{FLAGID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteFlagShares(@PathParam("FLAGID") Long flagId) {
    Flag flag = flagController.findFlagById(flagId);
    List<FlagShare> listShares = flagController.listShares(flag);
    
    for (FlagShare flagShare : listShares) {
      flagController.deleteFlagShare(flagShare);
    }
       
    return Response.noContent().build();
  }
  
  @POST
  @Path("/passwordchange/{EMAIL}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createPasswordChangeEntry(@PathParam ("EMAIL") String email) {
    UserEntity userEntity = userEntityController.findUserEntityByEmailAddress(email);
    if (userEntity == null)
      return Response.status(Status.NOT_FOUND).build();
     
      String confirmationHash = "testtesttest";
      userPendingPasswordChangeDAO.create(userEntity, confirmationHash, DateUtils.addHours(new Date(), 2));
      return Response.noContent().build();
  }
  
  @DELETE
  @Path("/passwordchange/{EMAIL}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deletePasswordChangeEntry(@PathParam ("EMAIL") String email) {
    UserEntity userEntity = userEntityController.findUserEntityByEmailAddress(email); 
    if (userEntity == null)
      return Response.status(Status.NOT_FOUND).build();
    
    UserPendingPasswordChange userPendingPasswordChange = userPendingPasswordChangeDAO.findByUserEntity(userEntity);    
    userPendingPasswordChangeDAO.delete(userPendingPasswordChange);  
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
  @Path("/userGroups")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteUserGroups() {
    List<UserGroupEntity> userGroups = userGroupEntityController.listAllUserGroupEntities();
    for (UserGroupEntity userGroup: userGroups) {
      for(UserGroupUserEntity userGroupUser : userGroupEntityController.listUserGroupUserEntitiesByUserGroupEntity(userGroup)) {
        userGroupEntityController.deleteUserGroupUserEntity(userGroupUser);
      }
      userGroupEntityController.deleteUserGroupEntity(userGroup);
    }
    return Response.noContent().build();
  }

  @DELETE
  @Path("/userGroups/users")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteUserGroupUsers() {
    List<UserGroupEntity> userGroups = userGroupEntityController.listAllUserGroupEntities();
    for (UserGroupEntity userGroup: userGroups) {
      for(UserGroupUserEntity userGroupUser : userGroupEntityController.listUserGroupUserEntitiesByUserGroupEntity(userGroup)) {
        userGroupEntityController.deleteUserGroupUserEntity(userGroupUser);
      }
    }
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
  
  @DELETE
  @Path("/workspaces/discussions/cleanup")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response cleanupWorkspaceDiscussions() {
    List<WorkspaceEntity> workspaces = workspaceController.listWorkspaceEntities();
    for(WorkspaceEntity workspaceEntity : workspaces) {
      List<WorkspaceForumArea> forumAreas = forumController.listWorkspaceForumAreas(workspaceEntity);
      List<ForumAreaGroup> groups = forumController.listForumAreaGroups();
      List<ForumThread> threads = new ArrayList<>();
      for(WorkspaceForumArea forumArea : forumAreas) {
        threads = forumController.listForumThreads(forumArea, 0, Integer.MAX_VALUE, true); 
        for (ForumThread thread : threads) {
          List<ForumThreadSubscription> subs = forumThreadSubscriptionController.listByThread(thread);
          for (ForumThreadSubscription sub : subs) {
            forumThreadSubscriptionController.deleteSubscription(sub);
          }       
          forumController.deleteThread(thread);
        }
        forumController.deleteArea(forumArea);   
      }
      for (ForumAreaGroup group : groups) {
        forumController.deleteAreaGroup(group);
      }
    }
    return Response.noContent().build();
  }
  
  @POST
  @Path("/discussiongroups")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createDiscussionGroup(fi.otavanopisto.muikku.atests.DiscussionGroup payload) {
    if (StringUtils.isBlank(payload.getName())) {
      return Response.status(Status.BAD_REQUEST).entity("Mandatory name is missing").build(); 
    }
    
    return Response.ok(createRestEntity(forumController.createForumAreaGroup(payload.getName()))).build();
  }  
  
  @DELETE
  @Path("/discussiongroups/{GROUPID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteDiscussionGroup(@PathParam ("GROUPID") Long groupId) {
    ForumAreaGroup group = forumController.findForumAreaGroup(groupId);
    if (group == null) {
      return Response.status(Status.NOT_FOUND).entity("Group not found").build();
    }
    
    forumController.deleteAreaGroup(group);
    
    return Response.noContent().build();
  }  

  @POST
  @Path("/discussiongroups/{GROUPID}/discussions")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createDiscussion(@PathParam ("GROUPID") Long groupId, fi.otavanopisto.muikku.atests.Discussion payload) {
    ForumAreaGroup group = forumController.findForumAreaGroup(groupId);
    if (group == null) {
      return Response.status(Status.NOT_FOUND).entity("Group not found").build();
    }
    
    if (StringUtils.isBlank(payload.getName())) {
      return Response.status(Status.BAD_REQUEST).entity("Mandatory name is missing").build(); 
    }
    return Response.ok(createRestEntity(forumController.createEnvironmentForumArea(payload.getName(), payload.getDescription(), group.getId()))).build();
  }
  
  @POST
  @Path("/discussions/reply")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createDiscussionThreadReply(fi.otavanopisto.muikku.atests.DiscussionThreadReply payload) {
    ForumThread thread = forumController.getForumThread(payload.getThreadId());
    if (thread == null) {
      return Response.status(Status.NOT_FOUND).entity("Thread not found").build();
    }
    
    if (StringUtils.isBlank(payload.getMessage())) {
      return Response.status(Status.BAD_REQUEST).entity("Message is missing").build(); 
    }   
    return Response.ok(createRestEntity(forumController.createForumThreadReply(thread, payload.getMessage(), null))).build();
  }

  @DELETE
  @Path("/discussiongroups/{GROUPID}/discussions/{DISCUSSIONID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteDiscussion(@PathParam ("GROUPID") Long groupId, @PathParam ("DISCUSSIONID") Long discussionId) {
    ForumAreaGroup group = forumController.findForumAreaGroup(groupId);
    if (group == null) {
      return Response.status(Status.NOT_FOUND).entity("Group not found").build();
    }
    
    ForumArea forumArea = forumController.getForumArea(discussionId);
    if (forumArea == null) {
      return Response.status(Status.NOT_FOUND).entity("Discussion not found").build();
    }

    List<ForumThread> threads = forumController.listForumThreads(forumArea, 0, Integer.MAX_VALUE, true);
    for (ForumThread thread : threads) {
      List<ForumThreadReply> replies = forumController.listForumThreadReplies(thread, 0, Integer.MAX_VALUE, true);
      for (ForumThreadReply reply : replies) {
        forumController.deleteReply(reply); 
      }
      
      forumController.deleteThread(thread);
    }
    
    forumController.deleteArea(forumArea);
    
    return Response.noContent().build();
  }

  @DELETE
  @Path("/discussion/cleanup")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response cleanupDiscussions() {
    List<EnvironmentForumArea> forumAreas = environmentForumAreaDAO.listAllNonArchived();
//    List<ForumAreaGroup> groups = forumController.listForumAreaGroups();
    List<ForumThread> threads = new ArrayList<>();
    List<ForumThreadReply> replies = new ArrayList<>();
    for(EnvironmentForumArea forumArea : forumAreas) {
      threads = forumController.listForumThreads(forumArea  , 0, Integer.MAX_VALUE, true); 
      for (ForumThread thread : threads) {
        List<ForumThreadSubscription> subs = forumThreadSubscriptionController.listByThread(thread);
        for (ForumThreadSubscription sub : subs) {
          forumThreadSubscriptionController.deleteSubscription(sub);
        }
        replies = forumController.listForumThreadReplies(thread, 0, Integer.MAX_VALUE, true);
        for (ForumThreadReply reply : replies) {
          forumController.deleteReply(reply); 
        }
        forumController.deleteThread(thread);
      } 
    }
    
    for(EnvironmentForumArea forumArea : forumAreas) {
      forumController.deleteArea(forumArea);      
    }
    
//    for (ForumAreaGroup group : groups) {
//      forumController.deleteAreaGroup(group);
//    }
    return Response.noContent().build();

  }
  
  @POST
  @Path("/discussiongroups/{GROUPID}/discussions/{DISCUSSIONID}/threads")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createDiscussionThread(@PathParam ("GROUPID") Long groupId, @PathParam ("DISCUSSIONID") Long discussionId, fi.otavanopisto.muikku.atests.DiscussionThread payload) {
    ForumAreaGroup group = forumController.findForumAreaGroup(groupId);
    if (group == null) {
      return Response.status(Status.NOT_FOUND).entity("Group not found").build();
    }
    
    ForumArea discussion = forumController.getForumArea(discussionId);
    if (discussion == null) {
      return Response.status(Status.NOT_FOUND).entity("Discussion not found").build();
    }
    
    return Response.ok(createRestEntity(forumController.createForumThread(discussion, payload.getTitle(), payload.getMessage(), payload.getSticky(), null))).build();
  }
  
  @DELETE
  @Path("/discussiongroups/{GROUPID}/discussions/{DISCUSSIONID}/threads/{ID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteDiscussionThread(@PathParam ("GROUPID") Long groupId, @PathParam ("DISCUSSIONID") Long discussionId, @PathParam ("ID") Long id) {
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

  @PUT
  @Path("/users/archive/{EMAIL}")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response archiveUserByEmail(@PathParam ("EMAIL") String email) {
    UserEntity userEntity = userEntityController.findUserEntityByEmailAddress(email);
    userEntity.setArchived(true);
    userEntityController.archiveUserEntity(userEntity);
    userIndexer.removeUser(userEntity.getDefaultSchoolDataSource().getIdentifier(), userEntity.getDefaultIdentifier());
    return Response.ok().build();
  }
  
  @GET
  @Path("/users/id/{EMAIL}")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response getUserIdByEmail(@PathParam ("EMAIL") String email) {
    UserEntity userEntity = userEntityController.findUserEntityByEmailAddress(email);
    if(userEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    return Response.ok(userEntity.getId()).build();
  }
  
  @POST
  @Path("/workspaces/{WORKSPACEID}/journal/{AUTHOREMAIL}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response addJournalEntry(@PathParam("WORKSPACEID") Long workspaceId, @PathParam("AUTHOREMAIL") String authorEmail, fi.otavanopisto.muikku.atests.WorkspaceJournalEntry payload) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    UserEntity userEntity = userEntityController.findUserEntityByEmailAddress(authorEmail);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    WorkspaceJournalEntry workspaceJournalEntry = workspaceJournalController.createJournalEntry(
        workspaceEntity,
        userEntity,
        payload.getHtml(),
        null,
        payload.getTitle());
    return Response.ok(createRestEntity(workspaceJournalEntry)).build();

  }
  
  @DELETE
  @Path("/journal/{ID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteJournalEntry(@PathParam("ID") Long journalEntryId) {
    WorkspaceJournalEntry workspaceJournalEntry = workspaceJournalController.findJournalEntry(journalEntryId);
    if (workspaceJournalEntry == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    workspaceJournalController.delete(workspaceJournalEntry);
    return Response.noContent().build();
  }
  
  private fi.otavanopisto.muikku.atests.WorkspaceJournalEntry createRestEntity(WorkspaceJournalEntry workspaceJournalEntry) {
    fi.otavanopisto.muikku.atests.WorkspaceJournalEntry journalEntry = new fi.otavanopisto.muikku.atests.WorkspaceJournalEntry(workspaceJournalEntry.getWorkspaceEntityId(), workspaceJournalEntry.getUserEntityId(),
        workspaceJournalEntry.getHtml(), workspaceJournalEntry.getTitle(), workspaceJournalEntry.getCreated(), workspaceJournalEntry.getArchived());
    journalEntry.setId(workspaceJournalEntry.getId());
    return journalEntry;
  }

  private fi.otavanopisto.muikku.atests.Workspace createRestEntity(WorkspaceEntity workspaceEntity, String name) {
    return new fi.otavanopisto.muikku.atests.Workspace(workspaceEntity.getId(), 
        name, 
        workspaceEntity.getUrlName(), 
        workspaceEntity.getDataSource().getIdentifier(), 
        workspaceEntity.getIdentifier(), 
        workspaceEntity.getPublished());
  }

  private DiscussionGroup createRestEntity(ForumAreaGroup entity) {
    return new DiscussionGroup(entity.getId(), entity.getName());
  }

  private fi.otavanopisto.muikku.atests.Discussion createRestEntity(WorkspaceForumArea entity) {
    return new fi.otavanopisto.muikku.atests.Discussion(entity.getId(), entity.getName(), entity.getDescription(), entity.getGroup().getId());
  }
  
  private fi.otavanopisto.muikku.atests.Discussion createRestEntity(EnvironmentForumArea entity) {
    return new fi.otavanopisto.muikku.atests.Discussion(entity.getId(), entity.getName(), entity.getDescription(), entity.getGroup().getId());
  }

  private fi.otavanopisto.muikku.atests.DiscussionThreadReply createRestEntity(ForumThreadReply entity) {
    DiscussionThreadReply parentReply = null;
    if(entity.getParentReply() != null) {
      parentReply = new DiscussionThreadReply(entity.getParentReply().getId(), entity.getParentReply().getThread().getId(), entity.getParentReply().getMessage(), entity.getParentReply().getDeleted(), createRestEntity(entity.getParentReply()));
    }
    return new fi.otavanopisto.muikku.atests.DiscussionThreadReply(entity.getId(), entity.getThread().getId(), entity.getMessage(), entity.getDeleted(), parentReply);
  }
  
  private fi.otavanopisto.muikku.atests.WorkspaceHtmlMaterial createRestEntity(WorkspaceMaterial workspaceMaterial, HtmlMaterial htmlMaterial) {
    return new fi.otavanopisto.muikku.atests.WorkspaceHtmlMaterial(workspaceMaterial.getId(), 
        workspaceMaterial.getParent() != null ? workspaceMaterial.getParent().getId() : null, 
        workspaceMaterial.getTitle(), 
        htmlMaterial.getContentType(), 
        htmlMaterial.getHtml(), 
        workspaceMaterial.getAssignmentType() != null ? workspaceMaterial.getAssignmentType().toString() : null,
        htmlMaterial.getLicense());
  }

  private fi.otavanopisto.muikku.atests.WorkspaceFolder createRestEntity(WorkspaceFolder workspaceFolder) {
    return new fi.otavanopisto.muikku.atests.WorkspaceFolder(workspaceFolder.getId(), 
        workspaceFolder.getHidden(),
        workspaceFolder.getOrderNumber(),
        workspaceFolder.getUrlName(),
        workspaceFolder.getTitle(),
        workspaceFolder.getParent() != null ? workspaceFolder.getParent().getId() : null);
  }

  private fi.otavanopisto.muikku.atests.DiscussionThread createRestEntity(ForumThread entity) {
    return new fi.otavanopisto.muikku.atests.DiscussionThread(entity.getId(), 
        entity.getTitle(), 
        entity.getMessage(), 
        entity.getSticky(), 
        null);
  }
  
  private fi.otavanopisto.muikku.atests.Flag createRestEntity(Flag entity) {

    return new fi.otavanopisto.muikku.atests.Flag(entity.getId(),
        entity.getName(), 
        entity.getColor(), 
        entity.getDescription(), 
        null);
  }
  
  private fi.otavanopisto.muikku.atests.StudentFlag createRestEntity(FlagStudent flagStudent) {
    SchoolDataIdentifier studentIdentifier = new SchoolDataIdentifier(flagStudent.getStudentIdentifier().getIdentifier(), flagStudent.getStudentIdentifier().getDataSource().getIdentifier());
    return new fi.otavanopisto.muikku.atests.StudentFlag(flagStudent.getId(), flagStudent.getFlag().getId(), studentIdentifier.toId());
  }
  
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

}