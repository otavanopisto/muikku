package fi.otavanopisto.muikku.plugins.hops.rest;

import java.io.IOException;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
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

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserIdentifierProperty;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequest;
import fi.otavanopisto.muikku.plugins.hops.HopsController;
import fi.otavanopisto.muikku.plugins.hops.HopsWebsocketMessenger;
import fi.otavanopisto.muikku.plugins.hops.model.Hops;
import fi.otavanopisto.muikku.plugins.hops.model.HopsGoals;
import fi.otavanopisto.muikku.plugins.hops.model.HopsHistory;
import fi.otavanopisto.muikku.plugins.hops.model.HopsOptionalSuggestion;
import fi.otavanopisto.muikku.plugins.hops.model.HopsPlannedCourse;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudentChoice;
import fi.otavanopisto.muikku.plugins.hops.model.HopsSuggestion;
import fi.otavanopisto.muikku.plugins.hops.ws.HopsGoalsWSMessage;
import fi.otavanopisto.muikku.plugins.hops.ws.HopsHistoryItemWSMessage;
import fi.otavanopisto.muikku.plugins.hops.ws.HopsLockWSMessage;
import fi.otavanopisto.muikku.plugins.hops.ws.HopsOptionalSuggestionWSMessage;
import fi.otavanopisto.muikku.plugins.hops.ws.HopsStudentChoiceWSMessage;
import fi.otavanopisto.muikku.plugins.hops.ws.HopsSuggestionWSMessage;
import fi.otavanopisto.muikku.plugins.hops.ws.HopsWithLatestChangeWSMessage;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceEntityFileController;
import fi.otavanopisto.muikku.rest.model.UserBasicInfo;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceType;
import fi.otavanopisto.muikku.schooldata.payload.StudyActivityItemRestModel;
import fi.otavanopisto.muikku.schooldata.payload.StudyActivityItemStatus;
import fi.otavanopisto.muikku.search.IndexedWorkspace;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.search.SearchResults;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.OrganizationRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.PublicityRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.TemplateRestriction;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserGroupGuidanceController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/hops")
@RequestScoped
@Stateful
@Produces("application/json")
@RestCatchSchoolDataExceptions
public class HopsRestService {

  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;

  @Inject
  private HopsController hopsController;

  @Inject
  private OrganizationEntityController organizationEntityController;

  @Inject
  private EvaluationController evaluationController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private UserSchoolDataController userSchoolDataController;

  @Inject
  private CourseMetaController courseMetaController;

  @Inject
  private HopsWebsocketMessenger hopsWebSocketMessenger;

  @Inject
  private WorkspaceEntityFileController workspaceEntityFileController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private UserGroupGuidanceController userGroupGuidanceController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @Inject
  private UserController userController;

