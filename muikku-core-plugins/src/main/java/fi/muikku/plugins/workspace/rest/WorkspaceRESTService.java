package fi.muikku.plugins.workspace.rest;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Event;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;

import fi.muikku.controller.messaging.MessagingWidget;
import fi.muikku.i18n.LocaleController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.model.workspace.WorkspaceUserSignup;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.evaluation.EvaluationController;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.QueryFieldController;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryField;
import fi.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.WorkspaceMaterialDeleteError;
import fi.muikku.plugins.workspace.WorkspaceMaterialFieldController;
import fi.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.muikku.plugins.workspace.WorkspaceVisitController;
import fi.muikku.plugins.workspace.fieldio.WorkspaceFieldIOException;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.plugins.workspace.rest.model.WorkspaceMaterialEvaluation;
import fi.muikku.plugins.workspace.rest.model.WorkspaceMaterialFieldAnswer;
import fi.muikku.plugins.workspace.rest.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.rest.model.WorkspaceUser;
import fi.muikku.schooldata.CourseMetaController;
import fi.muikku.schooldata.GradingController;
import fi.muikku.schooldata.RoleController;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.Subject;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.events.SchoolDataWorkspaceUserDiscoveredEvent;
import fi.muikku.search.SearchProvider;
import fi.muikku.search.SearchResult;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;
import fi.muikku.users.WorkspaceUserEntityController;

@RequestScoped
@Path("/workspace")
@Stateful
@Produces("application/json")
public class WorkspaceRESTService extends PluginRESTService {

  private static final long serialVersionUID = -5286350366083446537L;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private SessionController sessionController;

  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private RoleController roleController;

  @Inject
  private CourseMetaController courseMetaController;

  @Inject
  private LocaleController localeController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;
  
  @Inject
  private MaterialController materialController;

  @Inject
  private QueryFieldController queryFieldController;
  
  @Inject
  private WorkspaceMaterialFieldController workspaceMaterialFieldController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @Inject
  @Any
  private Instance<MessagingWidget> messagingWidgets;

  @Inject
  private Event<SchoolDataWorkspaceUserDiscoveredEvent> schoolDataWorkspaceUserDiscoveredEvent;
  
  @Inject
  private WorkspaceVisitController workspaceVisitController;

  @Inject
  private GradingController gradingController;
  
  @Inject
  private EvaluationController evaluationController;
  
  @GET
  @Path("/workspaces/")
  public Response listWorkspaces(
        @QueryParam("userId") Long userId,
        @QueryParam("search") String searchString,
        @QueryParam("subjects") List<String> subjects,
        @QueryParam("minVisits") Long minVisits,
        @QueryParam("orderBy") List<String> orderBy,
        @Context Request request) {
    List<fi.muikku.plugins.workspace.rest.model.Workspace> workspaces = new ArrayList<>();

    boolean doSubjectFilter = !subjects.isEmpty();
    boolean doUserFilter = userId != null;
    boolean doMinVisitFilter = minVisits != null;
    UserEntity userEntity = userId != null ? userEntityController.findUserEntityById(userId) : null;

    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      SearchProvider searchProvider = searchProviderIterator.next();
      SearchResult searchResult = null;

      if (StringUtils.isNotBlank(searchString)) {
        searchResult = searchProvider.search(searchString, new String[] { "name", "description", "courseIdentifierIdentifier" }, 0,
            Integer.MAX_VALUE, Workspace.class);
      } else {
        searchResult = searchProvider.matchAllSearch(0, Integer.MAX_VALUE, Workspace.class);
      }

      List<Map<String, Object>> results = searchResult.getResults();
      for (Map<String, Object> result : results) {
        String[] id = ((String) result.get("id")).split("/", 2);
        if (id.length == 2) {
          String dataSource = id[1];
          String identifier = id[0];
          WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(dataSource, identifier);
          if (workspaceEntity != null) {
            boolean accept = true;

            if (accept && doSubjectFilter) {
              Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
              if (workspace != null) {
                CourseIdentifier courseIdentifier = courseMetaController.findCourseIdentifier(workspace.getSchoolDataSource(),
                    workspace.getCourseIdentifierIdentifier());
                Subject subject = courseMetaController
                    .findSubject(workspace.getSchoolDataSource(), courseIdentifier.getSubjectIdentifier());
                if (!subjects.contains(subject.getIdentifier())) {
                  accept = false;
                }
              }
            }

            if (accept && doUserFilter) {
              if (workspaceUserEntityController.listWorkspaceUserEntitiesByWorkspaceAndUser(workspaceEntity, userEntity).isEmpty()) {
                accept = false;
              }
            }
            
            if (accept && doMinVisitFilter) {
              if (workspaceVisitController.getNumVisits(workspaceEntity) < minVisits.intValue()) {
                accept = false;
              }
            }

            if (accept) {
              workspaces.add(createRestModel(workspaceEntity, (String) result.get("name"), (String) result.get("description")));
            }
          }
        }
      }
    } else {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }

