package fi.otavanopisto.muikku.plugins.hops.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
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

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.hops.HopsController;
import fi.otavanopisto.muikku.plugins.hops.model.Hops;
import fi.otavanopisto.muikku.plugins.hops.model.HopsAlternativeStudyOptions;
import fi.otavanopisto.muikku.plugins.hops.model.HopsGoals;
import fi.otavanopisto.muikku.plugins.hops.model.HopsHistory;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudentChoice;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudyHours;
import fi.otavanopisto.muikku.plugins.hops.model.HopsSuggestion;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessenger;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.payload.StudyActivityItemRestModel;
import fi.otavanopisto.muikku.schooldata.payload.StudyActivityItemStatus;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;
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
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  @Inject
  private CourseMetaController courseMetaController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @Inject
  private WebSocketMessenger webSocketMessenger;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  
  @GET
  @Path("/student/{STUDENTIDENTIFIER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findHops(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    Hops hops = hopsController.findHopsByStudentIdentifier(studentIdentifier);
    return hops == null ? Response.noContent().build() : Response.ok(hops.getFormData()).build();  
  }
  
  @POST
  @Path("/student/{STUDENTIDENTIFIER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateHops(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, String formData) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_EDIT)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    // Validate JSON

    ObjectMapper objectMapper = new ObjectMapper();
    try {
      objectMapper.readTree(formData);
    }
    catch (IOException e) {
      logger.log(Level.WARNING, String.format("Failed to deserialize %s", formData));
    }
    
    // Create or update
    
    Hops hops = hopsController.findHopsByStudentIdentifier(studentIdentifier);
    if (hops == null) {
      hops = hopsController.createHops(studentIdentifier, formData);
    }
    else {
      hops = hopsController.updateHops(hops, studentIdentifier, formData);
    }

    return Response.ok(formData).build();
  }
  
  @GET
  @Path("/student/{STUDENTIDENTIFIER}/hopsGoals")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findHopsGoals(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    HopsGoals hops = hopsController.findHopsGoalsByStudentIdentifier(studentIdentifier);
    return hops == null ? Response.noContent().build() : Response.ok(hops.getGoals()).build();  
  }
  
  @POST
  @Path("/student/{STUDENTIDENTIFIER}/hopsGoals")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateHopsGoals(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, String goals) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_EDIT)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    // Validate JSON

    ObjectMapper objectMapper = new ObjectMapper();
    try {
      objectMapper.readTree(goals);
    }
    catch (IOException e) {
      logger.log(Level.WARNING, String.format("Failed to deserialize %s", goals));
    }
    
    // Get recipients for websocket
    
    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(schoolDataIdentifier);
    
    schoolDataBridgeSessionController.startSystemSession();
    List<UserEntity> recipients = new ArrayList<>();

    try {
      recipients = hopsController.getGuidanceCouncelors(schoolDataIdentifier);
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
    
    recipients.add(studentEntity);
    
    // Create or update
    
    HopsGoals hopsGoals = hopsController.findHopsGoalsByStudentIdentifier(studentIdentifier);
    if (hopsGoals == null) {
      hopsGoals = hopsController.createHopsGoals(studentIdentifier, goals);
    }
    else {
      hopsGoals = hopsController.updateHopsGoals(hopsGoals, studentIdentifier, goals);
    }
    webSocketMessenger.sendMessage("hops:hops-goals", goals, recipients);
    return Response.ok(goals).build();
  }

  @GET
  @Path("/student/{STUDENTIDENTIFIER}/studyActivity")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getStudyActivity(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_GET_STUDENT_STUDY_ACTIVITY)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);
    
    // Pyramus call for ongoing, transferred, and graded courses
    
    BridgeResponse<List<StudyActivityItemRestModel>> response = userSchoolDataController.getStudyActivity(
        schoolDataIdentifier.getDataSource(), schoolDataIdentifier.getIdentifier());
    if (response.ok()) {
      
      // Add suggested courses to the list
      
      List<StudyActivityItemRestModel> items = response.getEntity();
      List<HopsSuggestion> suggestions = hopsController.listSuggestionsByStudentIdentifier(studentIdentifier);
      for (HopsSuggestion suggestion : suggestions) {
        
        // Check if subject + course number already exists. If so, delete suggestion as it is already outdated
        
        long matches = items
            .stream()
            .filter(s -> s.getSubject().equals(suggestion.getSubject()) && Objects.equals(s.getCourseNumber(), suggestion.getCourseNumber()))
            .count();
        if (matches == 0) {
          WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(suggestion.getWorkspaceEntityId());
          if (workspaceEntity == null) {
            logger.warning("Removing suggested workspace %d as it was not found");
            hopsController.removeSuggestion(suggestion);
          }
          else {
            StudyActivityItemRestModel item = new StudyActivityItemRestModel();
            item.setCourseId(suggestion.getWorkspaceEntityId());
            item.setCourseName(workspaceEntityController.getName(workspaceEntity));
            item.setCourseNumber(suggestion.getCourseNumber());
            item.setDate(suggestion.getCreated());
            item.setSubject(suggestion.getSubject());
            
            if (suggestion.getType().toLowerCase().contains("optional")) {
              item.setStatus(StudyActivityItemStatus.SUGGESTED_OPTIONAL);
            } else {
              item.setStatus(StudyActivityItemStatus.SUGGESTED_NEXT);
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
  @Path("/student/{STUDENTIDENTIFIER}/history")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getHopsHistory(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_EDIT)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    List<HopsHistory> history = hopsController.listHistoryByStudentIdentifier(studentIdentifier);
    if (history.isEmpty()) {
      return Response.ok(Collections.<HistoryItem>emptyList()).build();
    }

    Map<String, String> nameMap = new HashMap<>();
    List<HistoryItem> historyItems = new ArrayList<>();
    for (HopsHistory historyEntry : history) {
      HistoryItem historyItem = new HistoryItem();
      historyItem.setDate(historyEntry.getDate());
      if (nameMap.containsKey(historyEntry.getModifier())) {
        historyItem.setModifier(nameMap.get(historyEntry.getModifier()));
      }
      else {
        SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(historyEntry.getModifier());
        UserEntityName userEntityName = userEntityController.getName(sdi);
        if (userEntityName != null) {
          historyItem.setModifier(userEntityName.getDisplayName());
          nameMap.put(historyEntry.getModifier(), userEntityName.getDisplayName());
        }
      }
      historyItems.add(historyItem);
    }
    
    return Response.ok(historyItems).build();
  }
  
  @GET
  @Path("/listWorkspaceSuggestions")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceSuggestions(@QueryParam("subject") String subject, @QueryParam("courseNumber") Integer courseNumber) {
    
    List<SuggestedWorkspaceRestModel> suggestedWorkspaces = new ArrayList<>();
    
    // Turn code into a Pyramus subject identifier because Elastic index only has that :(
    
    String schoolDataSource = sessionController.getLoggedUserSchoolDataSource();
    Subject subjectObject = courseMetaController.findSubjectByCode(schoolDataSource, subject);
    if (subjectObject == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Do the search
    
    SearchProvider searchProvider = getProvider("elastic-search");
    if (searchProvider != null) {
      SearchResult sr = searchProvider.searchWorkspaces(organizationEntityController.listLoggedUserOrganizations(), subjectObject.getIdentifier(), courseNumber);
      List<Map<String, Object>> results = sr.getResults();
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
              SuggestedWorkspaceRestModel suggestedWorkspace = new SuggestedWorkspaceRestModel();
              suggestedWorkspace.setId(workspaceEntity.getId());
              String name = (String) result.get("name");
              if (result.get("nameExtension") != null) {
                name = String.format("%s (%s)", name, (String) result.get("nameExtension"));
              }
              suggestedWorkspace.setName(name);
              suggestedWorkspace.setSubject(subjectObject.getCode());
              suggestedWorkspace.setCourseNumber((Integer) result.get("courseNumber"));
              suggestedWorkspace.setUrlName(workspaceEntity.getUrlName());
              suggestedWorkspaces.add(suggestedWorkspace);
            }
          }
        }
      }
    }
    return Response.ok(suggestedWorkspaces).build();
  }

  @POST
  @Path("/student/{STUDENTIDENTIFIER}/toggleSuggestion")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response toggleSuggestion(@Context Request request, @PathParam("STUDENTIDENTIFIER") String studentIdentifier, SuggestedWorkspaceRestModel payload) {

    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_SUGGEST_WORKSPACES)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Find a previous suggestion with subject + course number and toggle accordingly
    HopsSuggestion hopsSuggestion = hopsController.findSuggestionByStudentIdentifierAndSubjectAndCourseNumber(
        studentIdentifier,
        payload.getSubject(),
        payload.getCourseNumber());
    
    WorkspaceEntity workspaceEntity = null;
    
    if (payload.getId() != null) {
      workspaceEntity = workspaceEntityController.findWorkspaceEntityById(payload.getId());
    }
    
    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(schoolDataIdentifier);
    UserEntity counselorEntity = sessionController.getLoggedUserEntity();
    
    if (hopsSuggestion == null && payload.getId() != null) { // create new suggestion
      if (workspaceEntity == null) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Workspace entity %d not found", payload.getId())).build();
      }
      hopsSuggestion = hopsController.suggestWorkspace(studentIdentifier, payload.getSubject(), payload.getType(), payload.getCourseNumber(), payload.getId());
      StudyActivityItemRestModel item = new StudyActivityItemRestModel();
      item.setCourseId(hopsSuggestion.getWorkspaceEntityId());
      item.setCourseName(workspaceEntityController.getName(workspaceEntity));
      item.setCourseNumber(hopsSuggestion.getCourseNumber());
      item.setDate(hopsSuggestion.getCreated());
      item.setSubject(hopsSuggestion.getSubject());
      
      if (payload.getType().toLowerCase().contains("optional")) {
        item.setStatus(StudyActivityItemStatus.SUGGESTED_OPTIONAL);
      } else {
        item.setStatus(StudyActivityItemStatus.SUGGESTED_NEXT);
      }
      webSocketMessenger.sendMessage("hops:workspace-suggested", item, Arrays.asList(studentEntity, counselorEntity));

      return Response.ok(item).build();
    }
    else if (hopsSuggestion != null && payload.getId() == null){ // remove suggestion
      hopsController.unsuggestWorkspace(studentIdentifier, payload.getSubject(), payload.getCourseNumber());
      
      StudyActivityItemRestModel item = new StudyActivityItemRestModel();
      item.setSubject(hopsSuggestion.getSubject());
      item.setCourseNumber(hopsSuggestion.getCourseNumber());
      webSocketMessenger.sendMessage("hops:workspace-suggested", item, Arrays.asList(studentEntity, counselorEntity));

      return Response.ok(item).build();
    }else { // update suggestion
      
      if (hopsSuggestion == null || payload.getCourseNumber() == null || payload.getId() == null || payload.getSubject() == null) {
        logger.log(Level.WARNING, String.format("Can not update suggestion", payload));
        return Response.noContent().build();
      }
      hopsController.suggestWorkspace(studentIdentifier, payload.getSubject(), payload.getType(), payload.getCourseNumber(), workspaceEntity.getId());
      
      StudyActivityItemRestModel item = new StudyActivityItemRestModel();
      item.setCourseId(hopsSuggestion.getWorkspaceEntityId());
      item.setCourseName(workspaceEntityController.getName(workspaceEntity));
      item.setCourseNumber(hopsSuggestion.getCourseNumber());
      item.setDate(hopsSuggestion.getCreated());
      item.setSubject(hopsSuggestion.getSubject());
      
      if (payload.getType().toLowerCase().contains("optional")) {
        item.setStatus(StudyActivityItemStatus.SUGGESTED_OPTIONAL);
      } else {
        item.setStatus(StudyActivityItemStatus.SUGGESTED_NEXT);
      }
      webSocketMessenger.sendMessage("hops:workspace-suggested", item, Arrays.asList(studentEntity, counselorEntity));

      return Response.ok(item).build();
    }

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
  @Path("/student/{STUDENTIDENTIFIER}/studentChoices")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response toggleStudentChoices(@Context Request request, @PathParam("STUDENTIDENTIFIER") String studentIdentifier, StudentChoiceRestModel payload) {
    
    // Create or remove
    
    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(schoolDataIdentifier);
    
    schoolDataBridgeSessionController.startSystemSession();
    List<UserEntity> recipients = new ArrayList<>();

    try {
      recipients = hopsController.getGuidanceCouncelors(schoolDataIdentifier);
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
    
    recipients.add(studentEntity);
    HopsStudentChoice hopsStudentChoice = hopsController.findStudentChoiceByStudentIdentifier(studentIdentifier, payload.getSubject(), payload.getCourseNumber());
    
    
    if (hopsStudentChoice == null) {
      hopsStudentChoice = hopsController.createStudentChoice(studentIdentifier, payload.getSubject(), payload.getCourseNumber());
      
      StudentChoiceRestModel studentChoiceRestModel = new StudentChoiceRestModel();
      studentChoiceRestModel.setCourseNumber(hopsStudentChoice.getCourseNumber());
      studentChoiceRestModel.setSubject(hopsStudentChoice.getSubject());
      webSocketMessenger.sendMessage("hops:studentchoice-updated", studentChoiceRestModel, recipients);

      return Response.ok(hopsStudentChoice).build();
    }
    else {
      hopsController.removeStudentChoice(studentIdentifier, payload.getSubject(), payload.getCourseNumber());
      StudentChoiceRestModel studentChoiceRestModel = new StudentChoiceRestModel();
      studentChoiceRestModel.setCourseNumber(hopsStudentChoice.getCourseNumber());
      studentChoiceRestModel.setSubject(hopsStudentChoice.getSubject());
      webSocketMessenger.sendMessage("hops:studentchoice-updated", studentChoiceRestModel, recipients);

      return Response.noContent().build();
    }
  }
  
  @GET
  @Path("/student/{STUDENTIDENTIFIER}/studentChoices")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listStudentChoices(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
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
  public Response getStudentInformation(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);
    
    User student = userSchoolDataController.findUser(schoolDataIdentifier);
    UserEntity studentEntity = userEntityController.findUserEntityByUser(student);
    User counselor;
    schoolDataBridgeSessionController.startSystemSession();
    List<String> counselorList = new ArrayList<>();

    try {
      List<UserEntity> counselorEntities = hopsController.getGuidanceCouncelors(schoolDataIdentifier);
      for (UserEntity counselorEntity : counselorEntities) {
        counselor = userSchoolDataController.findUser(counselorEntity.defaultSchoolDataIdentifier());
        counselorList.add(counselor.getDisplayName());
      }
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
    
    return Response.ok(createRestModel(
        studentEntity.getId(),
        student.getFirstName(),
        student.getLastName(),
        counselorList
    )).build(); 
  }
  
  private fi.otavanopisto.muikku.plugins.hops.rest.StudentInformationRestModel createRestModel(
      Long studentIdentifier,
      String firstName,
      String lastName,
      List<String> counselorList) {
    return new fi.otavanopisto.muikku.plugins.hops.rest.StudentInformationRestModel(
        studentIdentifier,
        firstName, 
        lastName,
        counselorList);
  }
  
  @POST
  @Path("/student/{STUDENTIDENTIFIER}/studyHours")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateStudyHours(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, StudyHoursRestModel payload) {
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_EDIT)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    Integer hours = null;
    
    if (payload.getStudyHours() != null) {
      hours = payload.getStudyHours();
    }
    // Create or update
    HopsStudyHours hopsStudyHours = hopsController.findHopsStudyHoursByStudentIdentifier(studentIdentifier);
    if (hopsStudyHours == null) {
      hopsStudyHours = hopsController.createHopsStudyHours(studentIdentifier, hours);
    }
    else {
      hopsStudyHours = hopsController.updateHopsStudyHours(hopsStudyHours, studentIdentifier, hours);
    }
    
    // Recipients for websocket
    
    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(schoolDataIdentifier);
    
    schoolDataBridgeSessionController.startSystemSession();
    List<UserEntity> recipients = new ArrayList<>();

    try {
      recipients = hopsController.getGuidanceCouncelors(schoolDataIdentifier);
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
    
    recipients.add(studentEntity);
    
    StudyHoursRestModel studyHoursRestModel = new StudyHoursRestModel();
    studyHoursRestModel.setId(hopsStudyHours.getId());
    studyHoursRestModel.setStudentIdentifier(hopsStudyHours.getStudentIdentifier());
    studyHoursRestModel.setStudyHours(hopsStudyHours.getStudyHours());
    
    webSocketMessenger.sendMessage("hops:studyhours", studyHoursRestModel, recipients);
    return Response.ok(hopsStudyHours).build();
  }
  
  @GET
  @Path("/student/{STUDENTIDENTIFIER}/studyHours")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findStudyHours(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    HopsStudyHours hopsStudyHours = hopsController.findHopsStudyHoursByStudentIdentifier(studentIdentifier);
    return hopsStudyHours == null ? Response.noContent().build() : Response.ok(hopsStudyHours.getStudyHours()).build();  
  }
  
  @POST
  @Path("/student/{STUDENTIDENTIFIER}/alternativeStudyOptions")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateAlternativeStudyOptions(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, AlternativeStudyOptionsRestModel payload) {
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_EDIT)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(schoolDataIdentifier);
    
    schoolDataBridgeSessionController.startSystemSession();
    List<UserEntity> recipients = new ArrayList<>();

    try {
      recipients = hopsController.getGuidanceCouncelors(schoolDataIdentifier);
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
    
    recipients.add(studentEntity);
    HopsAlternativeStudyOptions hopsAlternativeStudyOptions = hopsController.findHopsAlternativeStudyOptionsByStudentIdentifier(studentIdentifier);
    
    
    if (hopsAlternativeStudyOptions == null) {
      hopsAlternativeStudyOptions = hopsController.createHopsAlternativeStudyOptions(studentIdentifier, payload.getFinnishAsLanguage(), payload.getReligionAsEthics());
      
    } else {
      hopsController.updateHopsAlternativeStudyOptions(hopsAlternativeStudyOptions, studentIdentifier, payload.getFinnishAsLanguage(), payload.getReligionAsEthics());

    }
    AlternativeStudyOptionsRestModel alternativeStudyOptionsRestModel = new AlternativeStudyOptionsRestModel();
    alternativeStudyOptionsRestModel.setFinnishAsLanguage(hopsAlternativeStudyOptions.getFinnishAsLanguage());
    alternativeStudyOptionsRestModel.setReligionAsEthics(hopsAlternativeStudyOptions.getReligionAsEthics());
    webSocketMessenger.sendMessage("hops:alternative-study-options", alternativeStudyOptionsRestModel, recipients);

    return Response.ok(hopsAlternativeStudyOptions).build();
  }
  
  @GET
  @Path("/student/{STUDENTIDENTIFIER}/alternativeStudyOptions")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findAlternativeStudyOptions(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    HopsAlternativeStudyOptions hopsAlternativeStudyOptions = hopsController.findHopsAlternativeStudyOptionsByStudentIdentifier(studentIdentifier);
    
    if (hopsAlternativeStudyOptions == null) {
      return Response.noContent().build();
    } else {
      
      Boolean finnishAsLanguage = hopsAlternativeStudyOptions.getFinnishAsLanguage() == null ? false : hopsAlternativeStudyOptions.getFinnishAsLanguage();
      Boolean religionAsEthics = hopsAlternativeStudyOptions.getReligionAsEthics() == null ? false : hopsAlternativeStudyOptions.getReligionAsEthics();

      AlternativeStudyOptionsRestModel alternativeStudyOptionsRestModel = new AlternativeStudyOptionsRestModel();
      alternativeStudyOptionsRestModel.setFinnishAsLanguage(finnishAsLanguage);
      alternativeStudyOptionsRestModel.setReligionAsEthics(religionAsEthics);
      
      return Response.ok(alternativeStudyOptionsRestModel).build();
    }
  }
}
