package fi.otavanopisto.muikku.plugins.guider;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
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

import org.apache.commons.lang3.StringUtils;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.collections.CollectionUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.Flag;
import fi.otavanopisto.muikku.model.users.FlagStudent;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.assessmentrequest.WorkspaceAssessmentState;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.AssesmentRequestNotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.NoPassedCoursesNotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.StudyTimeLeftNotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.AssesmentRequestNotification;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.NoPassedCoursesNotification;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.StudyTimeNotification;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsFileController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;
import fi.otavanopisto.muikku.rest.model.Student;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceActivity;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.security.RoleFeatures;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.FlagController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/guider")
@RestCatchSchoolDataExceptions
public class GuiderRESTService extends PluginRESTService {

  private static final long serialVersionUID = -5286350366083446537L;

  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private GuiderController guiderController;

  @Inject
  private EvaluationController evaluationController;
  
  @Inject
  private AssessmentRequestController assessmentRequestController;
  
  @Inject
  private TranscriptOfRecordsFileController torFileController;
  
  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private NoPassedCoursesNotificationController noPassedCoursesNotificationController;

  @Inject
  private StudyTimeLeftNotificationController studyTimeLeftNotificationController;

  @Inject
  private AssesmentRequestNotificationController assessmentRequestNotificationController;

