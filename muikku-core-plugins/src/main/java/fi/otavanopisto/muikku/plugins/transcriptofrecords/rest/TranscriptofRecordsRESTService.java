package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.StreamingOutput;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.StudiesViewCourseChoiceController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsFileController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptofRecordsPermissions;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptofRecordsUserProperties;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.VopsLister;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.StudiesViewCourseChoice;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.TransferCredit;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.session.SessionController;
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
  private TranscriptOfRecordsFileController transcriptOfRecordsFileController;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private PermissionController permissionController;

  @Inject
  private CourseMetaController courseMetaController;

  @Inject
  private TranscriptOfRecordsController vopsController;

  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private StudiesViewCourseChoiceController studiesViewCourseChoiceController;

  @Inject
  private GradingController gradingController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @GET
  @Path("/files/{ID}/content")
  @RESTPermit(handling = Handling.INLINE)
  @Produces("*/*")
  public Response getFileContent(@PathParam("ID") Long fileId) {

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();

    TranscriptOfRecordsFile file = transcriptOfRecordsFileController
        .findFileById(fileId);

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
    
    if (!vopsController.shouldShowStudies(student)) {
      VopsRESTModel result = new VopsRESTModel(null, 0, 0, false);
      return Response.ok(result).build();
    }
    
    List<TransferCredit> transferCredits = new ArrayList<>(gradingController.listStudentTransferCredits(studentIdentifier));

    List<Subject> subjects = courseMetaController.listSubjects();
    Map<SchoolDataIdentifier, WorkspaceAssessment> studentAssessments = vopsController.listStudentAssessments(studentIdentifier);
    
    
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
      vopsController,
      student,
      transferCredits,
      curriculumIdentifier,
      workspaceController,
      workspaceUserEntityController,
      studentIdentifier,
      studentAssessments,
      userGroupEntityController,
      permissionController,
      studiesViewCourseChoiceController,
      studentIdentifierString,
      gradingController,
      educationTypeMapping
    );
    
    lister.performListing();

    VopsRESTModel result = new VopsRESTModel(
        lister.getRows(),
        lister.getNumCourses(),
        lister.getNumMandatoryCourses(),
        lister.isOptedIn()
    );

    return Response.ok(result).build();
  }
  
  private HopsRESTModel createHopsRESTModelForStudent(SchoolDataIdentifier userIdentifier) {
    User user = userController.findUserByIdentifier(userIdentifier);
    EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(userIdentifier);

    if (roleEntity == null || roleEntity.getArchetype() != EnvironmentRoleArchetype.STUDENT) {
      return null;
    }

    TranscriptofRecordsUserProperties userProperties = vopsController.loadUserProperties(user);
    
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
        userProperties.asString("additionalInfo")
    );
  }

  @GET
  @Path("/hops")
  @RESTPermit(handling=Handling.INLINE)
  public Response retrieveForm(){

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
  public Response retrieveForm(@PathParam("USERIDENTIFIER") String userIdentifierString){

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

    if (!vopsController.shouldShowStudies(user)) {
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
  public Response updateHops(HopsRESTModel model){
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();
    User user = userController.findUserByIdentifier(userIdentifier);
    EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(userIdentifier);

    if (roleEntity == null || roleEntity.getArchetype() != EnvironmentRoleArchetype.STUDENT) {
      return Response.status(Status.FORBIDDEN).entity("Must be a student").build();
    }

    vopsController.saveStringProperty(user, "goalSecondarySchoolDegree", model.getGoalSecondarySchoolDegree());
    vopsController.saveStringProperty(user, "goalMatriculationExam", model.getGoalMatriculationExam());
    vopsController.saveStringProperty(user, "vocationalYears", model.getVocationalYears());
    vopsController.saveStringProperty(user, "goalJustMatriculationExam", model.getGoalJustMatriculationExam());
    vopsController.saveStringProperty(user, "justTransferCredits", model.getJustTransferCredits());
    vopsController.saveStringProperty(user, "transferCreditYears", model.getTransferCreditYears());
    vopsController.saveStringProperty(user, "completionYears", model.getCompletionYears());
    vopsController.saveStringProperty(user, "mathSyllabus", model.getMathSyllabus());
    vopsController.saveStringProperty(user, "finnish", model.getFinnish());
    vopsController.saveBoolProperty(user, "swedish", model.isSwedish());
    vopsController.saveBoolProperty(user, "english", model.isEnglish());
    vopsController.saveBoolProperty(user, "german", model.isGerman());
    vopsController.saveBoolProperty(user, "french", model.isFrench());
    vopsController.saveBoolProperty(user, "italian", model.isItalian());
    vopsController.saveBoolProperty(user, "spanish", model.isSpanish());
    vopsController.saveStringProperty(user, "science", model.getScience());
    vopsController.saveStringProperty(user, "religion", model.getReligion());
    vopsController.saveStringProperty(user, "additionalInfo", model.getAdditionalInfo());

    return Response.ok().entity(model).build();
  }
  
}
