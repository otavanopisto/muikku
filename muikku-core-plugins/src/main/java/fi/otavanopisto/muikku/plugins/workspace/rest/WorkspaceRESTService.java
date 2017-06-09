package fi.otavanopisto.muikku.plugins.workspace.rest;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
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
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.messaging.MessagingWidget;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.Flag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialProducer;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.material.MaterialController;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;
import fi.otavanopisto.muikku.plugins.search.UserIndexer;
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
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAudioFieldAnswerClip;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNodeType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
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
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceType;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.FlagController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/workspace")
@RestCatchSchoolDataExceptions
public class WorkspaceRESTService extends PluginRESTService {

  private static final long serialVersionUID = -5286350366083446537L;

  @Inject
  private Logger logger;

  @Inject
  private UserIndexer userIndexer;

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
  private CopiedWorkspaceEntityIdFinder copiedWorkspaceEntityIdFinder;

  @Inject
  private FlagController flagController;

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
    
    WorkspaceEntity sourceWorkspaceEntity = null;
    if (sourceWorkspaceEntityId != null) {
      sourceWorkspaceEntity = workspaceEntityController.findWorkspaceEntityById(sourceWorkspaceEntityId);
      if (sourceWorkspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid source workspace entity id %d", sourceWorkspaceEntityId)).build();
      }
      
      workspaceIdentifier = new SchoolDataIdentifier(sourceWorkspaceEntity.getIdentifier(), sourceWorkspaceEntity.getDataSource().getIdentifier());
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
    
    // #2599: Also copy workspace default license and producers
    if (sourceWorkspaceEntity != null) {
      workspaceEntityController.updateDefaultMaterialLicense(workspaceEntity, sourceWorkspaceEntity.getDefaultMaterialLicense());
      List<WorkspaceMaterialProducer> workspaceMaterialProducers = workspaceController.listWorkspaceMaterialProducers(sourceWorkspaceEntity);
      for (WorkspaceMaterialProducer workspaceMaterialProducer : workspaceMaterialProducers) {
        workspaceController.createWorkspaceMaterialProducer(workspaceEntity, workspaceMaterialProducer.getName());
      }
    }

    return Response
        .ok(createRestModel(workspaceEntity, workspace.getName(), workspace.getNameExtension(), workspace.getDescription(), convertWorkspaceCurriculumIds(workspace), workspace.getSubjectIdentifier()))
        .build();
  }

  private Set<String> convertWorkspaceCurriculumIds(Workspace workspace) {
    Set<String> curriculumIdentifiers = new HashSet<String>(); 
    if (workspace.getCurriculumIdentifiers() != null)
      workspace.getCurriculumIdentifiers().forEach((SchoolDataIdentifier id) -> curriculumIdentifiers.add(id.toId()));
    return curriculumIdentifiers;
  }
  
  private WorkspaceEntity findCopiedWorkspaceEntity(Workspace workspace) {
    WorkspaceEntity workspaceEntity = null;
    Long workspaceEntityId = null;
    
    long timeoutTime = System.currentTimeMillis() + 60000;    
    
    while (workspaceEntityId == null) {
      workspaceEntityId = copiedWorkspaceEntityIdFinder.findCopiedWorkspaceEntityId(workspace);
    
      if (System.currentTimeMillis() > timeoutTime) {
        logger.severe("Timeouted when waiting for copied workspace entity");
        return null;
      }
      
      if (workspaceEntityId == null) {
        try {
          Thread.sleep(10);
        } catch (InterruptedException e) {
        }
      }
      else {
        workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      }
    }
    
    return workspaceEntity;
  }