    if (workspaces.isEmpty()) {
      return Response.noContent().build();
    }
    
    if (orderBy.contains("lastVisit")) {
      Collections.sort(workspaces, new Comparator<fi.muikku.plugins.workspace.rest.model.Workspace>() {
        @Override
        public int compare(fi.muikku.plugins.workspace.rest.model.Workspace workspace1,
                           fi.muikku.plugins.workspace.rest.model.Workspace workspace2) {
          if (workspace1.getLastVisit() == null || workspace2.getLastVisit() == null) {
            return 0;
          }
          
          if (workspace1.getLastVisit().before(workspace2.getLastVisit())) {
            return 1;
          }
          
          if (workspace1.getLastVisit().after(workspace2.getLastVisit())) {
            return -1;
          }
          
          return 0;
         }
      });
    }

    return Response.ok(workspaces).build();
  }
  
  @GET
  @Path("/workspaces/{ID}")
  public Response getWorkspace(@PathParam("ID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    Workspace workspace = null;
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      workspace = workspaceController.findWorkspace(workspaceEntity);
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }

    if (workspace == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    return Response.ok(createRestModel(workspaceEntity, workspace.getName(), workspace.getDescription())).build();
  }

  @GET
  @Path("/workspaces/{ID}/users")
  public Response getWorkspaceUsers(@PathParam("ID") Long workspaceEntityId, @QueryParam("roleArchtype") String roleArchetype,
      @QueryParam("userId") Long userId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    List<WorkspaceUserEntity> workspaceUsers = null;
    List<WorkspaceRoleEntity> workspaceRoles = null;

    if (StringUtils.isNotBlank(roleArchetype)) {
      WorkspaceRoleArchetype type = WorkspaceRoleArchetype.valueOf(roleArchetype);
      if (type == null) {
        return Response.status(Status.BAD_REQUEST).build();
      } else {
        workspaceRoles = roleController.listWorkspaceRoleEntitiesByArchetype(type);
      }
    }

    if (userId != null) {
      workspaceUsers = new ArrayList<>();

      UserEntity userEntity = userEntityController.findUserEntityById(userId);
      if (userEntity == null) {
        return Response.status(Status.BAD_REQUEST).build();
      }

      List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listWorkspaceUserEntitiesByWorkspaceAndUser(
          workspaceEntity, userEntity);
      for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
        List<Long> workspaceRoleIds = null;

        if (workspaceRoles != null) {
          workspaceRoleIds = new ArrayList<>();
          for (WorkspaceRoleEntity workspaceRole : workspaceRoles) {
            workspaceRoleIds.add(workspaceRole.getId());
          }
        }

        if ((workspaceRoleIds == null) || (workspaceRoleIds.contains(workspaceUserEntity.getWorkspaceUserRole().getId()))) {
          workspaceUsers.add(workspaceUserEntity);
        }
      }
    } else {
      if (workspaceRoles != null) {
        workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByRoles(workspaceEntity, workspaceRoles);
      } else {
        workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntities(workspaceEntity);
      }
    }

    if (workspaceUsers.isEmpty()) {
      return Response.noContent().build();
    }

    return Response.ok(createRestModel(workspaceUsers.toArray(new WorkspaceUserEntity[0]))).build();
  }

  @POST
  @Path("/workspaces/{ID}/users")
  public Response createWorkspaceUser(@PathParam("ID") Long workspaceEntityId, fi.muikku.plugins.workspace.rest.model.WorkspaceUser entity) {
    // TODO: Security

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    User user = userController.findUserByDataSourceAndIdentifier(sessionController.getLoggedUserSchoolDataSource(),
        sessionController.getLoggedUserIdentifier());

    if (entity.getRoleId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid workspace role '" + entity.getRoleId() + "'").build();
    }

    WorkspaceRoleEntity workspaceRole = roleController.findWorkspaceRoleEntityById(entity.getRoleId());
    if (workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserDataSourceAndUserIdentifier(workspaceEntity,
        user.getSchoolDataSource(), user.getIdentifier()) != null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);

    Role role = roleController.findRoleByDataSourceAndRoleEntity(user.getSchoolDataSource(), workspaceRole);
    fi.muikku.schooldata.entity.WorkspaceUser workspaceUser = workspaceController.createWorkspaceUser(workspace, user, role);
    UserSchoolDataIdentifier userIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(
        user.getSchoolDataSource(), user.getIdentifier());
    SchoolDataWorkspaceUserDiscoveredEvent discoverEvent = new SchoolDataWorkspaceUserDiscoveredEvent(workspaceUser.getSchoolDataSource(),
        workspaceUser.getIdentifier(), workspaceUser.getWorkspaceSchoolDataSource(), workspaceUser.getWorkspaceIdentifier(),
        workspaceUser.getUserSchoolDataSource(), workspaceUser.getUserIdentifier(), workspaceUser.getRoleSchoolDataSource(),
        workspaceUser.getRoleIdentifier());
    schoolDataWorkspaceUserDiscoveredEvent.fire(discoverEvent);

    // TODO: should this work based on permission? Permission -> Roles -> Recipients
    // TODO: Messaging should be moved into a CDI event listener

    WorkspaceRoleEntity teacherRole = roleController.ROLE_WORKSPACE_TEACHER();
    List<WorkspaceUserEntity> workspaceTeachers = workspaceUserEntityController.listWorkspaceUserEntitiesByRole(workspaceEntity,
        teacherRole);
    List<UserEntity> teachers = new ArrayList<UserEntity>();

    String workspaceName = workspace.getName();

    String userName = user.getFirstName() + " " + user.getLastName();

    for (WorkspaceUserEntity cu : workspaceTeachers) {
      teachers.add(cu.getUserSchoolDataIdentifier().getUserEntity());
    }

    for (MessagingWidget messagingWidget : messagingWidgets) {
      String caption = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.caption");
      String content = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.content");
      caption = MessageFormat.format(caption, workspaceName);
      content = MessageFormat.format(content, userName, workspaceName);
      // TODO: Category?
      messagingWidget.postMessage(userIdentifier.getUserEntity(), "message", caption, content, teachers);
    }

    WorkspaceUser result = new fi.muikku.plugins.workspace.rest.model.WorkspaceUser(discoverEvent.getDiscoveredWorkspaceUserEntityId(),
        workspaceEntityId, userIdentifier.getUserEntity().getId(), entity.getRoleId(), Boolean.FALSE);

    return Response.ok(result).build();
  }

  @POST
  @Path("/workspaces/{ID}/signups")
  public Response createWorkspaceUserSignup(@PathParam("ID") Long workspaceEntityId,
      fi.muikku.plugins.workspace.rest.model.WorkspaceUserSignup entity) {
    // TODO: Security

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    UserEntity userEntity = null;

    if (entity.getUserId() != null) {
      userEntity = userEntityController.findUserEntityById(entity.getUserId());
    } else {
      userEntity = sessionController.getLoggedUserEntity();
    }

    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    WorkspaceUserSignup signup = workspaceController
        .createWorkspaceUserSignup(workspaceEntity, userEntity, new Date(), entity.getMessage());

    return Response.ok(createRestModel(signup)).build();
  }
  
  @POST
  @Path("/workspaces/{ID}/materials/")
  public Response createWorkspaceMaterial(@PathParam("ID") Long workspaceEntityId,
      fi.muikku.plugins.workspace.rest.model.WorkspaceMaterial entity) {
    // TODO: Security

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (entity.getMaterialId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("material_id is required when creating new WorkspaceMaterial").build();
    }

    WorkspaceNode parent = null;
    if (entity.getParentId() != null) {
      parent = workspaceMaterialController.findWorkspaceNodeById(entity.getParentId());
      if (parent == null) {
        return Response.status(Status.NOT_FOUND).entity("parent not found").build();
      }
    } else {
      parent = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    }

    Material material = materialController.findMaterialById(entity.getMaterialId());
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity("material not found").build();
    }
    ;

    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.createWorkspaceMaterial(parent, material, entity.getAssignmentType());
    if (entity.getNextSiblingId() != null) {
      WorkspaceNode nextSibling = workspaceMaterialController.findWorkspaceNodeById(entity.getNextSiblingId());
      if (nextSibling == null) {
        return Response.status(Status.BAD_REQUEST).entity("Specified next sibling does not exist").build();
      }

      if (!nextSibling.getParent().getId().equals(parent.getId())) {
        return Response.status(Status.BAD_REQUEST).entity("Specified next sibling does not share parent with created workspace material")
            .build();
      }

      workspaceMaterialController.moveAbove(workspaceMaterial, nextSibling);
    }

    return Response.ok(createRestModel(workspaceMaterial)).build();
  }

  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{ID}")
  public Response getWorkspaceMaterial(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("ID") Long workspaceMaterialId) {
    // TODO: Security

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("workspaceMaterial not found").build();
    }

    WorkspaceRootFolder rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial);
    if (rootFolder == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    
    if (!workspaceEntity.getId().equals(rootFolder.getWorkspaceEntityId())) {
      return Response.status(Status.NOT_FOUND).build();
    }
     
    return Response.ok(createRestModel(workspaceMaterial)).build();
  }
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/materialreplies")
  public Response getWorkspaceMaterialAnswers(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    // TODO: Correct workspace entity?
    // TODO: Security
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Workspace could not be found").build();
    }
    
    List<WorkspaceMaterialFieldAnswer> answers = new ArrayList<>();
    
    try {
      List<fi.muikku.plugins.workspace.model.WorkspaceMaterialReply> replies = workspaceMaterialReplyController.listVisibleWorkspaceMaterialRepliesByWorkspaceEntity(workspaceEntity, sessionController.getLoggedUserEntity());
      for (fi.muikku.plugins.workspace.model.WorkspaceMaterialReply reply : replies) {
        List<WorkspaceMaterialField> fields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByWorkspaceMaterial(reply.getWorkspaceMaterial());
        for (WorkspaceMaterialField field : fields) {
          String value = workspaceMaterialFieldController.retrieveFieldValue(field, reply);
          Material material = field.getQueryField().getMaterial();
          WorkspaceMaterialFieldAnswer answer = new WorkspaceMaterialFieldAnswer(reply.getWorkspaceMaterial().getId(), material.getId(), field.getEmbedId(), field.getQueryField().getName(), value);
          answers.add(answer);
        }
      }
    } catch (WorkspaceFieldIOException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Internal error occurred while retrieving field answers: " + e.getMessage()).build();
    }
    
    if (answers.isEmpty()) {
      return Response.noContent().build();
    }
    
    WorkspaceMaterialReply result = new WorkspaceMaterialReply(answers);
    
    return Response.ok(result).build();
  }

  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/replies")
  public Response getWorkspaceMaterialAnswers(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, @QueryParam ("userEntityId") Long userEntityId) {
    // TODO: Correct workspace entity?, 
    // TODO: Security
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build();
    }
    
    // TODO Return everyone's answers
    if (userEntityId == null) {
      return Response.status(Status.NOT_IMPLEMENTED).build();
    }
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("Workspace material could not be found").build();
    }
    
    List<WorkspaceMaterialFieldAnswer> answers = new ArrayList<>();
    
    try {
      fi.muikku.plugins.workspace.model.WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
      if (reply != null) {
        List<WorkspaceMaterialField> fields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByWorkspaceMaterial(workspaceMaterial);
        for (WorkspaceMaterialField field : fields) {
          String value = workspaceMaterialFieldController.retrieveFieldValue(field, reply);
          Material material = field.getQueryField().getMaterial();
          WorkspaceMaterialFieldAnswer answer = new WorkspaceMaterialFieldAnswer(workspaceMaterial.getId(), material.getId(), field.getEmbedId(), field.getQueryField().getName(), value);
          answers.add(answer);
        }
      }
    } catch (WorkspaceFieldIOException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Internal error occurred while retrieving field answers: " + e.getMessage()).build();
    }
    
    WorkspaceMaterialReply result = new WorkspaceMaterialReply(answers);
    
    return Response.ok(result).build();
  }
  
  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/replies")
  public Response createWorkspaceMaterialAnswers(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, WorkspaceMaterialReply reply) {
    // TODO: Correct workspace entity?
    // TODO: Security
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build();
    }
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("Workspace material could not be found").build();
    }
    
    fi.muikku.plugins.workspace.model.WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, sessionController.getLoggedUserEntity());
    if (workspaceMaterialReply == null) {
      workspaceMaterialReply = workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, sessionController.getLoggedUserEntity());
    }
    
    try {
      for (WorkspaceMaterialFieldAnswer answer : reply.getAnswers()) {
        String fieldName = answer.getFieldName();
        if (StringUtils.isBlank(fieldName)) {
          return Response.status(Status.BAD_REQUEST).entity("fieldName is empty").build();
        }
        
        Material material = materialController.findMaterialById(answer.getMaterialId());
        if (material == null) {
          return Response.status(Status.BAD_REQUEST).entity("material id is invalid").build();
        }
        
        QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(material, fieldName);
        
        WorkspaceMaterialField materialField = workspaceMaterialFieldController.findWorkspaceMaterialFieldByWorkspaceMaterialAndQueryFieldAndEmbedId(workspaceMaterial, queryField, answer.getEmbedId());
        if (materialField == null) {
          materialField = workspaceMaterialFieldController.createWorkspaceMaterialField(workspaceMaterial, queryField, answer.getEmbedId());
        }
        
        workspaceMaterialFieldController.storeFieldValue(materialField, workspaceMaterialReply, answer.getValue());
      }
    } catch (WorkspaceFieldIOException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Internal error occurred while storing field answers: " + e.getMessage()).build();
    }
    
    return Response.noContent().build();
  }
