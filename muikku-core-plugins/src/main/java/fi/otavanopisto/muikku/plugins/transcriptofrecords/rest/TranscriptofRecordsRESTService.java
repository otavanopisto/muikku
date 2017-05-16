package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.StreamingOutput;

import org.codehaus.jackson.map.ObjectMapper;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsFileController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.EnvironmentUserController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/records")
@RequestScoped
@Stateful
@Produces("application/json")
@RestCatchSchoolDataExceptions
public class TranscriptofRecordsRESTService extends PluginRESTService {

  private static final long serialVersionUID = 1L;
  private static final int MAX_COURSE_NUMBER = 15;

  @Inject
  private TranscriptOfRecordsFileController transcriptOfRecordsFileController;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private CourseMetaController courseMetaController;

  @Inject
  private TranscriptOfRecordsController vopsController;

  @Inject
  private UserController userController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private EnvironmentUserController environmentUserController;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private GradingController gradingController;

  @Inject
  private Logger logger;

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

    if (!Objects.equals(sessionController.getLoggedUser(), studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Can only look at own information").build();
    }

    User student = userController.findUserByIdentifier(studentIdentifier);

    List<Subject> subjects = courseMetaController.listSubjects();
    List<VopsRESTModel.VopsRow> rows = new ArrayList<>();
    int numCourses = 0;
    int numMandatoryCourses = 0;
    
    for (Subject subject : subjects) {
      if (vopsController.subjectAppliesToStudent(student, subject)) {
        List<VopsRESTModel.VopsItem> items = new ArrayList<>();
        for (int i=1; i<MAX_COURSE_NUMBER; i++) {
          List<Workspace> workspaces =
              workspaceController.listWorkspacesBySubjectIdentifierAndCourseNumber(
                  subject.getSchoolDataSource(),
                  subject.getIdentifier(),
                  i);
          List<WorkspaceAssessment> workspaceAssessments = new ArrayList<>();
          if (!workspaces.isEmpty()) {
            SchoolDataIdentifier educationSubtypeIdentifier = null;
            boolean workspaceUserExists = false;
            for (Workspace workspace : workspaces) {
              WorkspaceEntity workspaceEntity =
                  workspaceController.findWorkspaceEntity(workspace);
              WorkspaceUserEntity workspaceUser =
                  workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(
                      workspaceEntity,
                      studentIdentifier);
              SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspace.getIdentifier(), workspace.getSchoolDataSource());
              WorkspaceAssessment workspaceAssesment = gradingController.findLatestWorkspaceAssessment(workspaceIdentifier, studentIdentifier);
              if (workspaceAssesment != null) {
                workspaceAssessments.add(workspaceAssesment);
              }

              if (workspaceUser != null) {
                workspaceUserExists = true;
              }
            }
            for (Workspace workspace : workspaces) {
              educationSubtypeIdentifier = workspace.getEducationSubtypeIdentifier();
              if (educationSubtypeIdentifier != null) {
                break;
              }
            }
            Mandatority mandatority = educationTypeMapping.getMandatority(educationSubtypeIdentifier);
            CourseCompletionState state = CourseCompletionState.NOT_ENROLLED;
            if (workspaceUserExists) {
              state = CourseCompletionState.ENROLLED;
            }
            for (WorkspaceAssessment workspaceAssessment : workspaceAssessments) {
              if (!workspaceAssessment.getPassing()) {
                state = CourseCompletionState.FAILED;
                break;
              }
            }
            for (WorkspaceAssessment workspaceAssessment : workspaceAssessments) {
              if (workspaceAssessment.getPassing()) {
                state = CourseCompletionState.ASSESSED;
                numCourses++;
                if (mandatority == Mandatority.MANDATORY) {
                  numMandatoryCourses++;
                }
                break;
              }
            }
            items.add(new VopsRESTModel.VopsItem(
                i,
                state,
                educationSubtypeIdentifier != null ? educationSubtypeIdentifier.toId() : null,
                mandatority));
          }
        }
        rows.add(new VopsRESTModel.VopsRow(subject.getCode(), items));
      }
    }

    VopsRESTModel result = new VopsRESTModel(rows, numCourses, numMandatoryCourses);

    return Response.ok(result).build();
  }

  @GET
  @Path("/hops")
  @RESTPermit(handling=Handling.INLINE)
  public Response retrieveForm(){

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }

    SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();
    User user = userController.findUserByIdentifier(userIdentifier);
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
    EnvironmentRoleEntity roleEntity = environmentUser.getRole();

    if (!EnvironmentRoleArchetype.STUDENT.equals(roleEntity.getArchetype())) {
      return Response.status(Status.FORBIDDEN).entity("Must be a student").build();
    }

    HopsRESTModel response = new HopsRESTModel(
        vopsController.loadStringProperty(user, "goalSecondarySchoolDegree"),
        vopsController.loadStringProperty(user, "goalMatriculationExam"),
        vopsController.loadStringProperty(user, "vocationalYears"),
        vopsController.loadStringProperty(user, "goalJustMatriculationExam"),
        vopsController.loadStringProperty(user, "justTransferCredits"),
        vopsController.loadStringProperty(user, "transferCreditYears"),
        vopsController.loadStringProperty(user, "completionYears"),
        vopsController.loadStringProperty(user, "mathSyllabus"),
        vopsController.loadStringProperty(user, "finnish"),
        vopsController.loadBoolProperty(user, "swedish"),
        vopsController.loadBoolProperty(user, "english"),
        vopsController.loadBoolProperty(user, "german"),
        vopsController.loadBoolProperty(user, "french"),
        vopsController.loadBoolProperty(user, "italian"),
        vopsController.loadBoolProperty(user, "spanish"),
        vopsController.loadStringProperty(user, "science"),
        vopsController.loadStringProperty(user, "religion"),
        vopsController.loadStringProperty(user, "additionalInfo")
    );

    return Response.ok(response).build();
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
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
    EnvironmentRoleEntity roleEntity = environmentUser.getRole();

    if (!EnvironmentRoleArchetype.STUDENT.equals(roleEntity.getArchetype())) {
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