  @GET
  @Path("/workspaces/")
  @RESTPermit (handling = Handling.INLINE)
  public Response listWorkspaces(
        @QueryParam("userId") Long userEntityId,
        @QueryParam("userIdentifier") String userId,
        @QueryParam("includeInactiveWorkspaces") @DefaultValue ("false") Boolean includeInactiveWorkspaces,
        @QueryParam("search") String searchString,
        @QueryParam("subjects") List<String> subjects,
        @QueryParam("educationTypes") List<String> educationTypeIds,
        @QueryParam("curriculums") List<String> curriculumIds,
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
    
    if (includeInactiveWorkspaces && userIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("includeInactiveWorkspaces works only with userIdentifier parameter").build();
    }
    
    if (includeInactiveWorkspaces && doMinVisitFilter) {
      return Response.status(Status.BAD_REQUEST).entity("includeInactiveWorkspaces cannot be used with doMinVisitFilter").build();
    }
    
    if (doMinVisitFilter) {
      if (!sessionController.isLoggedIn()) {
        return Response.status(Status.UNAUTHORIZED).entity("You need to be logged in to filter by visit count").build();
      }
      UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();
      workspaceEntities = workspaceVisitController.listEnrolledWorkspaceEntitiesByMinVisitsOrderByLastVisit(loggedUserEntity, minVisits);
    }
    else {
      if (userIdentifier != null) {
        if (includeInactiveWorkspaces) {
          workspaceEntities = workspaceUserEntityController.listWorkspaceEntitiesByUserIdentifier(userIdentifier);
        } else {
          workspaceEntities = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserIdentifier(userIdentifier);
        }
      }
      else if (userEntity != null) {
        workspaceEntities = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(userEntity);
      }
      else {
        if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_ALL_WORKSPACES)) {
          return Response.status(Status.FORBIDDEN).build();
        }
        workspaceEntities = Boolean.TRUE.equals(includeUnpublished)
          ? workspaceController.listWorkspaceEntities()
          : workspaceController.listPublishedWorkspaceEntities();
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
      
      List<SchoolDataIdentifier> curriculums = null;
      if (curriculumIds != null) {
        curriculums = new ArrayList<>(curriculumIds.size());
        for (String curriculumId : curriculumIds) {
          SchoolDataIdentifier curriculumIdentifier = SchoolDataIdentifier.fromId(curriculumId);
          if (curriculumIdentifier != null) {
            curriculums.add(curriculumIdentifier);
          } else {
            return Response.status(Status.BAD_REQUEST).entity(String.format("Malformed curriculum identifier", curriculumId)).build();
          }
        }
      }
      
      searchResult = searchProvider.searchWorkspaces(schoolDataSourceFilter, subjects, workspaceIdentifierFilters, educationTypes, 
          curriculums, searchString, null, null, includeUnpublished, firstResult, maxResults, sorts);
      
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
              String subjectIdentifier = (String) result.get("subjectIdentifier");
              
              Object curriculumIdentifiersObject = result.get("curriculumIdentifiers");
              Set<String> curriculumIdentifiers = new HashSet<String>();
              if (curriculumIdentifiersObject instanceof Collection) {
                Collection<?> curriculumIdentifierCollection = (Collection<?>) curriculumIdentifiersObject;
                for (Object o : curriculumIdentifierCollection) {
                  if (o instanceof String)
                    curriculumIdentifiers.add((String) o);
                  else
                    logger.warning("curriculumIdentifier not of type String");
                }
              }
              
              if (StringUtils.isNotBlank(name)) {
                workspaces.add(createRestModel(workspaceEntity, name, nameExtension, description, curriculumIdentifiers, subjectIdentifier));
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

    return Response.ok(createRestModel(
        workspaceEntity,
        workspace.getName(),
        workspace.getNameExtension(),
        workspace.getDescription(),
        convertWorkspaceCurriculumIds(workspace),
        workspace.getSubjectIdentifier()
    )).build();
  }
  
  @GET
  @Path("/workspaces/{ID}/details")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspaceDetails(@PathParam("ID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.VIEW_WORKSPACE_DETAILS, workspaceEntity)) {
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
    
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIAL_PRODUCERS, workspaceEntity)) {
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
      if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIAL_PRODUCERS, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIAL_PRODUCERS, workspaceEntity)) {
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
            if (!sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_MEMBERS_ONLY_WORKSPACE, workspaceEntity)) {
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

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIAL_PRODUCERS, workspaceEntity)) {
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

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_DETAILS, workspaceEntity)) {
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
  
  private boolean isEqualDateTime(OffsetDateTime dateTime1, OffsetDateTime dateTime2) {
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
    
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.PUBLISH_WORKSPACE, workspaceEntity)) {
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
      workspaceEntity = workspaceEntityController.updatePublished(workspaceEntity, payload.getPublished());
    }
    
    workspaceEntity = workspaceEntityController.updateAccess(workspaceEntity, payload.getAccess());
    workspaceEntity = workspaceEntityController.updateDefaultMaterialLicense(workspaceEntity, payload.getMaterialDefaultLicense());
    
    // Reindex the workspace so that Elasticsearch can react to publish and visibility

    workspaceIndexer.indexWorkspace(workspaceEntity);
    
    return Response.ok(createRestModel(
        workspaceEntity,
        workspace.getName(),
        workspace.getNameExtension(),
        workspace.getDescription(),
        convertWorkspaceCurriculumIds(workspace),
        workspace.getSubjectIdentifier()
    )).build();
  }
  
  @GET
  @Path("/workspaces/{ID}/students")
  @RESTPermit (handling = Handling.INLINE)
  public Response listWorkspaceStudents(@PathParam("ID") Long workspaceEntityId,
      @QueryParam("active") Boolean active,
      @QueryParam("requestedAssessment") Boolean requestedAssessment,
      @QueryParam("assessed") Boolean assessed,
      @QueryParam("studentIdentifier") String studentId,
      @QueryParam("search") String searchString,
      @QueryParam("flags") Long[] flagIds,
      @QueryParam("maxResults") Integer maxResults,
      @QueryParam("orderBy") String orderBy) {
    
    List<SchoolDataIdentifier> studentIdentifiers = null;
    if (StringUtils.isNotBlank(studentId)) {    
      SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentId);
      if (studentIdentifier == null) {
        return Response.status(Status.BAD_REQUEST).entity(String.format("Malformed student identifier %s", studentId)).build();
      }
      studentIdentifiers = Collections.singletonList(studentIdentifier);
    }
    
    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Access check
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_WORKSPACE_MEMBERS, workspaceEntity)) {
      if (studentIdentifiers == null
          || studentIdentifiers.size() != 1
          || !studentIdentifiers.get(0).equals(sessionController.getLoggedUser())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    List<fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser> workspaceUsers = null;
    
    if (searchString != null) {
      studentIdentifiers = new ArrayList<>();

      Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
      if (!searchProviderIterator.hasNext()) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity("No search provider found").build();
      }
      SearchProvider elasticSearchProvider = searchProviderIterator.next();

      if (elasticSearchProvider != null) {
        String[] fields = new String[] { "firstName", "lastName", "nickName", "email" };

        SearchResult result = elasticSearchProvider.searchUsers(
            searchString,
            fields,
            Arrays.asList(EnvironmentRoleArchetype.STUDENT),
            (Collection<Long>)null,
            Collections.singletonList(workspaceEntityId),
            (Collection<SchoolDataIdentifier>) null,
            Boolean.FALSE,
            Boolean.FALSE,
            false,
            0,
            maxResults != null ? maxResults : Integer.MAX_VALUE);
        
        List<Map<String, Object>> results = result.getResults();

        if (results != null && !results.isEmpty()) {
          for (Map<String, Object> o : results) {
            String foundStudentId = (String) o.get("id");
            if (StringUtils.isBlank(foundStudentId)) {
              logger.severe("Could not process user found from search index because it had a null id");
              continue;
            }
            
            String[] studentIdParts = foundStudentId.split("/", 2);
            SchoolDataIdentifier foundStudentIdentifier = studentIdParts.length == 2 ? new SchoolDataIdentifier(studentIdParts[0], studentIdParts[1]) : null;
            if (foundStudentIdentifier == null) {
              logger.severe(String.format("Could not process user found from search index with id %s", studentId));
              continue;
            }
            
            studentIdentifiers.add(foundStudentIdentifier);
          }
        }
      }
    }
    
    List<Flag> flags = null;
    if (flagIds != null && flagIds.length > 0) {
      flags = new ArrayList<>(flagIds.length);
      for (Long flagId : flagIds) {
        Flag flag = flagController.findFlagById(flagId);
        if (flag == null) {
          return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid flag id %d", flagId)).build();
        }
        
        if (!flagController.hasFlagPermission(flag, sessionController.getLoggedUser())) {
          return Response.status(Status.FORBIDDEN).entity(String.format("You don't have permission to use flag %d", flagId)).build();
        }
        
        flags.add(flag);
      }
    }
    
    if (flags != null) {
      List<SchoolDataIdentifier> flaggedStudents = flagController.getFlaggedStudents(flags);
      if (studentIdentifiers != null) {
        studentIdentifiers.retainAll(flaggedStudents);
      } else {
        studentIdentifiers = flaggedStudents;
      }
    }

    List<WorkspaceStudent> result = new ArrayList<>();
    
    if (studentIdentifiers != null) {
      workspaceUsers = new ArrayList<>();
      
      for (SchoolDataIdentifier studentIdentifier : studentIdentifiers) {
        WorkspaceUserEntity wue = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, studentIdentifier);
        if (wue == null) {
          continue;
        }

        if (active != null && !active.equals(wue.getActive())) {
          continue;
        }

        WorkspaceUser workspaceUser = workspaceController.findWorkspaceUser(wue);
        if (workspaceUser == null) {
          continue;
        }

        workspaceUsers.add(workspaceUser);
      }
    } else {
      // Students via WorkspaceSchoolDataBridge
      workspaceUsers = workspaceController.listWorkspaceStudents(workspaceEntity);
    }
  
    if (workspaceUsers == null || workspaceUsers.isEmpty()) {
      return Response.noContent().build();
    }

    Map<String, WorkspaceUserEntity> workspaceUserEntityMap = new HashMap<>();
    List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listWorkspaceUserEntities(workspaceEntity);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      workspaceUserEntityMap.put(new SchoolDataIdentifier(workspaceUserEntity.getIdentifier(), workspaceUserEntity.getUserSchoolDataIdentifier().getDataSource().getIdentifier()).toId(), 
          workspaceUserEntity);
    }

    if (maxResults != null && workspaceUsers.size() > maxResults) {
      workspaceUsers.subList(maxResults, workspaceUsers.size() - 1).clear();
    }
  
    for (fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser workspaceUser : workspaceUsers) {
      SchoolDataIdentifier workspaceUserIdentifier = workspaceUser.getIdentifier();
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityMap.get(workspaceUserIdentifier.toId());
      
      if (workspaceUserEntity == null) {
        logger.log(Level.WARNING, String.format("Workspace student %s does not exist in Muikku", workspaceUserIdentifier.toId()));
        continue;
      }
      
      if (active == null || active.equals(workspaceUserEntity.getActive())) {
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

          if (workspaceUserEntity != null) {
            userEntity = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
          } else {
            userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(user.getSchoolDataSource(), user.getIdentifier());  
          }
          
          result.add(createRestModel(userEntity, user, workspaceUser, workspaceUserEntity != null && workspaceUserEntity.getActive()));
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

  private WorkspaceStudent createRestModel(UserEntity userEntity, User user, WorkspaceUser workspaceUser, boolean userActive) {
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(user.getIdentifier(), user.getSchoolDataSource());
    String firstName = user.getFirstName();
    String lastName = user.getLastName();
    String studyProgrammeName = user.getStudyProgrammeName();
    OffsetDateTime enrolmentTime = workspaceUser.getEnrolmentTime();
    
    return new WorkspaceStudent(workspaceUser.getIdentifier().toId(), 
      userEntity != null ? userEntity.getId() : null, 
      userIdentifier.toId(),
      firstName, 
      lastName, 
      studyProgrammeName,
      enrolmentTime != null ? Date.from(enrolmentTime.toInstant()) : null,
      userActive);
    
  }
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/evaluatedAssignmentInfo")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getEvaluatedAssignmentInfo(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    Map<String, Long> result = new HashMap<String, Long>();
    
    // Workspace and user
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    UserEntity userEntity = sessionController.getLoggedUserEntity();

    // Total number of evaluated assignments
    
    List<WorkspaceMaterial> evaluatedAssignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(
        workspaceEntity,
        WorkspaceMaterialAssignmentType.EVALUATED);
    result.put("assignmentsTotal", new Long(evaluatedAssignments.size()));
    
    // Done number of evaluated assignments  

    List<WorkspaceMaterialReplyState> replyStates = new ArrayList<WorkspaceMaterialReplyState>();
    replyStates.add(WorkspaceMaterialReplyState.FAILED);
    replyStates.add(WorkspaceMaterialReplyState.PASSED);
    replyStates.add(WorkspaceMaterialReplyState.SUBMITTED);
    Long assignmentsDone = workspaceMaterialReplyController.getReplyCountByUserEntityAndReplyStatesAndWorkspaceMaterials(userEntity.getId(), replyStates, evaluatedAssignments);
    result.put("assignmentsDone", assignmentsDone);
    
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
    
    // #3069: If the user has evaluation fees and a school set, all workspaces have an
    // evaluation fee. Otherwise it depends on the applicability of the workspace itself.
    
    boolean evaluationFees = user.hasEvaluationFees() && (StringUtils.isNotEmpty(user.getSchool()) || workspace.isEvaluationFeeApplicable());

    return Response.ok(new WorkspaceFeeInfo(evaluationFees)).build();
  }

  @GET
  @Path("/workspaces/{ID}/staffMembers")
  @RESTPermitUnimplemented
  public Response listWorkspaceStaffMembers(@PathParam("ID") Long workspaceEntityId, @QueryParam("orderBy") String orderBy) {
    
    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Access check
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_WORKSPACE_MEMBERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Staff via WorkspaceSchoolDataBridge
    List<fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser> schoolDataUsers = workspaceController.listWorkspaceStaffMembers(workspaceEntity);
    List<WorkspaceStaffMember> workspaceStaffMembers = new ArrayList<>();
    
    for (fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser workspaceUser : schoolDataUsers) {
      SchoolDataIdentifier userIdentifier = workspaceUser.getUserIdentifier();
      User user = userController.findUserByIdentifier(userIdentifier);
      
      if (user != null) {
        UserEntity userEntity = userEntityController.findUserEntityByUser(user);
        
        // #3111: Workspace staff members should be limited to teachers only. A better implementation would support specified workspace roles
        
        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserEntity(workspaceEntity, userEntity);
        if (workspaceUserEntity == null || workspaceUserEntity.getWorkspaceUserRole().getArchetype() != WorkspaceRoleArchetype.TEACHER) {
          continue;
        }
        
        workspaceStaffMembers.add(new WorkspaceStaffMember(workspaceUser.getIdentifier().toId(),
          workspaceUser.getUserIdentifier().toId(),
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
      
      WorkspaceNode createdNode = null;
      WorkspaceMaterial createdMaterial = null;
      if (copyOnlyChildren) {
        List<WorkspaceNode> sourceChildren = workspaceMaterialController.listWorkspaceNodesByParent(sourceNode);
        for (WorkspaceNode sourceChild : sourceChildren) {
          workspaceMaterialController.cloneWorkspaceNode(sourceChild, targetNode, cloneMaterials);
        }
      }
      else {
        createdNode = workspaceMaterialController.cloneWorkspaceNode(sourceNode, targetNode, cloneMaterials);
        if (createdNode.getType() == WorkspaceNodeType.MATERIAL) {
          createdMaterial = workspaceMaterialController.findWorkspaceMaterialById(createdNode.getId());
          if (entity != null && entity.getNextSiblingId() != null) {
            WorkspaceNode nextSibling = workspaceMaterialController.findWorkspaceNodeById(entity.getNextSiblingId());
            if (nextSibling == null) {
              return Response.status(Status.BAD_REQUEST).entity("Specified next sibling does not exist").build();
            }
            workspaceMaterialController.moveAbove(createdNode, nextSibling);
          }
        }
      }
      
      // Done
      
      return createdMaterial == null ? Response.noContent().build() : Response.ok(createRestModel(createdMaterial)).build(); 
      
    } else {
      if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
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
        
        result.add(new WorkspaceCompositeReply(reply.getWorkspaceMaterial().getId(), reply.getId(), reply.getState(), answers));
      }

      if (result.isEmpty()) {
        return Response.noContent().build();
      }
    } catch (WorkspaceFieldIOException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Internal error occurred while retrieving field answers: " + e.getMessage()).build();
    }
    
    CacheControl cacheControl = new CacheControl();
    cacheControl.setMustRevalidate(true);
    cacheControl.setNoCache(true);
    cacheControl.setProxyRevalidate(true);

    return Response
        .ok(result)
        .cacheControl(cacheControl)
        .build();
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
  @RESTPermit (handling = Handling.INLINE)
  public Response getFileAnswer(@PathParam("FILEID") String fileId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceMaterialFileFieldAnswerFile answerFile = workspaceMaterialFieldAnswerController.findWorkspaceMaterialFileFieldAnswerFileByFileId(fileId);
    if (answerFile != null) {
      fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply workspaceMaterialReply = answerFile.getFieldAnswer().getReply();
      if (workspaceMaterialReply == null) {
        return Response.status(Status.INTERNAL_SERVER_ERROR)
          .entity(String.format("Could not find reply from answer file %d", answerFile.getId()))
          .build();
      }
      
      WorkspaceMaterial workspaceMaterial = workspaceMaterialReply.getWorkspaceMaterial();
      if (workspaceMaterial == null) {
        return Response.status(Status.INTERNAL_SERVER_ERROR)
          .entity(String.format("Could not find workspace material from reply %d", workspaceMaterialReply.getId()))
          .build();
      }

      WorkspaceRootFolder workspaceRootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial);
      if (workspaceRootFolder == null) {
        return Response.status(Status.INTERNAL_SERVER_ERROR)
          .entity(String.format("Could not find workspace root folder for material %d", workspaceMaterial.getId()))
          .build();
      }
      
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceRootFolder.getWorkspaceEntityId());
      if (workspaceEntity == null) {
        return Response.status(Status.INTERNAL_SERVER_ERROR)
          .entity(String.format("Could not find workspace entity for root folder %d", workspaceRootFolder.getId()))
          .build();
      }
      
      if (!workspaceMaterialReply.getUserEntityId().equals(sessionController.getLoggedUserEntity().getId())) {
        if (!sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_STUDENT_ANSWERS, workspaceEntity)) {
          return Response.status(Status.FORBIDDEN).build();
        }
      }
      
      return Response.ok(answerFile.getContent())
        .type(answerFile.getContentType())
        .header("Content-Disposition", "attachment; filename=\"" + answerFile.getFileName().replaceAll("\"", "\\\"") + "\"")
        .build();
    }
    
    return Response.status(Status.NOT_FOUND).build();
  }

  @GET
  @Path("/audioanswer/{CLIPID}")
  @RESTPermit (handling = Handling.INLINE)
  public Response getAudioAnswer(@PathParam("CLIPID") String clipId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceMaterialAudioFieldAnswerClip answerClip = workspaceMaterialFieldAnswerController.findWorkspaceMaterialAudioFieldAnswerClipByClipId(clipId);
    if (answerClip != null) {
      fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply workspaceMaterialReply = answerClip.getFieldAnswer().getReply();
      if (workspaceMaterialReply == null) {
        return Response.status(Status.INTERNAL_SERVER_ERROR)
          .entity(String.format("Could not find reply from answer audio %d", answerClip.getId()))
          .build();
      }
      
      WorkspaceMaterial workspaceMaterial = workspaceMaterialReply.getWorkspaceMaterial();
      if (workspaceMaterial == null) {
        return Response.status(Status.INTERNAL_SERVER_ERROR)
          .entity(String.format("Could not find workspace material from reply %d", workspaceMaterialReply.getId()))
          .build();
      }

      WorkspaceRootFolder workspaceRootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial);
      if (workspaceRootFolder == null) {
        return Response.status(Status.INTERNAL_SERVER_ERROR)
          .entity(String.format("Could not find workspace root folder for material %d", workspaceMaterial.getId()))
          .build();
      }
      
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceRootFolder.getWorkspaceEntityId());
      if (workspaceEntity == null) {
        return Response.status(Status.INTERNAL_SERVER_ERROR)
          .entity(String.format("Could not find workspace entity for root folder %d", workspaceRootFolder.getId()))
          .build();
      }
      
      if (!workspaceMaterialReply.getUserEntityId().equals(sessionController.getLoggedUserEntity().getId())) {
        if (!sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_STUDENT_ANSWERS, workspaceEntity)) {
          return Response.status(Status.FORBIDDEN).build();
        }
      }
      
      return Response.ok(answerClip.getContent())
        .type(answerClip.getContentType())
        .header("Content-Disposition", "attachment; filename=\"" + answerClip.getFileName().replaceAll("\"", "\\\"") + "\"")
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
  
  private fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial createRestModel(WorkspaceMaterial workspaceMaterial) {
    WorkspaceNode workspaceNode = workspaceMaterialController.findWorkspaceNodeNextSibling(workspaceMaterial);
    Long nextSiblingId = workspaceNode != null ? workspaceNode.getId() : null;
    
    return new fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial(workspaceMaterial.getId(), workspaceMaterial.getMaterialId(),
        workspaceMaterial.getParent() != null ? workspaceMaterial.getParent().getId() : null, nextSiblingId, workspaceMaterial.getHidden(), 
        workspaceMaterial.getAssignmentType(), workspaceMaterial.getCorrectAnswers(), workspaceMaterial.getPath(), workspaceMaterial.getTitle());
  }

  private fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace createRestModel(
      WorkspaceEntity workspaceEntity,
      String name,
      String nameExtension,
      String description,
      Set<String> curriculumIdentifiers,
      String subjectIdentifier) {
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
        lastVisit,
        curriculumIdentifiers,
        subjectIdentifier);
  }

  private fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceFolder createRestModel(WorkspaceFolder workspaceFolder) {
    WorkspaceNode nextSibling = workspaceMaterialController.findWorkspaceNodeNextSibling(workspaceFolder);
    return new fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceFolder(
        workspaceFolder.getId(),
        workspaceFolder.getParent() == null ? null : workspaceFolder.getParent().getId(),
        nextSibling == null ? null : nextSibling.getId(),
        workspaceFolder.getHidden(),
        workspaceFolder.getTitle(),
        workspaceFolder.getPath(),
        workspaceFolder.getViewRestrict());
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
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
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
    
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
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

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
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
    MaterialViewRestrict viewRestrict = restFolder.getViewRestrict();
    
    workspaceFolder = workspaceMaterialController.updateWorkspaceFolder(workspaceFolder, title, parentNode, nextSibling, hidden, viewRestrict);
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
    
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
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
    
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
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
    
    return Response.ok(createRestModel(
        workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity(),
        user,
        workspaceUser,
        workspaceUserEntity.getActive())).build();
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
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MEMBERS, workspaceEntity)) {
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
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(workspaceUserIdentifier);
    
    // Reindex user when switching between active and inactive
    if (workspaceStudent.getActive() != null && !workspaceStudent.getActive().equals(workspaceUserEntity.getActive())) {
      workspaceController.updateWorkspaceStudentActivity(bridgeUser, workspaceStudent.getActive());
      workspaceUserEntityController.updateActive(workspaceUserEntity, workspaceStudent.getActive());
      UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
      userIndexer.indexUser(userSchoolDataIdentifier.getDataSource().getIdentifier(), userSchoolDataIdentifier.getIdentifier());
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
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MEMBERS, workspaceEntity)) {
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
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listJournalEntries(
      @PathParam("WORKSPACEID") Long workspaceEntityId,
      @QueryParam("userEntityId") Long userEntityId,
      @QueryParam("workspaceStudentId") String workspaceStudentId,
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("25") Integer maxResults) {
    // Workspace
    
    List<WorkspaceJournalEntry> entries = new ArrayList<>();
    List<WorkspaceJournalEntryRESTModel> result = new ArrayList<>();
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    boolean canListAllEntries = sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_ALL_JOURNAL_ENTRIES, workspaceEntity);
    if (workspaceStudentId == null && userEntityId == null && canListAllEntries) {
      Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
      if (!searchProviderIterator.hasNext()) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity("No search provider found").build();
      }
      SearchProvider elasticSearchProvider = searchProviderIterator.next();

      Set<UserEntity> workspaceUserEntities = new HashSet<>();
      
      if (elasticSearchProvider != null) {
        SearchResult studentSearchResult = elasticSearchProvider.searchUsers(
            null,
            new String[0],
            Arrays.asList(EnvironmentRoleArchetype.STUDENT),
            (Collection<Long>)null,
            Collections.singletonList(workspaceEntityId),
            (Collection<SchoolDataIdentifier>) null,
            Boolean.FALSE,
            Boolean.FALSE,
            true,
            0,
            maxResults != null ? maxResults : Integer.MAX_VALUE);
        
        List<Map<String, Object>> results = studentSearchResult.getResults();

        if (results != null && !results.isEmpty()) {
          for (Map<String, Object> o : results) {
            String foundStudentId = (String) o.get("id");
            if (StringUtils.isBlank(foundStudentId)) {
              logger.severe("Could not process user found from search index because it had a null id");
              continue;
            }
            
            String[] studentIdParts = foundStudentId.split("/", 2);
            SchoolDataIdentifier foundStudentIdentifier = studentIdParts.length == 2 ? new SchoolDataIdentifier(studentIdParts[0], studentIdParts[1]) : null;
            if (foundStudentIdentifier == null) {
              logger.severe(String.format("Could not process user found from search index with id %s", foundStudentId));
              continue;
            }
            
            WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifier(workspaceEntity, foundStudentIdentifier);
            if (workspaceUserEntity != null) {
              workspaceUserEntities.add(workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity());
            }
          }
        }
      }
      
      entries = workspaceJournalController.listEntriesForStudents(workspaceEntity, workspaceUserEntities, firstResult, maxResults);
    }
    else {
      if (userEntityId != null) {
        // List by user entity (Muikku)
        if (!userEntityId.equals(userEntity.getId())) {
          if (canListAllEntries) {
            userEntity = userEntityController.findUserEntityById(userEntityId);
            if (userEntity == null) {
              return Response.status(Status.NOT_FOUND).build();
            }
          }
          else {
            return Response.status(Status.FORBIDDEN).build();
          }
        }
      }
      else if (workspaceStudentId != null) {
        // List by workspace student (school data)
        SchoolDataIdentifier workspaceUserIdentifier = SchoolDataIdentifier.fromId(workspaceStudentId);
        if (workspaceUserIdentifier == null) {
          return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceStudentId").build();
        }
        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(workspaceUserIdentifier);
        if (workspaceUserEntity == null) {
          return Response.status(Status.NOT_FOUND).build();
        }
        UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier(); 
        UserEntity userEntityFromWorkspaceUser = userEntityController.findUserEntityByDataSourceAndIdentifier(
            userSchoolDataIdentifier.getDataSource(),
            userSchoolDataIdentifier.getIdentifier());
        if (userEntityFromWorkspaceUser == null) {
          return Response.status(Status.NOT_FOUND).build();
        }
        if (!canListAllEntries) {
          if (!userEntity.getId().equals(userEntityFromWorkspaceUser.getId())) {
            return Response.status(Status.FORBIDDEN).build();
          }
        }
        else {
          userEntity = userEntityFromWorkspaceUser;
        }
      }
      entries = workspaceJournalController.listEntriesByWorkspaceEntityAndUserEntity(workspaceEntity, userEntity, firstResult, maxResults);
    }
    
    for (WorkspaceJournalEntry entry : entries) {
      UserEntity entryUserEntity = userEntityController.findUserEntityById(entry.getUserEntityId());
      User user = userController.findUserByUserEntityDefaults(entryUserEntity);
      
      result.add(new WorkspaceJournalEntryRESTModel(
          entry.getId(),
          entry.getWorkspaceEntityId(),
          entry.getUserEntityId(),
          user.getFirstName(),
          user.getLastName(),
          entry.getHtml(),
          entry.getTitle(),
          entry.getCreated()
      ));
    }

    return Response.ok(result).build();
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
  public Response updateJournalEntry(@PathParam("WORKSPACEID") Integer workspaceId, @PathParam("JOURNALENTRYID") Long journalEntryId) {
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
