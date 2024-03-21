package fi.otavanopisto.muikku.plugins.coursepicker;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.messaging.MessagingWidget;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.EducationTypeMapping;
import fi.otavanopisto.muikku.model.workspace.Mandatority;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.search.UserIndexer;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessenger;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceEntityFileController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceVisitController;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Curriculum;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentState;
import fi.otavanopisto.muikku.schooldata.payload.StudyActivityItemRestModel;
import fi.otavanopisto.muikku.schooldata.payload.StudyActivityItemStatus;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.OrganizationRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.PublicityRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.TemplateRestriction;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.servlet.BaseUrl;
import fi.otavanopisto.muikku.session.CurrentUserSession;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupGuidanceController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityIdFinder;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/coursepicker")
@RequestScoped
@Stateful
@Produces ("application/json")
@RestCatchSchoolDataExceptions
public class CoursePickerRESTService extends PluginRESTService {

  private static final long serialVersionUID = -7027696842893383409L;

  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private LocaleController localeController;

  @Inject
  private CoursePickerController coursePickerController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private WorkspaceVisitController workspaceVisitController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private Mailer mailer;

  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private CourseMetaController courseMetaController;

  @Inject
  private UserIndexer userIndexer;
  
  @Inject
  private WorkspaceUserEntityIdFinder workspaceUserEntityIdFinder;

  @Inject
  private WorkspaceEntityFileController workspaceEntityFileController;
  
  @Inject
  private CurrentUserSession currentUserSession;
  
  @Inject
  private AssessmentRequestController assessmentRequestController;
  
  @Inject
  private OrganizationEntityController organizationEntityController;
  
  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @Inject
  private UserGroupGuidanceController userGroupGuidanceController;
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @Inject
  @Any
  private Instance<MessagingWidget> messagingWidgets;

  @Inject
  @BaseUrl
  private String baseUrl;
  
  @GET
  @Path("/curriculums")
  @RESTPermit (requireLoggedIn = false, handling = Handling.UNSECURED)
  public Response listCurriculums() {
    List<Curriculum> curriculums = coursePickerController.listAvailableCurriculums();
    List<CoursePickerCurriculum> restCurriculums = new ArrayList<CoursePickerCurriculum>();
    
    for (Curriculum curriculum : curriculums) {
      restCurriculums.add(new CoursePickerCurriculum(curriculum.getIdentifier().toId(), curriculum.getName()));
    }

    restCurriculums.sort((CoursePickerCurriculum a, CoursePickerCurriculum b) -> {
      return b.getName().compareTo(a.getName());
    });

    return Response.ok(restCurriculums).build();
  }
  
  @GET
  @Path("/educationTypes")
  @RESTPermit (requireLoggedIn = false, handling = Handling.UNSECURED)
  public Response listEducationTypes() {
    List<EducationType> educationTypes = coursePickerController.listAvailableEducationTypes();
    
    List<fi.otavanopisto.muikku.plugins.workspace.rest.EducationType> restEducationTypes = new ArrayList<>();

    for (EducationType educationType : educationTypes) {
      restEducationTypes.add(new fi.otavanopisto.muikku.plugins.workspace.rest.EducationType(educationType.getIdentifier().toId(), educationType.getName()));
    }
    
    return Response.ok(restEducationTypes).build();
  }

  @GET
  @Path("/organizations")
  @RESTPermit (requireLoggedIn = false, handling = Handling.UNSECURED)
  public Response listOrganizations() {
    // Find the organizations with public workspaces accessible and/or for logged user the own organization workspaces

    List<OrganizationEntity> organizations = coursePickerController.listAccessibleOrganizations();
    
    List<CoursePickerOrganization> restOrganizations = organizations.stream().map(organization -> {
      SchoolDataIdentifier organizationIdentifier = organization.schoolDataIdentifier();
      return new CoursePickerOrganization(organizationIdentifier.toId(), organization.getName());
    }).collect(Collectors.toList());
    
    restOrganizations.sort((CoursePickerOrganization a, CoursePickerOrganization b)-> {
      return a.getName().compareTo(b.getName());
    });
    
    return Response.ok(restOrganizations).build();
  }
  