  @GET
  @Path("/isHopsAvailable/{STUDENTIDENTIFIER}")
  @RESTPermit(handling = Handling.INLINE)
  public Response getIsAvailable(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    return Response.ok(sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_STUDENT_INFO) && hopsController.isHopsAvailable(studentIdentifier)).build();
  }

  @GET
  @Path("/student/{STUDENTIDENTIFIER}/lock")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getHopsLock(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr) {

    // Access check

    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (!hopsController.isHopsAvailable(studentIdentifierStr)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifierStr).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        if (!userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
          return Response.status(Status.FORBIDDEN).build();
        }
      }
    }

    // Return value

    HopsLockRestModel hopsLock = null;
    UserIdentifierProperty hopsProperty = userEntityController.getUserIdentifierPropertyByKey(studentIdentifier.getIdentifier(), "hopsLock");
    if (hopsProperty != null && !StringUtils.isBlank(hopsProperty.getValue())) {
      try {
        hopsLock = new ObjectMapper().readValue(hopsProperty.getValue(), HopsLockRestModel.class);
      }
      catch (Exception e) {
        logger.log(Level.SEVERE, "Error deserializing HOPS lock", e);
      }
    }

    if (hopsLock == null) {
      hopsLock = new HopsLockRestModel();
    }

    return Response.ok(hopsLock).build();
  }

  @PUT
  @Path("/student/{STUDENTIDENTIFIER}/lock")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateHopsLock(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr, HopsLockRestModel payload) {

    // Access check

    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (!hopsController.isHopsAvailable(studentIdentifierStr)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifierStr).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        if (!userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
          return Response.status(Status.FORBIDDEN).build();
        }
      }
    }

    // Create/update

    if (payload.isLocked()) {
      payload.setUserEntityId(sessionController.getLoggedUserEntity().getId());
      payload.setUserName(userEntityController.getName(sessionController.getLoggedUserEntity(), true).getDisplayNameWithLine());
      try {
        userEntityController.setUserIdentifierProperty(studentIdentifier.getIdentifier(), "hopsLock",  new ObjectMapper().writeValueAsString(payload));
      }
      catch (Exception e) {
        logger.log(Level.SEVERE, "Error serializing HOPS lock", e);
      }
    }
    else {
      payload.setUserEntityId(null);
      payload.setUserName(null);
      userEntityController.setUserIdentifierProperty(studentIdentifier.getIdentifier(), "hopsLock", null);
    }

    HopsLockWSMessage msg = new HopsLockWSMessage();
    msg.setLocked(payload.isLocked());
    msg.setUserEntityId(payload.getUserEntityId());
    msg.setUserName(payload.getUserName());
    msg.setStudentIdentifier(studentIdentifierStr);
    hopsWebSocketMessenger.sendMessage(studentIdentifierStr, "hops:lock-updated", msg);

    return Response.ok(payload).build();
  }

  @GET
  @Path("/student/{STUDENTIDENTIFIER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findHops(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr) {
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (studentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    // Access check
    if (!hopsController.isHopsAvailable(studentIdentifierStr)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifierStr).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        if (!userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
          return Response.status(Status.FORBIDDEN).build();
        }
        else {
          return Response.noContent().build(); // guardians don't need form data
        }
      }
    }

    hopsWebSocketMessenger.registerUser(studentIdentifierStr, sessionController.getLoggedUserEntity().getId());

    Hops hops = hopsController.findHopsByStudentIdentifier(studentIdentifierStr);
    return hops == null ? Response.noContent().build() : Response.ok(hops.getFormData()).build();
  }

  @POST
  @Path("/student/{STUDENTIDENTIFIER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateHops(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, HopsData payload) {

    // Access check
    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_EDIT)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    // Validate JSON
    ObjectMapper objectMapper = new ObjectMapper();

    if (payload == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    String formData = payload.getFormData();
    try {
      objectMapper.readTree(formData);
    }
    catch (IOException e) {
      logger.log(Level.WARNING, String.format("Failed to deserialize %s", formData));
    }

    // Create or update

    Hops hops = hopsController.findHopsByStudentIdentifier(studentIdentifier);
    HopsHistory historyItem;
    if (hops == null) {
      historyItem = hopsController.createHops(studentIdentifier, formData, payload.getHistoryDetails(), payload.getHistoryChanges());
    }
    else {
      historyItem = hopsController.updateHops(hops, studentIdentifier, formData, payload.getHistoryDetails(), payload.getHistoryChanges());
    }

    HopsWithLatestChange hopsWithChange = new HopsWithLatestChange(formData, toRestModel(historyItem, null));

    HopsWithLatestChangeWSMessage msg = new HopsWithLatestChangeWSMessage();
    msg.setFormData(hopsWithChange.getFormData());
    msg.setLatestChange(hopsWithChange.getLatestChange());
    msg.setStudentIdentifier(studentIdentifier);
    hopsWebSocketMessenger.sendMessage(studentIdentifier, "hops:hops-updated", msg);

    return Response.ok(hopsWithChange).build();
  }

  @GET
  @Path("/student/{STUDENTIDENTIFIER}/hopsGoals")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findHopsGoals(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr) {
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (studentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    // Access check
    if(!hopsController.isHopsAvailable(studentIdentifierStr)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifierStr).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        if (!userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
          return Response.status(Status.FORBIDDEN).build();
        }
      }
    }

    HopsGoals goals = hopsController.findHopsGoalsByStudentIdentifier(studentIdentifierStr);
    if (goals == null || StringUtils.isEmpty(goals.getGoals())) {
      return Response.noContent().build();
    }
    else {
      try {
        return Response.ok(new ObjectMapper().readValue(goals.getGoals(), HopsGoalsRestModel.class)).build();
      }
      catch (Exception e) {
        // Database might have deprecated data structures, so we replace them with a new object 
        return Response.ok(new HopsGoalsRestModel()).build();
      }
    }
  }

  @POST
  @Path("/student/{STUDENTIDENTIFIER}/hopsGoals")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateHopsGoals(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, HopsGoalsRestModel payload) {

    // Access check
    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_EDIT)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    // Create or update

    try {
      HopsGoals hopsGoals = hopsController.findHopsGoalsByStudentIdentifier(studentIdentifier);
      if (hopsGoals == null) {
        hopsGoals = hopsController.createHopsGoals(studentIdentifier, new ObjectMapper().writeValueAsString(payload));
      }
      else {
        hopsGoals = hopsController.updateHopsGoals(hopsGoals, studentIdentifier, new ObjectMapper().writeValueAsString(payload));
      }
    }
    catch (Exception e) {
      logger.log(Level.SEVERE, "Error serializing HOPS goals", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Error serializing HOPS goals").build();
    }

    HopsGoalsWSMessage msg = new HopsGoalsWSMessage();
    msg.setGraduationGoal(payload.getGraduationGoal());
    msg.setStudyHours(payload.getStudyHours());
    msg.setStudentIdentifier(studentIdentifier);

    hopsWebSocketMessenger.sendMessage(studentIdentifier, "hops:hops-goals", msg);

    return Response.ok(payload).build();
  }

  @GET
  @Path("/student/{STUDENTIDENTIFIER}/studyActivity")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getStudyActivity(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr) {
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (studentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    // Access check
    if(!hopsController.isHopsAvailable(studentIdentifierStr)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_GET_STUDENT_STUDY_ACTIVITY)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifierStr).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        if (!userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
          return Response.status(Status.FORBIDDEN).build();
        }
      }
    }

    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(schoolDataIdentifier);

    // Pyramus call for ongoing, transferred, and graded courses

    BridgeResponse<List<StudyActivityItemRestModel>> response = userSchoolDataController.getStudyActivity(
        schoolDataIdentifier.getDataSource(), schoolDataIdentifier.getIdentifier());
    if (response.ok()) {

      // Add suggested courses to the list and track supplementation requests as well

      List<StudyActivityItemRestModel> items = response.getEntity();
      for (StudyActivityItemRestModel item : items) {
        if (item.getCourseId() != null && studentEntity != null) {
          SupplementationRequest supplementationRequest = evaluationController.findLatestSupplementationRequestByStudentAndWorkspaceAndHandledAndArchived(
              studentEntity.getId(),
              item.getCourseId(),
              Boolean.FALSE,
              Boolean.FALSE);
          if (supplementationRequest != null && item.getDate().before(supplementationRequest.getRequestDate())) {
            item.setDate(supplementationRequest.getRequestDate());
            item.setStatus(StudyActivityItemStatus.SUPPLEMENTATIONREQUEST);
          }
        }
      }

      List<HopsSuggestion> suggestions = hopsController.listSuggestionsByStudentIdentifier(studentIdentifierStr);
      for (HopsSuggestion suggestion : suggestions) {

        // Check if subject + course number already exists. If so, delete suggestion as it is already outdated

        long matches = items
            .stream()
            .filter(s -> s.getSubject().equals(suggestion.getSubject()) && Objects.equals(s.getCourseNumber(), suggestion.getCourseNumber()) && Objects.equals(s.getCourseId(), suggestion.getWorkspaceEntityId()))
            .count();
        if (matches == 0) {
          WorkspaceEntity workspaceEntity = null;
          if (suggestion.getWorkspaceEntityId() != null) {
            workspaceEntity = workspaceEntityController.findWorkspaceEntityById(suggestion.getWorkspaceEntityId());
          }

          if (workspaceEntity == null) {
            logger.warning("Removing suggested workspace %d as it was not found");
            hopsController.removeSuggestion(suggestion);
          }
          else {
            StudyActivityItemRestModel item = new StudyActivityItemRestModel();

            item.setCourseNumber(suggestion.getCourseNumber());
            item.setDate(suggestion.getCreated());
            item.setSubject(suggestion.getSubject());

            if (suggestion.getType().toLowerCase().contains("optional")) {
              item.setStatus(StudyActivityItemStatus.SUGGESTED_OPTIONAL);
            } else {
              item.setStatus(StudyActivityItemStatus.SUGGESTED_NEXT);
              item.setCourseId(suggestion.getWorkspaceEntityId());
              item.setCourseName(workspaceEntityController.getName(workspaceEntity).getDisplayName());
            }
            items.add(item);
          }
        }
        else {

          // Suggested subject + course number has turned into ongoing, transferred, or graded

          hopsController.removeSuggestion(suggestion);
        }
      }

      return Response.status(response.getStatusCode()).entity(items).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }

  @GET
  @Path("/student/{STUDENTIDENTIFIER}/plannedCourses")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getPlannedCourses(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr) {

    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);

    // Access check
    if(!hopsController.isHopsAvailable(studentIdentifierStr)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifierStr).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        if (!userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
          return Response.status(Status.FORBIDDEN).build();
        }
      }
    }

    List<HopsPlannedCourse> plannedCourses = hopsController.listPlannedCoursesByStudentIdentifier(studentIdentifierStr);
    if (plannedCourses.isEmpty()) {
      return Response.ok(Collections.emptyList()).build();
    }

    List<HopsPlannedCourseRestModel> restPlannedCourses = new ArrayList<>();
    for (HopsPlannedCourse plannedCourse : plannedCourses) {
      restPlannedCourses.add(toRestModel(plannedCourse));
    }

    return Response.ok(restPlannedCourses).build();
  }

  @PUT
  @Path("/student/{STUDENTIDENTIFIER}/plannedCourses")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updatePlannedCourses(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr, HopsPlannedCoursesRestModel payload) {

    // Access check

    if(!hopsController.isHopsAvailable(studentIdentifierStr)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_EDIT)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifierStr).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    // Create, update, and delete planned courses based on payload

    List<HopsPlannedCourse> currentPlannedCourses = hopsController.listPlannedCoursesByStudentIdentifier(studentIdentifierStr);
    for (HopsPlannedCourseRestModel plannedCourse : payload.getPlannedCourses()) {
      if (plannedCourse.getId() == null) {
        hopsController.createPlannedCourse(studentIdentifierStr,
            plannedCourse.getName(),
            plannedCourse.getCourseNumber(),
            plannedCourse.getLength(),
            plannedCourse.getLengthSymbol(),
            plannedCourse.getSubjectCode(),
            plannedCourse.getMandatory(),
            plannedCourse.getStartDate(),
            plannedCourse.getDuration(),
            plannedCourse.getWorkspaceInstance() == null ? null : plannedCourse.getWorkspaceInstance().getId());
      }
      else {
        HopsPlannedCourse existingPlannedCourse = currentPlannedCourses.stream().filter(c -> c.getId().equals(plannedCourse.getId())).findFirst().orElse(null);
        if (existingPlannedCourse != null) {
          hopsController.updatePlannedCourse(existingPlannedCourse,
              plannedCourse.getName(),
              plannedCourse.getCourseNumber(),
              plannedCourse.getLength(),
              plannedCourse.getLengthSymbol(),
              plannedCourse.getSubjectCode(),
              plannedCourse.getMandatory(),
              plannedCourse.getStartDate(),
              plannedCourse.getDuration(),
              plannedCourse.getWorkspaceInstance() == null ? null : plannedCourse.getWorkspaceInstance().getId());
          currentPlannedCourses.remove(existingPlannedCourse);
        }
      }
    }
    for (HopsPlannedCourse deletedCourse : currentPlannedCourses) {
      hopsController.deletePlannedCourse(deletedCourse);
    }

    List<HopsPlannedCourse> plannedCourses = hopsController.listPlannedCoursesByStudentIdentifier(studentIdentifierStr);
    if (plannedCourses.isEmpty()) {
      return Response.ok(Collections.emptyList()).build();
    }

    List<HopsPlannedCourseRestModel> restPlannedCourses = new ArrayList<>();
    for (HopsPlannedCourse plannedCourse : plannedCourses) {
      restPlannedCourses.add(toRestModel(plannedCourse));
    }

    return Response.ok(restPlannedCourses).build();
  }

  @GET
  @Path("/student/{STUDENTIDENTIFIER}/history")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getHopsHistory(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr,
      @QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue("5") Integer maxResults) {

    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);

    // Access check
    if(!hopsController.isHopsAvailable(studentIdentifierStr)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_EDIT)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifierStr).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        if (!userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
          return Response.status(Status.FORBIDDEN).build();
        }
        else {
          return Response.ok(Collections.<HistoryItem>emptyList()).build(); // guardians don't see hops history
        }
      }
    }

    List<HopsHistory> history = hopsController.listHistoryByStudentIdentifier(studentIdentifierStr, firstResult, maxResults);
    if (history.isEmpty()) {
      return Response.ok(Collections.<HistoryItem>emptyList()).build();
    }

    Map<String, UserBasicInfo> userMap = new HashMap<>();

    List<HistoryItem> historyItems = new ArrayList<>();
    for (HopsHistory historyEntry : history) {
      historyItems.add(toRestModel(historyEntry, userMap));
    }

    historyItems.sort(Comparator.comparing(HistoryItem::getDate).reversed());

    return Response.ok(historyItems).build();
  }

  @PUT
  @Path("/student/{STUDENTIDENTIFIER}/history/{HISTORYID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateHopsHistoryDetails(@PathParam ("STUDENTIDENTIFIER") String studentIdentifier, @PathParam("HISTORYID") Long historyId, HistoryItem hopsHistory) {

    if (studentIdentifier == null || historyId == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    HopsHistory history = hopsController.findHistoryById(historyId);

    if (history == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(history.getModifier());

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_EDIT)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    } else if (!sdi.equals(sessionController.getLoggedUserEntity().defaultSchoolDataIdentifier())){
      return Response.status(Status.FORBIDDEN).entity("You can modify only your own history details").build();
    }

    HopsHistory updatedHistory = hopsController.updateHopsHistoryDetails(history, hopsHistory.getDetails(), hopsHistory.getChanges());

    HistoryItem historyItem = new HistoryItem();
    historyItem.setDate(updatedHistory.getDate());

    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(sdi);


    historyItem.setId(updatedHistory.getId());

    UserEntityName userEntityName = userEntityController.getName(sdi, false);
    if (userEntityName != null) {
      historyItem.setModifier(userEntityName.getDisplayName());
    }

    historyItem.setModifierId(userEntity.getId());
    historyItem.setModifierHasImage(userEntityFileController.hasProfilePicture(userEntity));
    historyItem.setDetails(updatedHistory.getDetails());
    historyItem.setChanges(updatedHistory.getChanges());

    HopsHistoryItemWSMessage msg = new HopsHistoryItemWSMessage();
    msg.setChanges(historyItem.getChanges());
    msg.setDate(historyItem.getDate());
    msg.setDetails(historyItem.getDetails());
    msg.setId(historyItem.getId());
    msg.setModifier(historyItem.getModifier());
    msg.setModifierHasImage(historyItem.getModifierHasImage());
    msg.setModifierId(historyItem.getModifierId());
    msg.setStudentIdentifier(studentIdentifier);
    hopsWebSocketMessenger.sendMessage(studentIdentifier, "hops:history-item-updated", msg);

    return Response.ok(historyItem).build();
  }

  @GET
  @Path("/listWorkspaceSuggestions")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceSuggestions(@QueryParam("subject") String subject, @QueryParam("courseNumber") Integer courseNumber, @QueryParam("userEntityId") Long userEntityId) {

    // Student needs to exist and have HOPS available

    if (userEntityId == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing userEntityId").build();
    }
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    SchoolDataIdentifier userIdentifier = userEntity.defaultSchoolDataIdentifier();
    if (userEntity == null || !hopsController.isHopsAvailable(userIdentifier.getDataSource() + "-" + userIdentifier.getIdentifier())) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Students may only list suggestions for themselves

    if (userEntity != null && !sessionController.getLoggedUserEntity().getId().equals(userEntity.getId())) {
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(sessionController.getLoggedUserEntity());
      if (userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    // Student needs to be active

    User user = userController.findUserByUserEntityDefaults(userEntity);
    boolean isActive = userSchoolDataController.isActiveUser(user);
    if (!isActive) {
      return Response.ok(Collections.emptyList()).build();
    }

    // Student needs to be OPS 2018 or OPS 2021

    String curriculumName = courseMetaController.getCurriculumName(user.getCurriculumIdentifier());
    boolean studentCurriculumOPS2021 = StringUtils.equalsIgnoreCase(curriculumName, "OPS 2021");
    boolean studentCurriculumOPS2018 = StringUtils.equalsIgnoreCase(curriculumName, "OPS 2018");
    if (!studentCurriculumOPS2021 && !studentCurriculumOPS2018) {
      return Response.ok(Collections.emptyList()).build();
    }

    List<SuggestedWorkspaceRestModel> suggestedWorkspaces = new ArrayList<>();

    // Turn subject code into a Pyramus subject identifier because Elastic index only has that :(

    String schoolDataSource = sessionController.getLoggedUserSchoolDataSource();
    Subject subjectObject = courseMetaController.findSubjectByCode(schoolDataSource, subject);
    if (subjectObject == null) {
      // If querying with an unknown subject, immediately return no results
      return Response.ok(suggestedWorkspaces).build();
    }

    // Do the search

    SearchProvider searchProvider = getProvider("elastic-search");
    if (searchProvider != null) {
      SearchResult sr = searchProvider.searchWorkspaces(subjectObject.schoolDataIdentifier(), courseNumber);

      List<Map<String, Object>> results = sr.getResults();
      for (Map<String, Object> result : results) {
        String searchId = (String) result.get("id");
        if (StringUtils.isNotBlank(searchId)) {
          String[] id = searchId.split("/", 2);
          if (id.length == 2) {
            String dataSource = id[1];
            String identifier = id[0];
            SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(identifier, dataSource);

            // Skip unpublished courses

            Boolean published = (Boolean) result.get("published");
            if (!published) {
              continue;
            }

            // OPS of the course and the student must match

            @SuppressWarnings("unchecked")
            ArrayList<String> curriculumIdentifiers = (ArrayList<String>) result.get("curriculumIdentifiers");
            boolean correctCurriculum = false;
            for (String curriculumIdentifier : curriculumIdentifiers) {
              String courseCurriculumName = courseMetaController.getCurriculumName(SchoolDataIdentifier.fromId(curriculumIdentifier));
              if (StringUtils.equalsIgnoreCase(courseCurriculumName, curriculumName)) {
                correctCurriculum = true;
                break;
              }
            }
            if (!correctCurriculum) {
              continue;
            }

            // Skip missing courses

            WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(workspaceIdentifier.getDataSource(), workspaceIdentifier.getIdentifier());
            if (workspaceEntity == null) {
              continue;
            }

            // Skip members only courses

            if (workspaceEntity.getAccess() != null && workspaceEntity.getAccess() == WorkspaceAccess.MEMBERS_ONLY) {
              continue;
            }

            // For students, skip courses that they cannot sign up to
            boolean isStudent = userEntityController.isStudent(sessionController.getLoggedUserEntity());

            boolean canSignUp = hopsController.canSignup(workspaceEntity, userEntity);
            if (isStudent && !canSignUp) {
              continue;
            }

            // For teachers, only list non-stop courses

            WorkspaceType workspaceType = null;
            if (!isStudent) {
              Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
              workspaceType = workspaceController.findWorkspaceType(workspace.getWorkspaceTypeId());
              if (workspaceType != null && !StringUtils.equalsIgnoreCase(workspaceType.getName(), "Nonstop")) {
                continue;
              }
            }

            // Course has passed all checks, so add it as a result

            Integer courseNum = null;

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> subjects = (List<Map<String, Object>>) result.get("subjects");
            for (Map<String, Object> s : subjects) {
              if (subjectObject.getCode().equals(s.get("subjectCode"))){
                courseNum = (Integer) s.get("courseNumber");
                break;
              }
            }

            SuggestedWorkspaceRestModel suggestedWorkspace = new SuggestedWorkspaceRestModel();
            suggestedWorkspace.setId(workspaceEntity.getId());
            suggestedWorkspace.setName((String) result.get("name"));
            suggestedWorkspace.setNameExtension((String) result.get("nameExtension"));
            suggestedWorkspace.setSubject(subjectObject.getCode());
            suggestedWorkspace.setCourseNumber(courseNum);
            suggestedWorkspace.setUrlName(workspaceEntity.getUrlName());
            suggestedWorkspace.setHasCustomImage(workspaceEntityFileController.getHasCustomImage(workspaceEntity));
            suggestedWorkspace.setDescription((String) result.get("description"));
            suggestedWorkspace.setType(workspaceType != null ? workspaceType.getName() : null);
            suggestedWorkspace.setCanSignup(canSignUp);
            suggestedWorkspaces.add(suggestedWorkspace);

          }
        }
      }
    }
    return Response.ok(suggestedWorkspaces).build();
  }

  @POST
  @Path("/student/{STUDENTIDENTIFIER}/toggleSuggestion")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response toggleSuggestion(@Context Request request, @PathParam("STUDENTIDENTIFIER") String studentIdentifier, HopsSuggestionRestModel payload) {

    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);

    // Access check
    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      if (!userSchoolDataController.amICounselor(schoolDataIdentifier)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_SUGGEST_WORKSPACES)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Find a previous suggestion with subject + course number and toggle accordingly
    HopsSuggestion hopsSuggestion = hopsController.findSuggestionByStudentIdentifierAndSubjectAndCourseNumberAndWorkspaceEntityId(
        studentIdentifier,
        payload.getSubject(),
        payload.getCourseNumber(),
        payload.getCourseId());

    WorkspaceEntity workspaceEntity = null;

    if (payload.getCourseId() != null) {
      workspaceEntity = workspaceEntityController.findWorkspaceEntityById(payload.getCourseId());
    }

    if (hopsSuggestion == null || !hopsSuggestion.getWorkspaceEntityId().equals(payload.getCourseId())) { // create new suggestion
      if (workspaceEntity == null) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Workspace entity %d not found", payload.getId())).build();
      }

      Boolean canSignUp = workspaceEntityController.canSignup(schoolDataIdentifier, workspaceEntity);
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);

      // return if student doesn't have sign up permission/ Course is unpublished/ Course begin date is earlier than today
      if (!canSignUp || !workspaceEntity.getPublished()) {
        return Response.status(Status.FORBIDDEN).entity(String.format("Student does not have sign up permission to course %d", workspaceEntity.getId())).build();
      } else if (workspace.getBeginDate() != null && !workspace.getBeginDate().isAfter(OffsetDateTime.now())) {
        return Response.status(Status.FORBIDDEN).entity(String.format("The course %d has already begun", workspaceEntity.getId())).build();
      }

      hopsSuggestion = hopsController.suggestWorkspace(studentIdentifier, payload.getSubject(), StudyActivityItemStatus.SUGGESTED_NEXT.name(), payload.getCourseNumber(), payload.getCourseId());
      HopsSuggestionRestModel item = new HopsSuggestionRestModel();

      item.setStatus(StudyActivityItemStatus.SUGGESTED_NEXT.name());
      item.setCourseId(hopsSuggestion.getWorkspaceEntityId());
      item.setName(workspaceEntityController.getName(workspaceEntity).getDisplayName());
      item.setId(hopsSuggestion.getId());
      item.setCourseNumber(hopsSuggestion.getCourseNumber());
      item.setCreated(hopsSuggestion.getCreated());
      item.setSubject(hopsSuggestion.getSubject());

      HopsSuggestionWSMessage msg = new HopsSuggestionWSMessage();
      msg.setStatus(item.getStatus());
      msg.setCourseId(item.getCourseId());
      msg.setName(item.getName());
      msg.setId(item.getId());
      msg.setCourseNumber(item.getCourseNumber());
      msg.setCreated(item.getCreated());
      msg.setSubject(item.getSubject());
      msg.setStudentIdentifier(studentIdentifier);

      hopsWebSocketMessenger.sendMessage(studentIdentifier, "hops:workspace-suggested", msg);

      return Response.ok(item).build();

    } else { // update suggestion

      if (hopsSuggestion == null || !hopsSuggestion.getWorkspaceEntityId().equals(payload.getCourseId()) || payload.getCourseNumber() == null || payload.getSubject() == null) {
        logger.log(Level.WARNING, String.format("Can not update suggestion", payload));
        return Response.noContent().build();
      }

      hopsController.suggestWorkspace(studentIdentifier, payload.getSubject(), StudyActivityItemStatus.SUGGESTED_NEXT.name(), payload.getCourseNumber(), workspaceEntity != null ? workspaceEntity.getId() : null);

      HopsSuggestionRestModel item = new HopsSuggestionRestModel();

      item.setStatus(StudyActivityItemStatus.SUGGESTED_NEXT.name());
      item.setCourseId(hopsSuggestion.getWorkspaceEntityId());
      item.setName(workspaceEntityController.getName(workspaceEntity).getDisplayName());
      item.setId(hopsSuggestion.getId());
      item.setCourseNumber(hopsSuggestion.getCourseNumber());
      item.setCreated(hopsSuggestion.getCreated());
      item.setSubject(hopsSuggestion.getSubject());

      HopsSuggestionWSMessage msg = new HopsSuggestionWSMessage();
      msg.setStatus(item.getStatus());
      msg.setCourseId(item.getCourseId());
      msg.setName(item.getName());
      msg.setId(item.getId());
      msg.setCourseNumber(item.getCourseNumber());
      msg.setCreated(item.getCreated());
      msg.setSubject(item.getSubject());
      msg.setStudentIdentifier(studentIdentifier);

      hopsWebSocketMessenger.sendMessage(studentIdentifier, "hops:workspace-suggested", msg);

      return Response.ok(item).build();
    }

  }

  @PUT
  @Path("/student/{STUDENTIDENTIFIER}/toggleSuggestion")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response removeSuggestion(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, HopsSuggestionRestModel payload) {

    // Access check
    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_SUGGEST_WORKSPACES)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    hopsController.unsuggestWorkspace(studentIdentifier, payload.getSubject(), payload.getCourseNumber(), payload.getCourseId());

    HopsSuggestionWSMessage msg = new HopsSuggestionWSMessage();
    msg.setStatus(payload.getStatus());
    msg.setCourseId(payload.getCourseId());
    msg.setName(payload.getName());
    msg.setId(payload.getId());
    msg.setCourseNumber(payload.getCourseNumber());
    msg.setCreated(payload.getCreated());
    msg.setSubject(payload.getSubject());
    msg.setStudentIdentifier(studentIdentifier);

    hopsWebSocketMessenger.sendMessage(studentIdentifier, "hops:workspace-suggested", msg);

    return Response.noContent().build();
  }

  private SearchProvider getProvider(String name) {
    for (SearchProvider searchProvider : searchProviders) {
      if (name.equals(searchProvider.getName())) {
        return searchProvider;
      }
    }
    return null;
  }

  @POST
  @Path("/student/{STUDENTIDENTIFIER}/optionalSuggestion")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response toggleOptionalSuggestions(@Context Request request, @PathParam("STUDENTIDENTIFIER") String studentIdentifier, HopsOptionalSuggestionRestModel payload) {

    // Create or remove

    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);

    // Access check
    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      if (!userSchoolDataController.amICounselor(schoolDataIdentifier)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    HopsOptionalSuggestion hopsOptionalSuggestion = hopsController.findOptionalSuggestionByStudentIdentifier(studentIdentifier, payload.getSubject(), payload.getCourseNumber());

    if (hopsOptionalSuggestion == null) {
      hopsOptionalSuggestion = hopsController.createOptionalSuggestion(studentIdentifier, payload.getSubject(), payload.getCourseNumber());
      HopsOptionalSuggestionRestModel hopsOptionalSuggestionRestModel = new HopsOptionalSuggestionRestModel();
      hopsOptionalSuggestionRestModel.setCourseNumber(hopsOptionalSuggestion.getCourseNumber());
      hopsOptionalSuggestionRestModel.setSubject(hopsOptionalSuggestion.getSubject());

      HopsOptionalSuggestionWSMessage msg = new HopsOptionalSuggestionWSMessage();
      msg.setCourseNumber(hopsOptionalSuggestionRestModel.getCourseNumber());
      msg.setSubject(hopsOptionalSuggestionRestModel.getSubject());
      msg.setStudentIdentifier(studentIdentifier);

      hopsWebSocketMessenger.sendMessage(studentIdentifier, "hops:optionalsuggestion-updated", msg);

      return Response.ok(hopsOptionalSuggestionRestModel).build();
    }
    else {
      hopsController.removeOptionalSuggestion(studentIdentifier, payload.getSubject(), payload.getCourseNumber());

      HopsOptionalSuggestionWSMessage msg = new HopsOptionalSuggestionWSMessage();
      msg.setCourseNumber(hopsOptionalSuggestion.getCourseNumber());
      msg.setSubject(hopsOptionalSuggestion.getSubject());
      msg.setStudentIdentifier(studentIdentifier);

      hopsWebSocketMessenger.sendMessage(studentIdentifier, "hops:optionalsuggestion-updated", msg);

      return Response.noContent().build();
    }
  }
  
  /**
   * For the current user, returns courses based on OPS, subject, and course number that the caller has rights to sign up to.
   * 
   * @param ops OPS; optional
   * @param subject subject code; required
   * @param courseNumber course number; required
   * 
   * @return List of courses matching the search terms
   */
  @GET
  @Path("/availableCourses")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listAvailableCourses(@QueryParam("ops") String ops, @QueryParam("subject") String subject, @QueryParam("courseNumber") Integer courseNumber) {
    
    // Returns courses based on OPS, subject, and course number that the caller has rights to sign up to
    
    // OPS name to identifier (e.g. OPS 2021 -> PYRAMUS-1)

    List<SchoolDataIdentifier> curriculumIdentifiers = new ArrayList<>();
    if (!StringUtils.isEmpty(ops)) {
      SchoolDataIdentifier opsIdentifier = courseMetaController.opsNameToIdentifier(ops);
      if (opsIdentifier == null) {
        return Response.status(Status.BAD_REQUEST).entity(String.format("Unknown OPS %s", ops)).build();
      }
      curriculumIdentifiers.add(opsIdentifier);
    }
    
    // Subject to identifier
    
    if (StringUtils.isEmpty(subject)) {
      return Response.status(Status.BAD_REQUEST).entity("Missing subject").build();
    }
    Subject s = courseMetaController.findSubjectByCode(sessionController.getLoggedUserSchoolDataSource(), subject);
    if (s == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Subject %s not found", subject)).build();
    }
    List<SchoolDataIdentifier> subjectIdentifiers = new ArrayList<>();
    subjectIdentifiers.add(s.schoolDataIdentifier());
    
    // Course number
    
    if (courseNumber == null || courseNumber == 0) {
      return Response.status(Status.BAD_REQUEST).entity("Missing courseNumber").build();
    }

    // Enforced organization filter

    List<OrganizationEntity> organizations = new ArrayList<>();
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    OrganizationEntity loggedUserOrganization = userSchoolDataIdentifier.getOrganization();
    organizations.add(loggedUserOrganization);
    List<OrganizationRestriction> organizationRestrictions = organizationEntityController.listUserOrganizationRestrictions(
        organizations,
        PublicityRestriction.ONLY_PUBLISHED,
        TemplateRestriction.ONLY_WORKSPACES);
    
    // Search matching courses

    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      SearchProvider searchProvider = searchProviderIterator.next();
      SearchResults<List<IndexedWorkspace>> searchResult = searchProvider.searchWorkspaces()
          .setSubjects(subjectIdentifiers)
          .setCurriculumIdentifiers(curriculumIdentifiers)
          .setOrganizationRestrictions(organizationRestrictions)
          .setAccessUser(sessionController.getLoggedUser())
          .setFirstResult(0)
          .setMaxResults(1000)
          .searchTyped();
      
      List<HopsAvailableCourseRestModel> courses = new ArrayList<>();
      for (IndexedWorkspace indexedWorkspace : searchResult.getResults()) {
        // course number match
        if (indexedWorkspace.getSubjects().stream().filter(sbj -> subject.equals(sbj.getSubjectCode()) && courseNumber.equals(sbj.getCourseNumber())).findFirst().orElse(null) == null) {
          continue;
        }
        WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByIdentifier(indexedWorkspace.getIdentifier());
        String name = indexedWorkspace.getName();
        if (indexedWorkspace.getNameExtension() != null) {
          name = String.format("%s %s", name, indexedWorkspace.getNameExtension()); 
        }
        LocalDate beginDate = indexedWorkspace.getBeginDate() == null ? null : indexedWorkspace.getBeginDate().atZoneSameInstant(ZoneId.systemDefault()).toLocalDate();
        LocalDate endDate = indexedWorkspace.getEndDate() == null ? null : indexedWorkspace.getEndDate().atZoneSameInstant(ZoneId.systemDefault()).toLocalDate();
        if (workspaceEntity != null && workspaceEntityController.canSignup(sessionController.getLoggedUser(), workspaceEntity)) {
          courses.add(new HopsAvailableCourseRestModel(workspaceEntity.getId(), name, beginDate, endDate));
        }
      }

      return Response.ok().entity(courses).build();
    }
    else {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Elastic search unavailable").build();
    }
  }

  @GET
  @Path("/opsCourses")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listOpsCourses(@QueryParam("ops") String ops, @QueryParam("educationTypeCode") String educationTypeCode) {

    // OPS name to identifier (e.g. OPS 2021 -> PYRAMUS-1)

    if (StringUtils.isEmpty(ops)) {
      return Response.status(Status.BAD_REQUEST).entity("Missing OPS").build();
    }
    SchoolDataIdentifier opsIdentifier = courseMetaController.opsNameToIdentifier(ops);
    if (opsIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Unknown OPS %s", ops)).build();
    }
    List<SchoolDataIdentifier> curriculumIdentifiers = new ArrayList<>();
    curriculumIdentifiers.add(opsIdentifier);

    // Education type name to identifier (e.g. Lukio -> PYRAMUS-2)

    if (StringUtils.isEmpty(educationTypeCode)) {
      return Response.status(Status.BAD_REQUEST).entity("Missing educationTypeCode").build();
    }
    List<SchoolDataIdentifier> educationTypeIdentifiers = courseMetaController.educationTypeCodeToIdentifiers(educationTypeCode);
    if (educationTypeIdentifiers.isEmpty()) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Unknown education type code %s", educationTypeCode)).build();
    }

    // Enforced organization filter

    List<OrganizationEntity> organizations = new ArrayList<>();
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    OrganizationEntity loggedUserOrganization = userSchoolDataIdentifier.getOrganization();
    organizations.add(loggedUserOrganization);
    List<OrganizationRestriction> organizationRestrictions = organizationEntityController.listUserOrganizationRestrictions(
        organizations,
        PublicityRestriction.ONLY_PUBLISHED,
        TemplateRestriction.ONLY_WORKSPACES);

    // Search matching courses

    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      SearchProvider searchProvider = searchProviderIterator.next();
      SearchResult searchResult = searchProvider.searchWorkspaces()
          .setEducationTypeIdentifiers(educationTypeIdentifiers)
          .setCurriculumIdentifiers(curriculumIdentifiers)
          .setOrganizationRestrictions(organizationRestrictions)
          .setAccessUser(sessionController.getLoggedUser())
          .setFirstResult(0)
          .setMaxResults(1000)
          .search();
      List<Map<String, Object>> results = searchResult.getResults();

      // List instances

      List<HopsOpsCoursesRestModel> courses = new ArrayList<>();
      Map<String,Set<Integer>> courseMap = new HashMap<>();
      for (Map<String, Object> result : results) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> subjects = (List<Map<String, Object>>) result.get("subjects");
        for (Map<String, Object> s : subjects) {
          String subject = (String) s.get("subjectCode");
          Integer courseNumber = (Integer) s.get("courseNumber");
          if (subject != null && courseNumber != null) {
            if (courseMap.containsKey(subject)) {
              courseMap.get(subject).add(courseNumber);
            }
            else {
              Set<Integer> courseNumbers = new HashSet<>();
              courseNumbers.add(courseNumber);
              courseMap.put(subject, courseNumbers);
            }
          }
        }
      }

      // Convert to return value

      for (String s : courseMap.keySet()) {
        courses.add(new HopsOpsCoursesRestModel(s, courseMap.get(s)));
      }
      return Response.ok().entity(courses).build();
    }
    else {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Elastic search unavailable").build();
    }
  }

  @GET
  @Path("/student/{STUDENTIDENTIFIER}/optionalSuggestions")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listOptionalSuggestions(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {

    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    List<HopsOptionalSuggestionRestModel> optionalSuggestions = new ArrayList<>();
    List<HopsOptionalSuggestion> optionalSuggestionsFromDB = hopsController.listOptionalSuggestionsByStudentIdentifier(studentIdentifier);

    if (optionalSuggestionsFromDB != null) {
      for (HopsOptionalSuggestion optionalSuggestion : optionalSuggestionsFromDB) {
        HopsOptionalSuggestionRestModel hopsOptionalSuggestionRestModel = new HopsOptionalSuggestionRestModel();

        hopsOptionalSuggestionRestModel.setCourseNumber(optionalSuggestion.getCourseNumber());
        hopsOptionalSuggestionRestModel.setSubject(optionalSuggestion.getSubject());

        optionalSuggestions.add(hopsOptionalSuggestionRestModel);
      }
    }
    return Response.ok(optionalSuggestions).build();
  }

  @POST
  @Path("/student/{STUDENTIDENTIFIER}/studentChoices")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response toggleStudentChoices(@Context Request request, @PathParam("STUDENTIDENTIFIER") String studentIdentifier, StudentChoiceRestModel payload) {

    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Create or remove

    HopsStudentChoice hopsStudentChoice = hopsController.findStudentChoiceByStudentIdentifier(studentIdentifier, payload.getSubject(), payload.getCourseNumber());
    if (hopsStudentChoice == null) {
      hopsStudentChoice = hopsController.createStudentChoice(studentIdentifier, payload.getSubject(), payload.getCourseNumber());

      StudentChoiceRestModel studentChoiceRestModel = new StudentChoiceRestModel();
      studentChoiceRestModel.setCourseNumber(hopsStudentChoice.getCourseNumber());
      studentChoiceRestModel.setSubject(hopsStudentChoice.getSubject());

      HopsStudentChoiceWSMessage msg = new HopsStudentChoiceWSMessage();
      msg.setCourseNumber(hopsStudentChoice.getCourseNumber());
      msg.setSubject(hopsStudentChoice.getSubject());
      msg.setStudentIdentifier(studentIdentifier);

      hopsWebSocketMessenger.sendMessage(studentIdentifier, "hops:studentchoice-updated", msg);

      return Response.ok(hopsStudentChoice).build();
    }
    else {
      hopsController.removeStudentChoice(studentIdentifier, payload.getSubject(), payload.getCourseNumber());

      HopsStudentChoiceWSMessage msg = new HopsStudentChoiceWSMessage();
      msg.setCourseNumber(hopsStudentChoice.getCourseNumber());
      msg.setSubject(hopsStudentChoice.getSubject());
      msg.setStudentIdentifier(studentIdentifier);

      hopsWebSocketMessenger.sendMessage(studentIdentifier, "hops:studentchoice-updated", msg);

      return Response.noContent().build();
    }
  }

  @GET
  @Path("/student/{STUDENTIDENTIFIER}/studentChoices")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listStudentChoices(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {

    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    List<StudentChoiceRestModel> studentChoices = new ArrayList<>();
    List<HopsStudentChoice> studentChoicesFromDB = hopsController.listStudentChoiceByStudentIdentifier(studentIdentifier);

    if (studentChoicesFromDB != null) {
      for (HopsStudentChoice studentChoice : studentChoicesFromDB) {
        StudentChoiceRestModel studentChoiceRestModel = new StudentChoiceRestModel();

        studentChoiceRestModel.setCourseNumber(studentChoice.getCourseNumber());
        studentChoiceRestModel.setSubject(studentChoice.getSubject());

        studentChoices.add(studentChoiceRestModel);
      }
    }
    return Response.ok(studentChoices).build();
  }

  @GET
  @Path("/student/{STUDENTIDENTIFIER}/studentInfo")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getStudentInformation(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr) {

    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (studentIdentifier == null) {
      return null;
    }

    // Access check
    if(!hopsController.isHopsAvailable(studentIdentifierStr)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifierStr).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        if (!userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier))
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    User student = userSchoolDataController.findUser(studentIdentifier);
    UserEntity studentEntity = userEntityController.findUserEntityByUser(student);

    List<String> counselorList = new ArrayList<>();

    List<UserEntity> counselorEntities = userGroupGuidanceController.getGuidanceCounselorUserEntities(studentIdentifier, false);
    for (UserEntity counselorEntity : counselorEntities) {
      UserEntityName counselorName = userEntityController.getName(counselorEntity, false);
      if (counselorName != null) {
        counselorList.add(counselorName.getDisplayName());
      }
    }

    return Response.ok(createRestModel(
        studentEntity.getId(),
        student.getFirstName(),
        student.getLastName(),
        student.getStudyProgrammeEducationType(),
        student.getStudyStartDate(),
        student.getStudyEndDate(),
        student.getStudyTimeEnd(),
        counselorList,
        student.getCurriculumIdentifier() != null ? courseMetaController.getCurriculumName(student.getCurriculumIdentifier()) : null

    )).build();
  }

  private fi.otavanopisto.muikku.plugins.hops.rest.StudentInformationRestModel createRestModel(
      Long studentIdentifier,
      String firstName,
      String lastName,
      String studyProgrammeEducationType,
      OffsetDateTime studyStartDate,
      OffsetDateTime studyEndDate,
      OffsetDateTime studyTimeEnd,
      List<String> counselorList,
      String curriculumName) {
    return new fi.otavanopisto.muikku.plugins.hops.rest.StudentInformationRestModel(
        studentIdentifier,
        firstName,
        lastName,
        studyProgrammeEducationType,
        studyStartDate,
        studyEndDate,
        studyTimeEnd,
        counselorList,
        curriculumName);
  }

  @GET
  @Path("/student/{STUDENTIDENTIFIER}/alternativeStudyOptions")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findAlternativeStudyOptions(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr) {
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (studentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if(!hopsController.isHopsAvailable(studentIdentifierStr)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Access check

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!studentIdentifier.equals(sessionController.getLoggedUser())) {
        if (!userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
          return Response.status(Status.FORBIDDEN).build();
        }
      }
    }

    return Response.ok(userSchoolDataController.listStudentAlternativeStudyOptions(studentIdentifier)).build();

  }

  private HopsPlannedCourseRestModel toRestModel(HopsPlannedCourse plannedCourse) {
    return new HopsPlannedCourseRestModel(plannedCourse.getId(),
        plannedCourse.getName(),
        plannedCourse.getCourseNumber(),
        plannedCourse.getLength(),
        plannedCourse.getLengthSymbol(),
        plannedCourse.getSubjectCode(),
        plannedCourse.getMandatory(),
        new Date(plannedCourse.getStartDate().getTime()).toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
        plannedCourse.getDuration(),
        toRestModel(SchoolDataIdentifier.fromId(plannedCourse.getStudentIdentifier()), plannedCourse.getWorkspaceEntityId()));
  }
  
  private HopsPlannedCourseInstanceRestModel toRestModel(SchoolDataIdentifier studentIdentifier, Long workspaceEntityId) {
    HopsPlannedCourseInstanceRestModel instance = null;
    if (workspaceEntityId != null) {
      instance = new HopsPlannedCourseInstanceRestModel(workspaceEntityId, null, null, null, false);
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      if (workspaceEntity != null) {
        SearchProvider searchProvider = getProvider("elastic-search");
        if (searchProvider != null) {

          // Enforced organization filter

          List<OrganizationEntity> organizations = new ArrayList<>();
          UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
          OrganizationEntity loggedUserOrganization = userSchoolDataIdentifier.getOrganization();
          organizations.add(loggedUserOrganization);
          List<OrganizationRestriction> organizationRestrictions = organizationEntityController.listUserOrganizationRestrictions(
              organizations,
              PublicityRestriction.ONLY_PUBLISHED,
              TemplateRestriction.ONLY_WORKSPACES);

          // Find the course

          SearchResults<List<IndexedWorkspace>> results = searchProvider.searchIndexedWorkspaces(
              Collections.emptyList(),
              Collections.singletonList(workspaceEntity.schoolDataIdentifier()),
              Collections.emptyList(),
              Collections.emptyList(),
              organizationRestrictions,
              null,
              null,
              sessionController.getLoggedUser(),
              0,
              1,
              null);

          if (results != null && results.getResults().size() == 1) {
            IndexedWorkspace workspace = results.getResults().get(0);
            Long id = workspaceEntity.getId();
            String name = workspace.getName();
            if (!StringUtils.isEmpty(workspace.getNameExtension())) {
              name = String.format("%s %s", name, workspace.getNameExtension());
            }
            LocalDate beginDate = workspace.getBeginDate() == null ? null : workspace.getBeginDate().atZoneSameInstant(ZoneId.systemDefault()).toLocalDate();
            LocalDate endDate = workspace.getEndDate() == null ? null : workspace.getEndDate().atZoneSameInstant(ZoneId.systemDefault()).toLocalDate();
            // check if user is already in course; if so, exists for sure
            boolean instanceExists = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(
                workspaceEntity,
                studentIdentifier) != null;
            if (!instanceExists) {
              // check against signup groups and signup dates
              instanceExists = workspaceEntityController.canSignup(studentIdentifier, workspaceEntity);
            }
            instance.setId(id);
            instance.setName(name);
            instance.setStartDate(beginDate);
            instance.setEndDate(endDate);
            instance.setInstanceExists(instanceExists);
          }
        }
      }
    }
    return instance;
  }

  private HistoryItem toRestModel(HopsHistory historyEntry, Map<String, UserBasicInfo> userMap) {
    HistoryItem historyItem = new HistoryItem();
    historyItem.setDate(historyEntry.getDate());
    historyItem.setId(historyEntry.getId());
    historyItem.setDetails(historyEntry.getDetails());
    historyItem.setChanges(historyEntry.getChanges());

    if (userMap != null && userMap.containsKey(historyEntry.getModifier())) {
      UserBasicInfo basicInfo = userMap.get(historyEntry.getModifier());
      historyItem.setModifier(String.format("%s %s", basicInfo.getFirstName(), basicInfo.getLastName()));
      historyItem.setModifierId(userMap.get(historyEntry.getModifier()).getId());
      historyItem.setModifierHasImage(userMap.get(historyEntry.getModifier()).isHasImage());
    }
    else {
      SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(historyEntry.getModifier());
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(sdi);
      UserEntityName userEntityName = userEntityController.getName(sdi, false);

      if (userEntity != null && userEntityName != null) {
        UserBasicInfo userDetails = new UserBasicInfo();

        historyItem.setModifier(userEntityName.getDisplayName());
        historyItem.setModifierId(userEntity.getId());
        historyItem.setModifierHasImage(userEntityFileController.hasProfilePicture(userEntity));

        userDetails.setFirstName(userEntityName.getFirstName());
        userDetails.setLastName(userEntityName.getLastName());
        userDetails.setId(userEntity.getId());
        userDetails.setHasImage(userEntityFileController.hasProfilePicture(userEntity));

        if (userMap != null) {
          userMap.put(historyEntry.getModifier(), userDetails);
        }

      }
    }
    return historyItem;
  }
}
