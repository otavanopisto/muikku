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
import javax.ws.rs.DefaultValue;
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

import fi.muikku.controller.messaging.MessagingWidget;
import fi.muikku.i18n.LocaleController;
import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.model.workspace.WorkspaceUserSignup;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.search.WorkspaceIndexer;
import fi.muikku.plugins.workspace.WorkspaceJournalController;
import fi.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.WorkspaceMaterialDeleteError;
import fi.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.muikku.plugins.workspace.WorkspaceMaterialFieldController;
import fi.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.muikku.plugins.workspace.WorkspaceVisitController;
import fi.muikku.plugins.workspace.fieldio.WorkspaceFieldIOException;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceJournalEntry;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.plugins.workspace.rest.model.WorkspaceAssessment;
import fi.muikku.plugins.workspace.rest.model.WorkspaceCompositeReply;
import fi.muikku.plugins.workspace.rest.model.WorkspaceJournalEntryRESTModel;
import fi.muikku.plugins.workspace.rest.model.WorkspaceMaterialCompositeReply;
import fi.muikku.plugins.workspace.rest.model.WorkspaceMaterialFieldAnswer;
import fi.muikku.plugins.workspace.rest.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.rest.model.WorkspaceUser;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.schooldata.GradingController;
import fi.muikku.schooldata.RoleController;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.events.SchoolDataWorkspaceUserDiscoveredEvent;
import fi.muikku.search.SearchProvider;
import fi.muikku.search.SearchResult;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.SessionController;
import fi.muikku.users.EnvironmentUserController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;
import fi.muikku.users.WorkspaceUserEntityController;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/workspace")
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
  private LocaleController localeController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;
  
  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;
  
  @Inject
  private MaterialController materialController;
  
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
  private EnvironmentUserController environmentUserController;
  
  @Inject
  private WorkspaceIndexer workspaceIndexer;
  
  @Inject
  private WorkspaceJournalController workspaceJournalController;
  
  @GET
  @Path("/workspaces/")
  @RESTPermitUnimplemented
  public Response listWorkspaces(
        @QueryParam("userId") Long userId,
        @QueryParam("search") String searchString,
        @QueryParam("subjects") List<String> subjects,
        @QueryParam("minVisits") Long minVisits,
        @QueryParam("includeUnpublished") @DefaultValue ("false") Boolean includeUnpublished,
        @QueryParam("orderBy") List<String> orderBy,
        @Context Request request) {
    List<fi.muikku.plugins.workspace.rest.model.Workspace> workspaces = new ArrayList<>();

    boolean doMinVisitFilter = minVisits != null;
    UserEntity userEntity = userId != null ? userEntityController.findUserEntityById(userId) : null;
    List<WorkspaceEntity> workspaceEntities = null;
    String schoolDataSourceFilter = null;
    List<String> workspaceIdentifierFilters = null;
    
    if (doMinVisitFilter) {
      if (userEntity != null) {
        workspaceEntities = workspaceVisitController.listWorkspaceEntitiesByMinVisitsOrderByLastVisit(userEntity, minVisits);
      } else {
        workspaceEntities = workspaceVisitController.listWorkspaceEntitiesByMinVisitsOrderByLastVisit(sessionController.getLoggedUserEntity(), minVisits);
      }
    } else {
      if (userEntity != null) {
        workspaceEntities = workspaceUserEntityController.listWorkspaceEntitiesByUserEntity(userEntity);
      }
    }

    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      SearchProvider searchProvider = searchProviderIterator.next();
      SearchResult searchResult = null;
      
      if (workspaceEntities != null) {
        workspaceIdentifierFilters = new ArrayList<>();
        
        for (WorkspaceEntity workspaceEntity : workspaceEntities) {
          if (schoolDataSourceFilter == null) {
            schoolDataSourceFilter = workspaceEntity.getDataSource().getIdentifier();
          }
          
          workspaceIdentifierFilters.add(workspaceEntity.getIdentifier());
        }
      }
      
      // TODO: Pagination support
      searchResult = searchProvider.searchWorkspaces(schoolDataSourceFilter, subjects, workspaceIdentifierFilters, searchString, includeUnpublished, 0, 50);
      
      List<Map<String, Object>> results = searchResult.getResults();
      for (Map<String, Object> result : results) {
        String searchId = (String) result.get("id");
        if (StringUtils.isNotBlank(searchId)) {
          String[] id = searchId.split("/", 2);
          if (id.length == 2) {
            String dataSource = id[1];
            String identifier = id[0];
            WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(dataSource, identifier);
            if (workspaceEntity != null) {
              String name = (String) result.get("name");
              String description = (String) result.get("description");
              if (StringUtils.isNotBlank(name)) {
                workspaces.add(createRestModel(workspaceEntity, name, description));
              }
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
  @RESTPermitUnimplemented
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
  
  @PUT
  @Path("/workspaces/{WORKSPACEENTITYID}")
  @RESTPermitUnimplemented
  public Response updateWorkspace(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, fi.muikku.plugins.workspace.rest.model.Workspace payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceEntity #%d not found", workspaceEntityId)).build();
    }
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.PUBLISH_WORKSPACE, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if ((payload.getArchived() != null) && payload.getArchived()) {
      return Response.status(Status.NOT_IMPLEMENTED).entity("Archiving workspaces is currently unimplemented").build();
    }

    Workspace workspace = null;
    try {
      workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace == null) {
        return Response.status(Status.NOT_FOUND).entity(String.format("Could not find a workspace for WorkspaceEntity #%d", workspaceEntityId)).build();
      }
    } catch (Exception e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Failed to retrieve workspace from school data source (%s)", e.getMessage())).build();
    }

    if ((payload.getDescription() != null) || (payload.getName() != null)) {
      try {
        if ((!StringUtils.equals(payload.getName(), workspace.getName())) || (!StringUtils.equals(payload.getDescription(), workspace.getDescription()))) {
          workspace.setName(payload.getName());
          workspace.setDescription(payload.getDescription());
          workspace = workspaceController.updateWorkspace(workspace);
        }
      } catch (Exception e) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Failed to update workspace data into school data source (%s)", e.getMessage())).build();
      }
    }
    
    if (payload.getNumVisits() != null) {
      if (workspaceVisitController.getNumVisits(workspaceEntity) != payload.getNumVisits().longValue()) {
        return Response.status(Status.NOT_IMPLEMENTED).entity("Updating number of visit via this endpoint is currently unimplemented").build();
      }
    }
    
    if (payload.getLastVisit() != null) {
      if (workspaceVisitController.getLastVisit(workspaceEntity).equals(payload.getLastVisit())) {
        return Response.status(Status.NOT_IMPLEMENTED).entity("Updating last visit via this endpoint is currently unimplemented").build();
      }
    }
    
    if (payload.getPublished() != null && !workspaceEntity.getPublished().equals(payload.getPublished())) {
      workspaceEntityController.updatePublished(workspaceEntity, payload.getPublished());
    }
    
    // Reindex the workspace so that Elasticsearch can react to publish/unpublish 
    workspaceIndexer.indexWorkspace(workspaceEntity);
    
    return Response.ok(createRestModel(workspaceEntity, workspace.getName(), workspace.getDescription())).build();
  }

  @GET
  @Path("/workspaces/{ID}/users")
  @RESTPermitUnimplemented
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
    
    boolean canList = false;
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    Long loggedUserId = userEntity == null ? null : userEntity.getId();
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUsers) {
      if (workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity().getId().equals(loggedUserId)) {
        canList = true;
        break;
      }
    }
    
    if ("TEACHER".equals(roleArchetype)) {
      canList = true;
    }
    
    if (sessionController.hasCoursePermission(MuikkuPermissions.LIST_WORKSPACE_STUDENTS,
                                              workspaceEntity)) {
      canList = true;
    }
    
    if (canList) {
      return Response.ok(createRestModel(workspaceUsers.toArray(new WorkspaceUserEntity[0]))).build();
    } else {
      return Response.status(Status.FORBIDDEN).entity("You must be enrolled").build();
    }
  }
  


  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/users/{WORKSPACEUSERENTITYID}")
  @RESTPermitUnimplemented
  public Response findWorkspaceUser(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId) {
    // TODO: Security
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceEntity could not be found").build();
    }
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceUserEntity could not be found").build();
    }
    
    return Response.ok(createRestModel(workspaceUserEntity)).build();
  }

  @POST
  @Path("/workspaces/{ID}/users")
  @RESTPermitUnimplemented
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

    List<WorkspaceUserEntity> workspaceTeachers = workspaceUserEntityController.listWorkspaceUserEntitiesByRoleArchetype(workspaceEntity,
        WorkspaceRoleArchetype.TEACHER);
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
  @RESTPermitUnimplemented
  public Response createWorkspaceUserSignup(@PathParam("ID") Long workspaceEntityId,
      fi.muikku.plugins.workspace.rest.model.WorkspaceUserSignup entity) {
    // TODO: Security

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

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
  @RESTPermitUnimplemented
  public Response createWorkspaceMaterial(@PathParam("ID") Long workspaceEntityId,
      fi.muikku.plugins.workspace.rest.model.WorkspaceMaterial entity) {

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
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

    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.createWorkspaceMaterial(parent, material, entity.getAssignmentType(), entity.getCorrectAnswers());
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
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/")
  @RESTPermitUnimplemented
  public Response listWorkspaceMaterials(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @QueryParam("parentId") Long parentId, @QueryParam ("assignmentType") String assignmentType) {
    // TODO: SecuritY???
    
    if (parentId == null && assignmentType == null) {
      return Response.status(Status.NOT_IMPLEMENTED).entity("Listing workspace materials without parentId or assignmentType is currently not implemented").build();
    }
    
    WorkspaceMaterialAssignmentType workspaceAssignmentType = null;
    
    if (assignmentType != null) {
      workspaceAssignmentType = WorkspaceMaterialAssignmentType.valueOf(assignmentType);
      if (workspaceAssignmentType == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid assignmentType parameter").build();
      }
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Could not find a workspace entity").build();
    }
    
    List<WorkspaceMaterial> workspaceMaterials = null;
    
    if (parentId != null) {
      WorkspaceNode parent = workspaceMaterialController.findWorkspaceNodeById(parentId);
      if (parent == null) {
        return Response.status(Status.BAD_REQUEST).entity("Given workspace parent material does not exist").build();
      }
      
      WorkspaceRootFolder rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(parent);
      if (rootFolder == null) {
        return Response.status(Status.BAD_REQUEST).entity("Could not find a workspace root folder").build();
      }
      
      if (!rootFolder.getWorkspaceEntityId().equals(workspaceEntityId)) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid parentId").build();
      }

      if (assignmentType != null) {
        // TODO: support for invisible materials
        workspaceMaterials = workspaceMaterialController.listVisibleWorkspaceMaterialsByParentAndAssignmentType(parent, workspaceEntity, workspaceAssignmentType);
      } else {
        workspaceMaterials = workspaceMaterialController.listWorkspaceMaterialsByParent(parent);
      }
    } else {
      // TODO: support for invisible materials
      workspaceMaterials = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(workspaceEntity, workspaceAssignmentType);
    }
    
    if (workspaceMaterials.isEmpty()) {
      return Response.noContent().build();
    }
    
    return Response.ok(createRestModel(workspaceMaterials.toArray(new WorkspaceMaterial[0]))).build();
  } 

  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{ID}")
  @RESTPermitUnimplemented
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
  @Path("/workspaces/{WORKSPACEENTITYID}/compositeReplies")
  @RESTPermitUnimplemented
  public Response getWorkspaceMaterialAnswers(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    // TODO: Correct workspace entity?
    // TODO: Available to all logged-in users?
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build();
    }
    
    List<WorkspaceCompositeReply> result = new ArrayList<>();
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Workspace could not be found").build();
    }
    
    try {
      List<fi.muikku.plugins.workspace.model.WorkspaceMaterialReply> replies = workspaceMaterialReplyController.listVisibleWorkspaceMaterialRepliesByWorkspaceEntity(workspaceEntity, sessionController.getLoggedUserEntity());
      
      for (fi.muikku.plugins.workspace.model.WorkspaceMaterialReply reply : replies) {
        List<WorkspaceMaterialFieldAnswer> answers = new ArrayList<>();

        List<WorkspaceMaterialField> fields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByWorkspaceMaterial(reply.getWorkspaceMaterial());
        for (WorkspaceMaterialField field : fields) {
          String value = workspaceMaterialFieldController.retrieveFieldValue(field, reply);
          Material material = field.getQueryField().getMaterial();
          WorkspaceMaterialFieldAnswer answer = new WorkspaceMaterialFieldAnswer(reply.getWorkspaceMaterial().getId(), material.getId(), field.getEmbedId(), field.getQueryField().getName(), value);
          answers.add(answer);
        }
        
        result.add(new WorkspaceCompositeReply(reply.getWorkspaceMaterial().getId(), reply.getState(), answers));
      }

      if (result.isEmpty()) {
        return Response.noContent().build();
      }
    } catch (WorkspaceFieldIOException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Internal error occurred while retrieving field answers: " + e.getMessage()).build();
    }
    
    return Response.ok(result).build();
  }

  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/compositeMaterialReplies")
  @RESTPermitUnimplemented
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
      
      WorkspaceMaterialCompositeReply result = new WorkspaceMaterialCompositeReply(answers, 
        reply != null ? reply.getState() : null, 
        reply != null ? reply.getCreated() : null, 
        reply != null ? reply.getLastModified() : null, 
        reply != null ? reply.getSubmitted() : null, 
        reply != null ? reply.getWithdrawn() : null
      );

      return Response.ok(result).build();
    } catch (WorkspaceFieldIOException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Internal error occurred while retrieving field answers: " + e.getMessage()).build();
    }
  }

  @GET
  @Path("/fileanswer/{FILEID}")
  @RESTPermitUnimplemented
  public Response getFileAnswer(@PathParam("FILEID") String fileId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    WorkspaceMaterialFileFieldAnswerFile answerFile = workspaceMaterialFieldAnswerController.findWorkspaceMaterialFileFieldAnswerFileByFileId(fileId);
    if (answerFile != null) {
      // TODO Security; only allow if userEntity is current user or workspace teacher
      //WorkspaceMaterialFileFieldAnswer fieldAnswer = answerFile.getFieldAnswer();
      //fi.muikku.plugins.workspace.model.WorkspaceMaterialReply reply = fieldAnswer.getReply();
      //WorkspaceMaterial workspaceMaterial = reply.getWorkspaceMaterial();
      //Long workspaceEntityId = workspaceMaterialController.getWorkspaceEntityId(workspaceMaterial);
      //WorkspaceEntity workspace = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      //UserEntity userEntity = userEntityController.findUserEntityById(reply.getUserEntityId());
      return Response.ok(answerFile.getContent())
        .type(answerFile.getContentType())
        .header("content-disposition", "attachment; filename =" + answerFile.getFileName())
        .build();
    }
    return Response.status(Status.NOT_FOUND).build();
  }

  @GET
  // @Path ("/workspaces/{WORKSPACEENTITYID:[0-9]*}/materials/{WORKSPACEMATERIALID:[0-9]*}/replies")
  @Path ("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/replies")
  @RESTPermitUnimplemented
  public Response listWorkspaceMaterialReplies(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, @QueryParam ("userEntityId") Long userEntityId) {
    // TODO: Security!

    if (userEntityId == null) {
      return Response.status(Status.NOT_IMPLEMENTED).entity("Currently listing must be filtered by userEntityId").build(); 
    }
    
    UserEntity loggedUser = sessionController.getLoggedUserEntity();
    if (loggedUser == null) {
      return Response.status(Status.UNAUTHORIZED).entity("Unauthorized").build(); 
    }

    if (!userEntityId.equals(loggedUser.getId())) {
      return Response.status(Status.UNAUTHORIZED).entity("Not permitted to list another user's replies").build(); 
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Could not find workspace entity").build(); 
    }
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("Could not find workspace material").build(); 
    }
    
    WorkspaceRootFolder workspaceRootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial);
    if (workspaceRootFolder == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Could not find workspace root folder").build(); 
    }
    
    if (!workspaceRootFolder.getWorkspaceEntityId().equals(workspaceEntity.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid workspace material id or workspace entity id").build(); 
    }
    
    fi.muikku.plugins.workspace.model.WorkspaceMaterialReply materialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, loggedUser);
    if (materialReply != null) {
      return Response.ok(createRestModel(new fi.muikku.plugins.workspace.model.WorkspaceMaterialReply[] { materialReply })).build();
    } else {
      return Response.ok(createRestModel(new fi.muikku.plugins.workspace.model.WorkspaceMaterialReply[] { })).build();
    }
  }
  
  @POST
  // @Path ("/workspaces/{WORKSPACEENTITYID:[0-9]*}/materials/{WORKSPACEMATERIALID:[0-9]*}/replies")
  @Path ("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/replies")
  @RESTPermitUnimplemented
  public Response createWorkspaceMaterialReply(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, WorkspaceMaterialReply payload) {
    // TODO: Security!
    
    if (payload == null) {
      return Response.status(Status.BAD_REQUEST).entity("Payload is missing").build(); 
    }

    if (payload.getState() == null) {
      return Response.status(Status.BAD_REQUEST).entity("State is missing").build(); 
    }

    UserEntity loggedUser = sessionController.getLoggedUserEntity();
    if (loggedUser == null) {
      return Response.status(Status.UNAUTHORIZED).entity("Unauthorized").build(); 
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Could not find workspace entity").build(); 
    }
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("Could not find workspace material").build(); 
    }
    
    WorkspaceRootFolder workspaceRootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial);
    if (workspaceRootFolder == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Could not find workspace root folder").build(); 
    }
    
    if (!workspaceRootFolder.getWorkspaceEntityId().equals(workspaceEntity.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid workspace material id or workspace entity id").build(); 
    }
    
    fi.muikku.plugins.workspace.model.WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, payload.getState(), loggedUser);
    
    return Response.ok(createRestModel(workspaceMaterialReply)).build();
  }
  
  @PUT
  // @Path ("/workspaces/{WORKSPACEENTITYID:[0-9]*}/materials/{WORKSPACEMATERIALID:[0-9]*}/replies/{REPLYID:[0-9]*}")
  @Path ("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/replies/{REPLYID}")
  @RESTPermitUnimplemented
  public Response createWorkspaceMaterialReply(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, @PathParam ("REPLYID") Long workspaceMaterialReplyId, WorkspaceMaterialReply payload) {
    // TODO: Security!
    
    if (payload == null) {
      return Response.status(Status.BAD_REQUEST).entity("Payload is missing").build(); 
    }
    
    UserEntity loggedUser = sessionController.getLoggedUserEntity();
    if (loggedUser == null) {
      return Response.status(Status.UNAUTHORIZED).entity("Unauthorized").build(); 
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Could not find workspace entity").build(); 
    }
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("Could not find workspace material").build(); 
    }
    
    WorkspaceRootFolder workspaceRootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial);
    if (workspaceRootFolder == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Could not find workspace root folder").build(); 
    }
    
    if (!workspaceRootFolder.getWorkspaceEntityId().equals(workspaceEntity.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid workspace material id or workspace entity id").build(); 
    }

    fi.muikku.plugins.workspace.model.WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyById(workspaceMaterialReplyId);
    if (workspaceMaterialReply == null) {
      return Response.status(Status.NOT_FOUND).entity("Could not find workspace material reply").build(); 
    }
    
    workspaceMaterialReplyController.updateWorkspaceMaterialReply(workspaceMaterialReply, payload.getState());
    
    return Response.noContent().build();
  }
  
  private List<WorkspaceMaterialReply> createRestModel(fi.muikku.plugins.workspace.model.WorkspaceMaterialReply... entries) {
    List<fi.muikku.plugins.workspace.rest.model.WorkspaceMaterialReply> result = new ArrayList<>();

    for (fi.muikku.plugins.workspace.model.WorkspaceMaterialReply entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }
  
  private WorkspaceMaterialReply createRestModel(fi.muikku.plugins.workspace.model.WorkspaceMaterialReply entity) {
    return new WorkspaceMaterialReply(entity.getId(), entity.getState());
  }

  private List<fi.muikku.plugins.workspace.rest.model.WorkspaceMaterial> createRestModel(WorkspaceMaterial... entries) {
    List<fi.muikku.plugins.workspace.rest.model.WorkspaceMaterial> result = new ArrayList<>();

    for (WorkspaceMaterial entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }
  
  private fi.muikku.plugins.workspace.rest.model.WorkspaceAssessment createRestModel(WorkspaceEntity workspaceEntity, fi.muikku.schooldata.entity.WorkspaceAssessment entry) {
    UserEntity assessor = userEntityController.findUserEntityByDataSourceAndIdentifier(entry.getAssessingUserSchoolDataSource(), entry.getAssessingUserIdentifier());
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndIdentifier(workspaceEntity, entry.getWorkspaceUserIdentifier());
    
    return new fi.muikku.plugins.workspace.rest.model.WorkspaceAssessment(
      entry.getIdentifier(),
      entry.getDate(),
      assessor != null ? assessor.getId() : null,
      workspaceUserEntity != null ? workspaceUserEntity.getId() : null,
      entry.getGradingScaleIdentifier(),
      entry.getGradingScaleSchoolDataSource(),
      entry.getGradeIdentifier(),
      entry.getGradeSchoolDataSource(),
      entry.getVerbalAssessment()
    ); 
  }
  
  private List<fi.muikku.plugins.workspace.rest.model.WorkspaceAssessment> createRestModel(WorkspaceEntity workspaceEntity, fi.muikku.schooldata.entity.WorkspaceAssessment... entries) {
    List<fi.muikku.plugins.workspace.rest.model.WorkspaceAssessment> result = new ArrayList<>();

    for (fi.muikku.schooldata.entity.WorkspaceAssessment entry : entries) {
      result.add(createRestModel(workspaceEntity, entry));
    }

    return result;
  }
  
  private fi.muikku.plugins.workspace.rest.model.WorkspaceMaterial createRestModel(WorkspaceMaterial workspaceMaterial) {
    WorkspaceNode workspaceNode = workspaceMaterialController.findWorkspaceNodeNextSibling(workspaceMaterial);
    Long nextSiblingId = workspaceNode != null ? workspaceNode.getId() : null;
    
    return new fi.muikku.plugins.workspace.rest.model.WorkspaceMaterial(workspaceMaterial.getId(), workspaceMaterial.getMaterialId(),
        workspaceMaterial.getParent() != null ? workspaceMaterial.getParent().getId() : null, nextSiblingId, workspaceMaterial.getHidden(), 
        workspaceMaterial.getAssignmentType(), workspaceMaterial.getCorrectAnswers(), workspaceMaterial.getPath(), workspaceMaterial.getTitle());
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
        workspaceEntity.getArchived(), workspaceEntity.getPublished(), name, description, numVisits, lastVisit);
  }

  private fi.muikku.plugins.workspace.rest.model.WorkspaceFolder createRestModel(WorkspaceFolder workspaceFolder) {
    WorkspaceNode nextSibling = workspaceMaterialController.findWorkspaceNodeNextSibling(workspaceFolder);
    return new fi.muikku.plugins.workspace.rest.model.WorkspaceFolder(
        workspaceFolder.getId(),
        workspaceFolder.getParent() == null ? null : workspaceFolder.getParent().getId(),
        nextSibling == null ? null : nextSibling.getId(),
        workspaceFolder.getHidden(),
        workspaceFolder.getTitle());
  }

  private fi.muikku.plugins.workspace.rest.model.WorkspaceUserSignup createRestModel(WorkspaceUserSignup signup) {
    return new fi.muikku.plugins.workspace.rest.model.WorkspaceUserSignup(signup.getId(), signup.getWorkspaceEntity().getId(), signup
        .getUserEntity().getId(), signup.getDate(), signup.getMessage());
  }

  @DELETE
  @Path("/workspaces/{WORKSPACEID}/materials/{WORKSPACEMATERIALID}")
  @RESTPermitUnimplemented
  public Response deleteNode(@PathParam("WORKSPACEID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, @QueryParam ("removeAnswers") Boolean removeAnswers) {
    // TODO Our workspace?
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
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
  
  @GET
  @Path("/workspaces/{WORKSPACEID}/folders/{WORKSPACEFOLDERID}")
  @RESTPermitUnimplemented
  public Response getWorkspaceFolder(
      @PathParam("WORKSPACEID") Long workspaceEntityId,
      @PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {

    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    // WorkspaceFolder
    WorkspaceFolder workspaceFolder = workspaceMaterialController.findWorkspaceFolderById(workspaceFolderId);
    if (workspaceFolder == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    return Response.ok(createRestModel(workspaceFolder)).build();
  }

  @DELETE
  @Path("/workspaces/{WORKSPACEID}/folders/{WORKSPACEFOLDERID}")
  @RESTPermitUnimplemented
  public Response deleteWorkspaceFolder(
      @PathParam("WORKSPACEID") Long workspaceEntityId,
      @PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build();
    }
    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // WorkspaceFolder
    WorkspaceFolder workspaceFolder = workspaceMaterialController.findWorkspaceFolderById(workspaceFolderId);
    if (workspaceFolder != null) {
      workspaceMaterialController.deleteWorkspaceFolder(workspaceFolder);
    }

    return Response.ok(createRestModel(workspaceFolder)).build();
  }
  
  @PUT
  @Path("/workspaces/{WORKSPACEID}/folders/{WORKSPACEFOLDERID}")
  @RESTPermitUnimplemented
  public Response updateWorkspaceFolder(
      @PathParam("WORKSPACEID") Long workspaceEntityId,
      @PathParam("WORKSPACEFOLDERID") Long workspaceFolderId,
      fi.muikku.plugins.workspace.rest.model.WorkspaceFolder restFolder) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build();
    }
    
    if (restFolder == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // WorkspaceFolder
    WorkspaceFolder workspaceFolder = workspaceMaterialController.findWorkspaceFolderById(restFolder.getId());
    if (workspaceFolder == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace folder belongs to workspace check
    
    Long folderWorkspaceEntityId = workspaceMaterialController.getWorkspaceEntityId(workspaceFolder);
    if (!folderWorkspaceEntityId.equals(workspaceEntityId)) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Actual update
    
    WorkspaceNode parentNode = restFolder.getParentId() == null ? null : workspaceMaterialController.findWorkspaceNodeById(restFolder.getParentId());
    WorkspaceNode nextSibling = restFolder.getNextSiblingId() == null ? null : workspaceMaterialController.findWorkspaceNodeById(restFolder.getNextSiblingId());
    Boolean hidden = restFolder.getHidden();
    String title = restFolder.getTitle();
    
    workspaceMaterialController.updateWorkspaceFolder(workspaceFolder, title, parentNode, nextSibling, hidden);
    return Response.noContent().build();
  }

  @POST
  @Path("/workspaces/{WORKSPACEID}/folders/")
  @RESTPermitUnimplemented
  public Response createWorkspaceFolder(
      @PathParam("WORKSPACEID") Long workspaceEntityId,
      fi.muikku.plugins.workspace.rest.model.WorkspaceFolder restFolder) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build();
    }
    
    if (restFolder == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    WorkspaceNode rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    WorkspaceNode nextSibling = restFolder.getNextSiblingId() == null ? null : workspaceMaterialController.findWorkspaceNodeById(restFolder.getNextSiblingId());
    
    WorkspaceFolder workspaceFolder = workspaceMaterialController.createWorkspaceFolder(rootFolder, "Untitled");
    if (nextSibling != null) {
        workspaceMaterialController.moveAbove(workspaceFolder, nextSibling);
    }
    return Response.ok(createRestModel(workspaceFolder)).build();
  }

  @PUT
  @Path("/workspaces/{WORKSPACEID}/materials/{WORKSPACEMATERIALID}")
  @RESTPermitUnimplemented
  // TODO @LoggedIn
  public Response updateWorkspaceMaterial(@PathParam("WORKSPACEID") Long workspaceEntityId,
      @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, fi.muikku.plugins.workspace.rest.model.WorkspaceMaterial workspaceMaterial) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build();
    }
    
    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
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
    String title = workspaceMaterial.getTitle();
    Boolean hidden = workspaceMaterial.getHidden();
    workspaceMaterialController.updateWorkspaceNode(workspaceNode, materialId, parentNode, nextSibling, hidden,
        workspaceMaterial.getAssignmentType(), workspaceMaterial.getCorrectAnswers(), title);
    return Response.noContent().build();
  }
  
  @PUT
  @Path("/workspaces/{WORKSPACEENTITYID}/assessments/{ID}")
  @RESTPermitUnimplemented
  public Response updateWorkspaceAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("ID") String workspaceAssesmentIdentifier, WorkspaceAssessment payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.EVALUATE_USER, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (payload.getEvaluated() == null) {
      return Response.status(Status.BAD_REQUEST).entity("evaluated is missing").build(); 
    }
    
    if (payload.getAssessorEntityId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessorEntityId is missing").build(); 
    }
    
    if (payload.getGradeSchoolDataSource() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeSchoolDataSource is missing").build(); 
    }
    
    if (payload.getGradeIdentifier() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeIdentifier is missing").build(); 
    }

    UserEntity assessor = userEntityController.findUserEntityById(payload.getAssessorEntityId());
    User assessingUser = userController.findUserByUserEntityDefaults(assessor);
    GradingScale gradingScale = gradingController.findGradingScale(payload.getGradingScaleSchoolDataSource(), payload.getGradingScaleIdentifier());
    GradingScaleItem grade = gradingController.findGradingScaleItem(gradingScale, payload.getGradeSchoolDataSource(), payload.getGradeIdentifier());
    
    if (assessor == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessor is invalid").build(); 
    }
    
    if (gradingScale == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradingScale is invalid").build(); 
    }
    
    if (grade == null) {
      return Response.status(Status.BAD_REQUEST).entity("grade is invalid").build(); 
    }
    
    WorkspaceUserEntity workspaceStudentEntity = workspaceUserEntityController.findWorkspaceUserEntityById(payload.getWorkspaceUserEntityId());
    if (workspaceStudentEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("WorkspaceUserEntityId is invalid").build();
    }
    
    if (!workspaceStudentEntity.getWorkspaceEntity().getId().equals(workspaceEntity.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("WorkspaceUserEntityId is invalid").build();
    }

    fi.muikku.schooldata.entity.WorkspaceUser workspaceStudent = workspaceController.findWorkspaceUser(workspaceStudentEntity);
    
    Date evaluated = payload.getEvaluated();
    
    return Response.ok(createRestModel(workspaceEntity, gradingController.updateWorkspaceAssessment(workspaceStudent.getSchoolDataSource(), workspaceAssesmentIdentifier, workspaceStudent, assessingUser, grade, payload.getVerbalAssessment(), evaluated))).build();
  }
  
  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/assessments/")
  @RESTPermitUnimplemented
  public Response createWorkspaceAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, WorkspaceAssessment payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.EVALUATE_USER, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (payload.getEvaluated() == null) {
      return Response.status(Status.BAD_REQUEST).entity("evaluated is missing").build(); 
    }
    
    if (payload.getAssessorEntityId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessorEntityId is missing").build(); 
    }
    
    if (payload.getGradeSchoolDataSource() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeSchoolDataSource is missing").build(); 
    }
    
    if (payload.getGradeIdentifier() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeIdentifier is missing").build(); 
    }

    UserEntity assessor = userEntityController.findUserEntityById(payload.getAssessorEntityId());
    User assessingUser = userController.findUserByUserEntityDefaults(assessor);
    GradingScale gradingScale = gradingController.findGradingScale(payload.getGradingScaleSchoolDataSource(), payload.getGradingScaleIdentifier());
    GradingScaleItem grade = gradingController.findGradingScaleItem(gradingScale, payload.getGradeSchoolDataSource(), payload.getGradeIdentifier());
    
    if (assessor == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessor is invalid").build(); 
    }
    
    if (gradingScale == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradingScale is invalid").build(); 
    }
    
    if (grade == null) {
      return Response.status(Status.BAD_REQUEST).entity("grade is invalid").build(); 
    }
    
    WorkspaceUserEntity workspaceStudentEntity = workspaceUserEntityController.findWorkspaceUserEntityById(payload.getWorkspaceUserEntityId());
    if (workspaceStudentEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("WorkspaceUserEntityId is invalid").build();
    }
    
    if (!workspaceStudentEntity.getWorkspaceEntity().getId().equals(workspaceEntity.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("WorkspaceUserEntityId is invalid").build();
    }

    fi.muikku.schooldata.entity.WorkspaceUser workspaceStudent = workspaceController.findWorkspaceUser(workspaceStudentEntity);
    
    Date evaluated = payload.getEvaluated();
    
    return Response.ok(createRestModel(workspaceEntity, gradingController.createWorkspaceAssessment(workspaceStudent.getSchoolDataSource(), workspaceStudent, assessingUser, grade, payload.getVerbalAssessment(), evaluated))).build();
  }

  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/assessments/")
  @RESTPermitUnimplemented
  public Response listWorkspaceAssessments(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @QueryParam ("userEntityId") Long userEntityId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    if (userEntityId == null) {
      return Response.status(Status.NOT_IMPLEMENTED).entity("Listing workspace assessments without userEntityId is not implemented yet").build();
    }
    
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("userEntityId is invalid").build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.getLoggedUserEntity().getId().equals(userEntity.getId())) {
      if (!sessionController.hasCoursePermission(MuikkuPermissions.VIEW_USER_EVALUATION, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
    if (environmentUser == null || (environmentUser.getRole().getArchetype() != EnvironmentRoleArchetype.STUDENT)) {
      return Response.noContent().build();
    }
    
    List<fi.muikku.schooldata.entity.WorkspaceAssessment> assessments = gradingController.listWorkspaceAssessments(workspaceEntity.getDataSource(), workspaceEntity.getIdentifier(), userEntity.getDefaultIdentifier());
    if (assessments.isEmpty()) {
      return Response.noContent().build();
    }
    
    return Response.ok(createRestModel(workspaceEntity, assessments.toArray(new fi.muikku.schooldata.entity.WorkspaceAssessment[0]))).build();
  }
  
  @GET
  @Path("/workspaces/{WORKSPACEID}/journal")
  @RESTPermitUnimplemented
  public Response listJournalEntries(@PathParam("WORKSPACEID") Long workspaceEntityId) {
    List<WorkspaceJournalEntry> entries = new ArrayList<>();
    List<WorkspaceJournalEntryRESTModel> result = new ArrayList<>();
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    if (!sessionController.hasCoursePermission(MuikkuPermissions.LIST_ALL_JOURNAL_ENTRIES, workspaceEntity)) {
      entries = workspaceJournalController.listEntries(workspaceController.findWorkspaceEntityById(workspaceEntityId));
    } else {
      entries = workspaceJournalController.listEntriesByWorkspaceEntityAndUserEntity(workspaceEntity, userEntity);
    }
    
    for (WorkspaceJournalEntry entry : entries) {
      result.add(new WorkspaceJournalEntryRESTModel(
          entry.getId(),
          entry.getWorkspaceEntityId(),
          entry.getUserEntityId(),
          entry.getHtml(),
          entry.getTitle(),
          entry.getCreated()
      ));
    }

    return Response.ok(entries).build();
  }

  @POST
  @Path("/workspaces/{WORKSPACEID}/journal")
  @RESTPermitUnimplemented
  public Response addJournalEntry(@PathParam("WORKSPACEID") Long workspaceEntityId,
                                  WorkspaceJournalEntryRESTModel restModel) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    workspaceJournalController.createJournalEntry(
        workspaceController.findWorkspaceEntityById(workspaceEntityId),
        sessionController.getLoggedUserEntity(),
        restModel.getContent(),
        restModel.getTitle());
    return Response.noContent().build();
  }

  @PUT
  @Path("/journal/{JOURNALENTRYID}")
  @RESTPermitUnimplemented
  public Response updateJournalEntry(@PathParam("JOURNALENTRYID") Long journalEntryId,
                                     WorkspaceJournalEntryRESTModel restModel) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceJournalEntry workspaceJournalEntry = workspaceJournalController.findJournalEntry(journalEntryId);
    if (workspaceJournalEntry == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    workspaceJournalController.updateJournalEntry(
        journalEntryId,
        restModel.getTitle(),
        restModel.getContent());

    return Response.noContent().build();
  }
  
  

}