//
//  @PUT
//  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{MATERIALID}/answers/{ID}")
//  public Response updateWorkspaceMaterialAnswer(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("MATERIALID") Long workspaceMaterialId, @PathParam("ID") Long workspaceMaterialAnswerId, WorkspaceMaterialAnswer answer) {
//    // TODO: Persist answer  
//  }
  
  private fi.muikku.plugins.workspace.rest.model.WorkspaceMaterial createRestModel(WorkspaceMaterial workspaceMaterial) {
    WorkspaceNode workspaceNode = workspaceMaterialController.findWorkspaceNodeNextSibling(workspaceMaterial);
    Long nextSiblingId = workspaceNode != null ? workspaceNode.getId() : null;
    return new fi.muikku.plugins.workspace.rest.model.WorkspaceMaterial(workspaceMaterial.getId(), workspaceMaterial.getMaterialId(),
        workspaceMaterial.getParent() != null ? workspaceMaterial.getParent().getId() : null, nextSiblingId, workspaceMaterial.getHidden(), workspaceMaterial.getAssignmentType());
  }

  private List<fi.muikku.plugins.workspace.rest.model.WorkspaceUser> createRestModel(WorkspaceUserEntity... entries) {
    List<fi.muikku.plugins.workspace.rest.model.WorkspaceUser> result = new ArrayList<>();

    for (WorkspaceUserEntity entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }

  private fi.muikku.plugins.workspace.rest.model.WorkspaceUser createRestModel(WorkspaceUserEntity entity) {
    Long workspaceEntityId = entity.getWorkspaceEntity() != null ? entity.getWorkspaceEntity().getId() : null;
    UserEntity userEntity = entity.getUserSchoolDataIdentifier().getUserEntity();
    Long userId = userEntity != null ? userEntity.getId() : null;
    Long roleId = entity.getWorkspaceUserRole() != null ? entity.getWorkspaceUserRole().getId() : null;
    return new fi.muikku.plugins.workspace.rest.model.WorkspaceUser(entity.getId(), workspaceEntityId, userId, roleId, entity.getArchived());
  }

  private fi.muikku.plugins.workspace.rest.model.Workspace createRestModel(WorkspaceEntity workspaceEntity, String name, String description) {
    Long numVisits = workspaceVisitController.getNumVisits(workspaceEntity);
    Date lastVisit = workspaceVisitController.getLastVisit(workspaceEntity);
    return new fi.muikku.plugins.workspace.rest.model.Workspace(workspaceEntity.getId(), workspaceEntity.getUrlName(),
        workspaceEntity.getArchived(), name, description, numVisits, lastVisit);
  }

  private fi.muikku.plugins.workspace.rest.model.WorkspaceUserSignup createRestModel(WorkspaceUserSignup signup) {
    return new fi.muikku.plugins.workspace.rest.model.WorkspaceUserSignup(signup.getId(), signup.getWorkspaceEntity().getId(), signup
        .getUserEntity().getId(), signup.getDate(), signup.getMessage());
  }

  @DELETE
  @Path("/workspaces/{WORKSPACEID}/materials/{MATERIALID}")
  public Response deleteNode(@PathParam("WORKSPACEID") Long workspaceEntityId, @PathParam("MATERIALID") Long materialId, @QueryParam ("removeAnswers") Boolean removeAnswers) {
    // TODO Our workspace?
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(materialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      try {
        workspaceMaterialController.deleteWorkspaceMaterial(workspaceMaterial, removeAnswers != null ? removeAnswers : false);
        return Response.noContent().build();
      } catch (WorkspaceMaterialContainsAnswersExeption e) {
        return Response.status(Status.CONFLICT).entity(new WorkspaceMaterialDeleteError(WorkspaceMaterialDeleteError.Reason.CONTAINS_ANSWERS)).build();
      } catch (Exception e) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).build();
      }
    }
  }

  @PUT
  @Path("/workspaces/{WORKSPACEID}/materials/{WORKSPACEMATERIALID}")
  // TODO @LoggedIn
  public Response updateWorkspaceMaterial(@PathParam("WORKSPACEID") Long workspaceEntityId,
      @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, fi.muikku.plugins.workspace.rest.model.WorkspaceMaterial workspaceMaterial) {

    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // WorkspaceNode
    WorkspaceNode workspaceNode = workspaceMaterialController.findWorkspaceNodeById(workspaceMaterial.getId());
    if (workspaceNode == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace material belongs to workspace check
    
    Long materialWorkspaceEntityId = workspaceMaterialController.getWorkspaceEntityId(workspaceNode);
    if (!materialWorkspaceEntityId.equals(workspaceEntityId)) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Actual update
    
    Long materialId = workspaceMaterial.getMaterialId(); 
    WorkspaceNode parentNode = workspaceMaterialController.findWorkspaceNodeById(workspaceMaterial.getParentId());
    WorkspaceNode nextSibling = workspaceMaterial.getNextSiblingId() == null ? null : workspaceMaterialController.findWorkspaceNodeById(workspaceMaterial.getNextSiblingId());
    Boolean hidden = workspaceMaterial.getHidden();
    workspaceMaterialController.updateWorkspaceNode(workspaceNode, materialId, parentNode, nextSibling, hidden, workspaceMaterial.getAssignmentType());
    return Response.noContent().build();
  }
  
  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/evaluations/")
  public Response createWorkspaceMaterialEvaluation(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, WorkspaceMaterialEvaluation payload) {
    // TODO: Security
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("workspaceMaterial not found").build();
    }

    WorkspaceRootFolder rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial);
    if (rootFolder == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    
    if (!workspaceEntity.getId().equals(rootFolder.getWorkspaceEntityId())) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (payload.getEvaluated() == null) {
      return Response.status(Status.BAD_REQUEST).entity("evaluated is missing").build(); 
    }
    
    if (payload.getAssessorEntityId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessorEntityId is missing").build(); 
    }
    
    if (payload.getStudentEntityId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("studentEntityId is missing").build(); 
    }
    
    if (payload.getGradingScaleSchoolDataSource() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradingScaleSchoolDataSource is missing").build(); 
    }
    
    if (payload.getGradingScaleIdentifier() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradingScaleIdentifier is missing").build(); 
    }
    
    if (payload.getGradeSchoolDataSource() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeSchoolDataSource is missing").build(); 
    }
    
    if (payload.getGradeIdentifier() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeIdentifier is missing").build(); 
    }

    UserEntity assessor = userEntityController.findUserEntityById(payload.getAssessorEntityId());
    UserEntity student = userEntityController.findUserEntityById(payload.getStudentEntityId());
    GradingScale gradingScale = gradingController.findGradingScale(payload.getGradingScaleSchoolDataSource(), payload.getGradingScaleIdentifier());
    GradingScaleItem grade = gradingController.findGradingScaleItem(gradingScale, payload.getGradeSchoolDataSource(), payload.getGradeIdentifier());

    if (assessor == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessor is invalid").build(); 
    }
    
    if (student == null) {
      return Response.status(Status.BAD_REQUEST).entity("student is invalid").build(); 
    }
    
    if (gradingScale == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradingScale is invalid").build(); 
    }
    
    if (grade == null) {
      return Response.status(Status.BAD_REQUEST).entity("grade is invalid").build(); 
    }
    
    Date evaluated = payload.getEvaluated().toDate();
    
    return Response.ok(createRestModel(
      evaluationController.createWorkspaceAssignmentEvaluation(student, workspaceMaterial, gradingScale, grade, assessor, evaluated, payload.getVerbalAssessment())
    )).build();
  }
  
  private WorkspaceMaterialEvaluation createRestModel(fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation evaluation) {
    return new WorkspaceMaterialEvaluation(evaluation.getId(), 
        new DateTime(evaluation.getEvaluated()), 
        evaluation.getAssessorEntityId(), 
        evaluation.getStudentEntityId(), 
        evaluation.getWorkspaceMaterialId(), 
        evaluation.getGradingScaleIdentifier(), 
        evaluation.getGradingScaleSchoolDataSource(), 
        evaluation.getGradeIdentifier(), 
        evaluation.getGradeSchoolDataSource(),
        evaluation.getVerbalAssessment());
  }

  // //
  // // Workspace
  // //
  //
  // @POST
  // @Path ("/workspaces/")
  // public Response createWorkspace(WorkspaceCompact workspaceData) {
  // if (StringUtils.isNotBlank(workspaceData.getIdentifier())) {
  // return Response.status(Status.BAD_REQUEST).entity("Identifier can not be specified when creating a workspace").build();
  // }
  //
  // if (StringUtils.isBlank(workspaceData.getSchoolDataSource())) {
  // return Response.status(Status.BAD_REQUEST).entity("SchoolDataSource must be defined when creating a workspace").build();
  // }
  //
  // if (StringUtils.isBlank(workspaceData.getName())) {
  // return Response.status(Status.BAD_REQUEST).entity("name must be defined when creating a workspace").build();
  // }
  //
  // if (StringUtils.isBlank(workspaceData.getWorkspaceTypeId())) {
  // return Response.status(Status.BAD_REQUEST).entity("workspaceTypeId must be defined when creating a workspace").build();
  // }
  //
  // if (StringUtils.isBlank(workspaceData.getCourseIdentifierIdentifier())) {
  // return Response.status(Status.BAD_REQUEST).entity("courseIdentifierIdentifier must be defined when creating a workspace").build();
  // }
  //
  // // TODO: Incorrect school data source
  // WorkspaceType workspaceType = workspaceController.findWorkspaceTypeByDataSourceAndIdentifier(workspaceData.getSchoolDataSource(),
  // workspaceData.getWorkspaceTypeId());
  // if (workspaceType == null) {
  // return Response.status(Status.BAD_REQUEST).entity("workspace type could not be found").build();
  // }
  //
  // Workspace workspace = workspaceController.createWorkspace(
  // workspaceData.getSchoolDataSource(),
  // workspaceData.getName(),
  // workspaceData.getDescription(),
  // workspaceType,
  // workspaceData.getCourseIdentifierIdentifier());
  //
  // return Response.ok(
  // tranquilityBuilderFactory.createBuilder()
  // .createTranquility()
  // .entity(workspace)
  // ).build();
  // }
  //

  //
  // @PUT
  // @Path ("/workspaces/{WORKSPACE_ENTITY_ID}")
  // public Response updateWorkspace(@PathParam ("WORKSPACE_ENTITY_ID") Long workspaceEntityId, WorkspaceCompact workspaceData) {
  // WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
  // if (workspaceEntity == null) {
  // return Response.status(Status.NOT_FOUND).build();
  // }
  //
  // Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
  // if (workspace == null) {
  // return Response.status(Status.NOT_FOUND).build();
  // }
  //
  // if (isChanged(workspaceData.getSchoolDataSource(), workspace.getSchoolDataSource())) {
  // return Response.status(Status.BAD_REQUEST).entity("SchoolDataSource can not be changed").build();
  // }
  //
  // if (isChanged(workspaceData.getIdentifier(), workspace.getIdentifier())) {
  // return Response.status(Status.BAD_REQUEST).entity("identifier can not be changed").build();
  // }
  //
  // // TODO: CourseIdentifierIdentififer should be updateable
  // if (isChanged(workspaceData.getWorkspaceTypeId(), workspace.getWorkspaceTypeId())) {
  // return Response.status(Status.BAD_REQUEST).entity("courseIdentifierIdentifier can not be changed").build();
  // }
  //
  // // TODO: WorkspaceTypeId should be updateable
  // if (isChanged(workspaceData.getCourseIdentifierIdentifier(), workspace.getCourseIdentifierIdentifier())) {
  // return Response.status(Status.BAD_REQUEST).entity("workspaceTypeId can not be changed").build();
  // }
  //
  // workspace.setDescription(workspaceData.getDescription());
  // workspace.setName(workspaceData.getName());
  // workspaceController.updateWorkspace(workspace);
  //
  // return Response.ok(
  // tranquilityBuilderFactory.createBuilder()
  // .createTranquility()
  // .entity(workspace)
  // ).build();
  // }
  //
  // @DELETE
  // @Path ("/workspaces/{WORKSPACE_ENTITY_ID}")
  // public Response deleteWorkspace(@PathParam ("WORKSPACE_ENTITY_ID") Long workspaceEntityId, @QueryParam ("permanently") Boolean
  // permanently) {
  // WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
  // if (workspaceEntity == null) {
  // return Response.status(Status.NOT_FOUND).build();
  // }
  //
  // Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
  // if (workspace == null) {
  // return Response.status(Status.NOT_FOUND).build();
  // }
  //
  // if (Boolean.TRUE.equals(permanently)) {
  // workspaceController.deleteWorkspace(workspace);
  // } else {
  // workspaceController.archiveWorkspace(workspace);
  // }
  //
  // return Response.noContent().build();
  // }
  //

  // //
  // // Materials
  // //
  //

  // //
  // // Nodes
  // //
  //
  // @GET
  // @Path ("/nodes/")
  // public Response listWorkspaceMaterials(@QueryParam ("parentId") Long parentId, @QueryParam ("workspaceEntityId") Long
  // workspaceEntityId) {
  // if (parentId != null && workspaceEntityId != null) {
  // return
  // Response.status(Status.BAD_REQUEST).entity("parentId and workspaceEntityId can not both be specified when listing workspace nodes").build();
  // }
  //
  // WorkspaceNode parent = null;
  // if (parentId != null) {
  // parent = workspaceMaterialController.findWorkspaceNodeById(parentId);
  // if (parent == null) {
  // return Response.status(Status.NOT_FOUND).entity("parent not found").build();
  // }
  //
  // return Response.ok(
  // tranquilityBuilderFactory.createBuilder()
  // .createTranquility()
  // .entities(workspaceMaterialController.listWorkspaceNodesByParent(parent))
  // ).build();
  // } else if (workspaceEntityId != null) {
  // WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
  // if (workspaceEntity == null) {
  // return Response.status(Status.NOT_FOUND).entity("parent not found").build();
  // }
  //
  // return Response.ok(
  // tranquilityBuilderFactory.createBuilder()
  // .createTranquility()
  // .entities(Arrays.asList(workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity)))
  // ).build();
  // } else {
  // return
  // Response.status(Status.BAD_REQUEST).entity("either parentId or workspaceEntityId must be specified when listing workspace nodes").build();
  // }
  // }
  //
  // private boolean isChanged(Object object1, Object object2) {
  // if (object1 == null) {
  // return false;
  // }
  //
  // return !object1.equals(object2);
  // }
  //
  //

}
