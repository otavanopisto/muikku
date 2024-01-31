package fi.otavanopisto.muikku.plugins.hops.rest;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
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

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.guider.GuiderController;
import fi.otavanopisto.muikku.plugins.hops.HopsController;
import fi.otavanopisto.muikku.plugins.hops.model.Hops;
import fi.otavanopisto.muikku.plugins.hops.model.HopsGoals;
import fi.otavanopisto.muikku.plugins.hops.model.HopsHistory;
import fi.otavanopisto.muikku.plugins.hops.model.HopsOptionalSuggestion;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudentChoice;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudyHours;
import fi.otavanopisto.muikku.plugins.hops.model.HopsSuggestion;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessenger;
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
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserGroupGuidanceController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
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
  private UserEntityController userEntityController;

  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private UserSchoolDataController userSchoolDataController;

  @Inject
  private CourseMetaController courseMetaController;

  @Inject
  private WebSocketMessenger webSocketMessenger;

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

  @Inject 
  private GuiderController guiderController;
  @GET
  @Path("/isHopsAvailable/{STUDENTIDENTIFIER}")
  @RESTPermit(handling = Handling.INLINE)
  public Response getIsAvailable(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    
    boolean available = hopsController.isHopsAvailable(studentIdentifier) && sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_STUDENT_INFO);

    return Response.ok(available).build(); 
  }

  @GET
  @Path("/student/{STUDENTIDENTIFIER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findHops(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {

    // Access check
    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
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
    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
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
    try {
      objectMapper.readTree(goals);
    }
    catch (IOException e) {
      logger.log(Level.WARNING, String.format("Failed to deserialize %s", goals));
    }

    // Get recipients for websocket

    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(schoolDataIdentifier);

    List<UserEntity> recipients = userGroupGuidanceController.getGuidanceCounselors(schoolDataIdentifier, false);

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
    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
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
  @Path("/student/{STUDENTIDENTIFIER}/history")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getHopsHistory(@PathParam("STUDENTIDENTIFIER") String studentIdentifier,
      @QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue("5") Integer maxResults) {

    // Access check
    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
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

    HopsHistory updatedHistory = hopsController.updateHopsHistoryDetails(history, hopsHistory.getDetails());

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

    return Response.ok(historyItem).build();
  }

  @GET
  @Path("/listWorkspaceSuggestions")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceSuggestions(@QueryParam("subject") String subject, @QueryParam("courseNumber") Integer courseNumber, @QueryParam("onlySignupWorkspaces") @DefaultValue ("false") Boolean onlySignupWorkspaces, @QueryParam("userEntityId") Long userEntityId) {
    
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    
    SchoolDataIdentifier userIdentifier = userEntity.defaultSchoolDataIdentifier();
    // Permission checks
    if(userEntity == null || !hopsController.isHopsAvailable(userIdentifier.getDataSource() + "-" + userIdentifier.getIdentifier())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (userEntity != null && !sessionController.getLoggedUserEntity().getId().equals(userEntity.getId())) {
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(sessionController.getLoggedUserEntity());

      if (userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    User user = userController.findUserByUserEntityDefaults(userEntity);
    Map<SchoolDataIdentifier, String> curriculumNameCache = new HashMap<>();

    String curriculumName = getCurriculumName(curriculumNameCache, user.getCurriculumIdentifier());
    
    Boolean studentCurriculumOPS2021 = StringUtils.equalsIgnoreCase(curriculumName, "OPS 2021");
    Boolean studentCurriculumOPS2018 = StringUtils.equalsIgnoreCase(curriculumName, "OPS 2018");

    
    List<SuggestedWorkspaceRestModel> suggestedWorkspaces = new ArrayList<>();

    // Turn code into a Pyramus subject identifier because Elastic index only has that :(

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
            
            WorkspaceType workspaceType = null;
            
            WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(workspaceIdentifier.getDataSource(), workspaceIdentifier.getIdentifier());
            
            if (workspaceEntity != null) {
              Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
              
              // TODO: We have to fetch workspace from Pyramus to fetch workspace type from Pyramus. Adding workspace type to Elastic would eliminate the need for both calls.
              
              if (onlySignupWorkspaces && !hopsController.canSignup(workspaceEntity, userEntity)) {
                continue;
              }
              
              Double beginDateDouble = (Double) result.get("beginDate");
              
              if (beginDateDouble != null && onlySignupWorkspaces) {
                long itemLong = (long) (beginDateDouble * 1000);
                Date beginDate = new Date(itemLong);
                if (beginDate != null && !beginDate.after(new Date())) {
                  continue;
                }
              }
              
              Boolean published = (Boolean) result.get("published");
              
              if (!published) {
                continue;
              }
              
              UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(sessionController.getLoggedUserEntity());

              if (!userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
              
                  
                // If student has no access to sign up on a course, add workspace to suggestion list only if all of these are correct
                // - Student curriculum OPS 2021/OPS 2018
                // - Course curriculum same as the student's curriculum
                // - Published
                // - Course type 'Nonstop'
                
                if (!studentCurriculumOPS2021 && !studentCurriculumOPS2018) {
                  continue;
                }
                
                @SuppressWarnings("unchecked")
                ArrayList<String> curriculumIdentifiers = (ArrayList<String>) result.get("curriculumIdentifiers");
                
                boolean correctCurriculum = false;
                
                for (String curriculumIdentifier : curriculumIdentifiers) {
                  String courseCurriculumName = getCurriculumName(curriculumNameCache, SchoolDataIdentifier.fromId(curriculumIdentifier));
                  if (StringUtils.equalsIgnoreCase(courseCurriculumName, curriculumName)) {
                    correctCurriculum = true;
                    break;
                  }
                }
                
                if (!correctCurriculum) {
                  continue;
                }
                
                if (workspaceEntity.getAccess() != null && (workspaceEntity.getAccess() != WorkspaceAccess.ANYONE && workspaceEntity.getAccess() != WorkspaceAccess.LOGGED_IN)) {
                  continue;
                }
                
                workspaceType = workspaceController.findWorkspaceType(workspace.getWorkspaceTypeId());
                
                if (workspaceType != null && !StringUtils.equalsIgnoreCase(workspaceType.getName(), "Nonstop") && onlySignupWorkspaces) {
                  continue;
                }
                
              }
              
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
              suggestedWorkspaces.add(suggestedWorkspace);

            }
          }
        }
      }
    }
    return Response.ok(suggestedWorkspaces).build();
  }

  private String getCurriculumName(Map<SchoolDataIdentifier, String> curriculumNameCache, SchoolDataIdentifier curriculumIdentifier){

    if (!curriculumNameCache.containsKey(curriculumIdentifier)) {
      curriculumNameCache.put(curriculumIdentifier, guiderController.getCurriculumName(curriculumIdentifier));
    }

    return curriculumNameCache.get(curriculumIdentifier);
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

    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(schoolDataIdentifier);
    UserEntity counselorEntity = sessionController.getLoggedUserEntity();

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

      webSocketMessenger.sendMessage("hops:workspace-suggested", item, Arrays.asList(studentEntity, counselorEntity));

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

      webSocketMessenger.sendMessage("hops:workspace-suggested", item, Arrays.asList(studentEntity, counselorEntity));

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

    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(schoolDataIdentifier);
    UserEntity counselorEntity = sessionController.getLoggedUserEntity();

    webSocketMessenger.sendMessage("hops:workspace-suggested", payload, Arrays.asList(studentEntity, counselorEntity));

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
    
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(schoolDataIdentifier);

    List<UserEntity> recipients = userGroupGuidanceController.getGuidanceCounselors(schoolDataIdentifier, false);

    recipients.add(studentEntity);
    HopsOptionalSuggestion hopsOptionalSuggestion = hopsController.findOptionalSuggestionByStudentIdentifier(studentIdentifier, payload.getSubject(), payload.getCourseNumber());


    if (hopsOptionalSuggestion == null) {
      hopsOptionalSuggestion = hopsController.createOptionalSuggestion(studentIdentifier, payload.getSubject(), payload.getCourseNumber());

      HopsOptionalSuggestionRestModel hopsOptionalSuggestionRestModel = new HopsOptionalSuggestionRestModel();
      hopsOptionalSuggestionRestModel.setCourseNumber(hopsOptionalSuggestion.getCourseNumber());
      hopsOptionalSuggestionRestModel.setSubject(hopsOptionalSuggestion.getSubject());
      webSocketMessenger.sendMessage("hops:optionalsuggestion-updated", hopsOptionalSuggestionRestModel, recipients);

      return Response.ok(hopsOptionalSuggestionRestModel).build();
    }
    else {
      hopsController.removeOptionalSuggestion(studentIdentifier, payload.getSubject(), payload.getCourseNumber());
      HopsOptionalSuggestionRestModel hopsOptionalSuggestionRestModel = new HopsOptionalSuggestionRestModel();
      hopsOptionalSuggestionRestModel.setCourseNumber(hopsOptionalSuggestion.getCourseNumber());
      hopsOptionalSuggestionRestModel.setSubject(hopsOptionalSuggestion.getSubject());
      webSocketMessenger.sendMessage("hops:optionalsuggestion-updated", hopsOptionalSuggestionRestModel, recipients);

      return Response.noContent().build();
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

    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(schoolDataIdentifier);

    List<UserEntity> recipients = userGroupGuidanceController.getGuidanceCounselors(schoolDataIdentifier, false);

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
  public Response getStudentInformation(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {

    // Access check
    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(studentIdentifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);

    User student = userSchoolDataController.findUser(schoolDataIdentifier);
    UserEntity studentEntity = userEntityController.findUserEntityByUser(student);
    
    List<String> counselorList = new ArrayList<>();

    List<UserEntity> counselorEntities = userGroupGuidanceController.getGuidanceCounselors(schoolDataIdentifier, false);
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
        student.getStudyTimeEnd(),
        counselorList,
        student.getCurriculumIdentifier() != null ? guiderController.getCurriculumName(student.getCurriculumIdentifier()) : null

    )).build();
  }

  private fi.otavanopisto.muikku.plugins.hops.rest.StudentInformationRestModel createRestModel(
      Long studentIdentifier,
      String firstName,
      String lastName,
      String studyProgrammeEducationType,
      OffsetDateTime studyTimeEnd,
      List<String> counselorList,
      String curriculumName) {
    return new fi.otavanopisto.muikku.plugins.hops.rest.StudentInformationRestModel(
        studentIdentifier,
        firstName,
        lastName,
        studyProgrammeEducationType,
        studyTimeEnd,
        counselorList,
        curriculumName);
  }

  @POST
  @Path("/student/{STUDENTIDENTIFIER}/studyHours")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateStudyHours(@PathParam("STUDENTIDENTIFIER") String studentIdentifier, StudyHoursRestModel payload) {
    
    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
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

    List<UserEntity> recipients = userGroupGuidanceController.getGuidanceCounselors(schoolDataIdentifier, false);

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
    if(!hopsController.isHopsAvailable(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
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
    
    if(!hopsController.isHopsAvailable(studentIdentifierParam)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierParam);

    // Access check

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.HOPS_VIEW)) {
      if (!studentIdentifier.equals(sessionController.getLoggedUser())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    return Response.ok(userSchoolDataController.listStudentAlternativeStudyOptions(studentIdentifier)).build();

  }
}
