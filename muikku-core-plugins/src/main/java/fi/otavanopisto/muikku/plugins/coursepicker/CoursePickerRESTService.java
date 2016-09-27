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

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.messaging.MessagingWidget;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceVisitController;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.RoleController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Curriculum;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.Role;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.servlet.BaseUrl;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
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
  private WorkspaceController workspaceController;
  
  @Inject
  private UserController userController;

  @Inject
  private RoleController roleController;
  
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
    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<Curriculum> curriculums = courseMetaController.listCurriculums();
      List<CoursePickerCurriculum> restCurriculums = new ArrayList<CoursePickerCurriculum>();
      
      for (Curriculum curriculum : curriculums)
        restCurriculums.add(new CoursePickerCurriculum(curriculum.getIdentifier().toId(), curriculum.getName()));
      
      return Response.ok(restCurriculums).build();
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  @GET
  @Path("/workspaces/")
  @RESTPermitUnimplemented
  public Response listWorkspaces(
        @QueryParam("search") String searchString,
        @QueryParam("subjects") List<String> subjects,
        @QueryParam("educationTypes") List<String> educationTypeIds,
        @QueryParam("curriculums") List<String> curriculumIds,
        @QueryParam("minVisits") Long minVisits,
        @QueryParam("includeUnpublished") @DefaultValue ("false") Boolean includeUnpublished,
        @QueryParam("myWorkspaces") @DefaultValue ("false") Boolean myWorkspaces,
        @QueryParam("orderBy") List<String> orderBy,
        @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult,
        @QueryParam("maxResults") @DefaultValue ("50") Integer maxResults,
        @Context Request request) {
    
    List<CoursePickerWorkspace> workspaces = new ArrayList<>();

    boolean doMinVisitFilter = minVisits != null;
    UserEntity userEntity = myWorkspaces ? sessionController.getLoggedUserEntity() : null;
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
      
      searchResult = searchProvider.searchWorkspaces(schoolDataSourceFilter, subjects, workspaceIdentifierFilters, educationTypes,
          curriculumIdentifiers, searchString, accesses, sessionController.getLoggedUser(), includeUnpublished, firstResult, maxResults, sorts);
      
      schoolDataBridgeSessionController.startSystemSession();
      try {
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
                boolean canSignup = getCanSignup(workspaceEntity);
                boolean isCourseMember = getIsAlreadyOnWorkspace(workspaceEntity);
                String educationTypeId = (String) result.get("educationTypeIdentifier");
                String educationTypeName = null;
                
                if (StringUtils.isNotBlank(educationTypeId)) {
                  EducationType educationType = null;
                  SchoolDataIdentifier educationTypeIdentifier = SchoolDataIdentifier.fromId(educationTypeId);
                  if (educationTypeIdentifier == null) {
                    logger.severe(String.format("Malformatted educationTypeIdentifier %s", educationTypeId));
                  } else {
                    educationType = courseMetaController.findEducationType(educationTypeIdentifier.getDataSource(), educationTypeIdentifier.getIdentifier());
                  }
                  
                  if (educationType != null) {
                    educationTypeName = educationType.getName();
                  }
                }
  
                if (StringUtils.isNotBlank(name)) {
                  workspaces.add(createRestModel(workspaceEntity, name, nameExtension, description, educationTypeName, canSignup, isCourseMember));
                } else {
                  logger.severe(String.format("Search index contains workspace %s that does not have a name", workspaceIdentifier));
                }
              } else {
                logger.severe(String.format("Search index contains workspace %s that does not exits on the school data system", workspaceIdentifier));
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
      return Response.noContent().build();
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

    boolean canSignup = getCanSignup(workspaceEntity);
    boolean isCourseMember = getIsAlreadyOnWorkspace(workspaceEntity);
    String educationTypeName = null;
    
    if (workspace.getWorkspaceTypeId() != null) {
      EducationType educationType = courseMetaController.findEducationType(workspace.getWorkspaceTypeId());
      if (educationType != null) {
        educationTypeName = educationType.getName();
      }
    }
    
    return Response.ok(createRestModel(workspaceEntity, workspace.getName(), workspace.getNameExtension(), workspace.getDescription(), educationTypeName, canSignup, isCourseMember)).build();
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

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.WORKSPACE_SIGNUP, workspaceEntity)) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    User user = userController.findUserByDataSourceAndIdentifier(sessionController.getLoggedUserSchoolDataSource(),
        sessionController.getLoggedUserIdentifier());

    Long workspaceStudentRoleId = getWorkspaceStudentRoleId();
    
    WorkspaceRoleEntity workspaceRole = roleController.findWorkspaceRoleEntityById(workspaceStudentRoleId);
    if (workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser()) != null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    
    Role role = roleController.findRoleByDataSourceAndRoleEntity(user.getSchoolDataSource(), workspaceRole);
    
    
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspace.getIdentifier(), workspace.getSchoolDataSource());
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(user.getIdentifier(), user.getSchoolDataSource());

    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifierIncludeArchived(workspaceEntity, userIdentifier);
    if (workspaceUserEntity != null && Boolean.TRUE.equals(workspaceUserEntity.getArchived())) {
      workspaceUserEntityController.unarchiveWorkspaceUserEntity(workspaceUserEntity);
    }
    
    fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser workspaceUser = workspaceController.findWorkspaceUserByWorkspaceAndUser(workspaceIdentifier, userIdentifier);
    if (workspaceUser == null) {
      workspaceUser = workspaceController.createWorkspaceUser(workspace, user, role);
    }
    else {
      workspaceController.updateWorkspaceStudentActivity(workspaceUser, true);
    }
    
    // TODO: should this work based on permission? Permission -> Roles -> Recipients
    // TODO: Messaging should be moved into a CDI event listener

    List<WorkspaceUserEntity> workspaceTeachers = workspaceUserEntityController.listWorkspaceUserEntitiesByRoleArchetype(workspaceEntity,
        WorkspaceRoleArchetype.TEACHER);
    List<UserEntity> teachers = new ArrayList<UserEntity>();

    String workspaceName = workspace.getName();
    if (!StringUtils.isBlank(workspace.getNameExtension())) {
      workspaceName += String.format(" (%s)", workspace.getNameExtension()); 
    }

    String userName = user.getDisplayName();

    for (WorkspaceUserEntity workspaceTeacher : workspaceTeachers) {
      teachers.add(workspaceTeacher.getUserSchoolDataIdentifier().getUserEntity());
    }

    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);
    
    workspaceController.createWorkspaceUserSignup(workspaceEntity, userSchoolDataIdentifier.getUserEntity(), new Date(), entity.getMessage());

    String caption = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.caption");
    caption = MessageFormat.format(caption, workspaceName);

    String workspaceLink = String.format("<a href=\"%s/workspace/%s\" >%s</a>", baseUrl, workspaceEntity.getUrlName(), workspaceName);
    
    SchoolDataIdentifier studentIdentifier = new SchoolDataIdentifier(user.getIdentifier(), user.getSchoolDataSource());
    
    String studentLink = String.format("<a href=\"%s/guider#userprofile/%s\" >%s</a>", baseUrl, studentIdentifier.toId(), userName);
    String content;
    if (StringUtils.isEmpty(entity.getMessage())) {
      content = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.content");
      content = MessageFormat.format(content, studentLink, workspaceLink);
    } else {
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
    
    return Response.noContent().build();
  }

  private boolean getIsAlreadyOnWorkspace(WorkspaceEntity workspaceEntity) {
    if (sessionController.isLoggedIn()) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());

      return workspaceUserEntity != null;
    } else
      return false;
  }
  
  private boolean getCanSignup(WorkspaceEntity workspaceEntity) {
    if (sessionController.isLoggedIn()) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());

      return
          workspaceUserEntity == null &&
          sessionController.hasCoursePermission(MuikkuPermissions.WORKSPACE_SIGNUP, workspaceEntity);
    } else
      return false;
  }
  
  private Long getWorkspaceStudentRoleId() {
    List<WorkspaceRoleEntity> workspaceStudentRoles = roleController.listWorkspaceRoleEntitiesByArchetype(WorkspaceRoleArchetype.STUDENT);
    if (workspaceStudentRoles.size() == 1) {
      return workspaceStudentRoles.get(0).getId();
    } else {
      // TODO: How to choose correct workspace student role?
      throw new RuntimeException("Multiple workspace student roles found.");
    }
  }
  
  private CoursePickerWorkspace createRestModel(WorkspaceEntity workspaceEntity, String name, String nameExtension, String description, String educationTypeName, boolean canSignup, boolean isCourseMember) {
    Long numVisits = workspaceVisitController.getNumVisits(workspaceEntity);
    Date lastVisit = workspaceVisitController.getLastVisit(workspaceEntity);
    return new CoursePickerWorkspace(
        workspaceEntity.getId(), 
        workspaceEntity.getUrlName(),
        workspaceEntity.getArchived(), 
        workspaceEntity.getPublished(), 
        name, 
        nameExtension, 
        description, 
        numVisits, 
        lastVisit, 
        educationTypeName,
        canSignup, 
        isCourseMember);
  }
  
}
