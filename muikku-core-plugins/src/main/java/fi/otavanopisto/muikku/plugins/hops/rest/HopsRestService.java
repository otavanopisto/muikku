package fi.otavanopisto.muikku.plugins.hops.rest;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
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

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.hops.HopsController;
import fi.otavanopisto.muikku.plugins.hops.model.Hops;
import fi.otavanopisto.muikku.plugins.hops.model.HopsGoals;
import fi.otavanopisto.muikku.plugins.hops.model.HopsHistory;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudentChoice;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudyHours;
import fi.otavanopisto.muikku.plugins.hops.model.HopsSuggestion;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessenger;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceEntityFileController;
import fi.otavanopisto.muikku.rest.model.UserBasicInfo;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;
import fi.otavanopisto.muikku.schooldata.payload.StudyActivityItemRestModel;
import fi.otavanopisto.muikku.schooldata.payload.StudyActivityItemStatus;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
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
  private UserEntityFileController userEntityFileController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private UserController userController;
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  @Inject
  private CourseMetaController courseMetaController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @Inject
  private WorkspaceEntityFileController workspaceEntityFileController;

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
  public Response createOrUpdateHops(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, HopsData payload) {
    
    // Access check
    
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
    if (hops == null) {
      hops = hopsController.createHops(studentIdentifier, formData, payload.getHistoryDetails());
    }
    else {
      hops = hopsController.updateHops(hops, studentIdentifier, formData, payload.getHistoryDetails());
    }

    return Response.ok(payload.getFormData()).build();
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
  public Response getHopsHistory(@PathParam("STUDENTIDENTIFIER") String studentIdentifier,
      @QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue("5") Integer maxResults) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_EDIT)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    List<HopsHistory> history = hopsController.listHistoryByStudentIdentifier(studentIdentifier, firstResult, maxResults);
    if (history.isEmpty()) {
      return Response.ok(Collections.<HistoryItem>emptyList()).build();
    }

    Map<String, UserBasicInfo> userMap = new HashMap<>();
    
    List<HistoryItem> historyItems = new ArrayList<>();
    for (HopsHistory historyEntry : history) {
      HistoryItem historyItem = new HistoryItem();
      historyItem.setDate(historyEntry.getDate());
      historyItem.setId(historyEntry.getId());
      historyItem.setDetails(historyEntry.getDetails());
      
      if (userMap.containsKey(historyEntry.getModifier())) {
        historyItem.setModifier(userMap.get(historyEntry.getModifier()).getFirstName() + " " + userMap.get(historyEntry.getModifier()).getLastName());
        historyItem.setModifierId(userMap.get(historyEntry.getModifier()).getId());
        historyItem.setModifierHasImage(userMap.get(historyEntry.getModifier()).isHasImage());
      }
      else {
        SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(historyEntry.getModifier());
        UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(sdi);
        UserEntityName userEntityName = userEntityController.getName(sdi);
        
        if (userEntity != null && userEntityName != null) {
          UserBasicInfo userDetails = new UserBasicInfo();
          
          historyItem.setModifier(userEntityName.getDisplayName());
          historyItem.setModifierId(userEntity.getId());
          historyItem.setModifierHasImage(userEntityFileController.hasProfilePicture(userEntity));
          
          userDetails.setFirstName(userEntityName.getFirstName());
          userDetails.setLastName(userEntityName.getLastName());
          userDetails.setId(userEntity.getId());
          userDetails.setHasImage(userEntityFileController.hasProfilePicture(userEntity));
          
          userMap.put(historyEntry.getModifier(), userDetails);
          
        }
      }
      historyItems.add(historyItem);
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
    
    HopsHistory updatedHistory = hopsController.updateHopsHistoryDetails(history, hopsHistory.getDetails());
    
    HistoryItem historyItem = new HistoryItem();
    historyItem.setDate(updatedHistory.getDate());

    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(sdi);
    
    
    historyItem.setId(updatedHistory.getId());
    
    UserEntityName userEntityName = userEntityController.getName(sdi);
    if (userEntityName != null) {
      historyItem.setModifier(userEntityName.getDisplayName());
    }
    
    historyItem.setModifierId(userEntity.getId());
    historyItem.setModifierHasImage(userEntityFileController.hasProfilePicture(userEntity));
    historyItem.setDetails(updatedHistory.getDetails());
    
    return Response.ok(historyItem).build();
  }
  
  @GET
  @Path("/listWorkspaceSuggestions")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceSuggestions(@QueryParam("subject") String subject, @QueryParam("courseNumber") Integer courseNumber, @QueryParam("onlySignupWorkspaces") @DefaultValue ("false") Boolean onlySignupWorkspaces) {
    
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
              if (onlySignupWorkspaces && !hopsController.canSignup(workspaceEntity)) {
                continue;
              }
              SuggestedWorkspaceRestModel suggestedWorkspace = new SuggestedWorkspaceRestModel();
              suggestedWorkspace.setId(workspaceEntity.getId());
              suggestedWorkspace.setName((String) result.get("name"));
              suggestedWorkspace.setNameExtension((String) result.get("nameExtension"));
              suggestedWorkspace.setSubject(subjectObject.getCode());
              suggestedWorkspace.setCourseNumber((Integer) result.get("courseNumber"));
              suggestedWorkspace.setUrlName(workspaceEntity.getUrlName());
              suggestedWorkspace.setHasCustomImage(workspaceEntityFileController.getHasCustomImage(workspaceEntity));
              suggestedWorkspace.setDescription((String) result.get("description"));
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
    List<String> counselorList = new ArrayList<>();
    String educationalLevel = null;
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<UserEntity> counselorEntities = hopsController.getGuidanceCouncelors(schoolDataIdentifier);
      for (UserEntity counselorEntity : counselorEntities) {
        counselor = userSchoolDataController.findUser(counselorEntity.defaultSchoolDataIdentifier());
        counselorList.add(counselor.getDisplayName());
      }
      
      // Get student's educational level from pyramus
      educationalLevel = userSchoolDataController.findStudentEducationalLevel(sessionController.getLoggedUserEntity().getDefaultSchoolDataSource(), studentEntity.getId());

    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
    
    return Response.ok(createRestModel(
        studentEntity.getId(),
        student.getFirstName(),
        student.getLastName(),
        educationalLevel,
        student.getStudyTimeEnd(),
        counselorList
    )).build(); 
  }
  
  private fi.otavanopisto.muikku.plugins.hops.rest.StudentInformationRestModel createRestModel(
      Long studentIdentifier,
      String firstName,
      String lastName,
      String educationalLevel,
      OffsetDateTime studyTimeEnd,
      List<String> counselorList) {
    return new fi.otavanopisto.muikku.plugins.hops.rest.StudentInformationRestModel(
        studentIdentifier,
        firstName, 
        lastName,
        educationalLevel,
        studyTimeEnd,
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
  
  @GET
  @Path("/student/{STUDENTIDENTIFIER}/alternativeStudyOptions")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findAlternativeStudyOptions(@PathParam("STUDENTIDENTIFIER") String studentIdentifierParam) {
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierParam);
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!studentIdentifier.equals(sessionController.getLoggedUser())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    User user = userController.findUserByIdentifier(studentIdentifier);
    UserProperty aidinkieli = userSchoolDataController.getUserProperty(user, "lukioAidinkieli");
    UserProperty uskonto = userSchoolDataController.getUserProperty(user, "lukioUskonto");
    
    AlternativeStudyOptionsRestModel alternativeStudyOptionsRestModel = new AlternativeStudyOptionsRestModel();
    alternativeStudyOptionsRestModel.setNativeLanguageSelection(aidinkieli != null ? aidinkieli.getValue() : null);
    alternativeStudyOptionsRestModel.setReligionSelection(uskonto != null ? uskonto.getValue() : null);
    
    return Response.ok(alternativeStudyOptionsRestModel).build();
  }
}