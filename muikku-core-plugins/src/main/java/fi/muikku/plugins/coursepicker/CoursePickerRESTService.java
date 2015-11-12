package fi.muikku.plugins.coursepicker;

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

import fi.muikku.controller.messaging.MessagingWidget;
import fi.muikku.i18n.LocaleController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.workspace.WorkspaceVisitController;
import fi.muikku.plugins.workspace.rest.model.WorkspaceUser;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.schooldata.RoleController;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.events.SchoolDataWorkspaceUserDiscoveredEvent;
import fi.muikku.search.SearchProvider;
import fi.muikku.search.SearchResult;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEmailEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/coursepicker")
@RequestScoped
@Stateful
@Produces ("application/json")
public class CoursePickerRESTService extends PluginRESTService {

  private static final long serialVersionUID = -7027696842893383409L;

  @Inject
  private SessionController sessionController;

  @Inject
  private LocaleController localeController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private UserController userController;

  @Inject
  private UserEmailEntityController userEmailEntityController;

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
  private Event<SchoolDataWorkspaceUserDiscoveredEvent> schoolDataWorkspaceUserDiscoveredEvent;
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @Inject
  @Any
  private Instance<MessagingWidget> messagingWidgets;

  @GET
  @Path("/workspaces/")
  @RESTPermitUnimplemented
  public Response listWorkspaces(
        @QueryParam("search") String searchString,
        @QueryParam("subjects") List<String> subjects,
        @QueryParam("minVisits") Long minVisits,
        @QueryParam("includeUnpublished") @DefaultValue ("false") Boolean includeUnpublished,
        @QueryParam("myWorkspaces") @DefaultValue ("false") Boolean myWorkspaces,
        @QueryParam("orderBy") List<String> orderBy,
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
              boolean canSignup = getCanSignup(workspaceEntity);
              boolean isCourseMember = getIsAlreadyOnWorkspace(workspaceEntity);
              
              if (StringUtils.isNotBlank(name)) {
                workspaces.add(createRestModel(workspaceEntity, name, description, canSignup, isCourseMember));
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

    return Response.ok(createRestModel(workspaceEntity, workspace.getName(), workspace.getDescription(), canSignup, isCourseMember)).build();
  }
  
  @POST
  @Path("/workspaces/{ID}/signup")
  @RESTPermit (handling = Handling.INLINE)
  public Response createWorkspaceUser(@PathParam("ID") Long workspaceEntityId, 
      fi.muikku.plugins.workspace.rest.model.WorkspaceUserSignup entity) {

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (!sessionController.hasCoursePermission(MuikkuPermissions.WORKSPACE_SIGNUP, workspaceEntity)) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    User user = userController.findUserByDataSourceAndIdentifier(sessionController.getLoggedUserSchoolDataSource(),
        sessionController.getLoggedUserIdentifier());

    Long workspaceStudentRoleId = getWorkspaceStudentRoleId();
    
    WorkspaceRoleEntity workspaceRole = roleController.findWorkspaceRoleEntityById(workspaceStudentRoleId);
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
    String userEmail = userEmailEntityController.getUserEmailAddress(userIdentifier.getUserEntity(), true);

    for (WorkspaceUserEntity cu : workspaceTeachers) {
      teachers.add(cu.getUserSchoolDataIdentifier().getUserEntity());
    }
    
    WorkspaceUser result = new fi.muikku.plugins.workspace.rest.model.WorkspaceUser(discoverEvent.getDiscoveredWorkspaceUserEntityId(),
        workspaceEntityId,
        userIdentifier.getUserEntity().getId(),
        workspaceStudentRoleId,
        user.getFirstName(),
        user.getLastName(),
        userEmail);

    workspaceController.createWorkspaceUserSignup(
        workspaceEntity, userIdentifier.getUserEntity(), new Date(), entity.getMessage());

    String caption = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.caption");
    caption = MessageFormat.format(caption, workspaceName);

    String content;
    if (StringUtils.isEmpty(entity.getMessage())) {
      content = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.content");
      content = MessageFormat.format(content, userName, workspaceName);
    } else {
      content = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.contentwmessage");
      content = MessageFormat.format(content, userName, workspaceName, entity.getMessage());
    }

    for (MessagingWidget messagingWidget : messagingWidgets) {
      // TODO: Category?
      messagingWidget.postMessage(userIdentifier.getUserEntity(), "message", caption, content, teachers);
    }

    return Response.ok(result).build();
  }

  private boolean getIsAlreadyOnWorkspace(WorkspaceEntity workspaceEntity) {
    if (sessionController.isLoggedIn()) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserEntity(workspaceEntity, sessionController.getLoggedUserEntity());

      return workspaceUserEntity != null;
    } else
      return false;
  }
  
  private boolean getCanSignup(WorkspaceEntity workspaceEntity) {
    if (sessionController.isLoggedIn()) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserEntity(workspaceEntity, sessionController.getLoggedUserEntity());

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
  
  private CoursePickerWorkspace createRestModel(WorkspaceEntity workspaceEntity, String name, String description, boolean canSignup, boolean isCourseMember) {
    Long numVisits = workspaceVisitController.getNumVisits(workspaceEntity);
    Date lastVisit = workspaceVisitController.getLastVisit(workspaceEntity);
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    return new CoursePickerWorkspace(workspaceEntity.getId(), workspaceEntity.getUrlName(),
        workspaceEntity.getArchived(), workspaceEntity.getPublished(), name, workspace.getNameExtension(), description, numVisits, lastVisit, canSignup, isCourseMember);
  }
  
}
