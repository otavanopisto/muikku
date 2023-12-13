package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.StreamingOutput;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserIdentifierProperty;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.EducationTypeMapping;
import fi.otavanopisto.muikku.model.workspace.Mandatority;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.plugins.guider.GuiderController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsFileController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptofRecordsPermissions;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptofRecordsUserProperties;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceRestModels;
import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;
import fi.otavanopisto.muikku.schooldata.MatriculationSchoolDataController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationEligibilities;
import fi.otavanopisto.muikku.schooldata.entity.StudentCourseStats;
import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibility;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceActivity;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceActivityCurriculum;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceActivityInfo;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceActivitySubject;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentState;
import fi.otavanopisto.muikku.search.IndexedWorkspace;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
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
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/records")
@RequestScoped
@Stateful
@Produces("application/json")
@RestCatchSchoolDataExceptions
public class TranscriptofRecordsRESTService extends PluginRESTService {

  private static final long serialVersionUID = -6752333351301485518L;

  @Inject
  private Logger logger;

  @Inject
  private TranscriptOfRecordsController transcriptOfRecordsController;

  @Inject
  private TranscriptOfRecordsFileController transcriptOfRecordsFileController;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserController userController;

  @Inject
  private EvaluationController evaluationController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private MatriculationSchoolDataController matriculationSchoolDataController;

  @Inject
  private OrganizationEntityController organizationEntityController;

  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private WorkspaceRestModels workspaceRestModels;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @Inject
  private GuiderController guiderController;