  @GET
  @Path("/workspaces/")
  @RESTPermitUnimplemented
  public Response listWorkspaces(
        @QueryParam("q") String searchString,
        @QueryParam("subjects") List<String> subjectIds,
        @QueryParam("educationTypes") List<String> educationTypeIds,
        @QueryParam("curriculums") List<String> curriculumIds,
        @QueryParam("organizations") List<String> organizationIds,
        @QueryParam("minVisits") Long minVisits,
        @QueryParam("publicity") @DefaultValue ("ONLY_PUBLISHED") PublicityRestriction publicityRestriction,
        @QueryParam("myWorkspaces") @DefaultValue ("false") Boolean myWorkspaces,
        @QueryParam("templates") @DefaultValue ("ONLY_WORKSPACES") TemplateRestriction templateRestriction,
        @QueryParam("orderBy") List<String> orderBy,
        @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult,
        @QueryParam("maxResults") @DefaultValue ("50") Integer maxResults,
        @Context Request request){
    
    List<CoursePickerWorkspace> workspaces = new ArrayList<>();

    boolean doMinVisitFilter = minVisits != null;
    UserEntity userEntity = myWorkspaces ? sessionController.getLoggedUserEntity() : null;
    List<WorkspaceEntity> workspaceEntities = null;
    List<SchoolDataIdentifier> workspaceIdentifierFilters = null;
    
    if (doMinVisitFilter) {
      if (userEntity != null) {
        workspaceEntities = workspaceVisitController.listWorkspaceEntitiesByMinVisitsOrderByLastVisit(userEntity, minVisits);
      } else {
        workspaceEntities = workspaceVisitController.listWorkspaceEntitiesByMinVisitsOrderByLastVisit(sessionController.getLoggedUserEntity(), minVisits);
      }
    } else {
      if (userEntity != null) {
        workspaceEntities = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(userEntity);
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
          workspaceEntities = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(sessionController.getLoggedUserEntity());
        } else {
          return Response.status(Status.FORBIDDEN).entity("You have no permission to list unpublished workspaces.").build();
        }
      }
    }
    
    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      SearchProvider searchProvider = searchProviderIterator.next();
      SearchResult searchResult = null;
      
      if (workspaceEntities != null) {
        workspaceIdentifierFilters = new ArrayList<>();
        
        for (WorkspaceEntity workspaceEntity : workspaceEntities) {
          workspaceIdentifierFilters.add(workspaceEntity.schoolDataIdentifier());
        }
      }