  @Inject
  private FlagController flagController;
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/activity")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspaceAssessmentsStudyProgressAnalysis(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();
    if (userIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid userIdentifier").build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceEntity not found").build();
    }
    
    GuiderStudentWorkspaceActivity activity = guiderController.getStudentWorkspaceActivity(workspaceEntity, userIdentifier);
    if (activity == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Failed to analyze assignments progress for student %s in workspace %d", userIdentifier, workspaceEntity.getId())).build();
    }
    
    WorkspaceAssessmentState assessmentState = new WorkspaceAssessmentState(WorkspaceAssessmentState.UNASSESSED);
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifier(workspaceEntity, userIdentifier);
    if (workspaceUserEntity != null && workspaceUserEntity.getWorkspaceUserRole().getArchetype() == WorkspaceRoleArchetype.STUDENT) {
      assessmentState = assessmentRequestController.getWorkspaceAssessmentState(workspaceUserEntity);
    }
    
    return Response.ok(toRestModel(activity, assessmentState)).build();
  }
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/studentactivity/{USERIDENTIFIER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspaceAssessmentsStudyProgressAnalysis(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERIDENTIFIER") String userId) {
    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(userId);
    if (userIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid userIdentifier").build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceEntity not found").build();
    }
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifier(workspaceEntity, userIdentifier);
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceUserEntity not found").build();
    }
    
    if (!sessionController.hasWorkspacePermission(GuiderPermissions.GUIDER_FIND_STUDENT_WORKSPACE_ACTIVITY, workspaceEntity)) {
      if (!sessionController.getLoggedUserEntity().getId().equals(workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity().getId())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    GuiderStudentWorkspaceActivity activity = guiderController.getStudentWorkspaceActivity(workspaceEntity, userIdentifier);
    if (activity == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Failed to analyze assignments progress for student %s in workspace %d", userIdentifier, workspaceEntity.getId())).build();
    }
    
    WorkspaceAssessmentState assessmentState = assessmentRequestController.getWorkspaceAssessmentState(workspaceUserEntity);
    
    return Response.ok(toRestModel(activity, assessmentState)).build();
  }
  
  @GET
  @Path("/students")
  @RESTPermit (handling = Handling.INLINE)
  public Response searchStudents(
      @QueryParam("q") String searchString,
      @QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue("10") Integer maxResults,
      @QueryParam("userGroupIds") List<Long> userGroupIds,
      @QueryParam("myUserGroups") Boolean myUserGroups,
      @QueryParam("workspaceIds") List<Long> workspaceIds,
      @QueryParam("myWorkspaces") Boolean myWorkspaces,
      @QueryParam("userEntityId") Long userEntityId,
      @DefaultValue ("false") @QueryParam("includeInactiveStudents") Boolean includeInactiveStudents,
      @QueryParam("flags") Long[] flagIds,
      @QueryParam("flagOwnerIdentifier") String flagOwnerId) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(GuiderPermissions.GUIDER_VIEW)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (CollectionUtils.isNotEmpty(userGroupIds) && Boolean.TRUE.equals(myUserGroups)) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (CollectionUtils.isNotEmpty(workspaceIds) && Boolean.TRUE.equals(myWorkspaces)) {
      return Response.status(Status.BAD_REQUEST).build();
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
    
    List<fi.otavanopisto.muikku.rest.model.Student> students = new ArrayList<>();

    UserEntity loggedUser = sessionController.getLoggedUserEntity();
    
    Set<Long> userGroupFilters = null;
    Set<Long> workspaceFilters = null;

    if (!sessionController.hasEnvironmentPermission(RoleFeatures.ACCESS_ONLY_GROUP_STUDENTS)) {
      if ((myUserGroups != null) && myUserGroups) {
        userGroupFilters = new HashSet<Long>();
  
        // Groups where user is a member
        
        List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUserIdentifier(sessionController.getLoggedUser());
        for (UserGroupEntity userGroup : userGroups) {
          userGroupFilters.add(userGroup.getId());
        }
      } else if (!CollectionUtils.isEmpty(userGroupIds)) {
        userGroupFilters = new HashSet<Long>();
        
        // Defined user groups
        userGroupFilters.addAll(userGroupIds);
      }
    } else {
      // User can only list users from his/her own user groups
      userGroupFilters = new HashSet<Long>();

      // Groups where user is a member and the ids of the groups
      List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUserIdentifier(sessionController.getLoggedUser());
      Set<Long> accessibleUserGroupEntityIds = userGroups.stream().map(UserGroupEntity::getId).collect(Collectors.toSet());
      
      if (CollectionUtils.isNotEmpty(userGroupIds)) {
        // if there are specified user groups, they need to be subset of the groups that the user can access
        if (!CollectionUtils.isSubCollection(userGroupIds, accessibleUserGroupEntityIds))
          return Response.status(Status.BAD_REQUEST).build();
        
        userGroupFilters.addAll(userGroupIds);
      } else {
        userGroupFilters.addAll(accessibleUserGroupEntityIds);
      }
    }
    
    List<SchoolDataIdentifier> userIdentifiers = null;    
    if (flags != null) {
      if (userIdentifiers == null) {
        userIdentifiers = new ArrayList<>();
      }
      
      userIdentifiers.addAll(flagController.getFlaggedStudents(flags));
    }
    if (Boolean.TRUE.equals(includeInactiveStudents)) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_INACTIVE_STUDENTS)) {
        if (userEntityId == null) {
          return Response.status(Status.FORBIDDEN).build();
        } else {
          if (!sessionController.getLoggedUserEntity().getId().equals(userEntityId)) {
            return Response.status(Status.FORBIDDEN).build();
          }
        }
      }
    } 
    
    if (userEntityId != null) {
      List<SchoolDataIdentifier> userEntityIdentifiers = new ArrayList<>();
       
      UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
      if (userEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid userEntityId %d", userEntityId)).build();
      }
      
      List<UserSchoolDataIdentifier> schoolDataIdentifiers = userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(userEntity);
      for (UserSchoolDataIdentifier schoolDataIdentifier : schoolDataIdentifiers) {
        userEntityIdentifiers.add(schoolDataIdentifier.schoolDataIdentifier());
      }
      
      if (userIdentifiers == null) {
        userIdentifiers = userEntityIdentifiers;
      } else {
        userIdentifiers.retainAll(userEntityIdentifiers);
      }
    }
    
    // #4585: By default, teachers should only see their own students
    if (CollectionUtils.isEmpty(workspaceIds) && !Boolean.TRUE.equals(myWorkspaces)) {
      EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(sessionController.getLoggedUser());
      if (roleEntity != null && roleEntity.getArchetype() == EnvironmentRoleArchetype.TEACHER) {
        myWorkspaces = true;
      }
    }
    
    if ((myWorkspaces != null) && myWorkspaces) {
      // Workspaces where user is a member
      List<WorkspaceEntity> workspaces = workspaceUserEntityController.listWorkspaceEntitiesByUserEntity(loggedUser);
      Set<Long> myWorkspaceIds = new HashSet<Long>();
      for (WorkspaceEntity ws : workspaces)
        myWorkspaceIds.add(ws.getId());

      workspaceFilters = new HashSet<>(myWorkspaceIds);
    } else if (!CollectionUtils.isEmpty(workspaceIds)) {
      // Defined workspaces
      workspaceFilters = new HashSet<>(workspaceIds);
    }

    SearchProvider elasticSearchProvider = getProvider("elastic-search");
    if (elasticSearchProvider != null) {
      String[] fields = new String[] { "firstName", "lastName", "nickName", "email" };

      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
      OrganizationEntity organization = userSchoolDataIdentifier.getOrganization();
      
      SearchResult result = elasticSearchProvider.searchUsers(Arrays.asList(organization), searchString, fields, Arrays.asList(EnvironmentRoleArchetype.STUDENT), 
          userGroupFilters, workspaceFilters, userIdentifiers, includeInactiveStudents, true, false, firstResult, maxResults);
      
      List<Map<String, Object>> results = result.getResults();

      if (results != null && !results.isEmpty()) {
        boolean getFlagsFromStudents = !StringUtils.isBlank(flagOwnerId);
        SchoolDataIdentifier ownerIdentifier = null;
        if (getFlagsFromStudents) {
          ownerIdentifier = SchoolDataIdentifier.fromId(flagOwnerId);
          if (ownerIdentifier == null) {
            return Response.status(Status.BAD_REQUEST).entity("flagOwnerIdentifier is malformed").build();
          }
          if (!ownerIdentifier.equals(sessionController.getLoggedUser())) {
            return Response.status(Status.FORBIDDEN).build();
          }
        }
        
        for (Map<String, Object> o : results) {
          String studentId = (String) o.get("id");
          if (StringUtils.isBlank(studentId)) {
            logger.severe("Could not process user found from search index because it had a null id");
            continue;
          }
          
          String[] studentIdParts = studentId.split("/", 2);
          SchoolDataIdentifier studentIdentifier = studentIdParts.length == 2 ? new SchoolDataIdentifier(studentIdParts[0], studentIdParts[1]) : null;
          if (studentIdentifier == null) {
            logger.severe(String.format("Could not process user found from search index with id %s", studentId));
            continue;
          }
          
          UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
          if (userEntity == null) {
            logger.severe(String.format("Student %s in search index not found in Muikku", studentIdentifier));
            continue;
          }
          String emailAddress = "";
          User student = userController.findUserByIdentifier(studentIdentifier);
          if (!Boolean.TRUE.equals(student.getHidden())) {
            emailAddress = userEmailEntityController.getUserDefaultEmailAddress(userEntity, true);
          }
          Date studyStartDate = getDateResult(o.get("studyStartDate"));
          Date studyEndDate = getDateResult(o.get("studyEndDate"));
          Date studyTimeEnd = getDateResult(o.get("studyTimeEnd"));
          
          List<FlagStudent> studentFlags = null;
          List<fi.otavanopisto.muikku.rest.model.StudentFlag> restFlags = null;
          if (getFlagsFromStudents) {
            studentFlags = flagController.listByOwnedAndSharedStudentFlags(studentIdentifier, ownerIdentifier);
            restFlags = createRestModel(studentFlags.toArray(new FlagStudent[0]));
          }
          
          boolean hasImage = userEntityFileController.hasProfilePicture(userEntity);
          
          UserSchoolDataIdentifier usdi = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
          OrganizationEntity organizationEntity = usdi.getOrganization();

          students.add(new fi.otavanopisto.muikku.rest.model.Student(
            studentIdentifier.toId(), 
            (String) o.get("firstName"),
            (String) o.get("lastName"),
            (String) o.get("nickName"),
            (String) o.get("studyProgrammeName"), 
            (String) o.get("studyProgrammeIdentifier"),
            hasImage,
            (String) o.get("nationality"), 
            (String) o.get("language"), 
            (String) o.get("municipality"), 
            (String) o.get("school"), 
            emailAddress,
            studyStartDate,
            studyEndDate,
            studyTimeEnd,
            userEntity.getLastLogin(),
            (String) o.get("curriculumIdentifier"),
            userEntity.getUpdatedByStudent(),
            userEntity.getId(),
            restFlags,
            organizationEntity == null ? null : toRestModel(organizationEntity)
          ));
        }
      }
    }

    return Response.ok(students).build();
  }

  @GET
  @Path("/students/{ID}")
  @RESTPermit (handling = Handling.INLINE)
  public Response findStudent(@Context Request request, @PathParam("ID") String id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (!sessionController.hasEnvironmentPermission(GuiderPermissions.GUIDER_VIEW)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(id);
    if (studentIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid studentIdentifier %s", id)).build();
    }
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    UserEntity userEntity = userSchoolDataIdentifier != null ? userSchoolDataIdentifier.getUserEntity() : null;
    if (userSchoolDataIdentifier == null || userEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("UserEntity not found").build();
    }
    
    // Bug fix #2966: REST endpoint should only return students
    EnvironmentRoleEntity userRole = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(userSchoolDataIdentifier);
    if (userRole == null || userRole.getArchetype() != EnvironmentRoleArchetype.STUDENT) {
      return Response.status(Status.NOT_FOUND).build();
    }

    EntityTag tag = new EntityTag(DigestUtils.md5Hex(String.valueOf(userEntity.getVersion())));

    ResponseBuilder builder = request.evaluatePreconditions(tag);
    if (builder != null) {
      return builder.build();
    }

    CacheControl cacheControl = new CacheControl();
    cacheControl.setMustRevalidate(true);
    
    User user = userController.findUserByIdentifier(studentIdentifier);
    if (user == null) {
      return Response.status(Status.NOT_FOUND).entity("User not found").build();
    }
    
    String emailAddress = userEmailEntityController.getUserDefaultEmailAddress(userEntity, true);
    Date studyStartDate = user.getStudyStartDate() != null ? Date.from(user.getStudyStartDate().toInstant()) : null;
    Date studyEndDate = user.getStudyEndDate() != null ? Date.from(user.getStudyEndDate().toInstant()) : null;
    Date studyTimeEnd = user.getStudyTimeEnd() != null ? Date.from(user.getStudyTimeEnd().toInstant()) : null;

    OrganizationEntity organizationEntity = userSchoolDataIdentifier.getOrganization();
    OrganizationRESTModel organizationRESTModel = null;
    if (organizationEntity != null) {
      organizationRESTModel = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
    }

    Student student = new Student(
        studentIdentifier.toId(), 
        user.getFirstName(), 
        user.getLastName(),
        user.getNickName(),
        user.getStudyProgrammeName(),
        user.getStudyProgrammeIdentifier() == null ? null : user.getStudyProgrammeIdentifier().toId(), 
        false, 
        user.getNationality(), 
        user.getLanguage(), 
        user.getMunicipality(), 
        user.getSchool(), 
        emailAddress, 
        studyStartDate,
        studyEndDate,
        studyTimeEnd,
        userEntity == null ? null : userEntity.getLastLogin(),
        user.getCurriculumIdentifier(),
        userEntity == null ? false : userEntity.getUpdatedByStudent(),
        userEntity == null ? -1 : userEntity.getId(),
        null,
        organizationRESTModel
    );
    
    return Response
        .ok(student)
        .cacheControl(cacheControl)
        .tag(tag)
        .build();
  }
  
  @GET
  @Path("/users/{USERIDENTIFIER}/workspaceActivity")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceActivities(
      @PathParam("USERIDENTIFIER") String userIdentifier,
      @QueryParam("workspaceIdentifier") String wsIdentifier,
      @QueryParam("includeTransferCredits") boolean includeTransferCredits,
      @QueryParam("includeAssignmentStatistics") boolean includeAssignmentStatistics) {
    
    // Access check
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(userIdentifier);
    if (studentIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid studentIdentifier %s", userIdentifier)).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.GET_WORKSPACE_ACTIVITY)) {
      if (!sessionController.getLoggedUser().equals(studentIdentifier)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    // Optional workspace filter
    
    SchoolDataIdentifier workspaceIdentifier = null;
    if (!StringUtils.isEmpty(wsIdentifier)) {
      workspaceIdentifier = SchoolDataIdentifier.fromId(wsIdentifier);
    }
    
    // Activity data
    
    List<WorkspaceActivity> activities = evaluationController.listWorkspaceActivities(
        studentIdentifier,
        workspaceIdentifier,
        includeTransferCredits,
        includeAssignmentStatistics);
    return Response.ok(activities).build();
  }

  @GET
  @Path("/users/{IDENTIFIER}/latestNotifications")
  @RESTPermit(GuiderPermissions.GUIDER_LIST_NOTIFICATIONS)
  public Response listUserNotifications(@PathParam("IDENTIFIER") String identifierString) {
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(identifierString);
    UserEntity ue = userEntityController.findUserEntityByUserIdentifier(identifier);
    if (ue == null) {
      return Response.status(Status.NOT_FOUND).entity("User entity not found").build();
    }
    
    Map<String, Date> map = new HashMap<>();
    
    StudyTimeNotification notification = studyTimeLeftNotificationController.findLatestByUserIdentifier(identifier);
    if (notification != null)
      map.put("studytime", notification.getSent());

    NoPassedCoursesNotification noPassNotification = noPassedCoursesNotificationController.findLatestByUserIdentifier(identifier);
    if (noPassNotification != null)
      map.put("nopassedcourses", noPassNotification.getSent());
    
    AssesmentRequestNotification assessmentRequestNotification = assessmentRequestNotificationController.findLatestByUserIdentifier(identifier);
    if (assessmentRequestNotification != null)
      map.put("assesmentrequest", assessmentRequestNotification.getSent());

    return Response.ok().entity(map).build();
  }

  @GET
  @Path("/users/{IDENTIFIER}/files")
  @RESTPermit (handling = Handling.INLINE)
  public Response listTranscriptOfRecordsFiles(@PathParam("IDENTIFIER") String identifierString) {
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(identifierString);
    UserEntity ue = userEntityController.findUserEntityByUserIdentifier(identifier);
    if (ue == null) {
      return Response.status(Status.NOT_FOUND).entity("User entity not found").build();
    }
    if (!sessionController.hasEnvironmentPermission(GuiderPermissions.GUIDER_LIST_TORFILES) && !identifier.equals(sessionController.getLoggedUser())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    List<TranscriptOfRecordsFile> torFiles = torFileController.listFiles(ue);
    return Response.ok().entity(torFiles).build();
  }

  @DELETE
  @Path("/files/{ID}")
  @RESTPermit(GuiderPermissions.GUIDER_DELETE_TORFILE)
  public Response deleteTranscriptOfRecordsFile(@PathParam("ID") Long fileId) {
    TranscriptOfRecordsFile file = torFileController.findFileById(fileId);
    if (file == null) {
      return Response.status(Status.NOT_FOUND).entity("file not found").build();
    }
    
    torFileController.delete(file);
    return Response.status(Status.NO_CONTENT).build();
  }

  @GET
  @Path("/files/{ID}/content")
  @RESTPermit(GuiderPermissions.GUIDER_GET_TORFILE_CONTENT)
  public Response getTranscriptOfRecordsFileContent(@PathParam("ID") Long fileId) {
    
    TranscriptOfRecordsFile file = torFileController .findFileById(fileId);

    if (file == null) {
      return Response.status(Status.NOT_FOUND).entity("File not found").build();
    }
    
    StreamingOutput output = s -> torFileController.outputFileToStream(file, s);
    
    String contentType = file.getContentType();
    
    return Response.ok().type(contentType).entity(output).build();
  }
  
  private OrganizationRESTModel toRestModel(OrganizationEntity organizationEntity) {
    return new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
  }
  
  private GuiderStudentWorkspaceActivityRestModel toRestModel(GuiderStudentWorkspaceActivity activity, WorkspaceAssessmentState assessmentState) {
    GuiderStudentWorkspaceActivityRestModel model = new GuiderStudentWorkspaceActivityRestModel(
        activity.getLastVisit(),
        activity.getNumVisits(),
        activity.getJournalEntryCount(),
        activity.getLastJournalEntry(),
        activity.getEvaluables().getUnanswered(), 
        activity.getEvaluables().getAnswered(), 
        activity.getEvaluables().getAnsweredLastDate(), 
        activity.getEvaluables().getSubmitted(), 
        activity.getEvaluables().getSubmittedLastDate(), 
        activity.getEvaluables().getWithdrawn(), 
        activity.getEvaluables().getWithdrawnLastDate(), 
        activity.getEvaluables().getPassed(), 
        activity.getEvaluables().getPassedLastDate(), 
        activity.getEvaluables().getFailed(), 
        activity.getEvaluables().getFailedLastDate(),
        activity.getEvaluables().getIncomplete(),
        activity.getEvaluables().getIncompleteLastDate(),
        activity.getExercises().getUnanswered(), 
        activity.getExercises().getAnswered(), 
        activity.getExercises().getAnsweredLastDate(),
        assessmentState);
    return model;
  }
  
  private List<fi.otavanopisto.muikku.rest.model.StudentFlag> createRestModel(FlagStudent[] flagStudents) {
    List<fi.otavanopisto.muikku.rest.model.StudentFlag> result = new ArrayList<>();
    
    for (FlagStudent flagStudent : flagStudents) {
      result.add(createRestModel(flagStudent));
    }
    
    return result;
  }
  
  private fi.otavanopisto.muikku.rest.model.StudentFlag createRestModel(FlagStudent flagStudent) {
    SchoolDataIdentifier studentIdentifier = flagStudent.getStudentIdentifier().schoolDataIdentifier();
    return new fi.otavanopisto.muikku.rest.model.StudentFlag(
        flagStudent.getId(),
        flagStudent.getFlag().getId(),
        flagStudent.getFlag().getName(),
        flagStudent.getFlag().getColor(),
        studentIdentifier.toId()
    );
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

  private Date getDateResult(Object value) {
    Date date = null;
    if (value instanceof Long) {
      date = new Date((Long) value);
    }
    else if (value instanceof Double) {
      // seconds to ms
      date = new Date(((Double) value).longValue() * 1000);
    }
    return date;
  }

} 