package fi.otavanopisto.muikku.plugins.guider;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
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

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.Flag;
import fi.otavanopisto.muikku.model.users.FlagStudent;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.EducationTypeMapping;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.AssesmentRequestNotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.NoPassedCoursesNotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.StudyTimeLeftNotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.AssesmentRequestNotification;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.NoPassedCoursesNotification;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.StudyTimeNotification;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsFileController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.rest.ToRWorkspaceRestModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceRestModels;
import fi.otavanopisto.muikku.rest.model.GuiderStudentRestModel;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryBatch;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryCommentRestModel;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryRestModel;
import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceActivity;
import fi.otavanopisto.muikku.search.IndexedWorkspace;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.search.SearchResults;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.OrganizationRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.PublicityRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.TemplateRestriction;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.security.RoleFeatures;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.FlagController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
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
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private SessionController sessionController;

  @Inject
  private EvaluationController evaluationController;

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
  private UserSchoolDataController userSchoolDataController;

  @Inject
  private NoPassedCoursesNotificationController noPassedCoursesNotificationController;

  @Inject
  private StudyTimeLeftNotificationController studyTimeLeftNotificationController;

  @Inject
  private AssesmentRequestNotificationController assessmentRequestNotificationController;

  @Inject
  private FlagController flagController;

  @Inject
  private WorkspaceRestModels workspaceRestModels;

  @Inject
  private OrganizationEntityController organizationEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

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
          if (student == null) {
            logger.severe(String.format("Couldn't fetch user %s found in search index", studentIdentifier));
            continue;
          }
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

    GuiderStudentRestModel student = new GuiderStudentRestModel(
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
        organizationRESTModel,
        user.getMatriculationEligibility()
    );

    return Response
        .ok(student)
        .cacheControl(cacheControl)
        .tag(tag)
        .build();
  }

  @GET
  @Path("/students/{ID}/workspaces/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaces(
        @Context Request request,
        @PathParam("ID") String userIdentifierParam
      ) {
    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(userIdentifierParam);
    if (userIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (!sessionController.hasEnvironmentPermission(GuiderPermissions.GUIDER_VIEW)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(userIdentifier);

    TemplateRestriction templateRestriction = TemplateRestriction.ONLY_WORKSPACES;
    PublicityRestriction publicityRestriction = PublicityRestriction.LIST_ALL;
    List<WorkspaceEntity> workspaceEntities = workspaceUserEntityController.listWorkspaceEntitiesByUserEntity(userEntity);

    if (CollectionUtils.isEmpty(workspaceEntities)) {
      return Response.ok(Collections.emptyList()).build();
    }

    List<ToRWorkspaceRestModel> workspaces = new ArrayList<>();

    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      SearchProvider searchProvider = searchProviderIterator.next();

      List<SchoolDataIdentifier> workspaceIdentifierFilters = workspaceEntities.stream()
          .map(WorkspaceEntity::schoolDataIdentifier).collect(Collectors.toList());

      List<OrganizationEntity> loggedUserOrganizations = organizationEntityController.listLoggedUserOrganizations();
      List<OrganizationRestriction> organizationRestrictions = organizationEntityController.listUserOrganizationRestrictions(loggedUserOrganizations, publicityRestriction, templateRestriction);
      // The list is restricted to all of the students' workspaces so list them all
      organizationRestrictions = organizationRestrictions.stream()
          .map(organizationRestriction -> new OrganizationRestriction(organizationRestriction.getOrganizationIdentifier(), PublicityRestriction.LIST_ALL, TemplateRestriction.ONLY_WORKSPACES))
          .collect(Collectors.toList());

      SearchResults<List<IndexedWorkspace>> searchResults = searchProvider.searchWorkspaces()
          .setWorkspaceIdentifiers(workspaceIdentifierFilters)
          .setOrganizationRestrictions(organizationRestrictions)
          .setMaxResults(500)
          .addSort(new Sort("name.untouched", Sort.Order.ASC))
          .searchTyped();

      List<IndexedWorkspace> indexedWorkspaces = searchResults.getResults();

      EducationTypeMapping educationTypeMapping = workspaceEntityController.getEducationTypeMapping();
      for (IndexedWorkspace indexedWorkspace : indexedWorkspaces) {
        workspaces.add(workspaceRestModels.createRestModelWithActivity(userIdentifier, indexedWorkspace, educationTypeMapping));
      }
    } else {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }

    return Response.ok(workspaces).build();
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

  /**
   * POST mApi().guider.students.studyTime.create(16, {months: 3})
   *
   * Increases student's study time end by given months.
   *
   * @param userEntityId
   * @param months
   * @return
   *
   * returns increased studyTimeEnd
   */

  @POST
  @Path("/students/{ID}/studyTime")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response increaseStudyTime(@PathParam("ID") Long userEntityId, @QueryParam("months") Integer months) {

    EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(sessionController.getLoggedUser());

    if (roleEntity == null || roleEntity.getArchetype().equals(EnvironmentRoleArchetype.STUDENT)) {
      logger.severe("Logged user does not have permission");
      return Response.status(Status.FORBIDDEN).entity("Logged user does not have permission").build();
    }

    // Validation
    if (months == null || months <= 0) {
      logger.severe("Invalid months");
      return Response.status(Status.BAD_REQUEST).entity("Invalid months").build();
    }
    UserEntity studentEntity = userEntityController.findUserEntityById(userEntityId);

    if (studentEntity == null) {
      logger.severe("Student not found");
      return Response.status(Status.BAD_REQUEST).entity("Student not found").build();
    }

    User student = userSchoolDataController.increaseStudyTime(studentEntity.defaultSchoolDataIdentifier(), months);
    if (student != null) {
      return Response.status(Status.OK).entity(student.getStudyTimeEnd()).build();
    }
    else {
      return Response.status(Status.NOT_FOUND).build();
    }
  }

  private OrganizationRESTModel toRestModel(OrganizationEntity organizationEntity) {
    return new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
  }

  /**
   * POST mApi().guider.student.contactLog.create(userEntityId, payload)
   *
   * Creates a new contact log entry from the given payload and studentEntityId.
   *
   * Payload:
   *
   * {text: "something something",
   *  entryDate: 2021-02-15
   *  creatorName: "Etunimi Sukunomi",
   *  type: "OTHER"/"LETTER"/"EMAIL"/"PHONE"/"CHATLOG"/"SKYPE"/"FACE2FACE"/"ABSENCE"/"MUIKKU"
   * }
   *
   * Output: Created student contact log entry
   *
   * {
   * id: 123;
   * text: "something something",
   * creatorId: 23,
   * creatorName: "Etunimi Sukunimi";
   * entryDate: 2021-02-15;
   * type: "PHONE";
   * }
   */
  @POST
  @Path("/student/{ID}/contactLog/")
  @RESTPermit (GuiderPermissions.ACCESS_CONTACT_LOG)
  public Response createStudentContactLog(@PathParam("ID") Long userEntityId, StudentContactLogEntryRestModel payload) {
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);

    BridgeResponse<StudentContactLogEntryRestModel> response = userSchoolDataController.createStudentContactLogEntry(dataSource, userEntity.defaultSchoolDataIdentifier(), payload);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }

  /**
   * PUT mApi().guider.student.contactLog.update(userEntityId, contactLogEntryId, payload)
   *
   * payload: {
   * text: "something something",
   * entryDate: 2021-02-15;
   * type: "PHONE";
   * creatorId: 2
   * }
   * @param userEntityId
   * @param contactLogEntryId
   * @param payload
   * @return
   *
   * Returns updated contact log entry
   */

  @PUT
  @Path("/student/{ID}/contactLog/{CONTACTLOGENTRYID}")
  @RESTPermit (GuiderPermissions.ACCESS_CONTACT_LOG)
  public Response updateStudentContactLog(@PathParam("ID") Long userEntityId, @PathParam("CONTACTLOGENTRYID") Long contactLogEntryId, StudentContactLogEntryRestModel payload) {
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);

    if (payload.getCreatorId() != sessionController.getLoggedUserEntity().getId()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    BridgeResponse<StudentContactLogEntryRestModel> response = userSchoolDataController.updateStudentContactLogEntry(dataSource, userEntity.defaultSchoolDataIdentifier(), contactLogEntryId, payload);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();

    }
  }
  /**
   * GET mApi().guider.users.contactLog(userEntityId, resultsPerPage, page)
   *
   * Returns a list of student's contact log entries (comments included) and totalHitCount + firstResult
   *
   * Output:
   *
   *
   StudentContactLigEntryBatch: {
     totalHitCount: 55,
     firstResult: 12,
     contactLogEntries: [{
       StudentContactLogEntryRestModel: {
         id: 123,
         text: "something something",
         creatorId: 13,
         creatorName: "Etunimi Sukunimi",
         hasImage: true,
         entryDate: 2021-02-15,
         type: "FACE2FACE"
         comments: [{
           id: 12,
           entry: 123,
           text: "plaa",
           creatorId: 2,
           creatorName: Etunimi Sukunimi,
           commentDate: 2022-04-03
          }]
        }
      }]
    }
}
   */
  @GET
  @Path("/users/{ID}/contactLog")
  @RESTPermit (GuiderPermissions.ACCESS_CONTACT_LOG)
  public Response listStudentContactLogEntries(@PathParam("ID") Long userEntityId,
      @QueryParam("resultsPerPage") @DefaultValue("10") Integer resultsPerPage,
      @QueryParam("page") @DefaultValue("1") Integer page) {
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);

    BridgeResponse<StudentContactLogEntryBatch> response = userSchoolDataController.listStudentContactLogEntries(dataSource, userEntity.defaultSchoolDataIdentifier(), resultsPerPage, page);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    } else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }
  /**
   * DELETE mApi().guider.student.contactLog.del(userEntityId, contactLogEntryId)
   *
   * Output: 204 (no content)
   */
  @DELETE
  @Path("/student/{ID}/contactLog/{CONTACTLOGENTRYID}")
  @RESTPermit (GuiderPermissions.ACCESS_CONTACT_LOG)
  public Response archiveStudentContactLog(@PathParam("ID") Long userEntityId, @PathParam("CONTACTLOGENTRYID") Long contactLogEntryId) {
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);

    userSchoolDataController.removeStudentContactLogEntry(dataSource, userEntity.defaultSchoolDataIdentifier(), contactLogEntryId);

    return Response.noContent().build();

  }

  /**
   *
   * POST mApi().guider.student.contactLog.comments.create(userEntityId, contactLogEntryId, payload)
   *
   * payload: {
   * commentDate: Date
   * text: "plaaplaa";
   * }
   *
   * @param userEntityId
   * @param entryId
   * @param payload
   * @return
   */
  @POST
  @Path("/student/{ID}/contactLog/{ENTRYID}/comments")
  @RESTPermit (GuiderPermissions.ACCESS_CONTACT_LOG)
  public Response createContactLogEntryComment(@PathParam("ID") Long userEntityId, @PathParam("ENTRYID") Long entryId, StudentContactLogEntryCommentRestModel payload) {
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    BridgeResponse<StudentContactLogEntryCommentRestModel> response = userSchoolDataController.createStudentContactLogEntryComment(dataSource, userEntity.defaultSchoolDataIdentifier(), entryId, payload);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }

  /**
   * PUT mApi().guider.student.contactLog.comments.update(userEntityId, entryId, commentId, payload)
   *
   * payload: {
   * text: "plaa",
   * commentDate: Date,
   * creatorId: 2
   * }
   *
   * @param userEntityId
   * @param entryId
   * @param commentId
   * @param payload
   * @return
   *
   * Output: Updated StudentContactLogEntryCommentRestModel
   */
  @PUT
  @Path("/student/{ID}/contactLog/{ENTRYID}/comments/{COMMENTID}")
  @RESTPermit (GuiderPermissions.ACCESS_CONTACT_LOG)
  public Response updateStudentContactLogComment(@PathParam("ID") Long userEntityId, @PathParam("ENTRYID") Long entryId, @PathParam("COMMENTID") Long commentId, StudentContactLogEntryCommentRestModel payload) {
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);

    if (payload.getCreatorId() != sessionController.getLoggedUserEntity().getId()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    BridgeResponse<StudentContactLogEntryCommentRestModel> response = userSchoolDataController.updateStudentContactLogEntryComment(dataSource, userEntity.defaultSchoolDataIdentifier(), entryId, commentId, payload);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }

  /**
   * DELETE mApi.guider.student.contactLog.comments.del(userEntityId, contactLogEntryId, commentId)
   *
   * @param userEntityId
   * @param contactLogEntryId
   * @param commentId
   * @return
   *
   * Output: 204 no-content
   */
  @DELETE
  @Path("/student/{ID}/contactLog/{ENTRYID}/comments/{COMMENTID}")
  @RESTPermit (GuiderPermissions.ACCESS_CONTACT_LOG)
  public Response archiveStudentContactLogComment(@PathParam("ID") Long userEntityId, @PathParam("ENTRYID") Long contactLogEntryId, @PathParam("COMMENTID") Long commentId) {
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    userSchoolDataController.removeStudentContactLogEntryComment(dataSource, userEntity.defaultSchoolDataIdentifier(), commentId);

    return Response.noContent().build();

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