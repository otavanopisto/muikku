package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

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

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.EducationTypeMappingNotSetException;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.StudiesViewCourseChoiceController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsFileController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptofRecordsPermissions;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptofRecordsUserProperties;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.VopsLister;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.StudiesViewCourseChoice;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
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
  private TranscriptOfRecordsController transcriptOfRecordsController;

  @Inject
  private TranscriptOfRecordsFileController transcriptOfRecordsFileController;

  @Inject
  private SessionController sessionController;

  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private StudiesViewCourseChoiceController studiesViewCourseChoiceController;

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
    
    try {
      VopsLister.Result listerResult = transcriptOfRecordsController.listVopsCourses(studentIdentifierString,
            studentIdentifier);

      VopsRESTModel result = new VopsRESTModel(
          listerResult.getRows(),
          listerResult.getNumCourses(),
          listerResult.getNumMandatoryCourses(),
          listerResult.isOptedIn()
      );

      return Response.ok(result).build();
    } catch (EducationTypeMappingNotSetException ex) {
      return Response.status(Status.INTERNAL_SERVER_ERROR)
                     .entity("Education type mapping not set")
                     .build();
    }
  }

  private HopsRESTModel createHopsRESTModelForStudent(SchoolDataIdentifier userIdentifier) {
    User user = userController.findUserByIdentifier(userIdentifier);
    EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(userIdentifier);

    if (roleEntity == null || roleEntity.getArchetype() != EnvironmentRoleArchetype.STUDENT) {
      return null;
    }

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

    transcriptOfRecordsController.saveStringProperty(user, "goalSecondarySchoolDegree", model.getGoalSecondarySchoolDegree());
    transcriptOfRecordsController.saveStringProperty(user, "goalMatriculationExam", model.getGoalMatriculationExam());
    transcriptOfRecordsController.saveStringProperty(user, "vocationalYears", model.getVocationalYears());
    transcriptOfRecordsController.saveStringProperty(user, "goalJustMatriculationExam", model.getGoalJustMatriculationExam());
    transcriptOfRecordsController.saveStringProperty(user, "justTransferCredits", model.getJustTransferCredits());
    transcriptOfRecordsController.saveStringProperty(user, "transferCreditYears", model.getTransferCreditYears());
    transcriptOfRecordsController.saveStringProperty(user, "completionYears", model.getCompletionYears());
    transcriptOfRecordsController.saveStringProperty(user, "mathSyllabus", model.getMathSyllabus());
    transcriptOfRecordsController.saveStringProperty(user, "finnish", model.getFinnish());
    transcriptOfRecordsController.saveBoolProperty(user, "swedish", model.isSwedish());
    transcriptOfRecordsController.saveBoolProperty(user, "english", model.isEnglish());
    transcriptOfRecordsController.saveBoolProperty(user, "german", model.isGerman());
    transcriptOfRecordsController.saveBoolProperty(user, "french", model.isFrench());
    transcriptOfRecordsController.saveBoolProperty(user, "italian", model.isItalian());
    transcriptOfRecordsController.saveBoolProperty(user, "spanish", model.isSpanish());
    transcriptOfRecordsController.saveStringProperty(user, "science", model.getScience());
    transcriptOfRecordsController.saveStringProperty(user, "religion", model.getReligion());
    transcriptOfRecordsController.saveStringProperty(user, "additionalInfo", model.getAdditionalInfo());

    return Response.ok().entity(model).build();
  }
  
}
