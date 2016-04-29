package fi.otavanopisto.muikku.plugins.workspace.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
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
import org.joda.time.DateTime;

import fi.otavanopisto.muikku.controller.messaging.MessagingWidget;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialProducer;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.material.MaterialController;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.search.WorkspaceIndexer;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceJournalController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialDeleteError;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialFieldController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceVisitController;
import fi.otavanopisto.muikku.plugins.workspace.fieldio.WorkspaceFieldIOException;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalEntry;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceAssessment;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceCompositeReply;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceDetails;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceFeeInfo;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceJournalEntryRESTModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterialCompositeReply;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterialFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceStaffMember;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceStudent;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceType;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/workspace")
public class WorkspaceRESTService extends PluginRESTService {

  private static final long serialVersionUID = -5286350366083446537L;
  
  @Inject
  private Logger logger;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private CourseMetaController courseMetaController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private AssessmentRequestController assessmentRequestController;

  @Inject
  private SessionController sessionController;

  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;
  
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
  private WorkspaceVisitController workspaceVisitController;

  @Inject
  private GradingController gradingController;
  
  @Inject
  private WorkspaceIndexer workspaceIndexer;
  
  @Inject
  private WorkspaceJournalController workspaceJournalController;
  
  @Inject
  private CommunicatorController communicatorController;
  
  @Inject
  private LocaleController localeController;
  
  @Inject
  private CopiedWorkspaceEntityFinder copiedWorkspaceEntityFinder;
  
  @GET
  @Path("/workspaceTypes")
  @RESTPermit (requireLoggedIn = false, handling = Handling.UNSECURED)
  public Response listWorkspaceTypes() {
    List<WorkspaceType> types = workspaceController.listWorkspaceTypes();  
    return Response.ok(createRestModel(types.toArray(new WorkspaceType[0]))).build();
  }
  
  @GET
  @Path("/educationTypes")
  @RESTPermit (requireLoggedIn = false, handling = Handling.UNSECURED)
  public Response listEducationTypes() {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<EducationType> types = courseMetaController.listEducationTypes();
      return Response.ok(createRestModel(types.toArray(new EducationType[0]))).build();
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }

  @POST
  @Path("/workspaces/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspace(@QueryParam ("sourceWorkspaceIdentifier") String sourceWorkspaceId, @QueryParam ("sourceWorkspaceEntityId") Long sourceWorkspaceEntityId, fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace payload) {
    SchoolDataIdentifier workspaceIdentifier = null;
    if (sourceWorkspaceId != null) {
      workspaceIdentifier = SchoolDataIdentifier.fromId(sourceWorkspaceId);
      if (workspaceIdentifier == null) {
        return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid source workspace identifier %s", sourceWorkspaceId)).build();
      }
    }
    
    if (sourceWorkspaceEntityId != null) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(sourceWorkspaceEntityId);
      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid source workspace entity id %d", sourceWorkspaceEntityId)).build();
      }
      
      workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
    }
    
    if (workspaceIdentifier == null) {
      return Response.status(Status.NOT_IMPLEMENTED).entity("Creating new workspaces without sourceWorkspace is not not implemented yet").build();
    }
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.COPY_WORKSPACE)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (StringUtils.isBlank(payload.getName())) {
      return Response.status(Status.BAD_REQUEST).entity("Name is required").build();
    }
    
    Workspace workspace = workspaceController.copyWorkspace(workspaceIdentifier, payload.getName(), payload.getNameExtension(), payload.getDescription());
    if (workspace == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Failed to create copy of workspace %s", sourceWorkspaceId)).build();
    }
    
    WorkspaceEntity workspaceEntity = findCopiedWorkspaceEntity(workspace);
    if (workspaceEntity == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Failed to create local copy of workspace %s", sourceWorkspaceId)).build();
    }
   
    return Response
        .ok(createRestModel(workspaceEntity, workspace.getName(), workspace.getNameExtension(), workspace.getDescription()))
        .build();
  }

  private WorkspaceEntity findCopiedWorkspaceEntity(Workspace workspace) {
    WorkspaceEntity result = null;
    
    long timeoutTime = System.currentTimeMillis() + 60000;    
    
    while (result == null) {
      result = copiedWorkspaceEntityFinder.findCopiedWorkspaceEntity(workspace);
    
      if (System.currentTimeMillis() > timeoutTime) {
        logger.severe("Timeouted when waiting for copied workspace entity");
        return null;
      }
      
      if (result == null) {
        try {
          Thread.sleep(10);
        } catch (InterruptedException e) {
        }
      }
    }
    
    return result;
  }

  @GET
  @Path("/workspaces/")
  @RESTPermitUnimplemented
  public Response listWorkspaces(
        @QueryParam("userId") Long userEntityId,
        @QueryParam("userIdentifier") String userId,
        @QueryParam("includeArchivedWorkspaceUsers") @DefaultValue ("false") Boolean includeArchivedWorkspaceUsers,
        @QueryParam("search") String searchString,
        @QueryParam("subjects") List<String> subjects,
        @QueryParam("educationTypes") List<String> educationTypeIds,
        @QueryParam("minVisits") Long minVisits,
        @QueryParam("includeUnpublished") @DefaultValue ("false") Boolean includeUnpublished,
        @QueryParam("orderBy") List<String> orderBy,
        @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult,
        @QueryParam("maxResults") @DefaultValue ("50") Integer maxResults,
        @Context Request request) {
    List<fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace> workspaces = new ArrayList<>();

    boolean doMinVisitFilter = minVisits != null;
    UserEntity userEntity = userEntityId != null ? userEntityController.findUserEntityById(userEntityId) : null;
    List<WorkspaceEntity> workspaceEntities = null;
    String schoolDataSourceFilter = null;
    List<String> workspaceIdentifierFilters = null;
    
    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(userId);
    if (userIdentifier != null) {
      if (doMinVisitFilter && userEntity == null) {
        userEntity = userEntityController.findUserEntityByUserIdentifier(userIdentifier);
      }
    }
    
    if (includeArchivedWorkspaceUsers && (userIdentifier == null)) {
      return Response.status(Status.BAD_REQUEST).entity("includeArchivedWorkspaceUsers works only with userIdentifier parameter").build();
    }
    
    if (includeArchivedWorkspaceUsers && doMinVisitFilter) {
      return Response.status(Status.BAD_REQUEST).entity("includeArchivedWorkspaceUsers and doMinVisitFilter are ").build();
    }
    
    if (doMinVisitFilter) {
      if (!sessionController.isLoggedIn()) {
        return Response.status(Status.UNAUTHORIZED).entity("You need to be logged in to filter by visit count").build();
      }
      UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();
      workspaceEntities = workspaceVisitController.listEnrolledWorkspaceEntitiesByMinVisitsOrderByLastVisit(loggedUserEntity, minVisits);
    } else {
      if (userIdentifier != null) {
        if (includeArchivedWorkspaceUsers) {
          workspaceEntities = workspaceUserEntityController.listWorkspaceEntitiesByUserIdentifierIncludeArchived(userIdentifier);
        } else {
          workspaceEntities = workspaceUserEntityController.listWorkspaceEntitiesByUserIdentifier(userIdentifier);
        }
      } else if (userEntity != null) {
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
      
      List<Sort> sorts = null;
      
      if (orderBy != null && orderBy.contains("alphabet")) {
        sorts = new ArrayList<>();
        sorts.add(new Sort("name.untouched", Sort.Order.ASC));
      }
      
      List<SchoolDataIdentifier> educationTypes = null;
      if (educationTypeIds != null) {
        educationTypes = new ArrayList<>(educationTypeIds.size());
        for (String educationTypeId : educationTypeIds) {
          SchoolDataIdentifier educationTypeIdentifier = SchoolDataIdentifier.fromId(educationTypeId);
          if (educationTypeIdentifier != null) {
            educationTypes.add(educationTypeIdentifier);
          } else {
            return Response.status(Status.BAD_REQUEST).entity(String.format("Malformed education type identifier", educationTypeId)).build();
          }
        }
      }
      
      searchResult = searchProvider.searchWorkspaces(schoolDataSourceFilter, subjects, workspaceIdentifierFilters, educationTypes, searchString, null, null, includeUnpublished, firstResult, maxResults, sorts);
      
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
              String nameExtension = (String) result.get("nameExtension");
              
              if (StringUtils.isNotBlank(name)) {
                workspaces.add(createRestModel(workspaceEntity, name, nameExtension, description));
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
      Collections.sort(workspaces, new Comparator<fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace>() {
        @Override
        public int compare(fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace workspace1,
                           fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace workspace2) {
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

    return Response.ok(createRestModel(workspaceEntity, workspace.getName(), workspace.getNameExtension(), workspace.getDescription())).build();
  }
  
  @GET
  @Path("/workspaces/{ID}/details")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspaceDetails(@PathParam("ID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.VIEW_WORKSPACE_DETAILS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    String typeId = workspace.getWorkspaceTypeId() != null ? workspace.getWorkspaceTypeId().toId() : null;

    return Response.ok(new WorkspaceDetails(typeId, workspace.getBeginDate(), workspace.getEndDate(), workspace.getViewLink())).build();
  }
  
  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/materialProducers")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceMaterialProducer(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, WorkspaceMaterialProducer payload) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIAL_PRODUCERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    WorkspaceMaterialProducer materialProducer = workspaceController.createWorkspaceMaterialProducer(workspaceEntity, payload.getName());
    
    return Response
      .ok(createRestModel(materialProducer))
      .build();
  }  
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/materialProducers")
  @RESTPermit (handling = Handling.INLINE)
  public Response listWorkspaceMaterialProducers(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (workspaceEntity.getArchived()) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!workspaceEntity.getPublished()) {
      if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIAL_PRODUCERS, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIAL_PRODUCERS, workspaceEntity)) {
      switch (workspaceEntity.getAccess()) {
        case ANYONE:
        break;
        case LOGGED_IN:
          if (!sessionController.isLoggedIn()) {
            return Response.status(Status.UNAUTHORIZED).build();
          }
        break;
        case MEMBERS_ONLY:
          if (!sessionController.isLoggedIn()) {
            return Response.status(Status.UNAUTHORIZED).build();
          }
          
          WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());
          if (workspaceUserEntity == null) {
            if (!sessionController.hasCoursePermission(MuikkuPermissions.ACCESS_MEMBERS_ONLY_WORKSPACE, workspaceEntity)) {
              return Response.status(Status.FORBIDDEN).build();
            }
          }
        break;
      }
    }
    
    return Response
      .ok(createRestModel(workspaceController.listWorkspaceMaterialProducers(workspaceEntity).toArray(new WorkspaceMaterialProducer[0])))
      .build();
  }  
  
  @DELETE
  @Path("/workspaces/{WORKSPACEENTITYID}/materialProducers/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteWorkspaceMaterialProducer(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("ID") Long workspaceMaterialProducerId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIAL_PRODUCERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    WorkspaceMaterialProducer materialProducer = workspaceController.findWorkspaceMaterialProducer(workspaceMaterialProducerId);
    
    workspaceController.deleteWorkspaceMaterialProducer(materialProducer);
    
    return Response
      .noContent()
      .build();
  } 

  @PUT
  @Path("/workspaces/{ID}/details")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspaceDetails(@PathParam("ID") Long workspaceEntityId, WorkspaceDetails payload) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_DETAILS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if ((payload.getExternalViewUrl() != null) && (!StringUtils.equals(workspace.getViewLink(), payload.getExternalViewUrl()))) {
      return Response.status(Status.BAD_REQUEST).entity("externalViewUrl is read-only property").build();
    }
    
    SchoolDataIdentifier typeIdentifier = null;    
    if (payload.getTypeId() != null) {
      typeIdentifier = SchoolDataIdentifier.fromId(payload.getTypeId());
      if (typeIdentifier == null) {
        return Response.status(Status.BAD_REQUEST).entity(String.format("Invlid typeId %s", payload.getTypeId())).build();
      }
    }
    
    if (!isEqualDateTime(workspace.getBeginDate(), payload.getBeginDate()) || 
        !isEqualDateTime(workspace.getEndDate(), payload.getEndDate()) ||
        !Objects.equals(typeIdentifier, workspace.getWorkspaceTypeId())) {
      workspace.setBeginDate(payload.getBeginDate());
      workspace.setEndDate(payload.getEndDate());
      workspace.setWorkspaceTypeId(typeIdentifier);
      workspaceController.updateWorkspace(workspace);
    }
    

    String typeId = workspace.getWorkspaceTypeId() != null ? workspace.getWorkspaceTypeId().toId() : null;

    return Response.ok(new WorkspaceDetails(typeId, workspace.getBeginDate(), workspace.getEndDate(), workspace.getViewLink())).build();
  }
  
  private boolean isEqualDateTime(DateTime dateTime1, DateTime dateTime2) {
    if (dateTime1 == dateTime2) {
      return true;
    }
    
    if (dateTime1 != null) {
      return dateTime1.equals(dateTime2);
    } else {
      return dateTime2.equals(dateTime1);
    }
  }
  
  @PUT
  @Path("/workspaces/{WORKSPACEENTITYID}")
  @RESTPermitUnimplemented
  public Response updateWorkspace(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace payload) {
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
        if ((!StringUtils.equals(payload.getName(), workspace.getName())) || 
            (!StringUtils.equals(payload.getDescription(), workspace.getDescription())) || 
            (!StringUtils.equals(payload.getNameExtension(), workspace.getNameExtension()))) {
          workspace.setName(payload.getName());
          workspace.setNameExtension(payload.getNameExtension());
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
    
    workspaceEntityController.updateAccess(workspaceEntity, payload.getAccess());
    workspaceEntityController.updateDefaultMaterialLicense(workspaceEntity, payload.getMaterialDefaultLicense());
    
    // Reindex the workspace so that Elasticsearch can react to publish/unpublish 
    workspaceIndexer.indexWorkspace(workspaceEntity);
    
    return Response.ok(createRestModel(workspaceEntity, workspace.getName(), workspace.getNameExtension(), workspace.getDescription())).build();
  }
  
  @GET
  @Path("/workspaces/{ID}/students")
  @RESTPermit (handling = Handling.INLINE)
  public Response listWorkspaceStudents(@PathParam("ID") Long workspaceEntityId,
      @QueryParam("archived") Boolean archived,
      @QueryParam("requestedAssessment") Boolean requestedAssessment,
      @QueryParam("assessed") Boolean assessed,
      @QueryParam("studentIdentifier") String studentId,
      @QueryParam("orderBy") String orderBy) {
    
    SchoolDataIdentifier studentIdentifier = null;
    if (StringUtils.isNotBlank(studentId)) {    
      studentIdentifier = SchoolDataIdentifier.fromId(studentId);
      if (studentIdentifier == null) {
        return Response.status(Status.BAD_REQUEST).entity(String.format("Malformed student identifier %s", studentId)).build();
      }
    }
    
    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Access check
    if (!sessionController.hasCoursePermission(MuikkuPermissions.LIST_WORKSPACE_MEMBERS, workspaceEntity)) {
      if (studentIdentifier == null || !studentIdentifier.equals(sessionController.getLoggedUser())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    List<fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser> workspaceUsers = null;
    
    if (studentIdentifier != null) {
      workspaceUsers = new ArrayList<>();
      
      WorkspaceUser workspaceUser = workspaceController.findWorkspaceUserByWorkspaceEntityAndUser(workspaceEntity, studentIdentifier);
      if (workspaceUser != null) {
        workspaceUsers.add(workspaceUser);
      }
    } else {
      // Students via WorkspaceSchoolDataBridge
      workspaceUsers = workspaceController.listWorkspaceStudents(workspaceEntity);
    }
    
    if (workspaceUsers == null || workspaceUsers.isEmpty()) {
      return Response.noContent().build();
    }

    List<WorkspaceStudent> result = null;
    result = new ArrayList<>();

    Map<String, WorkspaceUserEntity> workspaceUserEntityMap = new HashMap<>();
    List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listWorkspaceUserEntities(workspaceEntity);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      workspaceUserEntityMap.put(new SchoolDataIdentifier(workspaceUserEntity.getIdentifier(), workspaceUserEntity.getUserSchoolDataIdentifier().getDataSource().getIdentifier()).toId(), 
          workspaceUserEntity);
    }
  
    for (fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser workspaceUser : workspaceUsers) {
      SchoolDataIdentifier workspaceUserIdentifier = workspaceUser.getIdentifier();
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityMap.get(workspaceUserIdentifier.toId());
      
      boolean userArchived = workspaceUserEntity == null;
      if ((archived == null) || (archived.equals(userArchived))) {
        if (requestedAssessment != null) {
          boolean hasAssessmentRequest = workspaceUserEntity != null && !assessmentRequestController.listByWorkspaceUser(workspaceUserEntity).isEmpty();
          if (requestedAssessment != hasAssessmentRequest) {
            continue;
          }
        }
        
        if (assessed != null) {
          boolean isAssessed = !gradingController.listWorkspaceAssessments(workspaceUser.getWorkspaceIdentifier(), workspaceUser.getUserIdentifier()).isEmpty();
          if (assessed != isAssessed) {
            continue;
          }
        }

        SchoolDataIdentifier userIdentifier = workspaceUser.getUserIdentifier();
        User user = userController.findUserByIdentifier(userIdentifier);
        
        if (user != null) {
          UserEntity userEntity = null;
          Long workspaceUserId = null;

          if (workspaceUserEntity != null) {
            workspaceUserId = workspaceUserEntity.getId();
            userEntity = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
          } else {
            userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(user.getSchoolDataSource(), user.getIdentifier());  
          }
          
          String firstName = user.getFirstName();
          String lastName = user.getLastName();
          String studyProgrammeName = user.getStudyProgrammeName();
          DateTime enrolmentTime = workspaceUser.getEnrolmentTime();
          
          result.add(new WorkspaceStudent(workspaceUserIdentifier.toId(), 
            workspaceUserId, 
            userEntity != null ? userEntity.getId() : null, 
            firstName, 
            lastName, 
            studyProgrammeName,
            enrolmentTime != null ? enrolmentTime.toDate() : null,
            userArchived));
        } else {
          logger.log(Level.SEVERE, String.format("Could not find user for identifier %s", userIdentifier));
        }
      }
    }

    // Sorting
    if (StringUtils.equals(orderBy, "name")) {
      Collections.sort(result, new Comparator<WorkspaceStudent>() {
        @Override
        public int compare(WorkspaceStudent o1, WorkspaceStudent o2) {
          String s1 = String.format("%s, %s", StringUtils.defaultString(o1.getLastName(), ""), StringUtils.defaultString(o1.getFirstName(), ""));
          String s2 = String.format("%s, %s", StringUtils.defaultString(o2.getLastName(), ""), StringUtils.defaultString(o2.getFirstName(), ""));
          return s1.compareTo(s2);
        }
      });
    }
    
    // Response
    return Response.ok(result).build();
  }
  
  @GET
  @Path("/workspaces/{ID}/feeInfo")
  @RESTPermit(value = MuikkuPermissions.VIEW_WORKSPACE_FEE, requireLoggedIn = true)
  public Response getFeeInfo(@PathParam("ID") Long workspaceEntityId) {
    SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();
    if (userIdentifier == null) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

    User user = userController.findUserByIdentifier(userIdentifier);
    if (user == null) {
      return Response.status(Status.FORBIDDEN).build();
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    boolean evaluationFees = user.hasEvaluationFees() && workspace.isEvaluationFeeApplicable();

    return Response.ok(new WorkspaceFeeInfo(evaluationFees)).build();
  }

  @GET
  @Path("/workspaces/{ID}/staffMembers")
  @RESTPermitUnimplemented
  public Response listWorkspaceStaffMembers(@PathParam("ID") Long workspaceEntityId,
      @QueryParam("orderBy") String orderBy) {
    
    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Access check
    if (!sessionController.hasCoursePermission(MuikkuPermissions.LIST_WORKSPACE_MEMBERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Staff via WorkspaceSchoolDataBridge
    List<fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser> schoolDataUsers = workspaceController.listWorkspaceStaffMembers(workspaceEntity);
    if (schoolDataUsers.isEmpty()) {
      return Response.noContent().build();
    }

    List<WorkspaceStaffMember> workspaceStaffMembers = new ArrayList<>();
    
    for (fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser workspaceUser : schoolDataUsers) {
      SchoolDataIdentifier userIdentifier = workspaceUser.getUserIdentifier();
      User user = userController.findUserByIdentifier(userIdentifier);
      
      if (user != null) {
        UserEntity userEntity = userEntityController.findUserEntityByUser(user);
        workspaceStaffMembers.add(new WorkspaceStaffMember(workspaceUser.getIdentifier().toId(), 
          userEntity != null ? userEntity.getId() : null,
          user.getFirstName(), 
          user.getLastName()
        ));
      } else {
        logger.log(Level.SEVERE, String.format("Could not find user %s", userIdentifier));
      }
    }
    
    // Sorting
    if (StringUtils.equals(orderBy, "name")) {
      Collections.sort(workspaceStaffMembers, new Comparator<WorkspaceStaffMember>() {
        @Override
        public int compare(WorkspaceStaffMember o1, WorkspaceStaffMember o2) {
          String s1 = String.format("%s, %s", StringUtils.defaultString(o1.getLastName(), ""), StringUtils.defaultString(o1.getFirstName(), ""));
          String s2 = String.format("%s, %s", StringUtils.defaultString(o2.getLastName(), ""), StringUtils.defaultString(o2.getFirstName(), ""));
          return s1.compareTo(s2);
        }
      });
    }
    
    // Response
    return Response.ok(workspaceStaffMembers).build();
  }
  
  @POST
  @Path("/workspaces/{ID}/materials/")
  @RESTPermitUnimplemented
  public Response createWorkspaceMaterial(@PathParam("ID") Long workspaceEntityId,
      @QueryParam("sourceNodeId") Long sourceNodeId,
      @QueryParam("targetNodeId") Long targetNodeId,
      @QueryParam("sourceWorkspaceEntityId") Long sourceWorkspaceEntityId,
      @QueryParam("targetWorkspaceEntityId") Long targetWorkspaceEntityId,
      @QueryParam("copyOnlyChildren") Boolean copyOnlyChildren,
      @QueryParam("cloneMaterials") @DefaultValue ("false") Boolean cloneMaterials,
      @QueryParam("updateLinkedMaterials") @DefaultValue ("false") Boolean updateLinkedMaterials,
      fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial entity) {

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if ((sourceNodeId != null) || (sourceWorkspaceEntityId != null)) {
      // When source is specified the operation will be copy instead of create
      
      if (sourceNodeId == null) {
        WorkspaceEntity sourceWorkspaceEntity = workspaceController.findWorkspaceEntityById(sourceWorkspaceEntityId);
        if (sourceWorkspaceEntity == null) {
          return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid sourceWorkspaceEntity %d", sourceWorkspaceEntityId)).build();
        }
        
        WorkspaceRootFolder sourceRootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(sourceWorkspaceEntity);
        if (sourceRootFolder == null) {
          return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid sourceWorkspaceEntity %d", sourceWorkspaceEntityId)).build();
        }
       
        sourceNodeId = sourceRootFolder.getId();
      }
      
      if (targetNodeId == null) {
        if (targetWorkspaceEntityId != null) {
          WorkspaceEntity targetWorkspaceEntity = workspaceController.findWorkspaceEntityById(targetWorkspaceEntityId);
          if (targetWorkspaceEntity == null) {
            return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid targetWorkspaceEntity %d", sourceWorkspaceEntityId)).build();
          }
          
          WorkspaceRootFolder targetRootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(targetWorkspaceEntity);
          if (targetRootFolder == null) {
            return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid targetWorkspaceEntity %d", sourceWorkspaceEntityId)).build();
          }
         
          targetNodeId = targetRootFolder.getId();
        }
      }
      
      if (targetNodeId == null) {
        return Response.status(Status.BAD_REQUEST).entity("targetNodeId is required when sourceNodeId is specified").build();      
      }
      
      // Access
      
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.COPY_WORKSPACE)) {
        return Response.status(Status.FORBIDDEN).build();
      }

      // Source

      WorkspaceNode sourceNode = workspaceMaterialController.findWorkspaceNodeById(sourceNodeId);
      if (sourceNode == null) {
        return Response.status(Status.BAD_REQUEST).entity("null source").build();      
      }

      // Target
      
      WorkspaceNode targetNode = workspaceMaterialController.findWorkspaceNodeById(targetNodeId);
      if (targetNode == null) {
        return Response.status(Status.BAD_REQUEST).entity("null target").build();      
      }
      
      WorkspaceRootFolder targetRootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(targetNode);
      if (!targetRootFolder.getWorkspaceEntityId().equals(workspaceEntity.getId())) {
        return Response.status(Status.BAD_REQUEST).entity(String.format("targetNode does not belong to workspace entity %d", workspaceEntity.getId())).build();      
      }
      
      // Circular reference check
      
      WorkspaceNode node = targetNode;
      while (node != null) {
        if (node.getId().equals(sourceNode.getId())) {
          return Response.status(Status.BAD_REQUEST).entity("Circular copy reference").build();      
        }
        node = node.getParent();
      }
      
      // Copy
      
      if (copyOnlyChildren) {
        List<WorkspaceNode> sourceChildren = workspaceMaterialController.listWorkspaceNodesByParent(sourceNode);
        for (WorkspaceNode sourceChild : sourceChildren) {
          workspaceMaterialController.cloneWorkspaceNode(sourceChild, targetNode, cloneMaterials);
        }
      }
      else {
        workspaceMaterialController.cloneWorkspaceNode(sourceNode, targetNode, cloneMaterials);
      }
      
      // Done
      
      return Response.noContent().build();
      
    } else {
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
      
      // #1261: HtmlMaterial attachments should be added to all workspace materials sharing the same HtmlMaterial 
      if (updateLinkedMaterials && parent instanceof WorkspaceMaterial) {
        Long parentMaterialId = ((WorkspaceMaterial) parent).getMaterialId();
        if (parentMaterialId != null) {
          Material parentMaterial = materialController.findMaterialById(parentMaterialId);
          if (parentMaterial instanceof HtmlMaterial) {
            List<WorkspaceMaterial> sharedWorkspaceMaterials = workspaceMaterialController.listWorkspaceMaterialsByMaterial(parentMaterial);
            for (WorkspaceMaterial sharedWorkspaceMaterial : sharedWorkspaceMaterials) {
              if (sharedWorkspaceMaterial.getId().equals(workspaceMaterial.getId())) {
                continue; // skip the one we created above
              }
              WorkspaceMaterial sharedAttachment = workspaceMaterialController.findWorkspaceMaterialByParentAndUrlName(sharedWorkspaceMaterial, workspaceMaterial.getUrlName());
              if (sharedAttachment == null) {
                workspaceMaterialController.createWorkspaceMaterial(
                    sharedWorkspaceMaterial,
                    material,
                    workspaceMaterial.getUrlName(),
                    workspaceMaterial.getAssignmentType(),
                    workspaceMaterial.getCorrectAnswers());
              }
            }
          }
        }
      }
  
      return Response.ok(createRestModel(workspaceMaterial)).build();
    }
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
      List<fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply> replies = workspaceMaterialReplyController.listVisibleWorkspaceMaterialRepliesByWorkspaceEntity(workspaceEntity, sessionController.getLoggedUserEntity());
      
      for (fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply reply : replies) {
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
      fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
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
      //fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply reply = fieldAnswer.getReply();
      //WorkspaceMaterial workspaceMaterial = reply.getWorkspaceMaterial();
      //Long workspaceEntityId = workspaceMaterialController.getWorkspaceEntityId(workspaceMaterial);
      //WorkspaceEntity workspace = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      //UserEntity userEntity = userEntityController.findUserEntityById(reply.getUserEntityId());
      return Response.ok(answerFile.getContent())
        .type(answerFile.getContentType())
        .header("Content-Disposition", "attachment; filename=\"" + answerFile.getFileName().replaceAll("\"", "\\\"") + "\"")
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
    
    fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply materialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, loggedUser);
    if (materialReply != null) {
      return Response.ok(createRestModel(new fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply[] { materialReply })).build();
    } else {
      return Response.ok(createRestModel(new fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply[] { })).build();
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
    
    fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, payload.getState(), loggedUser);
    
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

    fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyById(workspaceMaterialReplyId);
    if (workspaceMaterialReply == null) {
      return Response.status(Status.NOT_FOUND).entity("Could not find workspace material reply").build(); 
    }
    
    workspaceMaterialReplyController.updateWorkspaceMaterialReply(workspaceMaterialReply, payload.getState());
    
    return Response.noContent().build();
  }

  private List<fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterialProducer> createRestModel(WorkspaceMaterialProducer... materialProducers) {
    List<fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterialProducer> result = new ArrayList<>();
    
    for (WorkspaceMaterialProducer materialProducer : materialProducers) {
      result.add(createRestModel(materialProducer));
    }
    
    return result;
  }
  
  private fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterialProducer createRestModel(WorkspaceMaterialProducer materialProducer) {
    return new fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterialProducer(materialProducer.getId(), materialProducer.getWorkspaceEntity().getId(), materialProducer.getName());
  }
  
  private List<fi.otavanopisto.muikku.plugins.workspace.rest.WorkspaceType> createRestModel(WorkspaceType... types) {
    List<fi.otavanopisto.muikku.plugins.workspace.rest.WorkspaceType> result = new ArrayList<>();
    
    for (WorkspaceType type : types) {
      result.add(new fi.otavanopisto.muikku.plugins.workspace.rest.WorkspaceType(type.getIdentifier().toId(), type.getName()));
    }
    
    return result;
  }
  
  private List<fi.otavanopisto.muikku.plugins.workspace.rest.EducationType> createRestModel(EducationType... types) {
    List<fi.otavanopisto.muikku.plugins.workspace.rest.EducationType> result = new ArrayList<>();
    
    for (EducationType type : types) {
      result.add(new fi.otavanopisto.muikku.plugins.workspace.rest.EducationType(type.getIdentifier().toId(), type.getName()));
    }
    
    return result;
  }
  
  private List<WorkspaceMaterialReply> createRestModel(fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply... entries) {
    List<fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterialReply> result = new ArrayList<>();

    for (fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }
  
  private WorkspaceMaterialReply createRestModel(fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply entity) {
    return new WorkspaceMaterialReply(entity.getId(), entity.getState());
  }

  private List<fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial> createRestModel(WorkspaceMaterial... entries) {
    List<fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial> result = new ArrayList<>();

    for (WorkspaceMaterial entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }
  
  private fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceAssessment createRestModel(WorkspaceEntity workspaceEntity, fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment entry) {
    UserEntity assessor = userEntityController.findUserEntityByDataSourceAndIdentifier(entry.getAssessingUserSchoolDataSource(), entry.getAssessingUserIdentifier());
    GradingScale gradingScale = gradingController.findGradingScale(entry.getGradingScaleSchoolDataSource(), entry.getGradingScaleIdentifier());
    GradingScaleItem grade = gradingController.findGradingScaleItem(gradingScale, entry.getGradeSchoolDataSource(), entry.getGradeIdentifier());
    SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(entry.getWorkspaceUserIdentifier(), entry.getWorkspaceUserSchoolDataSource());
    
    return new fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceAssessment(
      entry.getIdentifier(),
      entry.getDate(),
      assessor != null ? assessor.getId() : null,
      workspaceUserIdentifier.toId(),
      entry.getGradingScaleIdentifier(),
      entry.getGradingScaleSchoolDataSource(),
      entry.getGradeIdentifier(),
      entry.getGradeSchoolDataSource(),
      entry.getVerbalAssessment(),
      grade.isPassingGrade()
    ); 
  }
  
  private List<fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceAssessment> createRestModel(WorkspaceEntity workspaceEntity, fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment... entries) {
    List<fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceAssessment> result = new ArrayList<>();

    for (fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment entry : entries) {
      result.add(createRestModel(workspaceEntity, entry));
    }

    return result;
  }
  
  private fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial createRestModel(WorkspaceMaterial workspaceMaterial) {
    WorkspaceNode workspaceNode = workspaceMaterialController.findWorkspaceNodeNextSibling(workspaceMaterial);
    Long nextSiblingId = workspaceNode != null ? workspaceNode.getId() : null;
    
    return new fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial(workspaceMaterial.getId(), workspaceMaterial.getMaterialId(),
        workspaceMaterial.getParent() != null ? workspaceMaterial.getParent().getId() : null, nextSiblingId, workspaceMaterial.getHidden(), 
        workspaceMaterial.getAssignmentType(), workspaceMaterial.getCorrectAnswers(), workspaceMaterial.getPath(), workspaceMaterial.getTitle());
  }

  private fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace createRestModel(WorkspaceEntity workspaceEntity, String name, String nameExtension, String description) {
    Long numVisits = workspaceVisitController.getNumVisits(workspaceEntity);
    Date lastVisit = workspaceVisitController.getLastVisit(workspaceEntity);
    
    return new fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace(workspaceEntity.getId(), 
        workspaceEntity.getUrlName(),
        workspaceEntity.getAccess(),
        workspaceEntity.getArchived(), 
        workspaceEntity.getPublished(), 
        name, 
        nameExtension, 
        description, 
        workspaceEntity.getDefaultMaterialLicense(),
        numVisits, 
        lastVisit);
  }

  private fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceFolder createRestModel(WorkspaceFolder workspaceFolder) {
    WorkspaceNode nextSibling = workspaceMaterialController.findWorkspaceNodeNextSibling(workspaceFolder);
    return new fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceFolder(
        workspaceFolder.getId(),
        workspaceFolder.getParent() == null ? null : workspaceFolder.getParent().getId(),
        nextSibling == null ? null : nextSibling.getId(),
        workspaceFolder.getHidden(),
        workspaceFolder.getTitle(),
        workspaceFolder.getPath());
  }

  @DELETE
  @Path("/workspaces/{WORKSPACEID}/materials/{WORKSPACEMATERIALID}")
  @RESTPermitUnimplemented
  public Response deleteNode(
      @PathParam("WORKSPACEID") Long workspaceEntityId,
      @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId,
      @QueryParam("removeAnswers") Boolean removeAnswers,
      @QueryParam("updateLinkedMaterials") @DefaultValue ("false") Boolean updateLinkedMaterials) {
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
    }
    else {
      try {
        
        // #1261: HtmlMaterial attachments should be removed from all workspace materials sharing the same HtmlMaterial 
        if (updateLinkedMaterials) {
          WorkspaceNode parentNode = workspaceMaterial.getParent();
          if (parentNode instanceof WorkspaceMaterial) {
            Long parentMaterialId = ((WorkspaceMaterial) parentNode).getMaterialId();
            if (parentMaterialId != null) {
              Material parentMaterial = materialController.findMaterialById(parentMaterialId);
              if (parentMaterial instanceof HtmlMaterial) {
                List<WorkspaceMaterial> sharedWorkspaceMaterials = workspaceMaterialController.listWorkspaceMaterialsByMaterial(parentMaterial);
                for (WorkspaceMaterial sharedWorkspaceMaterial : sharedWorkspaceMaterials) {
                  WorkspaceMaterial childWorkspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByParentAndUrlName(sharedWorkspaceMaterial, workspaceMaterial.getUrlName());
                  if (childWorkspaceMaterial.getId().equals(workspaceMaterial.getId())) {
                    continue; // skip the one we delete below
                  }
                  workspaceMaterialController.deleteWorkspaceMaterial(childWorkspaceMaterial, removeAnswers != null ? removeAnswers : false);
                }
              }
            }
          }
        }

        workspaceMaterialController.deleteWorkspaceMaterial(workspaceMaterial, removeAnswers != null ? removeAnswers : false);
        return Response.noContent().build();
      }
      catch (WorkspaceMaterialContainsAnswersExeption e) {
        return Response.status(Status.CONFLICT).entity(new WorkspaceMaterialDeleteError(WorkspaceMaterialDeleteError.Reason.CONTAINS_ANSWERS)).build();
      }
      catch (Exception e) {
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
      fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceFolder restFolder) {
    
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
    
    workspaceFolder = workspaceMaterialController.updateWorkspaceFolder(workspaceFolder, title, parentNode, nextSibling, hidden);
    return Response.ok(createRestModel(workspaceFolder)).build();
  }

  @POST
  @Path("/workspaces/{WORKSPACEID}/folders/")
  @RESTPermitUnimplemented
  public Response createWorkspaceFolder(
      @PathParam("WORKSPACEID") Long workspaceEntityId,
      fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceFolder restFolder) {
    
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
      @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial workspaceMaterial) {
    
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
    workspaceNode = workspaceMaterialController.updateWorkspaceNode(workspaceNode, materialId, parentNode, nextSibling, hidden,
        workspaceMaterial.getAssignmentType(), workspaceMaterial.getCorrectAnswers(), title);
    workspaceMaterial.setPath(workspaceNode.getPath());
    return Response.ok(workspaceMaterial).build();
  }
  
  @PUT
  @Path("/workspaces/{WORKSPACEENTITYID}/assessments/{ID}")
  @RESTPermitUnimplemented
  public Response updateWorkspaceAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("ID") String workspaceAssesmentIdentifier, WorkspaceAssessment payload) {
    SchoolDataIdentifier workspaceStudentId = SchoolDataIdentifier.fromId(payload.getWorkspaceStudentId());
    if (workspaceStudentId == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Malformed workspaceStudentId (%s)", payload.getWorkspaceStudentId())).build();
    }
    
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
    
    WorkspaceUserEntity workspaceStudentEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(workspaceStudentId);
    if (workspaceStudentEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Could not find workspaceStudentEntity by school data identifier %s", workspaceStudentId.toId())).build();
    }
    
    if (!workspaceStudentEntity.getWorkspaceEntity().getId().equals(workspaceEntity.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("WorkspaceUserEntity is invalid").build();
    }

    fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser workspaceStudent = workspaceController.findWorkspaceUser(workspaceStudentEntity);
    
    Date evaluated = payload.getEvaluated();

    UserEntity student = userEntityController.findUserEntityByUserIdentifier(
        workspaceStudent.getUserIdentifier()
    );
    
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    
    if(student == null || workspace == null){
      logger.log(Level.SEVERE, "Missing workspace or student");
    }else{
      sendAssessmentNotification(payload, assessor, student, workspace);
    }
    
    return Response.ok(createRestModel(workspaceEntity, gradingController.updateWorkspaceAssessment(workspaceStudent.getSchoolDataSource(), workspaceAssesmentIdentifier, workspaceStudent, assessingUser, grade, payload.getVerbalAssessment(), evaluated))).build();
  }
  
  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/assessments/")
  @RESTPermitUnimplemented
  public Response createWorkspaceAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, WorkspaceAssessment payload) {
    SchoolDataIdentifier workspaceStudentId = SchoolDataIdentifier.fromId(payload.getWorkspaceStudentId());
    if (workspaceStudentId == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Malformed workspaceStudentId (%s)", payload.getWorkspaceStudentId())).build();
    }
    
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
    
    WorkspaceUserEntity workspaceStudentEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(workspaceStudentId);
    if (workspaceStudentEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Could not find workspaceStudentEntity by school data identifier %s", workspaceStudentId.toId())).build();
    }
    
    if (!workspaceStudentEntity.getWorkspaceEntity().getId().equals(workspaceEntity.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("WorkspaceUserEntity is invalid").build();
    }

    fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser workspaceStudent = workspaceController.findWorkspaceUser(workspaceStudentEntity);
    
    Date evaluated = payload.getEvaluated();
    
    UserEntity student = userEntityController.findUserEntityByUserIdentifier(
        workspaceStudent.getUserIdentifier()
    );
    
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);

    if(student == null || workspace == null){
      logger.log(Level.SEVERE, "Missing workspace or student");
    }else{
      sendAssessmentNotification(payload, assessor, student, workspace);
    }
    
    return Response.ok(createRestModel(workspaceEntity, gradingController.createWorkspaceAssessment(workspaceStudent.getSchoolDataSource(), workspaceStudent, assessingUser, grade, payload.getVerbalAssessment(), evaluated))).build();
  }

  private void sendAssessmentNotification(WorkspaceAssessment payload, UserEntity evaluator, UserEntity student,
      Workspace workspace) {
    Locale locale = userEntityController.getLocale(student);
    CommunicatorMessageCategory category = communicatorController.persistCategory("assessments");
    communicatorController.createMessage(
        communicatorController.createMessageId(),
        evaluator,
        Arrays.asList(student),
        category,
        localeController.getText(
            locale,
            "plugin.workspace.assessment.notificationTitle",
            new Object[] {workspace.getName()}),
        localeController.getText(
            locale,
            "plugin.workspace.assessment.notificationContent",
            new Object[] {payload.getVerbalAssessment()}),
        Collections.<Tag>emptySet());
  }

  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/assessments/")
  @RESTPermitUnimplemented
  public Response listWorkspaceAssessments(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @QueryParam ("workspaceStudentIdentifier") String workspaceStudentId, @QueryParam ("studentIdentifier") String studentId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    if (workspaceStudentId == null && studentId == null) {
      return Response.status(Status.NOT_IMPLEMENTED).entity("Listing workspace assessments without studentIdentifier or workspaceStudentIdentifier is not implemented yet").build();
    }
    
    SchoolDataIdentifier workspaceStudentIdentifier = null;
    SchoolDataIdentifier studentIdentifier = null;
    
    if (workspaceStudentId != null) {
      workspaceStudentIdentifier = SchoolDataIdentifier.fromId(workspaceStudentId);
      if (workspaceStudentIdentifier == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceStudentIdentifier").build();
      }
    }
    
    if (studentId != null) {
      studentIdentifier = SchoolDataIdentifier.fromId(studentId);
      if (studentIdentifier == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid studentIdentifier").build();
      }
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    WorkspaceUserEntity workspaceUserEntity = null;
    
    if (workspaceStudentIdentifier != null) {
      // Archived workspace users need access to workspace assessments
      workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(workspaceStudentIdentifier);
      if (workspaceUserEntity != null) {
        studentIdentifier = new SchoolDataIdentifier(workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier(), 
          workspaceUserEntity.getUserSchoolDataIdentifier().getDataSource().getIdentifier());
      }
    } else if (studentIdentifier != null) {
      // Archived workspace users need access to workspace assessments
      workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifierIncludeArchived(workspaceEntity, studentIdentifier);
      if (workspaceUserEntity != null) {
        workspaceStudentIdentifier = new SchoolDataIdentifier(workspaceUserEntity.getIdentifier(), workspaceUserEntity.getUserSchoolDataIdentifier().getDataSource().getIdentifier());
      }
    }
    
    if (workspaceStudentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Could not resolve workspace student identifier").build();
    }
    
    if (studentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Could not resolve student identifier").build();
    }
    
    if (workspaceUserEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("Could not find workspace student").build();
    }
    
    if (!workspaceUserEntity.getWorkspaceEntity().getId().equals(workspaceEntity.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("WorkspaceEntityUser's workpsace does not match specified workspace").build();
    }
    
    if (!sessionController.getLoggedUserEntity().getId().equals(workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity().getId())) {
      if (!sessionController.hasCoursePermission(MuikkuPermissions.VIEW_USER_EVALUATION, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
    List<fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment> assessments = gradingController.listWorkspaceAssessments(workspaceIdentifier, studentIdentifier);
    
    return Response.ok(createRestModel(workspaceEntity, assessments.toArray(new fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment[0]))).build();
  }
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{ID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response findWorkspaceStudent(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("ID") String workspaceStudentId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    SchoolDataIdentifier workspaceUserIdentifier = SchoolDataIdentifier.fromId(workspaceStudentId);
    if (workspaceUserIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid workspace user id").build();
    }
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(workspaceUserIdentifier);
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Workspace student not found").build();
    }
    fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser bridgeUser = workspaceController.findWorkspaceUser(workspaceUserEntity);
    if (bridgeUser == null) {
      return Response.status(Status.NOT_FOUND).entity("School data user not found").build();
    }
    
    SchoolDataIdentifier userIdentifier = bridgeUser.getUserIdentifier();
    User user = userController.findUserByIdentifier(userIdentifier);
    if (user == null) {
      return Response.status(Status.NOT_FOUND).entity("School data user not found").build();
    }
    
    WorkspaceUser workspaceUser = workspaceController.findWorkspaceUserByWorkspaceEntityAndUser(workspaceEntity, userIdentifier);
    if (workspaceUser == null) {
      return Response.status(Status.NOT_FOUND).entity("School data workspace user not found").build();
    }
    
    WorkspaceStudent workspaceStudent = new WorkspaceStudent(userIdentifier.toId(), 
        workspaceEntity.getId(), 
        workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity().getId(), 
        user.getFirstName(), 
        user.getLastName(), 
        user.getStudyProgrammeName(),
        workspaceUser.getEnrolmentTime() != null ? workspaceUser.getEnrolmentTime().toDate() : null,
        workspaceUserEntity.getArchived());
    
    return Response.ok(workspaceStudent).build();
  }
  
  @PUT
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{ID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateWorkspaceStudent(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId,
      @PathParam("ID") String workspaceStudentId,
      WorkspaceStudent workspaceStudent) {
    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    // Access check
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build();
    }
    if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MEMBERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Workspace student and school data user
    SchoolDataIdentifier workspaceUserIdentifier = SchoolDataIdentifier.fromId(workspaceStudentId);
    if (workspaceUserIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid workspace user id").build();
    }
    
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
    fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser bridgeUser = workspaceController.findWorkspaceUser(workspaceIdentifier, workspaceUserIdentifier);
    if (bridgeUser == null) {
      return Response.status(Status.NOT_FOUND).entity("School data user not found").build();
    }
    
    if (workspaceStudent.getArchived() != null) {
      workspaceController.updateWorkspaceStudentActivity(bridgeUser, !workspaceStudent.getArchived());
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(workspaceUserIdentifier);
      if (workspaceStudent.getArchived()) {
        // Archive
        if (workspaceUserEntity != null && !workspaceUserEntity.getArchived()) {
          workspaceUserEntityController.archiveWorkspaceUserEntity(workspaceUserEntity);
        }
      }
      else {
        // Unarchive
        if (workspaceUserEntity == null) {
          // TODO create new workspace student
        }
        else {
          workspaceUserEntityController.unarchiveWorkspaceUserEntity(workspaceUserEntity);
        }
      }
    }

    return Response.ok(workspaceStudent).build();
  }

  @DELETE
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{ID}")
  @RESTPermit (handling = Handling.INLINE)
  public Response deleteWorkspaceStudent(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("ID") String workspaceStudentId) {
    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    // User (in school data source)
    SchoolDataIdentifier workspaceUserIdentifier = SchoolDataIdentifier.fromId(workspaceStudentId);
    if (workspaceUserIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid workspace user id").build();
    }

    // Access check
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build();
    }
    if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MEMBERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(workspaceUserIdentifier);
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Workspace student not found").build();
    }
    fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser bridgeUser = workspaceController.findWorkspaceUser(workspaceUserEntity);
    if (bridgeUser == null) {
      return Response.status(Status.NOT_FOUND).entity("School data user not found").build();
    }
    workspaceController.updateWorkspaceStudentActivity(bridgeUser, false);
    workspaceUserEntityController.archiveWorkspaceUserEntity(workspaceUserEntity);
    
    return Response.noContent().build();
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

  @GET
  @Path("/workspaces/{WORKSPACEID}/journal")
  @RESTPermitUnimplemented
  public Response listJournalEntries(
      @PathParam("WORKSPACEID") Long workspaceEntityId,
      @QueryParam("workspaceStudentId") String workspaceStudentId) 
  {
    List<WorkspaceJournalEntry> entries = new ArrayList<>();
    List<WorkspaceJournalEntryRESTModel> result = new ArrayList<>();
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.LIST_ALL_JOURNAL_ENTRIES, workspaceEntity)) {
      return Response.status(Status.UNAUTHORIZED).build();
    } else {
      SchoolDataIdentifier workspaceUserIdentifier = SchoolDataIdentifier.fromId(workspaceStudentId);
      if (workspaceUserIdentifier == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceStudentId").build();
      }

      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(workspaceUserIdentifier);
      if (workspaceUserEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceStudentId").build();
      }
      if (workspaceUserEntity.getWorkspaceEntity().getId() != workspaceEntity.getId()) {
        return Response.status(Status.BAD_REQUEST).entity("WorkspaceStudent points to wrong workspace").build();
      }

      WorkspaceUser workspaceUser = workspaceController.findWorkspaceUser(workspaceUserEntity);
      SchoolDataIdentifier userIdentifier = workspaceUser.getUserIdentifier();
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(userIdentifier);

      if (userEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceStudentId").build();
      }
      
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

  @DELETE
  @Path("/workspaces/{WORKSPACEID}/journal/{JOURNALENTRYID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateJournalEntry(@PathParam("JOURNALENTRYID") Long journalEntryId) {
    WorkspaceJournalEntry workspaceJournalEntry = workspaceJournalController.findJournalEntry(journalEntryId);
    if (workspaceJournalEntry == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!workspaceJournalEntry.getUserEntityId().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    workspaceJournalController.archiveJournalEntry(workspaceJournalEntry);
    
    return Response.noContent().build();
  }

}
