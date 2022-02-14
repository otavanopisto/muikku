package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
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
import javax.ws.rs.DELETE;
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
import javax.ws.rs.core.StreamingOutput;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserIdentifierProperty;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.StudiesViewCourseChoiceController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsFileController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptofRecordsPermissions;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptofRecordsUserProperties;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.VopsLister;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.StudiesViewCourseChoice;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceRestModels;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.MatriculationSchoolDataController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationEligibilities;
import fi.otavanopisto.muikku.schooldata.entity.StudentCourseStats;
import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibility;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.TransferCredit;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.search.IndexedWorkspace;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
import fi.otavanopisto.muikku.search.SearchResults;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.OrganizationRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.PublicityRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.TemplateRestriction;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
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
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private CourseMetaController courseMetaController;

  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private GradingController gradingController;

  @Inject
  private StudiesViewCourseChoiceController studiesViewCourseChoiceController;

  @Inject
  private MatriculationSchoolDataController matriculationSchoolDataController;

  @Inject
  private OrganizationEntityController organizationEntityController;

  @Inject
  private WorkspaceRestModels workspaceRestModels;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

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

  @GET
  @Path("/vops/{IDENTIFIER}")
  @RESTPermit(handling = Handling.INLINE)
  public Response getVops(@PathParam("IDENTIFIER") String studentIdentifierString) {

    String educationTypeMappingString = pluginSettingsController.getPluginSetting("transcriptofrecords", "educationTypeMapping");
    EducationTypeMapping educationTypeMapping = new EducationTypeMapping();
    if (educationTypeMappingString != null) {
      try {
        educationTypeMapping = new ObjectMapper().readValue(educationTypeMappingString, EducationTypeMapping.class);
      } catch (IOException e) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Education type mapping not set").build();
      }
    }

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierString);

    if (studentIdentifier == null) {
      return Response.status(Status.NOT_FOUND).entity("Student identifier not found").build();
    }

    if (!sessionController.hasEnvironmentPermission(TranscriptofRecordsPermissions.TRANSCRIPT_OF_RECORDS_VIEW_ANY_STUDENT_STUDIES)
        && !Objects.equals(sessionController.getLoggedUser(), studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Can only look at own information").build();
    }

    User student = userController.findUserByIdentifier(studentIdentifier);

    if (!transcriptOfRecordsController.shouldShowStudies(student)) {
      VopsRESTModel result = new VopsRESTModel(null, 0, 0, false);
      return Response.ok(result).build();
    }

    List<TransferCredit> transferCredits = new ArrayList<>(gradingController.listStudentTransferCredits(studentIdentifier));

    List<Subject> subjects = courseMetaController.listSubjects();
    Map<SchoolDataIdentifier, WorkspaceAssessment> studentAssessments = transcriptOfRecordsController.listStudentAssessments(studentIdentifier);


    String curriculum = pluginSettingsController.getPluginSetting("transcriptofrecords", "curriculum");
    SchoolDataIdentifier curriculumIdentifier = null;
    if (curriculum != null) {
      curriculumIdentifier = SchoolDataIdentifier.fromId(curriculum);
    }

    final List<String> subjectList = new ArrayList<String>();
    String commaSeparatedSubjectsOrder = pluginSettingsController.getPluginSetting("transcriptofrecords", "subjectsOrder");
    if (!StringUtils.isBlank(commaSeparatedSubjectsOrder)) {
      subjectList.addAll(Arrays.asList(commaSeparatedSubjectsOrder.split(",")));
    }
    subjects.sort(new Comparator<Subject>() {
      public int compare(Subject o1, Subject o2) {
        int i1 = subjectList.indexOf(o1.getCode());
        int i2 = subjectList.indexOf(o2.getCode());
        i1 = i1 == -1 ? Integer.MAX_VALUE : i1;
        i2 = i2 == -1 ? Integer.MAX_VALUE : i2;
        return i1 < i2 ? -1 : i1 == i2 ? 0 : 1;
      }
    });

    VopsLister lister = new VopsLister(
      subjects,
      transcriptOfRecordsController,
      student,
      transferCredits,
      curriculumIdentifier,
      workspaceController,
      workspaceUserEntityController,
      studentIdentifier,
      studentAssessments,
      userGroupEntityController,
      studiesViewCourseChoiceController,
      studentIdentifierString,
      gradingController,
      educationTypeMapping,
      workspaceEntityController
    );

    lister.performListing();

    VopsRESTModel result = new VopsRESTModel(
        lister.getResult().getRows(),
        lister.getResult().getNumCourses(),
        lister.getResult().getNumMandatoryCourses(),
        lister.getResult().isOptedIn()
    );

    return Response.ok(result).build();
  }

  private HopsRESTModel createHopsRESTModelForStudent(SchoolDataIdentifier userIdentifier) {
    EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(userIdentifier);
    if (roleEntity == null || roleEntity.getArchetype() != EnvironmentRoleArchetype.STUDENT) {
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
    User user = userController.findUserByIdentifier(userIdentifier);

    if (!transcriptOfRecordsController.shouldShowStudies(user)) {
      return Response.ok(HopsRESTModel.nonOptedInHopsRESTModel()).build();
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

  @POST
  @Path("/plannedCourses/")
  @RESTPermit(handling=Handling.INLINE)
  public Response planCourse(
      VopsPlannedCourseRESTModel model
  ) {
    SchoolDataIdentifier loggedUserIdentifier = sessionController.getLoggedUser();
    boolean hasPermission = Objects.equals(loggedUserIdentifier.toId(), model.getStudentIdentifier());
    if (!hasPermission) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to access this").build();
    }

    StudiesViewCourseChoice choice = studiesViewCourseChoiceController.find(
        model.getSubjectIdentifier(),
        model.getCourseNumber(),
        model.getStudentIdentifier());
    if (choice == null) {
      studiesViewCourseChoiceController.create(
          model.getSubjectIdentifier(),
          model.getCourseNumber(),
          model.getStudentIdentifier());
    }
    return Response.ok(model).build();
  }

  @DELETE
  @Path("/plannedCourses/")
  @RESTPermit(handling=Handling.INLINE)
  public Response unplanCourse(
      VopsPlannedCourseRESTModel model
  ) {
    SchoolDataIdentifier loggedUserIdentifier = sessionController.getLoggedUser();
    boolean hasPermission = Objects.equals(loggedUserIdentifier.toId(), model.getStudentIdentifier());
    if (!hasPermission) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to access this").build();
    }

    StudiesViewCourseChoice choice = studiesViewCourseChoiceController.find(
        model.getSubjectIdentifier(),
        model.getCourseNumber(),
        model.getStudentIdentifier());
    if (choice != null) {
      studiesViewCourseChoiceController.delete(choice);
      return Response.ok().build();
    } else {
      return Response.status(Status.NOT_FOUND).build();
    }
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
    EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(userIdentifier);
    if (roleEntity == null || roleEntity.getArchetype() != EnvironmentRoleArchetype.STUDENT) {
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

    if ((coursesCompleted >= coursesRequired) || (creditPoints >= creditPointsRequired)) {
      result.setStatus(MatriculationExamEligibilityStatus.ELIGIBLE);
    } else {
      result.setStatus(MatriculationExamEligibilityStatus.NOT_ELIGIBLE);
      result.setCoursesCompleted(coursesCompleted);
      result.setCoursesRequired(coursesRequired);
      result.setCreditPoints(creditPoints);
      result.setCreditPointsRequired(creditPointsRequired);
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

      for (IndexedWorkspace indexedWorkspace : indexedWorkspaces) {
        workspaces.add(workspaceRestModels.createRestModelWithActivity(userIdentifier, indexedWorkspace));
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

    return Response.ok(workspaceRestModels.createRestModelWithActivity(sessionController.getLoggedUser(), workspaceEntity, workspace)).build();
  }

}
