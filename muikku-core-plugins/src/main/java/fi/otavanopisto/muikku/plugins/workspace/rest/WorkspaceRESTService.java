package fi.otavanopisto.muikku.plugins.workspace.rest;

import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
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
import java.util.UUID;
import java.util.function.Predicate;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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
import javax.ws.rs.core.EntityTag;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.StreamingOutput;
import javax.xml.bind.DatatypeConverter;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.jboss.resteasy.annotations.GZIP;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.controller.messaging.MessagingWidget;
import fi.otavanopisto.muikku.files.TempFileUtils;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.base.BooleanPredicate;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.EducationTypeMapping;
import fi.otavanopisto.muikku.model.workspace.Mandatority;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialProducer;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceSignupMessage;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.chat.ChatController;
import fi.otavanopisto.muikku.plugins.data.FileController;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.plugins.forum.ForumAreaSubsciptionController;
import fi.otavanopisto.muikku.plugins.forum.ForumThreadSubsciptionController;
import fi.otavanopisto.muikku.plugins.material.HtmlMaterialController;
import fi.otavanopisto.muikku.plugins.material.MaterialController;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.rest.HtmlRestMaterial;
import fi.otavanopisto.muikku.plugins.pedagogy.PedagogyController;
import fi.otavanopisto.muikku.plugins.search.UserIndexer;
import fi.otavanopisto.muikku.plugins.search.WorkspaceIndexer;
import fi.otavanopisto.muikku.plugins.workspace.ContentNode;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceEntityFileController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceJournalController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialDeleteError;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialFieldController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceVisitController;
import fi.otavanopisto.muikku.plugins.workspace.fieldio.FileAnswerType;
import fi.otavanopisto.muikku.plugins.workspace.fieldio.FileAnswerUtils;
import fi.otavanopisto.muikku.plugins.workspace.fieldio.WorkspaceFieldIOException;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceEntityFile;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalComment;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalEntry;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNodeType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceBasicInfo;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceCompositeReply;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceCompositeReplyLock;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceDetails;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceEntityFileRESTModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceFeeInfo;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceJournalCommentRESTModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceJournalEntryRESTModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterialFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterialReplyRestModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceRESTModelController;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceRestModels;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceSettingsRestModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceSignupGroupRestModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceSignupMessageGroupRestModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceSignupMessageRestModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceStaffMember;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceStudentRestModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceSubjectRestModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceUserRestModel;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.WorkspaceSignupGroupController;
import fi.otavanopisto.muikku.schooldata.WorkspaceSignupMessageController;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentState;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceSubject;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceType;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.search.SearchResults;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.OrganizationRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.PublicityRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.TemplateRestriction;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
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
  private AssessmentRequestController assessmentRequestController;

  @Inject
  private EvaluationController evaluationController;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Inject
  private LocaleController localeController;

  @Inject
  private CourseMetaController courseMetaController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceSignupMessageController workspaceSignupMessageController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private WorkspaceRESTModelController workspaceRESTModelController;

  @Inject
  private SessionController sessionController;

  @Inject
  private UserController userController;

  @Inject
  private PermissionController permissionController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private UserEntityFileController userEntityFileController;

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
  private WorkspaceIndexer workspaceIndexer;

  @Inject
  private WorkspaceJournalController workspaceJournalController;

  @Inject
  private CopiedWorkspaceEntityIdFinder copiedWorkspaceEntityIdFinder;

  @Inject
  private WorkspaceEntityFileController workspaceEntityFileController;

  @Inject
  private FileController fileController;

  @Inject
  private OrganizationEntityController organizationEntityController;

  @Inject
  private FileAnswerUtils fileAnswerUtils;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private ChatController chatController;

  @Inject
  private WorkspaceRestModels workspaceRestModels;

  @Inject
  private PedagogyController pedagogyController;

  @Inject
  private ForumAreaSubsciptionController forumAreaSubsciptionController;

  @Inject
  private ForumThreadSubsciptionController forumThreadSubsciptionController;

  @Inject
  private WorkspaceSignupGroupController workspaceSignupGroupController;

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

      workspaceIdentifier = sourceWorkspaceEntity.schoolDataIdentifier();
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

    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    SchoolDataIdentifier userOrganizationIdentifier = userSchoolDataIdentifier.getOrganization().schoolDataIdentifier();
    Workspace sourceWorkspace = workspaceController.findWorkspace(workspaceIdentifier);

    // Source workspace needs to be a template or belong to the same organization with the user
    if (!sourceWorkspace.isTemplate() && !sourceWorkspace.getOrganizationIdentifier().equals(userOrganizationIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    OrganizationEntity organizationEntity = payload.getOrganizationEntityId() != null ?
        organizationEntityController.findById(payload.getOrganizationEntityId()) : null;
    SchoolDataIdentifier destinationOrganizationIdentifier = organizationEntity != null ?
        organizationEntity.schoolDataIdentifier() : userOrganizationIdentifier;

    // Users can only create workspaces to the organization they belong to
    if (!destinationOrganizationIdentifier.equals(userOrganizationIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    Workspace workspace = workspaceController.copyWorkspace(workspaceIdentifier, payload.getName(), payload.getNameExtension(), payload.getDescription(), destinationOrganizationIdentifier);
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

      workspaceEntity.setLanguage(sourceWorkspaceEntity.getLanguage());
    }

    EducationTypeMapping educationTypeMapping = workspaceEntityController.getEducationTypeMapping();
    return Response
        .ok(createRestModel(workspaceEntity, workspace, educationTypeMapping))
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
        @QueryParam("q") String searchString,
        @QueryParam("subjects") List<String> subjectIds,
        @QueryParam("educationTypes") List<String> educationTypeIds,
        @QueryParam("curriculums") List<String> curriculumIds,
        @QueryParam("organizations") List<String> organizationIds,
        @QueryParam("minVisits") Long minVisits,
        @QueryParam("publicity") @DefaultValue ("ONLY_PUBLISHED") PublicityRestriction publicityRestriction,
        @QueryParam("templates") @DefaultValue ("ONLY_WORKSPACES") TemplateRestriction templateRestriction,
        @QueryParam("orderBy") List<String> orderBy,
        @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult,
        @QueryParam("maxResults") @DefaultValue ("50") Integer maxResults,
        @Context Request request) {
    List<fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace> workspaces = new ArrayList<>();

    boolean doMinVisitFilter = minVisits != null;
    UserEntity userEntity = userEntityId != null ? userEntityController.findUserEntityById(userEntityId) : null;
    List<WorkspaceEntity> workspaceEntities = null;
    List<SchoolDataIdentifier> workspaceIdentifierFilters = null;

    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(userId);
    if (userIdentifier != null) {
      if (doMinVisitFilter && userEntity == null) {
        userEntity = userEntityController.findUserEntityByUserIdentifier(userIdentifier);
      }
    }

    templateRestriction = templateRestriction != null ? templateRestriction : TemplateRestriction.ONLY_WORKSPACES;
    if (templateRestriction != TemplateRestriction.ONLY_WORKSPACES) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_WORKSPACE_TEMPLATES)) {
        return Response.status(Status.FORBIDDEN).entity("You have no permission to list workspace templates.").build();
      }
    }

    publicityRestriction = publicityRestriction != null ? publicityRestriction : PublicityRestriction.ONLY_PUBLISHED;
    if (publicityRestriction != PublicityRestriction.ONLY_PUBLISHED) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_ALL_UNPUBLISHED_WORKSPACES)) {
        if (sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_OWN_UNPUBLISHED_WORKSPACES)) {
          // List only from workspaces the user is member of
          workspaceIdentifierFilters = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(sessionController.getLoggedUserEntity()).stream()
              .map(WorkspaceEntity::schoolDataIdentifier)
              .collect(Collectors.toList());
        } else {
          return Response.status(Status.FORBIDDEN).entity("You have no permission to list unpublished workspaces.").build();
        }
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
        }
        else {
          workspaceEntities = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserIdentifier(userIdentifier);
        }
      }
      else if (userEntity != null) {
        workspaceEntities = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(userEntity);
      }
      else {
        if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_ALL_UNPUBLISHED_WORKSPACES)) {
          return Response.status(Status.FORBIDDEN).build();
        }
        workspaceEntities = publicityRestriction != PublicityRestriction.ONLY_PUBLISHED ? workspaceController.listWorkspaceEntities() : workspaceController.listPublishedWorkspaceEntities();
      }

      // When querying workspaces of a student, plain teachers are limited to workspaces they are teaching

      if ((userIdentifier != null || userEntity != null) && sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_OWN_STUDENT_WORKSPACES)) {
        UserSchoolDataIdentifier targetUSDI = userIdentifier != null
            ? userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier)
            : userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(userEntity);
        if (targetUSDI != null && targetUSDI.hasRole(EnvironmentRoleArchetype.STUDENT)) {
          Predicate<WorkspaceEntity> isTeacher = new Predicate<WorkspaceEntity>() {
            @Override
            public boolean test(WorkspaceEntity workspaceEntity) {
              return sessionController.hasWorkspacePermission(MuikkuPermissions.TEACH_WORKSPACE, workspaceEntity);
            }
          };
          workspaceEntities = workspaceEntities.stream().filter(isTeacher).collect(Collectors.toList());
          if (workspaceEntities.isEmpty()) {
            return Response.noContent().build();
          }
        }
      }
    }

    EducationTypeMapping educationTypeMapping = workspaceEntityController.getEducationTypeMapping();

    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      SearchProvider searchProvider = searchProviderIterator.next();

      if (workspaceEntities != null) {
        workspaceIdentifierFilters = new ArrayList<>();

        for (WorkspaceEntity workspaceEntity : workspaceEntities) {
          workspaceIdentifierFilters.add(workspaceEntity.schoolDataIdentifier());
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

      List<SchoolDataIdentifier> subjects = null;
      if (subjectIds != null) {
        subjects = new ArrayList<>(subjectIds.size());
        for (String subjectId : subjectIds) {
          SchoolDataIdentifier subjectIdentifier = SchoolDataIdentifier.fromId(subjectId);
          if (subjectIdentifier != null) {
            subjects.add(subjectIdentifier);
          } else {
            return Response.status(Status.BAD_REQUEST).entity(String.format("Malformed subject identifier", subjectId)).build();
          }
        }
      }

      // TODO: Limit to organizations the logged user has access to (how though?)

      List<OrganizationEntity> loggedUserOrganizations = organizationEntityController.listLoggedUserOrganizations();

      List<SchoolDataIdentifier> organizations = null;
      if (organizationIds != null) {
        organizations = new ArrayList<>(organizationIds.size());
        for (String organizationId : organizationIds) {
          SchoolDataIdentifier organizationIdentifier = SchoolDataIdentifier.fromId(organizationId);
          if (organizationIdentifier != null) {
            organizations.add(organizationIdentifier);
          } else {
            return Response.status(Status.BAD_REQUEST).entity(String.format("Malformed organization identifier", organizationId)).build();
          }
        }
      }

      List<OrganizationRestriction> organizationRestrictions = organizationEntityController.listUserOrganizationRestrictions(loggedUserOrganizations, publicityRestriction, templateRestriction);

      SearchResult searchResult = searchProvider.searchWorkspaces(subjects, workspaceIdentifierFilters, educationTypes,
          curriculums, organizationRestrictions, searchString, null, null, firstResult, maxResults, sorts);

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
              String educationTypeId = (String) result.get("educationTypeIdentifier");

              Mandatority mandatority = null;

              if (StringUtils.isNotBlank(educationTypeId)) {
                SchoolDataIdentifier educationSubtypeId = SchoolDataIdentifier.fromId((String) result.get("educationSubtypeIdentifier"));

                if (educationSubtypeId != null) {
                  if (educationTypeMapping != null) {
                    mandatority = educationTypeMapping.getMandatority(educationSubtypeId);
                  }
                }
              }

              if (StringUtils.isNotBlank(name)) {
                workspaces.add(createRestModel(workspaceEntity, name, nameExtension, description, curriculumIdentifiers, mandatority));
              }
            }
          }
        }
      }
    } else {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }

    if (workspaces.isEmpty()) {
      return Response.ok(workspaces).build();
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

    EducationTypeMapping educationTypeMapping = workspaceEntityController.getEducationTypeMapping();

    return Response.ok(createRestModel(
        workspaceEntity,
        workspace,
        educationTypeMapping
    )).build();
  }

  @GET
  @Path("/workspaces/{ID}/description")
  @RESTPermit (handling = Handling.INLINE)
  public Response getWorkspaceDescription(@PathParam("ID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
    	return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceMaterial frontPage = workspaceMaterialController.ensureWorkspaceFrontPageExists(workspaceEntity);
    return Response.ok(workspaceMaterialController.createContentNode(frontPage, null)).build();
  }

  @GET
  @Path("/workspaces/{ID}/help")
  @RESTPermit (handling = Handling.INLINE)
  public Response getWorkspaceHelpPages(@PathParam("ID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
    	return Response.status(Status.NOT_FOUND).build();
    }
    List<ContentNode> helpPages = workspaceMaterialController.listWorkspaceHelpPagesAsContentNodes(workspaceEntity);
    return Response.ok(helpPages).build();
  }

  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/asContentNode/{WORKSPACENODEID}")
  @RESTPermit (handling = Handling.INLINE)
  public Response getAsContentNode(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACENODEID") Long workspaceNodeId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    WorkspaceNode node = workspaceMaterialController.findWorkspaceNodeById(workspaceNodeId);
    if (workspaceEntity == null || node == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceNode nextSibling = workspaceMaterialController.findWorkspaceNodeNextSibling(node);
    return Response.ok(workspaceMaterialController.createContentNode(node, nextSibling)).build();
  }

  @GET
  @Path("/workspaces/{URLNAME}/basicInfo")
  @RESTPermit (handling = Handling.INLINE)
  public Response getWorkspaceBasicInfo(@PathParam("URLNAME") String urlName) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
    // TODO Make a generic status check method for all these access checks
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    if (!workspaceEntity.getPublished() && !sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_UNPUBLISHED_WORKSPACE, workspaceEntity)) {
      return Response.status(Status.NOT_FOUND).build();
    }
    if (!sessionController.isLoggedIn() && (workspaceEntity.getAccess() != WorkspaceAccess.ANYONE)) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (workspaceEntity.getAccess() == WorkspaceAccess.MEMBERS_ONLY) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());
      if (workspaceUserEntity == null && !sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_MEMBERS_ONLY_WORKSPACE, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    WorkspaceBasicInfo workspaceBasicInfo = workspaceRESTModelController.workspaceBasicInfo(workspaceEntity.getId());
    if (workspaceBasicInfo == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    return Response.ok(workspaceBasicInfo).build();
  }

  @GET
  @Path("/workspaces/{ID}/additionalInfo")
  @RESTPermit (handling = Handling.INLINE)
  public Response getWorkspaceAdditionalInfo(@PathParam("ID") Long workspaceEntityId) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
      if (workspaceEntity == null) {
        return Response.status(Status.NOT_FOUND).build();
      }

      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace == null) {
        return Response.status(Status.NOT_FOUND).build();
      }

      String typeId = workspace.getWorkspaceTypeId() != null ? workspace.getWorkspaceTypeId().toId() : null;

      EducationType educationTypeObject = workspace.getEducationTypeIdentifier() == null ? null
          : courseMetaController.findEducationType(workspace.getEducationTypeIdentifier());

      Map<String, Object> result = new HashMap<>();
      result.put("beginDate", workspace.getBeginDate());
      result.put("endDate", workspace.getEndDate());
      result.put("signupStart", workspace.getSignupStart());
      result.put("signupEnd", workspace.getSignupEnd());
      result.put("viewLink", workspace.getViewLink());
      result.put("workspaceTypeId", typeId);
      result.put("educationType", educationTypeObject);
      if (typeId != null) {
        WorkspaceType workspaceType = workspaceController.findWorkspaceType(workspace.getWorkspaceTypeId());
        result.put("workspaceType", workspaceType.getName());
      } else {
        result.put("workspaceType", null);
      }

      List<WorkspaceSubjectRestModel> subjectRestModels = workspace.getSubjects().stream()
          .map(workspaceSubject -> workspaceRestModels.toRestModel(workspaceSubject))
          .collect(Collectors.toList());
      result.put("subjects", subjectRestModels);

      return Response.ok(result).build();
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
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
    WorkspaceRootFolder rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    WorkspaceFolder helpFolder = workspaceMaterialController.ensureWorkspaceHelpFolderExists(workspaceEntity);
    WorkspaceMaterial frontPage = workspaceMaterialController.ensureWorkspaceFrontPageExists(workspaceEntity);

    return Response.ok(new WorkspaceDetails(typeId,
        workspace.getBeginDate(),
        workspace.getEndDate(),
        workspace.getSignupStart(),
        workspace.getSignupEnd(),
        workspace.getViewLink(),
        rootFolder.getId(),
        helpFolder.getId(),
        frontPage.getParent().getId())).build();
  }

  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/permissions")
  @RESTPermit (handling = Handling.INLINE)
  public Response getWorkspacePermissions(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    Set<String> permissionSet = new HashSet<String>();
    List<Permission> permissions = permissionController.listPermissionsByScope("WORKSPACE");
    for (Permission permission : permissions) {
      if (sessionController.hasWorkspacePermission(permission.getName(), workspaceEntity)) {

        /*
         * The following have exception cases which are handled differently with separate methods.
         */
        if (MuikkuPermissions.MANAGE_WORKSPACE.equals(permission.getName()) && !workspaceController.canIManageWorkspace(workspaceEntity)) {
          continue;
        }

        if (MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS.equals(permission.getName()) && !workspaceController.canIManageWorkspaceMaterials(workspaceEntity)) {
          continue;
        }

        permissionSet.add(permission.getName());
      }
    }
    return Response.ok(permissionSet).build();
  }

  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/materialProducers")
  @RESTPermit (handling = Handling.INLINE)
  public Response createWorkspaceMaterialProducers(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, List<String> payload) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIAL_PRODUCERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Out with the old

    List<WorkspaceMaterialProducer> producers = workspaceController.listWorkspaceMaterialProducers(workspaceEntity);
    for (WorkspaceMaterialProducer producer : producers) {
      workspaceController.deleteWorkspaceMaterialProducer(producer);
    }

    // In with the new

    producers = new ArrayList<>();
    for (String producer : payload) {
      producers.add(workspaceController.createWorkspaceMaterialProducer(workspaceEntity, producer));
    }

    return Response
      .ok(createRestModel(producers.toArray(new WorkspaceMaterialProducer[0])))
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
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/visit")
  @RESTPermit (handling = Handling.INLINE)
  public Response visitWorkspace(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    if (sessionController.isLoggedIn() && sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      if (workspaceEntity != null) {
        workspaceVisitController.visit(workspaceEntity);
      }
    }
    return Response.noContent().build();
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
        !isEqualDateTime(workspace.getSignupStart(), payload.getSignupStart()) ||
        !isEqualDateTime(workspace.getSignupEnd(), payload.getSignupEnd()) ||
        !Objects.equals(typeIdentifier, workspace.getWorkspaceTypeId())) {
      workspace.setBeginDate(payload.getBeginDate());
      workspace.setEndDate(payload.getEndDate());
      workspace.setSignupStart(payload.getSignupStart());
      workspace.setSignupEnd(payload.getSignupEnd());
      workspace.setWorkspaceTypeId(typeIdentifier);
      workspaceController.updateWorkspace(workspace);
    }

    String typeId = workspace.getWorkspaceTypeId() != null ? workspace.getWorkspaceTypeId().toId() : null;

    WorkspaceFolder helpFolder = workspaceMaterialController.ensureWorkspaceHelpFolderExists(workspaceEntity);
    WorkspaceMaterial frontPage = workspaceMaterialController.ensureWorkspaceFrontPageExists(workspaceEntity);

    return Response.ok(new WorkspaceDetails(
        typeId,
        workspace.getBeginDate(),
        workspace.getEndDate(),
        workspace.getSignupStart(),
        workspace.getSignupEnd(),
        workspace.getViewLink(),
        payload.getRootFolderId(),
        helpFolder.getId(),
        frontPage.getParent().getId())).build();
  }

  private String constructWorkspaceChatRoomName(Workspace workspace) {
    if (CollectionUtils.isNotEmpty(workspace.getSubjects()) && workspace.getSubjects().size() > 1) {
      /**
       *  Workspaces that have multiple subjects use naming convention of
       *
       *  When nameExtension exists:
       *  workspace.name - workspace.nameExtension
       *
       *  Otherwise:
       *  workspace.name
       */

      StringBuilder roomName = new StringBuilder();
      roomName.append(workspace.getName());
      if (!StringUtils.isBlank(workspace.getNameExtension())) {
        roomName.append(" - ");
        roomName.append(workspace.getNameExtension());
      }

      return roomName.toString();
    }
    else {
      /**
       * Workspaces that have only one subject
       *
       * When nameExtension exists:
       * subjectCode + courseNumber - nameExtension
       *
       * Otherwise:
       * subjectCode + courseNumber - name
       */

      WorkspaceSubject workspaceSubject = CollectionUtils.isNotEmpty(workspace.getSubjects()) ? workspace.getSubjects().get(0) : null;
      String subjectCode = workspaceSubject != null ? courseMetaController.findSubject(workspaceSubject.getSubjectIdentifier()).getCode() : null;
      StringBuilder roomName = new StringBuilder();
      if (!StringUtils.isBlank(subjectCode)) {
        roomName.append(subjectCode);
      }
      if ((workspaceSubject != null) && (workspaceSubject.getCourseNumber() != null)) {
        roomName.append(workspaceSubject.getCourseNumber());
      }
      if (!StringUtils.isBlank(roomName)) {
        roomName.append(" - ");
      }
      // Prefer just name extension but fall back to workspace name if extension is not available
      if (!StringUtils.isBlank(workspace.getNameExtension())) {
        roomName.append(workspace.getNameExtension());
      }
      else {
        roomName.append(workspace.getName());
      }
      return roomName.toString();
    }
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
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspace(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace payload) {
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

    if (payload.getLanguage() != null && !payload.getLanguage().equals(workspaceEntity.getLanguage())) {
      workspaceEntity = workspaceEntityController.updateLanguage(workspaceEntity, payload.getLanguage());
    }

    workspaceEntity = workspaceEntityController.updateAccess(workspaceEntity, payload.getAccess());
    workspaceEntity = workspaceEntityController.updateDefaultMaterialLicense(workspaceEntity, payload.getMaterialDefaultLicense());

    // Reindex the workspace so that Elasticsearch can react to publish and visibility

    workspaceIndexer.indexWorkspace(workspaceEntity);

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
      }
      catch (Exception e) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Failed to update workspace data into school data source (%s)", e.getMessage())).build();
      }
    }

    EducationTypeMapping educationTypeMapping = workspaceEntityController.getEducationTypeMapping();

    return Response.ok(createRestModel(
        workspaceEntity,
        workspace,
        educationTypeMapping
    )).build();
  }

  @GET
  @Path("/workspaces/{ID}/settings")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspaceSettings(@PathParam("ID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!workspaceController.canIManageWorkspaceSettings(workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    return Response.ok(getWorkspaceSettingsRestModel(workspaceEntity, workspace)).build();
  }

  @PUT
  @Path("/workspaces/{WORKSPACEENTITYID}/settings")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspaceSettings(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId, WorkspaceSettingsRestModel payload) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceEntity #%d not found", workspaceEntityId)).build();
    }

    if (!workspaceController.canIManageWorkspaceSettings(workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    SchoolDataIdentifier typeIdentifier = null;
    if (payload.getWorkspaceTypeIdentifier() != null) {
      typeIdentifier = SchoolDataIdentifier.fromId(payload.getWorkspaceTypeIdentifier());
      if (typeIdentifier == null) {
        return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid workspaceTypeIdentifier %s", payload.getWorkspaceTypeIdentifier())).build();
      }
    }

    if (payload.getDefaultSignupMessage() != null && payload.getDefaultSignupMessage().isEnabled()) {
      // Make sure the basic properties are defined

      if (StringUtils.isAnyBlank(payload.getDefaultSignupMessage().getCaption(), payload.getDefaultSignupMessage().getContent())) {
        return Response.status(Status.BAD_REQUEST).entity("Default Greeting message is missing caption or content.").build();
      }
    }

    if (payload.getSignupGroups() != null) {
      // Make sure the basic properties are defined
      for (WorkspaceSignupGroupRestModel signupGroupPayload : payload.getSignupGroups()) {
        if (signupGroupPayload.getUserGroupEntityId() == null) {
          return Response.status(Status.BAD_REQUEST).entity("Signup group is missing an id.").build();
        }
      }
    }

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.PUBLISH_WORKSPACE, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
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

    if (!workspaceEntity.getPublished().equals(payload.getPublished())) {
      workspaceEntity = workspaceEntityController.updatePublished(workspaceEntity, payload.getPublished());
    }

    if (payload.getLanguage() != null && !payload.getLanguage().equals(workspaceEntity.getLanguage())) {
      workspaceEntity = workspaceEntityController.updateLanguage(workspaceEntity, payload.getLanguage());
    }

    workspaceEntity = workspaceEntityController.updateAccess(workspaceEntity, payload.getAccess());
    workspaceEntity = workspaceEntityController.updateDefaultMaterialLicense(workspaceEntity, payload.getMaterialDefaultLicense());

    if (payload.getDefaultSignupMessage() != null) {
      WorkspaceSignupMessage studentSignupGreetingMessage = workspaceSignupMessageController.findDefaultSignupMessage(workspaceEntity);
      if (studentSignupGreetingMessage == null) {
        workspaceSignupMessageController.createWorkspaceSignupMessage(
            workspaceEntity,
            true,
            payload.getDefaultSignupMessage().isEnabled(),
            payload.getDefaultSignupMessage().getCaption(),
            payload.getDefaultSignupMessage().getContent(),
            Collections.emptyList());
      } else {
        workspaceSignupMessageController.updateWorkspaceSignupMessage(
            studentSignupGreetingMessage,
            payload.getDefaultSignupMessage().isEnabled(),
            payload.getDefaultSignupMessage().getCaption(),
            payload.getDefaultSignupMessage().getContent(),
            Collections.emptyList());
      }
    }
    
    // Signup messages
    
    List<WorkspaceSignupMessage> existingMessages = workspaceSignupMessageController.listGroupBoundSignupMessages(workspaceEntity);
    if (!CollectionUtils.isEmpty(payload.getSignupMessages())) {
      for (WorkspaceSignupMessageRestModel restMessage : payload.getSignupMessages()) {
        List<UserGroupEntity> groups = new ArrayList<>();
        for (WorkspaceSignupMessageGroupRestModel restGroup : restMessage.getSignupGroups()) {
          UserGroupEntity uge = userGroupEntityController.findUserGroupEntityById(restGroup.getUserGroupEntityId());
          if (uge != null) {
            groups.add(uge);
          }
        }
        if (restMessage.getId() == null) {
          workspaceSignupMessageController.createWorkspaceSignupMessage(
              workspaceEntity,
              false,
              restMessage.isEnabled(),
              restMessage.getCaption(),
              restMessage.getContent(),
              groups);
        }
        else {
          WorkspaceSignupMessage message = workspaceSignupMessageController.findSignupMessageById(restMessage.getId());
          if (message != null) {
            workspaceSignupMessageController.updateWorkspaceSignupMessage(
                message,
                restMessage.isEnabled(),
                restMessage.getCaption(),
                restMessage.getContent(),
                groups);
          }
          existingMessages.removeIf(em -> em.getId().equals(message.getId()));
        }
      }
    }
    for (WorkspaceSignupMessage existingMessage : existingMessages) {
      workspaceSignupMessageController.deleteWorkspaceSignupMessage(existingMessage);
    }

    // Fetch the existing Workspace Signup Groups
    Set<SchoolDataIdentifier> existingWorkspaceSignupGroups = workspaceController.listWorkspaceSignupGroups(workspaceEntity);

    if (payload.getSignupGroups() != null) {
      for (WorkspaceSignupGroupRestModel signupGroupPayload : payload.getSignupGroups()) {
        UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(signupGroupPayload.getUserGroupEntityId());

        boolean permitted = Boolean.TRUE.equals(signupGroupPayload.getCanSignup());

        if (permitted) {
          if (!existingWorkspaceSignupGroups.contains(userGroupEntity.schoolDataIdentifier())) {
            workspaceController.addWorkspaceSignupGroup(workspaceEntity, userGroupEntity);
          }
        }
        else {
          if (existingWorkspaceSignupGroups.contains(userGroupEntity.schoolDataIdentifier())) {
            workspaceController.removeWorkspaceSignupGroup(workspaceEntity, userGroupEntity);
          }
        }
      }
    }

    if ((payload.getDescription() != null) || (payload.getName() != null)) {
      try {
        if ((!StringUtils.equals(payload.getName(), workspace.getName())) ||
            (!StringUtils.equals(payload.getDescription(), workspace.getDescription())) ||
            (!StringUtils.equals(payload.getNameExtension(), workspace.getNameExtension())) ||
            !isEqualDateTime(workspace.getBeginDate(), payload.getBeginDate()) ||
            !isEqualDateTime(workspace.getEndDate(), payload.getEndDate()) ||
            !isEqualDateTime(workspace.getSignupStart(), payload.getSignupStart()) ||
            !isEqualDateTime(workspace.getSignupEnd(), payload.getSignupEnd()) ||
            !Objects.equals(typeIdentifier, workspace.getWorkspaceTypeId())) {
          workspace.setName(payload.getName());
          workspace.setNameExtension(payload.getNameExtension());
          workspace.setDescription(payload.getDescription());
          workspace.setBeginDate(payload.getBeginDate());
          workspace.setEndDate(payload.getEndDate());
          workspace.setSignupStart(payload.getSignupStart());
          workspace.setSignupEnd(payload.getSignupEnd());
          workspace.setWorkspaceTypeId(typeIdentifier);
          workspace = workspaceController.updateWorkspace(workspace);
        }
      }
      catch (Exception e) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Failed to update workspace data into school data source (%s)", e.getMessage())).build();
      }
    }

    // Chat
    
    String roomName = constructWorkspaceChatRoomName(workspace);
    chatController.toggleWorkspaceChatRoom(workspaceEntity, roomName, payload.isChatEnabled(), sessionController.getLoggedUserEntity());
    
    // Reindex the workspace so that Elasticsearch can react to publish and visibility

    workspaceIndexer.indexWorkspace(workspaceEntity);

    // Return the modified settings

    return Response.ok(getWorkspaceSettingsRestModel(workspaceEntity, workspace)).build();
  }

  /**
   * Returns students of workspace WORKSPACEENTITYID
   *
   * Query       : active (boolean) active or inactive workspace students (if null, all)
   * Used        : Workspace members view
   * Permissions : LIST_WORKSPACE_MEMBERS
   * Success     : 200 WorkspaceStudentRestModel (list)
   *
   * PK 20.11.2018
   */
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/students")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceStudents(
		  @PathParam("WORKSPACEENTITYID") Long workspaceEntityId,
		  @QueryParam("q") String searchString,
		  @QueryParam("active") Boolean active,
		  @QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
		  @QueryParam("maxResults") @DefaultValue("10")  Integer maxResults
		  ) {

    // Workspace, access, and Elastic checks

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_WORKSPACE_MEMBERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    SearchProvider elasticSearchProvider = null;
    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      elasticSearchProvider = searchProviderIterator.next();
    }
    if (elasticSearchProvider == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Search provider not found").build();
    }

    List<WorkspaceUserEntity> workspaceUserEntities = active == null
        ? workspaceUserEntityController.listWorkspaceStudents(workspaceEntity)
        : active
        ? workspaceUserEntityController.listActiveWorkspaceStudents(workspaceEntity)
        : workspaceUserEntityController.listInactiveWorkspaceStudents(workspaceEntity);

    Set<Long> activeUserIds = workspaceUserEntities.stream()
        .filter(wue -> Boolean.TRUE.equals(wue.getActive()))
        .map(wue -> wue.getId())
        .collect(Collectors.toSet());

    List<SchoolDataIdentifier> studentIdentifiers = new ArrayList<SchoolDataIdentifier>();
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      studentIdentifiers.add(workspaceUserEntity.getUserSchoolDataIdentifier().schoolDataIdentifier());
    }

    // Retrieve users via Elastic
    String[] fields = new String[] { "firstName", "lastName", "nickName", "email" };

    // #5954: Include hidden users in results as teachers need to know that they're in the workspace

    SearchResult searchResult = elasticSearchProvider.searchUsers(
        organizationEntityController.listUnarchived(),            // organizations
        null,                                                     // study programme identifiers
        searchString,                                             // search string
        fields,                                                   // fields
        null,                                                     // environment role
        null,                                                     // user groups
        null,                                                     // workspace (not set because of student identifiers)
        studentIdentifiers,                                       // user identifiers of students in workspace
        true,                                                     // include inactive students
        true,                                                     // include hidden
        false,                                                    // only default users
        firstResult,                                              // first result
        maxResults,                                               // max results
        false);                                                   // join groups and workspaces

    List<Map<String, Object>> elasticUsers = searchResult.getResults();

    List<WorkspaceStudentRestModel> workspaceStudents = new ArrayList<WorkspaceStudentRestModel>();
    if (elasticUsers != null && !elasticUsers.isEmpty()) {

      // Convert Elastic results to REST model objects (WorkspaceUserRestModel)

      for (Map<String, Object> elasticUser : elasticUsers) {
        if (elasticUser.get("identifier") != null && elasticUser.get("schoolDataSource") != null) {
          String identifier = elasticUser.get("identifier").toString();
          if (elasticUser.get("userEntityId") == null) {
            logger.warning(String.format("Identifier %s in Elastic search index has no userEntityId", identifier));
            continue;
          }
          SchoolDataIdentifier studentIdentifier = new SchoolDataIdentifier(String.valueOf(elasticUser.get("identifier")), String.valueOf(elasticUser.get("schoolDataSource")));
          WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifier(workspaceEntity, studentIdentifier);
          if (workspaceUserEntity == null) {
            logger.severe(String.format("No workspace user for identifier %s in workspace entity %d", identifier, workspaceEntity.getId()));
            continue;
          }
          UserEntity userEntity = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
          boolean hasImage = userEntity != null && userEntityFileController.hasProfilePicture(userEntity);
          workspaceStudents.add(new WorkspaceStudentRestModel(
              workspaceUserEntity.getId(),
              workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity().getId(),
              workspaceUserEntity.getUserSchoolDataIdentifier().schoolDataIdentifier(),
              String.valueOf(elasticUser.get("firstName")),
              elasticUser.get("nickName") == null ? null : elasticUser.get("nickName").toString(),
              String.valueOf(elasticUser.get("lastName")),
              elasticUser.get("studyProgrammeName") == null ? null : elasticUser.get("studyProgrammeName").toString(),
              hasImage,
              activeUserIds.contains(workspaceUserEntity.getId()),
              pedagogyController.isPublished(userEntity.getId()),
              userEntityController.isUnder18CompulsoryEducationStudent(workspaceUserEntity.getUserSchoolDataIdentifier().schoolDataIdentifier())
            )
          );
        }
      }

      // Sort by last and first name

      workspaceStudents.sort(Comparator.comparing(WorkspaceStudentRestModel::getLastName).thenComparing(WorkspaceStudentRestModel::getFirstName));
    }

    SearchResults<List<WorkspaceStudentRestModel>> responseStudents = new SearchResults<List<WorkspaceStudentRestModel>>(searchResult.getFirstResult(), workspaceStudents, searchResult.getTotalHitCount());
    return Response.ok(responseStudents).build();
  }


  /**
   * Returns staff members of workspace WORKSPACEENTITYID
   * TODO change to /workspace/{WORKSPACEENTITYID}/staffMembers once old endpoint no longer used
   *
   * Used        : Workspace members view
   * Permissions : LIST_WORKSPACE_MEMBERS
   * Success     : 200 WorkspaceUserRestModel (list)
   *
   * PK 20.11.2018
   */
  @GET
  @Path("/staffMembers/{WORKSPACEENTITYID}")
  @RESTPermit (handling = Handling.INLINE)
  public Response listWorkspaceStaffMembers(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {

    // Workspace, access, and Elastic checks

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_WORKSPACE_MEMBERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    SearchProvider elasticSearchProvider = null;
    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      elasticSearchProvider = searchProviderIterator.next();
    }
    if (elasticSearchProvider == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Search provider not found").build();
    }

    List<EnvironmentRoleArchetype> environmentRoleArchetypes = Arrays.asList(
        EnvironmentRoleArchetype.ADMINISTRATOR,
        EnvironmentRoleArchetype.MANAGER,
        EnvironmentRoleArchetype.STUDY_GUIDER,
        EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER,
        EnvironmentRoleArchetype.TEACHER);

    // Get workspace staff members via Elastic (#4917: Should be shown across all organizations)

    SearchResult searchResult = elasticSearchProvider.searchUsers(
        organizationEntityController.listUnarchived(),            // organizations
        null,                                                     // study programme identifiers
        null,                                                     // search string
        null,                                                     // fields
        environmentRoleArchetypes,                                // all staff archetypes
        null,                                                     // user groups
        Collections.singletonList(workspaceEntityId),             // workspace
        null,                                                     // user identifiers
        false,                                                    // include inactive students
        false,                                                    // include hidden
        false,                                                    // only default users
        0,                                                        // first result
        Integer.MAX_VALUE,                                        // max results
        false);                                                   // join groups and workspaces
    List<Map<String, Object>> elasticUsers = searchResult.getResults();

    List<WorkspaceUserRestModel> workspaceStaffMembers = new ArrayList<WorkspaceUserRestModel>();
    if (elasticUsers != null && !elasticUsers.isEmpty()) {

      // Convert Elastic result to REST model (WorkspaceUserRestModel)

      for (Map<String, Object> elasticUser : elasticUsers) {
        SchoolDataIdentifier identifier = SchoolDataIdentifier.fromString(elasticUser.get("id").toString());
        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, identifier);
        if (workspaceUserEntity != null && !workspaceUserEntity.getArchived()) {

          // #3111: Workspace staff members should be limited to teachers only. A better implementation would support specified workspace roles

          WorkspaceRoleArchetype workspaceRoleArcheType = workspaceUserEntity.getWorkspaceUserRole().getArchetype();
          if (workspaceRoleArcheType != WorkspaceRoleArchetype.TEACHER) {
            continue;
          }

          UserEntity userEntity = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
          boolean hasImage = userEntityFileController.hasProfilePicture(userEntity);

          workspaceStaffMembers.add(new WorkspaceUserRestModel(
              workspaceUserEntity.getId(),
              workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity().getId(),
              workspaceUserEntity.getUserSchoolDataIdentifier().schoolDataIdentifier(),
              elasticUser.get("firstName").toString(),
              elasticUser.get("lastName").toString(),
              hasImage));
        }
      }

      // Sort by last and first name

      workspaceStaffMembers.sort(Comparator.comparing(WorkspaceUserRestModel::getLastName).thenComparing(WorkspaceUserRestModel::getFirstName));
    }

    return Response.ok(workspaceStaffMembers).build();
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
    result.put("assignmentsTotal", Long.valueOf(evaluatedAssignments.size()));

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

    /* #5124: Workspaces no longer have logic related to evaluation fees, only line being studied matters
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
    */

    return Response.ok(new WorkspaceFeeInfo(user.getHasEvaluationFees())).build();
  }

  @GET
  @Path("/workspaces/{ID}/staffMembers")
  @RESTPermit (handling = Handling.INLINE)
  public Response listWorkspaceStaffMembers(
      @PathParam("ID") Long workspaceEntityId,
      @QueryParam("properties") String properties,
      @QueryParam("orderBy") String orderBy) {

    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    // Access check
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_WORKSPACE_STAFFMEMBERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Staff via WorkspaceSchoolDataBridge
    List<fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser> schoolDataUsers = workspaceController.listWorkspaceStaffMembers(workspaceEntity);
    List<WorkspaceStaffMember> workspaceStaffMembers = new ArrayList<>();

    String[] propertyArray = StringUtils.isEmpty(properties) ? new String[0] : properties.split(",");

    for (fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser workspaceUser : schoolDataUsers) {
      SchoolDataIdentifier userIdentifier = workspaceUser.getUserIdentifier();
      User user = userController.findUserByIdentifier(userIdentifier);

      if (user != null) {
        UserEntity userEntity = userEntityController.findUserEntityByUser(user);

        // #3111: Workspace staff members should be limited to teachers only. A better implementation would support specified workspace roles

        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, userEntity.defaultSchoolDataIdentifier());
        if (workspaceUserEntity == null || workspaceUserEntity.getWorkspaceUserRole().getArchetype() != WorkspaceRoleArchetype.TEACHER) {
          continue;
        }

        String email = userEmailEntityController.getUserDefaultEmailAddress(userIdentifier, false);
        Map<String, String> userProperties = new HashMap<String, String>();
        if (userEntity != null) {
          for (int i = 0; i < propertyArray.length; i++) {
            UserEntityProperty userEntityProperty = userEntityController.getUserEntityPropertyByKey(userEntity, propertyArray[i]);
            userProperties.put(propertyArray[i], userEntityProperty == null ? null : userEntityProperty.getValue());
          }
        }

        workspaceStaffMembers.add(new WorkspaceStaffMember(workspaceUser.getIdentifier().toId(),
          workspaceUser.getUserIdentifier().toId(),
          userEntity != null ? userEntity.getId() : null,
          user.getFirstName(),
          user.getLastName(),
          email,
          userProperties
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

  @GET
  @Path("/workspaces/{WORKSPACEID}/staffMembers/{STAFFMEMBERID}")
  @RESTPermit (handling = Handling.INLINE)
  public Response findWorkspaceStaffMember(
      @PathParam("WORKSPACEID") Long workspaceEntityId,
      @PathParam("STAFFMEMBERID") String workspaceStaffMemberIdentifier,
      @QueryParam("properties") String properties) {

    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    // Access check
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_WORKSPACE_STAFFMEMBERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    WorkspaceUser workspaceUser;

    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(workspaceStaffMemberIdentifier);
    if (userIdentifier != null) {
      workspaceUser = workspaceController.findWorkspaceUserByWorkspaceEntityAndUser(workspaceEntity, userIdentifier);
    } else {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid user id %s", workspaceStaffMemberIdentifier)).build();
    }

    if (workspaceUser == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    User user = userController.findUserByIdentifier(workspaceUser.getUserIdentifier());
    UserEntity userEntity = userEntityController.findUserEntityByUser(user);
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, userEntity.defaultSchoolDataIdentifier());
    if (user == null || workspaceUserEntity == null || workspaceUserEntity.getWorkspaceUserRole().getArchetype() != WorkspaceRoleArchetype.TEACHER) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    String email = userEmailEntityController.getUserDefaultEmailAddress(workspaceUser.getUserIdentifier(), false);

    String[] propertyArray = StringUtils.isEmpty(properties) ? new String[0] : properties.split(",");
    Map<String, String> userProperties = new HashMap<String, String>();
    if (userEntity != null) {
      for (int i = 0; i < propertyArray.length; i++) {
        UserEntityProperty userEntityProperty = userEntityController.getUserEntityPropertyByKey(userEntity, propertyArray[i]);
        userProperties.put(propertyArray[i], userEntityProperty == null ? null : userEntityProperty.getValue());
      }
    }

    WorkspaceStaffMember workspaceStaffMember = new WorkspaceStaffMember(workspaceUser.getIdentifier().toId(),
      workspaceUser.getUserIdentifier().toId(),
      userEntity != null ? userEntity.getId() : null,
      user.getFirstName(),
      user.getLastName(),
      email,
      userProperties
    );

    return Response.ok(workspaceStaffMember).build();
  }

  @POST
  @Path("/workspaces/{ID}/materials/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
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

      if (!workspaceController.canIManageWorkspaceMaterials(workspaceEntity)) {
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
      if (!workspaceController.canIManageWorkspaceMaterials(workspaceEntity)) {
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

      WorkspaceMaterial workspaceMaterial = workspaceMaterialController.createWorkspaceMaterial(
          parent,
          material,
          entity.getAssignmentType(),
          entity.getCorrectAnswers(),
          entity.getTitleLanguage(),
          entity.getMaxPoints(),
          entity.getAi());
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
                    workspaceMaterial.getCorrectAnswers(),
                    workspaceMaterial.getLanguage(),
                    workspaceMaterial.getMaxPoints(),
                    workspaceMaterial.getAi());
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
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceMaterials(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @QueryParam("parentId") Long parentId, @QueryParam("assignmentType") String assignmentType, @QueryParam("userEntityId") Long userEntityId) {
    if (parentId == null && assignmentType == null) {
      return Response.status(Status.NOT_IMPLEMENTED).entity("Listing workspace materials without parentId or assignmentType is currently not implemented").build();
    }
    
    boolean isStudent = userEntityController.isStudent(sessionController.getLoggedUserEntity());
    if (userEntityId != null && isStudent && !userEntityId.equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.FORBIDDEN).build();
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
        workspaceMaterials = workspaceMaterialController.listWorkspaceMaterialsByParentAndAssignmentType(parent, workspaceEntity, workspaceAssignmentType, BooleanPredicate.IGNORE);
      } else {
        workspaceMaterials = workspaceMaterialController.listWorkspaceMaterialsByParent(parent);
      }
    }
    else {
      workspaceMaterials = workspaceMaterialController.listWorkspaceMaterialsByAssignmentType(workspaceEntity, workspaceAssignmentType, BooleanPredicate.IGNORE);
    }

    if (workspaceMaterials.isEmpty()) {
      return Response.ok(Collections.emptyList()).build();
    }
    
    // Exam functionality: Never list exam assignments via this endpoint
    
    for (int i = workspaceMaterials.size() - 1; i >= 0; i--) {
      if (workspaceMaterials.get(i).isExamAssignment()) {
        workspaceMaterials.remove(i);
      }
    }

    return Response.ok(createRestModel(workspaceMaterials.toArray(new WorkspaceMaterial[0]))).build();
  }

  @GET
  @GZIP
  @Path("/workspaces/{WORKSPACEENTITYID}/materialContentNodes/")
  @RESTPermitUnimplemented
  public Response listWorkspaceMaterialsAsContentNodes(
    @PathParam("WORKSPACEENTITYID") Long workspaceEntityId,
    @QueryParam("includeHidden") Boolean includeHidden
  ) {
    // TODO: SecuritY???

    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Could not find a workspace entity").build();
    }

    List<ContentNode> workspaceMaterials;
    workspaceMaterials = workspaceMaterialController.listWorkspaceMaterialsAsContentNodes(workspaceEntity, includeHidden);
    if (workspaceMaterials.isEmpty()) {
    	return Response.ok(Collections.emptyList()).build();
    }

    return Response.ok(workspaceMaterials).build();
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
  @Path("/workspaces/{WORKSPACEENTITYID}/user/{USERENTITYID}/workspacematerial/{WORKSPACEMATERIALID}/compositeReply")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspaceMaterialReply(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId) {

    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Workspace not found").build();
    }

    if (!userEntityId.equals(sessionController.getLoggedUserEntity().getId()) && !sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_STUDENT_ANSWERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("User not found").build();
    }

    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("Material not found").build();
    }

    WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
    if (reply == null) {
      return Response.status(Status.NOT_FOUND).entity("Reply not found").build();
    }

    // #7352: Figure out scenarios in which the page is locked
    
    WorkspaceCompositeReplyLock lock = WorkspaceCompositeReplyLock.NONE;
    if (userEntityController.isStudent(userEntity)) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, userEntity.defaultSchoolDataIdentifier());
      if (workspaceUserEntity != null) {
        // Unavoidable Pyramus call
        List<WorkspaceAssessmentState> assessmentStates = assessmentRequestController.getAllWorkspaceAssessmentStates(workspaceUserEntity);
        for (WorkspaceAssessmentState assessmentState : assessmentStates) {
          // If workspace has been or is being assessed, the page is locked (for multi-module courses, even one assessed module fulfills this requirement)
          if (assessmentState.isAssessed() || assessmentState.isPending()) {
            lock = WorkspaceCompositeReplyLock.SOFT;
            break;
          }
        }
      }
    }
    if (reply.getState() == WorkspaceMaterialReplyState.PASSED || reply.getState() == WorkspaceMaterialReplyState.FAILED) {
      // Page is locked because it has been evaluated
      lock = WorkspaceCompositeReplyLock.SOFT;
    }
    else if (lock == WorkspaceCompositeReplyLock.NONE && reply.getLocked()) {
      // Page is locked simply because the teacher said so
      lock = WorkspaceCompositeReplyLock.HARD;
    }

    List<WorkspaceMaterialFieldAnswer> answers = new ArrayList<>();
    try {
      List<WorkspaceMaterialField> fields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByWorkspaceMaterial(reply.getWorkspaceMaterial());
      for (WorkspaceMaterialField field : fields) {
        String value = workspaceMaterialFieldController.retrieveFieldValue(field, reply);
        Material material = field.getQueryField().getMaterial();
        WorkspaceMaterialFieldAnswer answer = new WorkspaceMaterialFieldAnswer(reply.getWorkspaceMaterial().getId(), material.getId(), field.getEmbedId(), field.getQueryField().getName(), value);
        answers.add(answer);
      }

      WorkspaceCompositeReply compositeReply = new WorkspaceCompositeReply(
          reply.getWorkspaceMaterial().getId(),
          reply.getId(),
          reply.getState(),
          reply.getSubmitted(),
          answers,
          lock); 

      // Evaluation info for evaluable materials

      if (reply.getWorkspaceMaterial().getAssignmentType() == WorkspaceMaterialAssignmentType.EVALUATED ||
          reply.getWorkspaceMaterial().getAssignmentType() == WorkspaceMaterialAssignmentType.EXERCISE ||
          reply.getWorkspaceMaterial().getAssignmentType() == WorkspaceMaterialAssignmentType.INTERIM_EVALUATION) {
        compositeReply.setEvaluationInfo(evaluationController.getEvaluationInfo(userEntity.getId(), reply.getWorkspaceMaterial().getId()));
      }
      return Response.ok(compositeReply).build();
    }
    catch (WorkspaceFieldIOException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Internal error occurred while retrieving field answers: " + e.getMessage()).build();
    }
  }

  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/compositeReplies")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspaceMaterialAnswers(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @QueryParam ("userEntityId") Long userEntityId) {

    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceEntity not found").build();
    }

    if (userEntityId == null) {
      userEntityId = sessionController.getLoggedUserEntity().getId();
    }
    else if (!userEntityId.equals(sessionController.getLoggedUserEntity().getId()) && !sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_STUDENT_ANSWERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("UserEntity not found").build();
    }
    
    // #7352: Figure out scenarios in which all pages would be locked
    
    WorkspaceCompositeReplyLock workspaceLock = WorkspaceCompositeReplyLock.NONE;
    if (userEntityController.isStudent(userEntity)) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, userEntity.defaultSchoolDataIdentifier());
      if (workspaceUserEntity != null) {
        // Unavoidable Pyramus call
        List<WorkspaceAssessmentState> assessmentStates = assessmentRequestController.getAllWorkspaceAssessmentStates(workspaceUserEntity);
        for (WorkspaceAssessmentState assessmentState : assessmentStates) {
          // If workspace has been or is being assessed, the page is locked (for multi-module courses, even one assessed module fulfills this requirement)
          if (assessmentState.isAssessed() || assessmentState.isPending()) {
            workspaceLock = WorkspaceCompositeReplyLock.SOFT;
            break;
          }
        }
      }
    }

    List<WorkspaceCompositeReply> result = new ArrayList<>();
    try {
      List<WorkspaceMaterialReply> replies = workspaceMaterialReplyController.listWorkspaceMaterialRepliesByWorkspaceEntity(
          workspaceEntity,
          userEntity);

      for (WorkspaceMaterialReply reply : replies) {
        WorkspaceCompositeReplyLock pageLock = workspaceLock;
        List<WorkspaceMaterialFieldAnswer> answers = new ArrayList<>();

        // #7352: Figure out scenarios in which a single page would be locked

        if (reply.getState() == WorkspaceMaterialReplyState.PASSED || reply.getState() == WorkspaceMaterialReplyState.FAILED) {
          // Page is locked because it has been evaluated
          pageLock = WorkspaceCompositeReplyLock.SOFT;
        }
        else if (workspaceLock == WorkspaceCompositeReplyLock.NONE && reply.getLocked()) {
          // Page is locked simply because the teacher said so
          pageLock = WorkspaceCompositeReplyLock.HARD;
        }

        List<WorkspaceMaterialField> fields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByWorkspaceMaterial(reply.getWorkspaceMaterial());
        for (WorkspaceMaterialField field : fields) {
          String value = workspaceMaterialFieldController.retrieveFieldValue(field, reply);
          Material material = field.getQueryField().getMaterial();
          WorkspaceMaterialFieldAnswer answer = new WorkspaceMaterialFieldAnswer(reply.getWorkspaceMaterial().getId(), material.getId(), field.getEmbedId(), field.getQueryField().getName(), value);
          answers.add(answer);
        }

        WorkspaceCompositeReply compositeReply = new WorkspaceCompositeReply(
            reply.getWorkspaceMaterial().getId(),
            reply.getId(),
            reply.getState(),
            reply.getSubmitted(),
            answers,
            pageLock);

        // Evaluation info for evaluable materials

        if (reply.getWorkspaceMaterial().getAssignmentType() == WorkspaceMaterialAssignmentType.EVALUATED ||
            reply.getWorkspaceMaterial().getAssignmentType() == WorkspaceMaterialAssignmentType.EXERCISE ||
            reply.getWorkspaceMaterial().getAssignmentType() == WorkspaceMaterialAssignmentType.INTERIM_EVALUATION) {
          compositeReply.setEvaluationInfo(evaluationController.getEvaluationInfo(userEntity.getId(), reply.getWorkspaceMaterial().getId()));
        }

        result.add(compositeReply);
      }

      if (result.isEmpty()) {
        return Response.ok(Collections.emptyList()).build();
      }
    }
    catch (WorkspaceFieldIOException e) {
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
  @Path("/fileanswer/{FILEID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getFileAnswer(@PathParam("FILEID") String fileId) {
    WorkspaceMaterialFileFieldAnswerFile answerFile = workspaceMaterialFieldAnswerController.findWorkspaceMaterialFileFieldAnswerFileByFileId(fileId);
    if (answerFile == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    WorkspaceMaterialReply workspaceMaterialReply = answerFile.getFieldAnswer().getReply();
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
    byte[] content = answerFile.getContent();
    if (content == null) {
      Long userEntityId = workspaceMaterialReply.getUserEntityId();
      try {
        if (fileAnswerUtils.isFileInFileSystem(FileAnswerType.FILE, userEntityId, answerFile.getFileId())) {
          content = fileAnswerUtils.getFileContent(FileAnswerType.FILE, workspaceMaterialReply.getUserEntityId(), answerFile.getFileId());
        }
        else {
          logger.warning(String.format("File %s of user %d not found from file storage", answerFile.getFileId(), userEntityId));
        }
      }
      catch (FileNotFoundException fnfe) {
        return Response.status(Status.NOT_FOUND).build();
      }
      catch (IOException e) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Failed to retrieve file").build();
      }
    }
    if (content == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    try {
      String encFilename = URLEncoder.encode(answerFile.getFileName(), "utf-8").replaceAll("\\+", "%20").replaceAll("\"", "\\\"");
      if (StringUtils.isEmpty(answerFile.getContentType())) {
        return Response.ok(content)
          .header("Content-Disposition", "attachment; filename*=utf-8''" + encFilename)
          .build();
      }
      else {
        return Response.ok(content)
          .type(answerFile.getContentType())
          .header("Content-Disposition", "attachment; filename*=utf-8''" + encFilename)
          .build();
      }
    } catch (UnsupportedEncodingException e) {
      logger.warning("Unsupported character encoding: " + e.getMessage());
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GET
  @Produces("application/zip")
  @Path("/allfileanswers/{FILEID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getAllFileAnswers(@PathParam("FILEID") String fileId, @QueryParam("archiveName") String archiveName) {

    // Find the initial file

    WorkspaceMaterialFileFieldAnswerFile answerFile = workspaceMaterialFieldAnswerController.findWorkspaceMaterialFileFieldAnswerFileByFileId(fileId);
    if (answerFile == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    // Access check

    WorkspaceMaterialReply workspaceMaterialReply = answerFile.getFieldAnswer().getReply();
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

    // Fetch all files belonging to the same answer as the initial file

    List<WorkspaceMaterialFileFieldAnswerFile> answerFiles = workspaceMaterialFieldAnswerController
        .listWorkspaceMaterialFileFieldAnswerFilesByFieldAnswer(answerFile.getFieldAnswer());
    if (CollectionUtils.isEmpty(answerFiles)) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("answerFiles not found")).build();
    }

    // Create and serve the archive

    try {
      Set<String> fileNames = new HashSet<String>();
      StreamingOutput output = new StreamingOutput() {
        @Override
        public void write(OutputStream out) throws IOException {
          ZipOutputStream zout = new ZipOutputStream(out);
          for (WorkspaceMaterialFileFieldAnswerFile file : answerFiles) {

            // File content

            byte[] content = file.getContent();
            if (content == null) {
              Long userEntityId = workspaceMaterialReply.getUserEntityId();
              if (fileAnswerUtils.isFileInFileSystem(FileAnswerType.FILE, userEntityId, file.getFileId())) {
                content = fileAnswerUtils.getFileContent(FileAnswerType.FILE, userEntityId, file.getFileId());
              }
              else {
                logger.warning(String.format("File %s of user %d not found from file storage", file.getFileId(), userEntityId));
              }
            }

            if (content != null) {

              // Prevent duplicate file names

              String fileName = file.getFileName();
              if (fileNames.contains(fileName)) {
                int counter = 1;
                String name = file.getFileName();
                String prefix = "";
                if (StringUtils.contains(name, ".")) {
                  prefix = StringUtils.substringAfterLast(name, ".");
                  name = StringUtils.substringBeforeLast(name, ".");
                }
                if (!StringUtils.isEmpty(prefix)) {
                  prefix = String.format(".%s", prefix);
                }
                while (fileNames.contains(fileName)) {
                  fileName = String.format("%s (%s)%s", name, counter++, prefix);
                }
              }
              fileNames.add(fileName);

              // Zip file

              ZipEntry ze = new ZipEntry(fileName);
              zout.putNextEntry(ze);
              InputStream input = new ByteArrayInputStream(content);
              try {
                IOUtils.copy(input, zout);
              }
              finally {
                IOUtils.closeQuietly(input);
              }
              zout.closeEntry();
            }
          }
          zout.flush();
          zout.close();
        }
      };
      archiveName = StringUtils.defaultIfEmpty(archiveName, "files.zip");
      return Response.ok(output)
          .header("Content-Disposition", "attachment; filename=\"" + archiveName.replaceAll("\"", "\\\"") + "\"")
          .build();
    } catch (Exception e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GET
  @Path ("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/replies")
  @RESTPermitUnimplemented
  public Response listWorkspaceMaterialReplies(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId) {
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

    WorkspaceMaterialReply materialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, loggedUser);
    if (materialReply != null) {
      return Response.ok(createRestModel(new WorkspaceMaterialReply[] { materialReply })).build();
    } else {
      return Response.ok(createRestModel(new WorkspaceMaterialReply[] { })).build();
    }
  }

  @POST
  @Path ("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/replies")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceMaterialReply(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, WorkspaceMaterialReplyRestModel payload) {
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

    WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, payload.getState(), loggedUser, false);

    return Response.ok(createRestModel(workspaceMaterialReply)).build();
  }

  @PUT
  @Path ("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/replies/{REPLYID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceMaterialReply(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, @PathParam ("REPLYID") Long workspaceMaterialReplyId, WorkspaceMaterialReplyRestModel payload) {
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

    WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyById(workspaceMaterialReplyId);
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

  private fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceEntityFileRESTModel createRestModel(WorkspaceEntityFile file) {
    WorkspaceEntityFileRESTModel restfile = new fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceEntityFileRESTModel();
    restfile.setContentType(file.getContentType());
    restfile.setId(file.getId());
    restfile.setFileIdentifier(file.getFileIdentifier());
    restfile.setTempFileId(null);
    restfile.setWorkspaceEntityId(file.getWorkspaceEntity());
    return restfile;
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

  private List<WorkspaceMaterialReplyRestModel> createRestModel(WorkspaceMaterialReply... entries) {
    List<fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterialReplyRestModel> result = new ArrayList<>();

    for (WorkspaceMaterialReply entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }

  private WorkspaceMaterialReplyRestModel createRestModel(WorkspaceMaterialReply entity) {
    return new WorkspaceMaterialReplyRestModel(entity.getId(), entity.getState());
  }

  private List<fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial> createRestModel(WorkspaceMaterial... entries) {
    List<fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial> result = new ArrayList<>();

    for (WorkspaceMaterial entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }

  private fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial createRestModel(WorkspaceMaterial workspaceMaterial) {
    WorkspaceNode workspaceNodeNextSibling = workspaceMaterialController.findWorkspaceNodeNextSibling(workspaceMaterial);
    WorkspaceNode workspaceNode = workspaceMaterialController.findWorkspaceNodeById(workspaceMaterial.getId());
    Long nextSiblingId = workspaceNodeNextSibling != null ? workspaceNodeNextSibling.getId() : null;

    return new fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial(workspaceMaterial.getId(), workspaceMaterial.getMaterialId(),
        workspaceMaterial.getParent() != null ? workspaceMaterial.getParent().getId() : null, nextSiblingId, workspaceMaterial.getHidden(),
        workspaceMaterial.getAssignmentType(), workspaceMaterial.getCorrectAnswers(), workspaceMaterial.getPath(), workspaceMaterial.getTitle(),
        workspaceNode.getLanguage(), workspaceMaterial.getMaxPoints(), workspaceMaterial.getAi());
  }

  private fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace createRestModel(
      WorkspaceEntity workspaceEntity,
      Workspace workspace,
      EducationTypeMapping educationTypeMapping) {

    Mandatority mandatority = (educationTypeMapping != null && workspace.getEducationSubtypeIdentifier() != null)
        ? educationTypeMapping.getMandatority(workspace.getEducationSubtypeIdentifier()) : null;

    return createRestModel(
        workspaceEntity,
        workspace.getName(),
        workspace.getNameExtension(),
        workspace.getDescription(),
        convertWorkspaceCurriculumIds(workspace),
        mandatority
    );
  }

  private fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace createRestModel(
      WorkspaceEntity workspaceEntity,
      String name,
      String nameExtension,
      String description,
      Set<String> curriculumIdentifiers,
      Mandatority mandatority
      ) {
    Long numVisits = workspaceVisitController.getNumVisits(workspaceEntity);
    Date lastVisit = workspaceVisitController.getLastVisit(workspaceEntity);
    boolean hasCustomImage = workspaceEntityFileController.getHasCustomImage(workspaceEntity);

    return new fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace(workspaceEntity.getId(),
        workspaceEntity.getOrganizationEntity() == null ? null : workspaceEntity.getOrganizationEntity().getId(),
        workspaceEntity.getUrlName(),
        workspaceEntity.getAccess(),
        workspaceEntity.getArchived(),
        workspaceEntity.getPublished(),
        workspaceEntity.getLanguage(),
        name,
        nameExtension,
        description,
        workspaceEntity.getDefaultMaterialLicense(),
        mandatority,
        numVisits,
        lastVisit,
        curriculumIdentifiers,
        hasCustomImage);
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
        workspaceFolder.getViewRestrict(),
        workspaceFolder.getLanguage(),
        workspaceFolder.getExam());
  }

  @DELETE
  @Path("/workspaces/{WORKSPACEID}/materials/{WORKSPACEMATERIALID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteNode(
      @PathParam("WORKSPACEID") Long workspaceEntityId,
      @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId,
      @QueryParam("removeAnswers") @DefaultValue ("false") Boolean removeAnswers,
      @QueryParam("updateLinkedMaterials") @DefaultValue ("false") Boolean updateLinkedMaterials) {

    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Workspace entity not found").build();
    }
    if (!workspaceController.canIManageWorkspaceMaterials(workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("Workspace material not found").build();
    }
    else {
      if (removeAnswers) {
        logger.log(Level.WARNING, String.format("Delete workspace material %d by user %d with forced answer removal", workspaceMaterialId, sessionController.getLoggedUserEntity().getId()));
      }
      try {

        // #6638: When remove answers flag is on, refuse delete for non-admins if material's workspace is published or has student answers

        if (removeAnswers && !sessionController.hasEnvironmentPermission(MuikkuPermissions.REMOVE_ANSWERS)) {
          if (workspaceEntity.getPublished() || workspaceMaterialController.hasStudentAnswers(workspaceMaterial)) {
            logger.log(Level.WARNING, String.format("Delete workspace material %d by user %d denied due to material containing student answers", workspaceMaterialId, sessionController.getLoggedUserEntity().getId()));
            return Response.status(Status.FORBIDDEN).entity(localeController.getText(sessionController.getLocale(), "plugin.workspace.management.cannotRemoveAnswers")).build();
          }
        }

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

        // Actual delete

        workspaceMaterialController.deleteWorkspaceMaterial(workspaceMaterial, removeAnswers != null ? removeAnswers : false);
        return Response.noContent().build();
      }
      catch (WorkspaceMaterialContainsAnswersExeption e) {

        // #6638: When remove answers flag is off, either refuse delete for non-admins if the material's workspace is published, or notify frontend of the conflict

        if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.REMOVE_ANSWERS) && workspaceEntity.getPublished()) {
          logger.log(Level.WARNING, String.format("Delete workspace material %d by user %d denied due to material containing answers", workspaceMaterialId, sessionController.getLoggedUserEntity().getId()));
          return Response.status(Status.FORBIDDEN).entity(localeController.getText(sessionController.getLocale(), "plugin.workspace.management.cannotRemoveAnswers")).build();
        }
        else {
          return Response.status(Status.CONFLICT).entity(new WorkspaceMaterialDeleteError(WorkspaceMaterialDeleteError.Reason.CONTAINS_ANSWERS)).build();
        }
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
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteWorkspaceFolder(
      @PathParam("WORKSPACEID") Long workspaceEntityId,
      @PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {

    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (!workspaceController.canIManageWorkspaceMaterials(workspaceEntity)) {
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
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspaceFolder(
      @PathParam("WORKSPACEID") Long workspaceEntityId,
      @PathParam("WORKSPACEFOLDERID") Long workspaceFolderId,
      fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceFolder restFolder) {

    if (restFolder == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing payload").build();
    }

    // Workspace

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("Workspace not found").build();
    }

    if (!workspaceController.canIManageWorkspaceMaterials(workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // WorkspaceFolder

    WorkspaceFolder workspaceFolder = workspaceMaterialController.findWorkspaceFolderById(restFolder.getId());
    if (workspaceFolder == null) {
      return Response.status(Status.BAD_REQUEST).entity("Folder not found").build();
    }

    // Workspace folder belongs to workspace check

    Long folderWorkspaceEntityId = workspaceMaterialController.getWorkspaceEntityId(workspaceFolder);
    if (!folderWorkspaceEntityId.equals(workspaceEntityId)) {
      return Response.status(Status.BAD_REQUEST).entity("Workspace mismatch").build();
    }
    
    // Payload validation
    
    if (StringUtils.isEmpty(restFolder.getTitle())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing title").build();
    }
    if (restFolder.getParentId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing parent folder").build();
    }

    // Actual update

    WorkspaceNode parentNode = restFolder.getParentId() == null ? null : workspaceMaterialController.findWorkspaceNodeById(restFolder.getParentId());
    WorkspaceNode nextSibling = restFolder.getNextSiblingId() == null ? null : workspaceMaterialController.findWorkspaceNodeById(restFolder.getNextSiblingId());
    workspaceFolder = workspaceMaterialController.updateWorkspaceFolder(
        workspaceFolder,
        restFolder.getTitle(),
        parentNode,
        nextSibling,
        restFolder.getHidden(),
        restFolder.getViewRestrict(),
        restFolder.getTitleLanguage(),
        restFolder.getExam());
   
    return Response.ok(createRestModel(workspaceFolder)).build();
  }

  @POST
  @Path("/workspaces/{WORKSPACEID}/folders/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceFolder(
      @PathParam("WORKSPACEID") Long workspaceEntityId,
      fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceFolder restFolder) {

    if (restFolder == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (!workspaceController.canIManageWorkspaceMaterials(workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    WorkspaceNode rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    WorkspaceNode nextSibling = restFolder.getNextSiblingId() == null ? null : workspaceMaterialController.findWorkspaceNodeById(restFolder.getNextSiblingId());
    WorkspaceNode parentFolder = restFolder.getParentId() == null ? rootFolder : workspaceMaterialController.findWorkspaceNodeById(restFolder.getParentId());
    String title = restFolder.getTitle() == null ? "Untitled" : restFolder.getTitle();

    WorkspaceFolder workspaceFolder = workspaceMaterialController.createWorkspaceFolder(parentFolder, title, null, restFolder.getExam());
    if (nextSibling != null) {
      workspaceMaterialController.moveAbove(workspaceFolder, nextSibling);
    }
    return Response.ok(createRestModel(workspaceFolder)).build();
  }

  @PUT
  @Path("/workspaces/{WORKSPACEID}/materials/{WORKSPACEMATERIALID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspaceMaterial(@PathParam("WORKSPACEID") Long workspaceEntityId,
      @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial restWorkspaceMaterial) {

    // Workspace

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("Workspace not found").build();
    }

    if (!workspaceController.canIManageWorkspaceMaterials(workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // WorkspaceMaterial

    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(restWorkspaceMaterial.getId());
    if (workspaceMaterial == null) {
      return Response.status(Status.BAD_REQUEST).entity("Workspace material not found").build();
    }

    // Workspace material belongs to workspace check

    Long materialWorkspaceEntityId = workspaceMaterialController.getWorkspaceEntityId(workspaceMaterial);
    if (!materialWorkspaceEntityId.equals(workspaceEntityId)) {
      return Response.status(Status.BAD_REQUEST).entity("Workspace mismatch").build();
    }
    
    // Payload validation
    
    if (StringUtils.isEmpty(restWorkspaceMaterial.getTitle())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing title").build();
    }
    if (restWorkspaceMaterial.getParentId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing parent folder").build();
    }

    // Actual update

    Long materialId = restWorkspaceMaterial.getMaterialId();
    WorkspaceNode parentNode = workspaceMaterialController.findWorkspaceNodeById(restWorkspaceMaterial.getParentId());
    WorkspaceNode nextSibling = restWorkspaceMaterial.getNextSiblingId() == null ? null : workspaceMaterialController.findWorkspaceNodeById(restWorkspaceMaterial.getNextSiblingId());
    boolean titleChanged = !StringUtils.equals(restWorkspaceMaterial.getTitle(), workspaceMaterial.getTitle());
    WorkspaceNode workspaceNode = workspaceMaterialController.updateWorkspaceNode(
        workspaceMaterial,
        materialId,
        parentNode,
        nextSibling,
        restWorkspaceMaterial.getHidden(),
        restWorkspaceMaterial.getAssignmentType(),
        restWorkspaceMaterial.getCorrectAnswers(),
        restWorkspaceMaterial.getTitle(),
        restWorkspaceMaterial.getTitleLanguage(),
        restWorkspaceMaterial.getMaxPoints(),
        restWorkspaceMaterial.getAi());
    restWorkspaceMaterial.setPath(workspaceNode.getPath());

    // #6440: If the material is a journal page whose title is changed, update respective journal entry titles

    if (restWorkspaceMaterial.getAssignmentType() == WorkspaceMaterialAssignmentType.JOURNAL && titleChanged) {
      List<WorkspaceMaterialField> fields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByWorkspaceMaterial(workspaceMaterial);
      List<WorkspaceMaterialReply> replies =
          workspaceMaterialReplyController.listWorkspaceMaterialRepliesByWorkspaceMaterial(workspaceMaterial);
      for (WorkspaceMaterialField field : fields) {
        for (WorkspaceMaterialReply reply : replies) {
          String identifier = String.format("%d-%d", field.getId(), reply.getId());
          WorkspaceJournalEntry journalEntry = workspaceJournalController.findJournalEntryByMaterialFieldReplyIdentifier(identifier);
          if (journalEntry != null) {
            workspaceJournalController.updateJournalEntryTitle(journalEntry, restWorkspaceMaterial.getTitle());
          }
        }
      }
    }

    return Response.ok(restWorkspaceMaterial).build();
  }

  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/amIMember")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response isLoggedInStudentInWorkspace(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, userEntity.defaultSchoolDataIdentifier());
    return Response.ok(workspaceUserEntity != null).build();
  }

  /**
   * Returns workspace student
   *
   * Used        : evaluation-modal.js
   * Permissions : LIST_WORKSPACE_MEMBERS
   * Success     : 200 WorkspaceStudentRestModel
   *
   * PK 20.11.2018
   */
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{WORKSPACEUSERENTITYID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response findWorkspaceStudent(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId) {

    // Workspace, workspace user, and Elastic checks

    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_WORKSPACE_MEMBERS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    if (!workspaceEntity.getId().equals(workspaceUserEntity.getWorkspaceEntity().getId())) {
      logger.warning(String.format("Workspace entity mismatch (workspace %d workspace user %d)", workspaceEntityId, workspaceUserEntityId));
      return Response.status(Status.BAD_REQUEST).build();
    }
    if (workspaceUserEntity.getWorkspaceUserRole().getArchetype() != WorkspaceRoleArchetype.STUDENT) {
      logger.warning(String.format("Attempted to toggle activity of workspace user %d (not a student)", workspaceUserEntity.getId()));
      return Response.status(Status.BAD_REQUEST).build();
    }
    SearchProvider elasticSearchProvider = null;
    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      elasticSearchProvider = searchProviderIterator.next();
    }
    if (elasticSearchProvider == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Search provider not found").build();
    }

    // WorkspaceUserEntity to SchoolDataIdentifier

    SchoolDataIdentifier schoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier().schoolDataIdentifier();

    // Find user from Elastic

    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    OrganizationEntity organization = userSchoolDataIdentifier.getOrganization();
    List<OrganizationEntity> organizations = Arrays.asList(organization);

    // #5954: This endpoint retrieves a workspace student so they can be archived from the workspace. Thus hidden users are returned as well.

    SearchResult searchResult = elasticSearchProvider.searchUsers(
        organizations,                                            // organizations
        null,                                                     // study programme identifiers
        null,                                                     // search string
        null,                                                     // fields
        null,                                                     // environment roles
        null,                                                     // user groups
        null,                                                     // workspace
        Collections.singletonList(schoolDataIdentifier),          // user identifiers
        true,                                                     // include inactive students
        true,                                                     // include hidden
        false,                                                    // only default users
        0,                                                        // first result
        1,                                                        // max results
        false);                                                   // join groups and workspaces
    List<Map<String, Object>> elasticUsers = searchResult.getResults();
    if (elasticUsers.isEmpty()) {
      return Response.status(Status.NOT_FOUND).build();
    }
    Map<String, Object> elasticUser = elasticUsers.get(0);

    // Convert and return WorkspaceStudentRestModel

    boolean hasImage = userEntityFileController.hasProfilePicture(workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity());
    WorkspaceStudentRestModel workspaceStudentRestModel = new WorkspaceStudentRestModel(
        workspaceUserEntity.getId(),
        workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity().getId(),
        workspaceUserEntity.getUserSchoolDataIdentifier().schoolDataIdentifier(),
        elasticUser.get("firstName").toString(),
        elasticUser.get("nickName") == null ? null : elasticUser.get("nickName").toString(),
        elasticUser.get("lastName").toString(),
        elasticUser.get("studyProgrammeName") == null ? null : elasticUser.get("studyProgrammeName").toString(),
        hasImage,
        workspaceUserEntity.getActive(),
        pedagogyController.isPublished(workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity().getId()),
        userEntityController.isUnder18CompulsoryEducationStudent(workspaceUserEntity.getUserSchoolDataIdentifier().schoolDataIdentifier())
    );

    return Response.ok(workspaceStudentRestModel).build();
  }

  /**
   * Updates workspace student. Only updates activity field.
   *
   * Payload     : WorkspaceStudentRestModel
   * Used        : Workspace members view
   *               evaluation-modal.js
   * Permissions : MANAGE_WORKSPACE_MEMBERS
   * Success     : 204 no content
   *
   * PK 20.11.2018
   */
  @PUT
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{WORKSPACEUSERENTITYID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateWorkspaceStudent(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId,
      WorkspaceStudentRestModel workspaceStudentRestModel) {

    // Workspace, user, and access check

    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    if (!workspaceEntity.getId().equals(workspaceUserEntity.getWorkspaceEntity().getId())) {
      logger.warning(String.format("Workspace entity mismatch (workspace %d workspace user %d)", workspaceEntityId, workspaceUserEntityId));
      return Response.status(Status.BAD_REQUEST).build();
    }
    if (workspaceUserEntity.getWorkspaceUserRole().getArchetype() != WorkspaceRoleArchetype.STUDENT) {
      logger.warning(String.format("Attempted to toggle activity of workspace user %d (not a student)", workspaceUserEntity.getId()));
      return Response.status(Status.BAD_REQUEST).build();
    }
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MEMBERS, workspaceUserEntity.getWorkspaceEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Update activity in Muikku

    workspaceUserEntityController.updateActive(workspaceUserEntity, workspaceStudentRestModel.getActive());

    // Update activity in Pyramus (participation type in course might change)

    WorkspaceUser workspaceUser = workspaceController.findWorkspaceUser(workspaceUserEntity);
    if (workspaceUser != null) {
      workspaceController.updateWorkspaceStudentActivity(workspaceUser, workspaceStudentRestModel.getActive());
    }

    // Update Elastic search index (add or remove workspace from user's workspaces)

    UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
    userIndexer.indexUser(userSchoolDataIdentifier.getDataSource().getIdentifier(), userSchoolDataIdentifier.getIdentifier());

    // #6967: When a student is archived from a course, also remove their course discussion subscriptions

    if (!workspaceStudentRestModel.getActive()) {
      UserEntity userEntity = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
      forumAreaSubsciptionController.removeAreaSubscriptions(userEntity, workspaceEntity);
      forumThreadSubsciptionController.removeThreadSubscriptions(userEntity, workspaceEntity);
    }

    return Response.noContent().build();
  }

  @DELETE
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
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
  @Path("/workspaces/{WORKSPACEID}/journal/{JOURNALENTRYID}/comments")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listJournalEntryComments(@PathParam("WORKSPACEID") Long workspaceEntityId, @PathParam("JOURNALENTRYID") Long journalEntryId) {

    // Path validation

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceJournalEntry journalEntry = workspaceJournalController.findJournalEntry(journalEntryId);
    if (journalEntry == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    // Access check

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_WORKSPACE_JOURNAL_COMMENTS, workspaceEntity)) {
      if (!journalEntry.getUserEntityId().equals(sessionController.getLoggedUserEntity().getId())) { // allow students to view comments of their own journal
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    // Comment listing

    List<WorkspaceJournalComment> comments = orderCommentTree(workspaceJournalController.listCommentsByJournalEntry(journalEntry));
    List<WorkspaceJournalCommentRESTModel> result = new ArrayList<>();
    for (WorkspaceJournalComment comment : comments) {
      result.add(toRestModel(workspaceEntity, comment));
    }
    return Response.ok(result).build();
  }

  @POST
  @Path("/workspaces/{WORKSPACEID}/journal/{JOURNALENTRYID}/comments")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createJournalEntryComment(@PathParam("WORKSPACEID") Long workspaceEntityId, @PathParam("JOURNALENTRYID") Long journalEntryId, WorkspaceJournalCommentRESTModel payload) {

    // Path validation

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceJournalEntry journalEntry = workspaceJournalController.findJournalEntry(journalEntryId);
    if (journalEntry == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    // Payload validation

    if (!journalEntryId.equals(payload.getJournalEntryId())) {
      return Response.status(Status.BAD_REQUEST).entity("Journal entry id mismatch").build();
    }
    WorkspaceJournalComment parentComment = payload.getParentCommentId() == null ? null : workspaceJournalController.findCommentById(payload.getParentCommentId());
    if (parentComment != null && !journalEntryId.equals(parentComment.getJournalEntry().getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Parent journal entry id mismatch").build();
    }
    if (StringUtils.isBlank(payload.getComment())) {
      return Response.status(Status.BAD_REQUEST).entity("No comment").build();
    }

    // Access check

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.CREATE_WORKSPACE_JOURNAL_COMMENT, workspaceEntity)) {
      if (!journalEntry.getUserEntityId().equals(sessionController.getLoggedUserEntity().getId())) { // allow students to comment their own journal entries
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    // Comment creation

    WorkspaceJournalComment comment = workspaceJournalController.createComment(journalEntry, parentComment, payload.getComment(), sessionController.getLoggedUserEntity().getId());
    return Response.ok(toRestModel(workspaceEntity, comment)).build();
  }

  @PUT
  @Path("/workspaces/{WORKSPACEID}/journal/{JOURNALENTRYID}/comments/{JOURNALCOMMENTID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createJournalEntryComment(@PathParam("WORKSPACEID") Long workspaceEntityId, @PathParam("JOURNALENTRYID") Long journalEntryId,
      @PathParam("JOURNALCOMMENTID") Long journalCommentId, WorkspaceJournalCommentRESTModel payload) {

    // Path validation

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceJournalEntry journalEntry = workspaceJournalController.findJournalEntry(journalEntryId);
    if (journalEntry == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceJournalComment journalComment = workspaceJournalController.findCommentById(journalCommentId);
    if (journalComment == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    // Payload validation

    if (!journalEntryId.equals(payload.getJournalEntryId())) {
      return Response.status(Status.BAD_REQUEST).entity("Journal entry id mismatch").build();
    }
    if (!journalCommentId.equals(payload.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Journal comment id mismatch").build();
    }
    if (StringUtils.isBlank(payload.getComment())) {
      return Response.status(Status.BAD_REQUEST).entity("No comment").build();
    }

    // Access check

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.EDIT_WORKSPACE_JOURNAL_COMMENT, workspaceEntity)) {
      if (!journalComment.getCreator().equals(sessionController.getLoggedUserEntity().getId())) { // allow students to edit their own comments
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    // Comment update

    WorkspaceJournalComment comment = workspaceJournalController.updateComment(journalComment, payload.getComment());
    return Response.ok(toRestModel(workspaceEntity, comment)).build();
  }

  @DELETE
  @Path("/workspaces/{WORKSPACEID}/journal/{JOURNALENTRYID}/comments/{JOURNALCOMMENTID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createJournalEntryComment(@PathParam("WORKSPACEID") Long workspaceEntityId, @PathParam("JOURNALENTRYID") Long journalEntryId,
      @PathParam("JOURNALCOMMENTID") Long journalCommentId) {

    // Path validation

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceJournalEntry journalEntry = workspaceJournalController.findJournalEntry(journalEntryId);
    if (journalEntry == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceJournalComment journalComment = workspaceJournalController.findCommentById(journalCommentId);
    if (journalComment == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    // Payload validation

    if (!journalEntryId.equals(journalComment.getJournalEntry().getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Journal entry id mismatch").build();
    }
    if (!journalCommentId.equals(journalComment.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Journal comment id mismatch").build();
    }

    // Access check

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.REMOVE_WORKSPACE_JOURNAL_COMMENT, workspaceEntity)) {
      if (!journalComment.getCreator().equals(sessionController.getLoggedUserEntity().getId())) { // allow students to remove their own comments
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    // Comment archiving

    workspaceJournalController.archiveComment(journalComment);
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

    List<WorkspaceJournalEntry> entries = new ArrayList<>();
    List<WorkspaceJournalEntryRESTModel> result = new ArrayList<>();
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    UserEntity userEntity = sessionController.getLoggedUserEntity();
    boolean canListAllEntries = sessionController.hasWorkspacePermission(MuikkuPermissions.LIST_ALL_JOURNAL_ENTRIES, workspaceEntity);
    if (workspaceStudentId == null && userEntityId == null && canListAllEntries) {
      List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listActiveWorkspaceStudents(workspaceEntity);
      if (workspaceUserEntities.isEmpty()) {
        return Response.ok(result).build();
      }
      Set<UserEntity> userEntities = new HashSet<>();
      for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
        userEntities.add(workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity());
      }
      entries = workspaceJournalController.listEntriesForStudents(workspaceEntity, userEntities, firstResult, maxResults);
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
        UserEntity userEntityFromWorkspaceUser = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
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
      result.add(toRestModel(entry));
    }

    return Response.ok(result).build();
  }

  @POST
  @Path("/workspaces/{WORKSPACEID}/journal")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response addJournalEntry(@PathParam("WORKSPACEID") Long workspaceEntityId, WorkspaceJournalEntryRESTModel restModel) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_WORKSPACE_JOURNAL, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    WorkspaceJournalEntry workspaceJournalEntry = workspaceJournalController.createJournalEntry(
        workspaceController.findWorkspaceEntityById(workspaceEntityId),
        sessionController.getLoggedUserEntity(),
        restModel.getContent(),
        null,
        restModel.getTitle());
    return Response.ok(toRestModel(workspaceJournalEntry)).build();

  }

  @PUT
  @Path("/workspaces/{WORKSPACEID}/journal/{JOURNALENTRYID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateJournalEntry(@PathParam("WORKSPACEID") Long workspaceEntityId, @PathParam("JOURNALENTRYID") Long journalEntryId, WorkspaceJournalEntryRESTModel restModel) {
    if (!workspaceEntityId.equals(restModel.getWorkspaceEntityId())) {
      return Response.status(Status.BAD_REQUEST).entity("Journal entry workspace mismatch").build();
    }
    if (!journalEntryId.equals(restModel.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Journal entry id mismatch").build();
    }
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_WORKSPACE_JOURNAL, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    WorkspaceJournalEntry workspaceJournalEntry = workspaceJournalController.findJournalEntry(journalEntryId);
    if (workspaceJournalEntry == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    workspaceJournalEntry = workspaceJournalController.updateJournalEntry(workspaceJournalEntry, restModel.getTitle(), restModel.getContent());
    return Response.ok(toRestModel(workspaceJournalEntry)).build();
  }

  @DELETE
  @Path("/workspaces/{WORKSPACEID}/journal/{JOURNALENTRYID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateJournalEntry(@PathParam("WORKSPACEID") Long workspaceEntityId, @PathParam("JOURNALENTRYID") Long journalEntryId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceJournalEntry workspaceJournalEntry = workspaceJournalController.findJournalEntry(journalEntryId);
    if (workspaceJournalEntry == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_WORKSPACE_JOURNAL, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    if (!workspaceJournalEntry.getUserEntityId().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    workspaceJournalController.archiveJournalEntry(workspaceJournalEntry);
    return Response.noContent().build();
  }

  @POST
  @Path("/workspaces/{WORKSPACEID}/workspacefile/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceFile(@PathParam("WORKSPACEID") Long workspaceId, WorkspaceEntityFileRESTModel entity) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
    if (workspaceEntity == null)
      return Response.status(Status.BAD_REQUEST).build();

    if (!workspaceController.canIManageWorkspace(workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (StringUtils.isBlank(entity.getFileIdentifier())) {
      return Response.status(Status.BAD_REQUEST).entity("identifier is missing").build();
    }

    byte[] content = null;
    if (StringUtils.isNotBlank(entity.getTempFileId())) {
      try {
        content = TempFileUtils.getTempFileData(entity.getTempFileId());
      } catch (IOException e) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
      }
    }
    else if (StringUtils.isNotBlank(entity.getBase64Data())) {
      String base64File = entity.getBase64Data().split(",")[1];
      content = DatatypeConverter.parseBase64Binary(base64File);
    }

    if (content == null) {
      return Response.status(Status.BAD_REQUEST).entity("no content was found").build();
    }

    try {
      WorkspaceEntityFile workspaceEntityFile = workspaceEntityFileController.findWorkspaceEntityFile(workspaceEntity, entity.getFileIdentifier());
      ByteArrayInputStream contentStream = new ByteArrayInputStream(content);
      try {
        if (workspaceEntityFile == null) {
          String diskName = fileController.createFile("workspace", contentStream);
          workspaceEntityFile = workspaceEntityFileController.createWorkspaceEntityFile(
              workspaceEntity, entity.getFileIdentifier(), diskName, entity.getContentType(), new Date());
        } else {
          fileController.updateFile("workspace", workspaceEntityFile.getDiskName(), contentStream);
          workspaceEntityFile = workspaceEntityFileController.updateWorkspaceEntityFile(
              workspaceEntityFile, entity.getContentType(), new Date());
        }
      }
      finally {
        IOUtils.closeQuietly(contentStream);
      }

      return Response.ok(createRestModel(workspaceEntityFile)).build();
    } catch (IOException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }

  @POST
  @Path("/workspaces/{FROMWORKSPACEID}/workspacefilecopy/{TOWORKSPACEID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceFile(
      @PathParam("FROMWORKSPACEID") Long sourceWorkspaceId,
      @PathParam("TOWORKSPACEID") Long destinationWorkspaceId) {
    if (Objects.equals(sourceWorkspaceId, destinationWorkspaceId))
      return Response.status(Status.BAD_REQUEST).build();

    WorkspaceEntity sourceWorkspaceEntity = workspaceEntityController.findWorkspaceEntityById(sourceWorkspaceId);
    WorkspaceEntity destinationWorkspaceEntity = workspaceEntityController.findWorkspaceEntityById(destinationWorkspaceId);
    if (sourceWorkspaceEntity == null || destinationWorkspaceEntity == null)
      return Response.status(Status.BAD_REQUEST).build();

    if (!workspaceController.canIManageWorkspace(sourceWorkspaceEntity) ||
        !workspaceController.canIManageWorkspace(destinationWorkspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    try {
      List<WorkspaceEntityFile> workspaceEntityFiles = workspaceEntityFileController.listWorkspaceEntityFiles(sourceWorkspaceEntity);
      for (WorkspaceEntityFile workspaceEntityFile : workspaceEntityFiles) {
        String diskName = fileController.copyFile("workspace", workspaceEntityFile.getDiskName());
        workspaceEntityFileController.createWorkspaceEntityFile(
            destinationWorkspaceEntity, workspaceEntityFile.getFileIdentifier(), diskName, workspaceEntityFile.getContentType(), new Date());
      }
    } catch (IOException e) {
      logger.log(Level.SEVERE, String.format("Copying workspace file failed while copying workspace %s", sourceWorkspaceId), e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }

    return Response
        .noContent()
        .build();
  }

  @GET
  @Path("/workspaces/{WORKSPACEID}/workspacefile/{FILEIDENTIFIER}")
  @RESTPermit (handling = Handling.INLINE)
  public Response getWorkspaceFileContent(@PathParam("WORKSPACEID") Long workspaceId, @PathParam("FILEIDENTIFIER") String fileIdentifier, @Context Request request) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
    if (workspaceEntity == null)
      return Response.status(Status.BAD_REQUEST).build();

    WorkspaceEntityFile imageFile = workspaceEntityFileController.findWorkspaceEntityFile(workspaceEntity, fileIdentifier);
    if (imageFile == null)
      return Response.status(Status.NOT_FOUND).build();

    StreamingOutput output = s -> fileController.outputFileToStream("workspace", imageFile.getDiskName(), s);

    String contentType = imageFile.getContentType();

    String tagIdentifier = String.format("%d-%s-%d", imageFile.getWorkspaceEntity(), imageFile.getDiskName(), imageFile.getLastModified().getTime());
    EntityTag tag = new EntityTag(DigestUtils.md5Hex(String.valueOf(tagIdentifier)));
    ResponseBuilder builder = request.evaluatePreconditions(tag);
    if (builder != null) {
      return builder.build();
    }

    CacheControl cacheControl = new CacheControl();
    cacheControl.setMustRevalidate(true);
    if (StringUtils.isEmpty(contentType)) {
      return Response.ok()
        .cacheControl(cacheControl)
        .tag(tag)
        .entity(output)
        .build();
    }
    else {
      return Response.ok()
        .cacheControl(cacheControl)
        .tag(tag)
        .type(contentType)
        .entity(output)
        .build();
    }
  }

  @DELETE
  @Path("/workspaces/{WORKSPACEID}/workspacefile/{FILEIDENTIFIER}")
  @RESTPermit (handling = Handling.INLINE)
  public Response deleteWorkspaceFileContent(@PathParam("WORKSPACEID") Long workspaceId, @PathParam("FILEIDENTIFIER") String fileIdentifier, @Context Request request) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
    if (workspaceEntity == null)
      return Response.status(Status.BAD_REQUEST).build();

    if (!workspaceController.canIManageWorkspace(workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    WorkspaceEntityFile workspaceEntityFile = workspaceEntityFileController.findWorkspaceEntityFile(workspaceEntity, fileIdentifier);
    if (workspaceEntityFile == null)
      return Response.status(Status.NOT_FOUND).build();

    fileController.deleteFile("workspace", workspaceEntityFile.getDiskName());
    workspaceEntityFileController.deleteWorkspaceEntityFile(workspaceEntityFile);

    return Response
        .noContent()
        .build();
  }

  @Path("/userfiles")
  @POST
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createUserFile(MultipartFormDataInput multipart) {
    byte[] fileData = getFile(multipart, "file");
    String filename = StringUtils.strip(UUID.randomUUID().toString(), "-");
    try {
      fileAnswerUtils.storeFileToFileSystem(FileAnswerType.FILE, sessionController.getLoggedUserEntity().getId(), filename, fileData);
    }
    catch (IOException e) {
      logger.log(Level.WARNING, "Exception storing user file", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("File upload fail: %s", e.getMessage())).build();
    }
    return Response.ok(filename).build();
  }

  @Path("/userfiles/{USERID}/file/{FILENAME}")
  @GET
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  @Produces("*/*")
  public Response getUserFile(@PathParam("USERID") Long userEntityId, @PathParam("FILENAME") String filename) {
    if (!userEntityId.equals(sessionController.getLoggedUserEntity().getId())) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_STUDENT_FILES)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    try {
      byte[] data = fileAnswerUtils.getFileContent(FileAnswerType.FILE, userEntityId, filename);
      String contentType = fileAnswerUtils.getFileContentType(FileAnswerType.FILE, userEntityId, filename);
      return Response.ok(data)
          .type(contentType)
          .header("Content-Length", data.length)
          .header("Content-Disposition", String.format("inline; filename=\"%s\"", filename))
          .build();
    }
    catch (IOException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("File get fail: %s", e.getMessage())).build();
    }
  }

  @Path("/userfiles/{USERID}/file/{FILENAME}")
  @DELETE
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteUserFile(@PathParam("USERID") Long userEntityId, @PathParam("FILENAME") String filename) {
    if (!userEntityId.equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    try {
      fileAnswerUtils.removeFileFromFileSystem(FileAnswerType.FILE, userEntityId, filename);
      return Response.noContent().build();
    }
    catch (IOException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("File delete fail: %s", e.getMessage())).build();
    }
  }

  private WorkspaceSettingsRestModel getWorkspaceSettingsRestModel(WorkspaceEntity workspaceEntity, Workspace workspace) {
    
    SearchProvider elasticSearchProvider = null;
    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      elasticSearchProvider = searchProviderIterator.next();
    }

    EducationTypeMapping educationTypeMapping = workspaceEntityController.getEducationTypeMapping();
    Mandatority mandatority = (educationTypeMapping != null && workspace.getEducationSubtypeIdentifier() != null)
        ? educationTypeMapping.getMandatority(workspace.getEducationSubtypeIdentifier()) : null;
    boolean hasCustomImage = workspaceEntityFileController.getHasCustomImage(workspaceEntity);

    WorkspaceSignupMessage defaultSignupMessage = workspaceSignupMessageController.findDefaultSignupMessage(workspaceEntity);
    WorkspaceSignupMessageRestModel defaultSignupMessageRestModel = defaultSignupMessage == null
        ? null
        : new WorkspaceSignupMessageRestModel(defaultSignupMessage.getId(),
            defaultSignupMessage.isEnabled(),
            defaultSignupMessage.getCaption(),
            defaultSignupMessage.getContent(),
            Collections.emptyList());

    // All groups that can be assigned as signup groups
    
    List<UserGroupEntity> availableWorkspaceSignupGroups = workspaceSignupGroupController.listAvailableWorkspaceSignupGroups();
    
    // Currently selected signup groups
    
    Set<SchoolDataIdentifier> workspaceSignupGroups = workspaceController.listWorkspaceSignupGroups(workspaceEntity);
    List<WorkspaceSignupGroupRestModel> groupSignupRestModels = new ArrayList<>();
    for (UserGroupEntity availableSignupGroup : availableWorkspaceSignupGroups) {
      SearchResult searchResult = elasticSearchProvider.findUserGroup(availableSignupGroup.schoolDataIdentifier());
      if (searchResult.getTotalHitCount() == 1) {
        List<Map<String, Object>> results = searchResult.getResults();
        Map<String, Object> match = results.get(0);
        boolean canSignup = workspaceSignupGroups.contains(availableSignupGroup.schoolDataIdentifier());
        groupSignupRestModels.add(new WorkspaceSignupGroupRestModel(
            availableSignupGroup.getId(),
            (String) match.get("name"),
            canSignup));
      }
      else {
        logger.warning(String.format("WorkspaceSignupGroup %s not found from Elastic", availableSignupGroup.schoolDataIdentifier().toString()));
      }
    }
    
    // Signup messages
    
    List<WorkspaceSignupMessage> messages = workspaceSignupMessageController.listGroupBoundSignupMessages(workspaceEntity);
    List<WorkspaceSignupMessageRestModel> restMessages = new ArrayList<>();
    for (WorkspaceSignupMessage message : messages) {
      List<WorkspaceSignupMessageGroupRestModel> restGroups = new ArrayList<>();
      for (UserGroupEntity group : message.getUserGroupEntities()) {
        SearchResult searchResult = elasticSearchProvider.findUserGroup(group.schoolDataIdentifier());
        if (searchResult.getTotalHitCount() == 1) {
          List<Map<String, Object>> results = searchResult.getResults();
          Map<String, Object> match = results.get(0);
          restGroups.add(new WorkspaceSignupMessageGroupRestModel(
              group.getId(),
              (String) match.get("name")));
        }
        else {
          logger.warning(String.format("WorkspaceSignupMessageGroup %s not found from Elastic", group.schoolDataIdentifier().toString()));
        }
      }
      restMessages.add(new WorkspaceSignupMessageRestModel(message.getId(),
            message.isEnabled(),
            message.getCaption(),
            message.getContent(),
            restGroups));
    }

    String workspaceTypeIdentifier = workspace.getWorkspaceTypeId() != null ? workspace.getWorkspaceTypeId().toId() : null;

    return new WorkspaceSettingsRestModel(
        workspaceEntity.getId(),
        workspaceEntity.getOrganizationEntity() == null ? null : workspaceEntity.getOrganizationEntity().getId(),
        workspaceEntity.getUrlName(),
        workspaceEntity.getAccess(),
        workspaceEntity.getPublished(),
        workspaceEntity.getLanguage(),
        workspace.getName(),
        workspace.getNameExtension(),
        workspace.getDescription(),
        workspace.getBeginDate(),
        workspace.getEndDate(),
        workspace.getSignupStart(),
        workspace.getSignupEnd(),
        workspaceEntity.getDefaultMaterialLicense(),
        mandatority,
        convertWorkspaceCurriculumIds(workspace),
        workspaceTypeIdentifier,
        hasCustomImage,
        chatController.isChatEnabled(workspaceEntity),
        workspace.getViewLink(),
        defaultSignupMessageRestModel,
        groupSignupRestModels,
        restMessages
    );
  }

  private WorkspaceJournalCommentRESTModel toRestModel(WorkspaceEntity workspaceEntity, WorkspaceJournalComment workspaceJournalComment) {
    UserEntity author = userEntityController.findUserEntityById(workspaceJournalComment.getCreator());
    UserEntityName userEntityName = author == null ? null : userEntityController.getName(author, true);
    WorkspaceJournalCommentRESTModel result = new WorkspaceJournalCommentRESTModel();
    result.setId(workspaceJournalComment.getId());
    result.setJournalEntryId(workspaceJournalComment.getJournalEntry().getId());
    result.setAuthorId(workspaceJournalComment.getCreator());
    result.setComment(workspaceJournalComment.getComment());
    result.setCreated(workspaceJournalComment.getCreated());
    result.setFirstName(userEntityName == null ? null : userEntityName.getFirstName());
    result.setLastName(userEntityName == null ? null : userEntityName.getLastName());
    if (workspaceJournalComment.getParent() != null) {
      result.setParentCommentId(workspaceJournalComment.getParent().getId());
    }
    result.setDepth(workspaceJournalComment.getDepth());
    result.setEditable(workspaceJournalComment.getCreator().equals(sessionController.getLoggedUserEntity().getId()) ||
        sessionController.hasWorkspacePermission(MuikkuPermissions.EDIT_WORKSPACE_JOURNAL_COMMENT, workspaceEntity));
    result.setArchivable(workspaceJournalComment.getCreator().equals(sessionController.getLoggedUserEntity().getId()) ||
        sessionController.hasWorkspacePermission(MuikkuPermissions.REMOVE_WORKSPACE_JOURNAL_COMMENT, workspaceEntity));
    return result;
  }

  private WorkspaceJournalEntryRESTModel toRestModel(WorkspaceJournalEntry workspaceJournalEntry) {
    UserEntity entryUserEntity = userEntityController.findUserEntityById(workspaceJournalEntry.getUserEntityId());
    UserEntityName userEntityName = entryUserEntity == null ? null : userEntityController.getName(entryUserEntity, true);

    WorkspaceJournalEntryRESTModel result = new WorkspaceJournalEntryRESTModel();
    result.setId(workspaceJournalEntry.getId());
    result.setWorkspaceEntityId(workspaceJournalEntry.getWorkspaceEntityId());
    result.setUserEntityId(workspaceJournalEntry.getUserEntityId());
    result.setFirstName(userEntityName == null ? null : userEntityName.getFirstName());
    result.setLastName(userEntityName == null ? null : userEntityName.getLastName());
    result.setContent(workspaceJournalEntry.getHtml());
    result.setTitle(workspaceJournalEntry.getTitle());
    result.setCreated(workspaceJournalEntry.getCreated());
    result.setCommentCount(workspaceJournalController.getCommentCount(workspaceJournalEntry));

    if (workspaceJournalEntry.getMaterialFieldReplyIdentifier() != null) {
      String[] identifiers = workspaceJournalEntry.getMaterialFieldReplyIdentifier().split("-");
      Long replyId = Long.parseLong(identifiers[1]);
      WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyById(replyId);
      if (reply != null) {
        result.setWorkspaceMaterialId(reply.getWorkspaceMaterial().getId());
        result.setWorkspaceMaterialPath(reply.getWorkspaceMaterial().getPath());
        result.setWorkspaceMaterialReplyState(reply.getState());
        HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(reply.getWorkspaceMaterial().getMaterialId());
        if (htmlMaterial != null) {
          result.setMaterial(new HtmlRestMaterial(htmlMaterial.getId(),
              htmlMaterial.getTitle(),
              htmlMaterial.getContentType(),
              htmlMaterial.getHtml(),
              htmlMaterial.getLicense(),
              htmlMaterial.getViewRestrict()));        
        }
      }
    }

    return result;
  }

  private List<WorkspaceJournalComment> orderCommentTree(List<WorkspaceJournalComment> comments) {
    return commentTreeAdd(comments, null, new ArrayList<>(comments.size()));
  }

  private List<WorkspaceJournalComment> commentTreeAdd(List<WorkspaceJournalComment> comments, WorkspaceJournalComment parent, List<WorkspaceJournalComment> resultList) {
    comments.stream()
      .filter(c -> c.getParent() == parent)
      .sorted((c1, c2) -> c1.getCreated().compareTo(c2.getCreated()))
      .forEach(c -> {
        resultList.add(c);
        commentTreeAdd(comments, c, resultList);
      });
    return resultList;
  }

  private byte[] getFile(MultipartFormDataInput multipart, String field) {
    try {
      Map<String, List<InputPart>> form = multipart.getFormDataMap();
      List<InputPart> inputParts = form.get(field);
      if (inputParts.size() == 0) {
        return null;
      }
      else {
        return IOUtils.toByteArray(inputParts.get(0).getBody(InputStream.class, null));
      }
    }
    catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }
}