  @GET
  @Path("/students/{STUDENTIDENTIFIER}/students")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listStudents(
      @PathParam("STUDENTIDENTIFIER") String studentIdentifierStr,
      @DefaultValue ("false") @QueryParam("includeInactiveStudents") Boolean includeInactiveStudents
      ) {
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (studentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    if (userSchoolDataIdentifier == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Access
    
    if (!userSchoolDataIdentifier.getUserEntity().getId().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    List<UserSchoolDataIdentifier> schoolDataIdentifiers = userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(userSchoolDataIdentifier.getUserEntity());
    List<SchoolDataIdentifier> userEntityIdentifiers = schoolDataIdentifiers.stream().map(usdi -> usdi.schoolDataIdentifier()).collect(Collectors.toList());
      
    List<fi.otavanopisto.muikku.rest.model.Student> students = new ArrayList<>();
    
    SearchProvider elasticSearchProvider = getProvider("elastic-search");
    if (elasticSearchProvider != null) {
      OrganizationEntity organization = userSchoolDataIdentifier.getOrganization();
      
      SearchResult result = elasticSearchProvider.searchUsers(
          Arrays.asList(organization),
          null, // study programme identifiers
          null, // searchString,
          null, // fields,
          Arrays.asList(EnvironmentRoleArchetype.STUDENT), 
          null, // userGroupFilters,
          null, // workspaceFilters,
          userEntityIdentifiers, // userIdentifiers,
          includeInactiveStudents,
          true,
          false,
          0,
          20,
          false);
      
      List<Map<String, Object>> results = result.getResults();

      if (results != null && !results.isEmpty()) {
        for (Map<String, Object> o : results) {
          String studentId = (String) o.get("id");
          if (StringUtils.isBlank(studentId)) {
            logger.severe("Could not process user found from search index because it had a null id");
            continue;
          }
          
          String[] studentIdParts = studentId.split("/", 2);
          SchoolDataIdentifier searchStudentIdentifier = studentIdParts.length == 2 ? new SchoolDataIdentifier(studentIdParts[0], studentIdParts[1]) : null;
          if (searchStudentIdentifier == null) {
            logger.severe(String.format("Could not process user found from search index with id %s", studentId));
            continue;
          }
          
          if (!userEntityIdentifiers.contains(searchStudentIdentifier)) {
            logger.severe(String.format("Search returned invalid result %s for user %s", searchStudentIdentifier.toId(), studentIdentifier.toId()));
            continue;
          }
          
          UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(searchStudentIdentifier);
          String emailAddress = userEntity != null ? userEmailEntityController.getUserDefaultEmailAddress(userEntity, true) : null;

          Date studyStartDate = getDateResult(o.get("studyStartDate"));
          Date studyEndDate = getDateResult(o.get("studyEndDate"));
          Date studyTimeEnd = getDateResult(o.get("studyTimeEnd"));
          
          boolean hasImage = userEntityFileController.hasProfilePicture(userEntity);

          UserSchoolDataIdentifier usdi = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(searchStudentIdentifier);
          OrganizationEntity organizationEntity = usdi.getOrganization();
          OrganizationRESTModel organizationRESTModel = null;
          if (organizationEntity != null) {
            organizationRESTModel = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
          }

          students.add(new fi.otavanopisto.muikku.rest.model.Student(
            searchStudentIdentifier.toId(), 
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
            organizationRESTModel,
            false
          ));
        }
      }
    }

    return Response.ok(students).build();
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
      Long userEntityId = sessionController.getLoggedUserEntity().getId();
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
      if (userEntity == null || !userEntity.getId().equals(userEntityId)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    // Optional workspace filter

    SchoolDataIdentifier workspaceIdentifier = null;
    if (!StringUtils.isEmpty(wsIdentifier)) {
      workspaceIdentifier = SchoolDataIdentifier.fromId(wsIdentifier);
    }

    // Activity data

    WorkspaceActivityInfo activityInfo = evaluationController.listWorkspaceActivities(
        studentIdentifier,
        workspaceIdentifier,
        includeTransferCredits,
        includeAssignmentStatistics);
    
    Integer allCourseCredits = 0;
    Integer mandatoryCourseCredits = 0;
    boolean showCredits = false;
    
    User user = userController.findUserByDataSourceAndIdentifier(studentIdentifier.getDataSource(), studentIdentifier.getIdentifier());
    
    // Find student's curriculum to tell whether the score will be shown to the user
    
    String curriculumName = guiderController.getCurriculumName(user.getCurriculumIdentifier());
    
    if (curriculumName != null && curriculumName.equals("OPS 2021") && (activityInfo.getLineCategory() != null && activityInfo.getLineCategory().equals("Lukio"))) {
      showCredits = true;
    }
    
    SearchProvider searchProvider = getProvider("elastic-search");
    
    if (showCredits) {
      for (WorkspaceActivity activity : activityInfo.getActivities()) {
        
        List<WorkspaceAssessmentState> assessmentStatesList = activity.getAssessmentStates();
        
        if (!assessmentStatesList.isEmpty()) {
          for(WorkspaceAssessmentState assessmentState : assessmentStatesList) {
            if (assessmentState.getState() == WorkspaceAssessmentState.PASS || assessmentState.getState() == WorkspaceAssessmentState.TRANSFERRED) {
              for (WorkspaceActivitySubject workspaceActivitySubject : activity.getSubjects()) {
    
                // Check for courses that contains multiple coursemodules. WorkspaceActivitySubjectIdentifier should match assessmentState's workspaceSubjectIdentifier
                if (activity.getId() != null) {
                  if (!assessmentState.getWorkspaceSubjectIdentifier().equals(workspaceActivitySubject.getIdentifier())) {
                    continue;
                  }
                }
                
                if (workspaceActivitySubject.getCourseLengthSymbol().equals("op")) {
                  
                  for (WorkspaceActivityCurriculum curriculum : activity.getCurriculums()) {
                    if (curriculum.getName().equals("OPS 2021")) {
                      int units = workspaceActivitySubject.getCourseLength().intValue();
                      
                      // All completed courses
                      allCourseCredits = Integer.sum(units, allCourseCredits);
                      
                      // Mandatority for transferred courses
                      // Transferred courses doesn't have ids or identifiers so that's why these need to get separately
                      if (activity.getId() == null && assessmentState.getState() == WorkspaceAssessmentState.TRANSFERRED) {
                        Mandatority mandatority = activity.getMandatority();
                        if (mandatority != null && mandatority == Mandatority.MANDATORY) {
                          mandatoryCourseCredits = Integer.sum(units, mandatoryCourseCredits);
                       }
                      }
                      
                      // Search for finding out course mandaority
                      
                      if (searchProvider != null && activity.getId() != null) {
                        
                        WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(activity.getId());
                        workspaceIdentifier = workspaceEntity.schoolDataIdentifier();
                        SearchResult sr = searchProvider.findWorkspace(workspaceIdentifier);
                        
                        List<Map<String, Object>> results = sr.getResults();
                        for (Map<String, Object> result : results) {
                          
                          String educationTypeId = (String) result.get("educationTypeIdentifier");
    
                          Mandatority mandatority = null;
    
                          if (StringUtils.isNotBlank(educationTypeId)) {
                            SchoolDataIdentifier educationSubtypeId = SchoolDataIdentifier.fromId((String) result.get("educationSubtypeIdentifier"));
                            
                            EducationTypeMapping educationTypeMapping = workspaceEntityController.getEducationTypeMapping();
                            
                            mandatority = (educationTypeMapping != null && educationSubtypeId != null) 
                                ? educationTypeMapping.getMandatority(educationSubtypeId) : null;
                            
                          }
                          if (mandatority != null) {
                            if (mandatority == Mandatority.MANDATORY) {
                              mandatoryCourseCredits = Integer.sum(units, mandatoryCourseCredits);
                            }
                            activity.setMandatority(mandatority);
                          }
                        }
                      } 
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    
    activityInfo.setCompletedCourseCredits(allCourseCredits);
    activityInfo.setMandatoryCourseCredits(mandatoryCourseCredits);
    activityInfo.setShowCredits(showCredits);
    
    return Response.ok(activityInfo).build();
  }
  
  @GET
  @Path("/files/{ID}/content")
  @RESTPermit(handling = Handling.INLINE)
  @Produces("*/*")
  public Response getFileContent(@PathParam("ID") Long fileId) {

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();

    TranscriptOfRecordsFile file = transcriptOfRecordsFileController.findFileById(fileId);

    if (file == null) {
      return Response.status(Status.NOT_FOUND).entity("File not found").build();
    }

    boolean isLoggedUser = Objects.equals(file.getUserEntityId(), loggedUserEntity.getId());

    if (!isLoggedUser) {
      return Response.status(Status.FORBIDDEN).entity("Not your file").build();
    }

    StreamingOutput output = s -> transcriptOfRecordsFileController.outputFileToStream(file, s);

    String contentType = file.getContentType();

    return Response.ok().type(contentType).entity(output).build();
  }

  private HopsRESTModel createHopsRESTModelForStudent(SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);
    if (userSchoolDataIdentifier == null || !userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      return null;
    }
    UserIdentifierProperty hopsProperty = userEntityController.getUserIdentifierPropertyByKey(userIdentifier.getIdentifier(), "hops");
    if (hopsProperty != null && !StringUtils.isBlank(hopsProperty.getValue())) {
      try {
        return new ObjectMapper().readValue(hopsProperty.getValue(), HopsRESTModel.class);
      }
      catch (Exception e) {
        logger.log(Level.SEVERE, "Error deserializing HOPS form", e);
      }
    }
    else {
      User user = userController.findUserByIdentifier(userIdentifier);
      TranscriptofRecordsUserProperties userProperties = transcriptOfRecordsController.loadUserProperties(user);
      return new HopsRESTModel(
          userProperties.asString("goalSecondarySchoolDegree"),
          userProperties.asString("goalMatriculationExam"),
          userProperties.asString("vocationalYears"),
          userProperties.asString("goalJustMatriculationExam"),
          userProperties.asString("justTransferCredits"),
          userProperties.asString("transferCreditYears"),
          userProperties.asString("completionYears"),
          userProperties.asString("mathSyllabus"),
          userProperties.asString("finnish"),
          userProperties.asBoolean("swedish"),
          userProperties.asBoolean("english"),
          userProperties.asBoolean("german"),
          userProperties.asBoolean("french"),
          userProperties.asBoolean("italian"),
          userProperties.asBoolean("spanish"),
          userProperties.asString("science"),
          userProperties.asString("religion"),
          userProperties.asString("additionalInfo"),
          userProperties.getStudentMatriculationSubjects()
      );
    }
    return new HopsRESTModel();
  }

  @GET
  @Path("/hopseligibility")
  @RESTPermit(handling=Handling.INLINE)
  public Response retrieveHopsEligibility(){
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    MatriculationEligibilities eligibilities = matriculationSchoolDataController.listEligibilities();
    return Response.ok(eligibilities).build();
  }

  @GET
  @Path("/hops")
  @RESTPermit(handling=Handling.INLINE)
  public Response retrieveHops(){

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();

    HopsRESTModel response = createHopsRESTModelForStudent(userIdentifier);

    if (response == null) {
      return Response.status(Status.NOT_FOUND).entity("No HOPS form for non-students").build();
    }

    return Response.ok(response).build();
  }

  @GET
  @Path("/hops/{USERIDENTIFIER}")
  @RESTPermit(handling=Handling.INLINE)
  public Response retrieveHops(@PathParam("USERIDENTIFIER") String userIdentifierString){

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(userIdentifierString);
    if (userIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Malformed identifier").build();
    }

    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(userIdentifier);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("User not found").build();
    }
    if (!sessionController.hasEnvironmentPermission(TranscriptofRecordsPermissions.TRANSCRIPT_OF_RECORDS_VIEW_ANY_STUDENT_HOPS_FORM)
        && !Objects.equals(sessionController.getLoggedUser(), userIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Can only look at own information").build();
    }

    HopsRESTModel response = createHopsRESTModelForStudent(userIdentifier);

    if (response == null) {
      return Response.status(Status.NOT_FOUND).entity("No HOPS form for non-students").build();
    }

    return Response.ok(response).build();
  }

  @PUT
  @Consumes("application/json")
  @Path("/hops")
  @RESTPermit(handling=Handling.INLINE)
  public Response updateHops(HopsRESTModel model) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);
    if (userSchoolDataIdentifier == null || !userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      return Response.status(Status.FORBIDDEN).entity("Must be a student").build();
    }

    try {
      userEntityController.setUserIdentifierProperty(userIdentifier.getIdentifier(), "hops", new ObjectMapper().writeValueAsString(model));
    }
    catch (Exception e) {
      logger.log(Level.SEVERE, "Error serializing HOPS form", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Error serializing HOPS form").build();
    }

    return Response.ok().entity(model).build();
  }

  @GET
  @Consumes("application/json")
  @Path("/studentMatriculationEligibility/{STUDENTIDENTIFIER}")
  @RESTPermit(handling = Handling.INLINE)
  public Response getMatriculationEligibility(@PathParam("STUDENTIDENTIFIER") String studentIdentifier) {
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(studentIdentifier);
    if (identifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid student identifier").build();
    }

    if (!identifier.equals(sessionController.getLoggedUser())) {
      return Response.status(Status.FORBIDDEN).build();
    }

    User student = userController.findUserByIdentifier(identifier);
    if (student == null) {
      return Response.status(Status.NOT_FOUND).entity("Student not found").build();
    }

    StudentCourseStats studentCourseStats = transcriptOfRecordsController.fetchStudentCourseStats(identifier);

    MatriculationEligibilityRESTModel result = new MatriculationEligibilityRESTModel();
    int coursesCompleted = studentCourseStats.getNumMandatoryCompletedCourses();
    int coursesRequired = transcriptOfRecordsController.getMandatoryCoursesRequiredForMatriculation();

    double creditPoints = studentCourseStats.getSumMandatoryCompletedCreditPoints();
    double creditPointsRequired = transcriptOfRecordsController.getMandatoryCreditPointsRequiredForMatriculation();

    result.setCoursesCompleted(coursesCompleted);
    result.setCoursesRequired(coursesRequired);
    result.setCreditPoints(creditPoints);
    result.setCreditPointsRequired(creditPointsRequired);

    if ((coursesCompleted >= coursesRequired) || (creditPoints >= creditPointsRequired)) {
      result.setStatus(MatriculationExamEligibilityStatus.ELIGIBLE);
    } else {
      result.setStatus(MatriculationExamEligibilityStatus.NOT_ELIGIBLE);
    }

    return Response.ok(result).build();
  }

  /**
   * REST endpoint for listing matriculation subjects.
   *
   * Method requires that user is logged in but does not require any special permissions.
   *
   * @return REST response object
   */
  @GET
  @Path("/matriculationSubjects")
  @RESTPermit(handling = Handling.INLINE)
  public Response listMatriculationSubjects() {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    return Response.ok(transcriptOfRecordsController.listMatriculationSubjects()).build();
  }

  @GET
  @Path("/matriculationEligibility")
  @RESTPermit(handling = Handling.INLINE)
  public Response findMatriculationEligibility(@QueryParam ("subjectCode") String subjectCode) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    StudentMatriculationEligibility result = userController.getStudentMatriculationEligibility(sessionController.getLoggedUser(), subjectCode);

    return Response.ok(result).build();
  }

  @GET
  @Path("/workspaces/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaces(
        @QueryParam("userIdentifier") String userIdentifierParam,
        @Context Request request) {
    List<ToRWorkspaceRestModel> workspaces = new ArrayList<>();

    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(userIdentifierParam);
    if (userIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    UserEntity userEntity = sessionController.getLoggedUserEntity();

    List<UserSchoolDataIdentifier> userSchoolDataIdentifiers = userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(userEntity);
    if (!userSchoolDataIdentifiers.stream().anyMatch(usdi -> usdi.schoolDataIdentifier().toId().equals(userIdentifierParam))) {
      return Response.status(Status.FORBIDDEN).build();
    }

    TemplateRestriction templateRestriction = TemplateRestriction.ONLY_WORKSPACES;
    PublicityRestriction publicityRestriction = PublicityRestriction.LIST_ALL;
    List<WorkspaceEntity> workspaceEntities = workspaceUserEntityController.listWorkspaceEntitiesByUserIdentifier(userIdentifier);

    if (CollectionUtils.isEmpty(workspaceEntities)) {
      return Response.ok(Collections.emptyList()).build();
    }

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

      SearchResults<List<IndexedWorkspace>> searchResult = searchProvider.searchWorkspaces()
        .setWorkspaceIdentifiers(workspaceIdentifierFilters)
        .setOrganizationRestrictions(organizationRestrictions)
        .setMaxResults(500)
        .addSort(new Sort("name.untouched", Sort.Order.ASC))
        .searchTyped();

      List<IndexedWorkspace> indexedWorkspaces = searchResult.getResults();

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
  @Path("/workspaces/{ID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspace(@PathParam("ID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);

    if (workspace == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    EducationTypeMapping educationTypeMapping = workspaceEntityController.getEducationTypeMapping();
    return Response.ok(workspaceRestModels.createRestModelWithActivity(sessionController.getLoggedUser(), workspaceEntity, workspace, educationTypeMapping)).build();
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