      List<WorkspaceAccess> accesses = new ArrayList<>(Arrays.asList(WorkspaceAccess.ANYONE));
      if (sessionController.isLoggedIn()) {
        accesses.add(WorkspaceAccess.LOGGED_IN);
        accesses.add(WorkspaceAccess.MEMBERS_ONLY);
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
      
      List<SchoolDataIdentifier> curriculumIdentifiers = null;
      if (curriculumIds != null) {
        curriculumIdentifiers = new ArrayList<>(curriculumIds.size());
        for (String curriculumId : curriculumIds) {
          SchoolDataIdentifier curriculumIdentifier = SchoolDataIdentifier.fromId(curriculumId);
          if (curriculumIdentifier != null) {
            curriculumIdentifiers.add(curriculumIdentifier);
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
      
      final List<SchoolDataIdentifier> organizationIdentifiers = organizationIds != null ? new ArrayList<>(organizationIds.size()) : null;
      if (organizationIds != null) {
        for (String organizationId : organizationIds) {
          SchoolDataIdentifier organizationIdentifier = SchoolDataIdentifier.fromId(organizationId);
          if (organizationIdentifier != null) {
            organizationIdentifiers.add(organizationIdentifier);
          } else {
            return Response.status(Status.BAD_REQUEST).entity(String.format("Malformed organization identifier", organizationId)).build();
          }
        }
      }
      
      List<OrganizationEntity> organizations = coursePickerController.listAccessibleOrganizations();
      organizations.removeIf(organization -> CollectionUtils.isNotEmpty(organizationIdentifiers) && !organizationIdentifiers.contains(organization.schoolDataIdentifier()));
      
      List<OrganizationRestriction> organizationRestrictions = organizationEntityController.listUserOrganizationRestrictions(organizations, publicityRestriction, templateRestriction);

      searchResult = searchProvider.searchWorkspaces()
        .setSubjects(subjects)
        .setWorkspaceIdentifiers(workspaceIdentifierFilters)
        .setEducationTypeIdentifiers(educationTypes)
        .setCurriculumIdentifiers(curriculumIdentifiers)
        .setOrganizationRestrictions(organizationRestrictions)
        .setFreeText(searchString)
        .setAccesses(accesses)
        .setAccessUser(sessionController.getLoggedUser())
        .setFirstResult(firstResult)
        .setMaxResults(maxResults)
        .setSorts(sorts)
        .search();
      
      schoolDataBridgeSessionController.startSystemSession();
      try {
        EducationTypeMapping educationTypeMapping = workspaceEntityController.getEducationTypeMapping();

        List<Map<String, Object>> results = searchResult.getResults();
        for (Map<String, Object> result : results) {
          String searchId = (String) result.get("id");
          if (StringUtils.isNotBlank(searchId)) {
            String[] id = searchId.split("/", 2);
            if (id.length == 2) {
              String dataSource = id[1];
              String identifier = id[0];
  
              SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(identifier, dataSource);
              WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(workspaceIdentifier.getDataSource(), workspaceIdentifier.getIdentifier());
              if (workspaceEntity != null) {

                String name = (String) result.get("name");
                String nameExtension = (String) result.get("nameExtension");
                String description = (String) result.get("description");
                boolean isCourseMember = getIsAlreadyOnWorkspace(workspaceEntity);
                String educationTypeId = (String) result.get("educationTypeIdentifier");
                String educationTypeName = (String) result.get("educationTypeName");
                SchoolDataIdentifier educationSubtypeId = SchoolDataIdentifier.fromId((String) result.get("educationSubtypeIdentifier"));

                @SuppressWarnings("unchecked")
                ArrayList<String> curriculumIdentifiersList = (ArrayList<String>) result.get("curriculumIdentifiers");
  
                Mandatority mandatority = null;

                if (StringUtils.isNotBlank(educationTypeId)) {
                  
                  if (educationSubtypeId != null) {                    
                    if (educationTypeMapping != null) {
                      mandatority = educationTypeMapping.getMandatority(educationSubtypeId);
                    }
                  }
                }
                if (StringUtils.isNotBlank(name)) {
                  workspaces.add(createRestModel(workspaceEntity, name, nameExtension, description, educationTypeName, mandatority, isCourseMember, curriculumIdentifiersList));
                } else {
                  logger.severe(String.format("Search index contains workspace %s that does not have a name", workspaceIdentifier));
                }
              } else {
                logger.severe(String.format("Search index contains workspace %s that does not exists on the school data system", workspaceIdentifier));
              }
            }
          }
        }
      } finally {
        schoolDataBridgeSessionController.endSystemSession();
      }
    } else {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }

    if (workspaces.isEmpty()) {
      return Response.ok(workspaces).build();
    }
    
    if (orderBy.contains("lastVisit")) {
      Collections.sort(workspaces, new Comparator<CoursePickerWorkspace>() {
        @Override
        public int compare(CoursePickerWorkspace workspace1, CoursePickerWorkspace workspace2) {
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
  public Response getWorkspace(@PathParam("ID") Long workspaceEntityId){
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
    boolean isCourseMember = getIsAlreadyOnWorkspace(workspaceEntity);
    String educationTypeName = null;
    Mandatority mandatority = null;
    
    if (workspace.getWorkspaceTypeId() != null) {
      EducationType educationType = courseMetaController.findEducationType(workspace.getWorkspaceTypeId());
      if (educationType != null) {
        educationTypeName = educationType.getName();    
      }
    }
    SchoolDataIdentifier educationSubtypeId = workspace.getEducationSubtypeIdentifier();
    
    if (educationSubtypeId != null) {
      EducationTypeMapping educationTypeMapping = workspaceEntityController.getEducationTypeMapping();
      
      if (educationTypeMapping != null) {
        mandatority = educationTypeMapping.getMandatority(educationSubtypeId);
      }
    }
    
    List<String> curriculumIdentifiersList = new ArrayList<>();
    
    for (SchoolDataIdentifier curriculumIdentifier : workspace.getCurriculumIdentifiers()) {
      curriculumIdentifiersList.add(curriculumIdentifier.toId());
    }
    return Response.ok(createRestModel(workspaceEntity, workspace.getName(), workspace.getNameExtension(), workspace.getDescription(), educationTypeName, mandatority, isCourseMember, curriculumIdentifiersList)).build();
  }
  
  @GET
  @Path("/workspaces/{ID}/canSignup")
  @RESTPermit (handling = Handling.INLINE)
  public Response getCanSignup(@PathParam("ID") Long workspaceEntityId) {
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    boolean canSignup = getCanSignup(workspaceEntity);
    
    if (canSignup) {
      canSignup = !getIsAlreadyEvaluated(workspaceEntity);
    }
    
    // #5950: If both student and workspace have curriculum(s), they have to match
    
    if (canSignup) {
      Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
      if (searchProviderIterator.hasNext()) {
        SearchProvider searchProvider = searchProviderIterator.next();
        SearchResult searchResult = searchProvider.findUser(sessionController.getLoggedUser(), false);
        if (searchResult.getTotalHitCount() > 0) {
          Map<String, Object> result = searchResult.getResults().get(0);
          String studentCurriculum = (String) result.get("curriculumIdentifier");
          if (!StringUtils.isEmpty(studentCurriculum)) {
            searchResult = searchProvider.findWorkspace(workspaceEntity.schoolDataIdentifier());
            if (searchResult.getTotalHitCount() > 0) {
              result = searchResult.getResults().get(0);
              @SuppressWarnings("unchecked")
              List<String> workspaceCurriculums = (List<String>) result.get("curriculumIdentifiers");
              if (workspaceCurriculums != null && workspaceCurriculums.size() > 0) {
                canSignup = workspaceCurriculums.contains(studentCurriculum);
              }
            }
          }
        }
      }
    }
    
    return Response.ok(canSignup).build();
  }
  
  @POST
  @Path("/workspaces/{ID}/signup")
  @RESTPermit (handling = Handling.INLINE)
  public Response createWorkspaceUser(@PathParam("ID") Long workspaceEntityId, 
      fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceUserSignup entity) {

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (!workspaceEntityController.canSignup(sessionController.getLoggedUser(), workspaceEntity)) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    SchoolDataIdentifier workspaceIdentifier = workspaceEntity.schoolDataIdentifier();
    SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();

    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifierIncludeArchived(workspaceEntity, userIdentifier);
    if (workspaceUserEntity != null && Boolean.TRUE.equals(workspaceUserEntity.getArchived())) {
      workspaceUserEntityController.unarchiveWorkspaceUserEntity(workspaceUserEntity);
    }
    if (workspaceUserEntity != null && Boolean.FALSE.equals(workspaceUserEntity.getActive())) {
      workspaceUserEntityController.updateActive(workspaceUserEntity, Boolean.TRUE);
      userIndexer.indexUser(workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity());
    }
    
    fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser workspaceUser = workspaceController.findWorkspaceUserByWorkspaceAndUser(workspaceIdentifier, userIdentifier);
    if (workspaceUser == null) {
      workspaceUser = workspaceController.createWorkspaceUser(workspaceIdentifier, userIdentifier, WorkspaceRoleArchetype.STUDENT);
      waitForWorkspaceUserEntity(workspaceEntity, userIdentifier);
    }
    else {
      workspaceController.updateWorkspaceStudentActivity(workspaceUser, true);
    }
    
    // TODO: should this work based on permission? Permission -> Roles -> Recipients
    // TODO: Messaging should be moved into a CDI event listener

    List<WorkspaceUserEntity> workspaceTeachers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
    List<UserEntity> teachers = new ArrayList<UserEntity>();

    String workspaceName = workspaceEntityController.getName(workspaceEntity).getDisplayName();
    String userName = userEntityController.getName(sessionController.getLoggedUserEntity(), true).getDisplayNameWithLine();

    for (WorkspaceUserEntity workspaceTeacher : workspaceTeachers) {
      teachers.add(workspaceTeacher.getUserSchoolDataIdentifier().getUserEntity());
    }

    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);
    
    workspaceController.createWorkspaceUserSignup(workspaceEntity, userSchoolDataIdentifier.getUserEntity(), new Date(), entity.getMessage());

    String caption = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.caption");
    caption = MessageFormat.format(caption, userName, workspaceName);

    String workspaceLink = String.format("<a href=\"%s/workspace/%s\" >%s</a>", baseUrl, workspaceEntity.getUrlName(), workspaceName);
    
    String studentLink = String.format("<a href=\"%s/guider#?c=%s\" >%s</a>", baseUrl, userIdentifier.toId(), userName);
    String content;
    if (StringUtils.isEmpty(entity.getMessage())) {
      content = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.content");
      content = MessageFormat.format(content, studentLink, workspaceLink);
    }
    else {
      content = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.contentwmessage");
      String blockquoteMessage = String.format("<blockquote>%s</blockquote>", entity.getMessage());
      content = MessageFormat.format(content, studentLink, workspaceLink, blockquoteMessage);
    }

    for (MessagingWidget messagingWidget : messagingWidgets) {
      // TODO: Category?
      messagingWidget.postMessage(userSchoolDataIdentifier.getUserEntity(), "message", caption, content, teachers);
    }

    List<String> teacherEmails = new ArrayList<>(teachers.size());
    for (UserEntity teacher : teachers){
     String teacherEmail = userEmailEntityController.getUserDefaultEmailAddress(teacher, false);
     if (StringUtils.isNotBlank(teacherEmail)) {
       teacherEmails.add(teacherEmail);
     }
    }
    if (!teacherEmails.isEmpty()) {
      mailer.sendMail(MailType.HTML, teacherEmails, caption, content);
    }
    List<StudyActivityItemRestModel> restItems = new ArrayList<StudyActivityItemRestModel>();
    
    SearchProvider searchProvider = getProvider("elastic-search");
    if (searchProvider != null) {
      SearchResult searchResult =  searchProvider.findWorkspace(workspaceIdentifier);
      
      if (searchResult.getTotalHitCount() > 0) {
        List<Map<String, Object>> results = searchResult.getResults();
        Map<String, Object> match = results.get(0);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> subjectList = (List<Map<String, Object>>) match.get("subjects");
        for (Map<String, Object> s : subjectList) {
          StudyActivityItemRestModel item = new StudyActivityItemRestModel();

          item.setCourseName(workspaceName);
          item.setCourseId(workspaceEntity.getId());
          item.setCourseNumber((Integer) s.get("courseNumber"));
          item.setSubject((String) s.get("subjectCode"));
          item.setStatus(StudyActivityItemStatus.ONGOING);
          item.setSubjectName((String) s.get("subjectName"));
          item.setDate(new Date());
          
          restItems.add(item);
        }
        
        // Websocket recipients 
        
        List<UserEntity> recipients = userGroupGuidanceController.getGuidanceCounselors(userIdentifier, false);

        recipients.add(userSchoolDataIdentifier.getUserEntity());
        
        webSocketMessenger.sendMessage("hops:workspace-signup", restItems, recipients);

      }}
    return Response.noContent().build();
  }
  
  private SearchProvider getProvider(String name) {
    Iterator<SearchProvider> i = searchProviders.iterator();
    while (i.hasNext()) {
      SearchProvider provider = i.next();
      if (name.equals(provider.getName())) {
        return provider;
      }
    }
    return null;
  }

  private boolean getIsAlreadyOnWorkspace(WorkspaceEntity workspaceEntity) {
    return sessionController.isLoggedIn() ? workspaceUserEntityController.isWorkspaceMember(sessionController.getLoggedUser(), workspaceEntity) : false;
  }
  
  private boolean getCanSignup(WorkspaceEntity workspaceEntity) {
    if (sessionController.isLoggedIn() && currentUserSession.isActive()) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());
      return workspaceUserEntity == null && workspaceEntityController.canSignup(sessionController.getLoggedUser(), workspaceEntity);
    }
    else {
      return false;
    }
  }
  
  private boolean getIsAlreadyEvaluated(WorkspaceEntity workspaceEntity) {
    Boolean isEvaluated = false;
    if (sessionController.isLoggedIn()) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUserEntity().defaultSchoolDataIdentifier());
      if (workspaceUserEntity != null) {
        WorkspaceRoleEntity workspaceRoleEntity = workspaceUserEntity.getWorkspaceUserRole();
        WorkspaceRoleArchetype archetype = workspaceRoleEntity.getArchetype();
        if (archetype.equals(WorkspaceRoleArchetype.STUDENT)) {
          List<WorkspaceAssessmentState> assessmentStates = assessmentRequestController.getAllWorkspaceAssessmentStates(workspaceUserEntity);
          for (WorkspaceAssessmentState assessmentState : assessmentStates) {
            if (assessmentState.getState() == WorkspaceAssessmentState.PASS || assessmentState.getState() == WorkspaceAssessmentState.FAIL) {
              isEvaluated = true;
              break;
            }
          }
        }  
      }
    }
    return isEvaluated;
  }
  
  private CoursePickerWorkspace createRestModel(WorkspaceEntity workspaceEntity, String name, String nameExtension, String description, String educationTypeName, Mandatority mandatority, Boolean isCourseMember, List<String> curriculumIdentifiers) {
    Long numVisits = workspaceVisitController.getNumVisits(workspaceEntity);
    Date lastVisit = workspaceVisitController.getLastVisit(workspaceEntity);
    boolean hasCustomImage = workspaceEntityFileController.getHasCustomImage(workspaceEntity);
    OrganizationRESTModel organization = null;
    if (workspaceEntity.getOrganizationEntity() != null) {
      OrganizationEntity organizationEntity = workspaceEntity.getOrganizationEntity();
      organization = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
    }
    return new CoursePickerWorkspace(
        workspaceEntity.getId(), 
        workspaceEntity.getUrlName(),
        workspaceEntity.getArchived(), 
        workspaceEntity.getPublished(), 
        name, 
        nameExtension,
        description, numVisits, 
        lastVisit, 
        educationTypeName,
        mandatority,
        isCourseMember,
        hasCustomImage, 
        organization, 
        curriculumIdentifiers);
  }
  
  private void waitForWorkspaceUserEntity(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    Long workspaceUserEntityId = null;
    long timeoutTime = System.currentTimeMillis() + 10000;    
    while (workspaceUserEntityId == null) {
      workspaceUserEntityId = workspaceUserEntityIdFinder.findWorkspaceUserEntityId(workspaceEntity, userIdentifier);
      if (workspaceUserEntityId != null || System.currentTimeMillis() > timeoutTime) {
        break;
      }
      try {
        Thread.sleep(100);
      }
      catch (InterruptedException e) {
      }
    }
  }

}
