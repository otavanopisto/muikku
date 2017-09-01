package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

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
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities.EscapeMode;
import org.jsoup.safety.Cleaner;
import org.jsoup.safety.Whitelist;

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.StudiesViewCourseChoiceController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsFileController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptofRecordsPermissions;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptofRecordsUserProperties;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.VopsWorkspace;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.StudiesViewCourseChoice;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.Optionality;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.TransferCredit;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.EnvironmentUserController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
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
  private static final int MAX_COURSE_NUMBER = 15;

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
  private EnvironmentUserController environmentUserController;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private StudiesViewCourseChoiceController studiesViewCourseChoiceController;

  @Inject
  private GradingController gradingController;
  
  @Inject
  private Logger logger;
  
  private String clean(String html) {
    if (html == null) {
      return null;
    }
    Document doc = Jsoup.parseBodyFragment(html);
    doc = new Cleaner(Whitelist.none()).clean(doc);
    doc.outputSettings().escapeMode(EscapeMode.xhtml);
    return doc.body().html();
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
    
    UserEntity studentEntity = userEntityController.findUserEntityByUser(student);
    
    if (!vopsController.shouldShowStudies(studentEntity)) {
      VopsRESTModel result = new VopsRESTModel(null, 0, 0, false);
      return Response.ok(result).build();
    }
    
    List<TransferCredit> transferCredits = new ArrayList<>(gradingController.listStudentTransferCredits(studentIdentifier));

    List<Subject> subjects = courseMetaController.listSubjects();
    List<VopsRESTModel.VopsRow> rows = new ArrayList<>();
    int numCourses = 0;
    int numMandatoryCourses = 0;
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
    
    for (Subject subject : subjects) {
      boolean subjectHasCourses = false;
      if (vopsController.subjectAppliesToStudent(student, subject)) {
        List<VopsRESTModel.VopsEntry> entries = new ArrayList<>();
        for (int courseNumber=1; courseNumber<MAX_COURSE_NUMBER; courseNumber++) {
          boolean hasTransferCredit = false;

          for (TransferCredit transferCredit : transferCredits) {
            boolean subjectsMatch = Objects.equals(
                transferCredit.getSubjectIdentifier(),
                new SchoolDataIdentifier(subject.getIdentifier(), subject.getSchoolDataSource()));
            boolean courseNumbersMatch = Objects.equals(
                transferCredit.getCourseNumber(),
                courseNumber);
            if (subjectsMatch && courseNumbersMatch) {
              String grade = "";
              GradingScaleItem gradingScaleItem = null;
              Mandatority mandatority = Mandatority.MANDATORY;
              if (transferCredit.getOptionality() == Optionality.OPTIONAL) {
                mandatority = Mandatority.UNSPECIFIED_OPTIONAL;
              }

              if (transferCredit.getGradeIdentifier() != null
                  && transferCredit.getGradingScaleIdentifier() != null) {
                gradingScaleItem = findGradingScaleItemCached(
                    transferCredit.getGradingScaleIdentifier(),
                    transferCredit.getGradeIdentifier()
                );
                
                String gradeName = gradingScaleItem.getName();
                if (!StringUtils.isBlank(gradeName)) {
                  if (gradeName.length() > 2)
                    grade = gradeName.substring(0, 2);
                  else
                    grade = gradeName;
                }
              }
              entries.add(new VopsRESTModel.VopsItem(
                  courseNumber,
                  CourseCompletionState.ASSESSED,
                  (String)null,
                  mandatority,
                  grade,
                  false,
                  transferCredit.getCourseName(),
                  ""
              ));
              hasTransferCredit = true;
              break;
            }
          }

          List<VopsWorkspace> workspaces =
              vopsController.listWorkspaceIdentifiersBySubjectIdentifierAndCourseNumber(
                  subject.getSchoolDataSource(),
                  subject.getIdentifier(),
                  courseNumber);
          
          List<WorkspaceAssessment> workspaceAssessments = new ArrayList<>();
          
          boolean correctCurriculum = false;
          
          if (curriculumIdentifier == null) {
            correctCurriculum = true;
          } else {
            for (VopsWorkspace workspace : workspaces) {
              if (workspace.getCurriculumIdentifiers().contains(curriculumIdentifier)) {
                correctCurriculum = true;
                break;
              }
            }
          }

          if (!hasTransferCredit && !workspaces.isEmpty() && correctCurriculum) {
            SchoolDataIdentifier educationSubtypeIdentifier = null;
            boolean workspaceUserExists = false;
            String name = "";
            String description = "";

            for (VopsWorkspace workspace : workspaces) {
              WorkspaceEntity workspaceEntity =
                  workspaceController.findWorkspaceEntityById(workspace.getWorkspaceIdentifier());
              WorkspaceUserEntity workspaceUser =
                  workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(
                      workspaceEntity,
                      studentIdentifier);
              WorkspaceAssessment workspaceAssesment = studentAssessments.get(workspace.getWorkspaceIdentifier());
              
              List<UserGroupEntity> userGroupEntities = userGroupEntityController.listUserGroupsByUserIdentifier(studentIdentifier);
              
              boolean canSignUp = false;
              
              Permission permission = permissionController.findByName(MuikkuPermissions.WORKSPACE_SIGNUP);
              for (UserGroupEntity userGroupEntity : userGroupEntities) {
                if (permissionController.hasWorkspaceGroupPermission(workspaceEntity, userGroupEntity, permission)) {
                  canSignUp = true;
                  break;
                }
              }
              
              if (!canSignUp) {
                continue;
              }
              
              
              if (workspaceAssesment != null) {
                workspaceAssessments.add(workspaceAssesment);
              }

              if (workspaceUser != null) {
                workspaceUserExists = true;
              }
            }
            
            for (VopsWorkspace workspace : workspaces) {
              name = workspace.getName();
              if (name != null) {
                break;
              }
            }
            
            for (VopsWorkspace workspace : workspaces) {
              description = workspace.getDescription();
              if (description != null) {
                break;
              }
            }
            
            for (VopsWorkspace workspace : workspaces) {
              educationSubtypeIdentifier = workspace.getEducationSubtypeIdentifier();
              if (educationSubtypeIdentifier != null) {
                break;
              }
            }
            
            Mandatority mandatority = educationTypeMapping.getMandatority(educationSubtypeIdentifier);
            CourseCompletionState state = CourseCompletionState.NOT_ENROLLED;
            String grade = null;
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

                SchoolDataIdentifier gradingScaleIdentifier = workspaceAssessment.getGradingScaleIdentifier();
                if (gradingScaleIdentifier == null) {
                  break;
                }
                SchoolDataIdentifier gradeIdentifier = workspaceAssessment.getGradeIdentifier();
                if (gradeIdentifier == null) {
                  break;
                }
                GradingScaleItem gradingScaleItem = findGradingScaleItemCached(gradingScaleIdentifier, gradeIdentifier);
                String gradeName = gradingScaleItem.getName();
                if (!StringUtils.isBlank(gradeName)) {
                  // 2 characters is enough to cover cases like "10" and "Suoritettu/Saanut opetusta" unambiguously
                  // and still looking good in the matrix
                  
                  if (gradeName.length() > 2)
                    grade = gradeName.substring(0, 2);
                  else
                    grade = gradeName;
                }
                
                break;
              }
            }
            
            StudiesViewCourseChoice courseChoice = studiesViewCourseChoiceController.find(
                new SchoolDataIdentifier(subject.getIdentifier(), subject.getSchoolDataSource()).toId(),
                courseNumber,
                studentIdentifierString);
            if (state == CourseCompletionState.NOT_ENROLLED
                && courseChoice != null) {
              state = CourseCompletionState.PLANNED;
            }
            
            entries.add(new VopsRESTModel.VopsItem(
                courseNumber,
                state,
                educationSubtypeIdentifier != null ? educationSubtypeIdentifier.toId() : null,
                mandatority,
                grade,
                workspaceUserExists,
                clean(name),
                clean(description)
            ));
            subjectHasCourses = true;
          } else if (!hasTransferCredit) {
            entries.add(new VopsRESTModel.VopsPlaceholder());
          }
        }
        if (subjectHasCourses) {
          rows.add(new VopsRESTModel.VopsRow(
              subject.getCode(),
              new SchoolDataIdentifier(subject.getIdentifier(), subject.getSchoolDataSource()).toId(),
              entries));
        }
      }
    }

    VopsRESTModel result = new VopsRESTModel(rows, numCourses, numMandatoryCourses, true);

    return Response.ok(result).build();
  }
  
  
  private GradingScaleItem findGradingScaleItemCached(SchoolDataIdentifier gradingScaleIdentifier, SchoolDataIdentifier gradingScaleItemIdentifier) {
    GradingScaleItemCoordinates key = new GradingScaleItemCoordinates(gradingScaleIdentifier, gradingScaleItemIdentifier);
    if (!gradingScaleCache.containsKey(key)) {
      GradingScale gradingScale = gradingController.findGradingScale(gradingScaleIdentifier);
      if (gradingScale == null) {
        logger.log(Level.SEVERE, "Grading scale not found for identifier: %s", gradingScaleIdentifier);
        return null;
      }
      for (GradingScaleItem gradingScaleItem : gradingController.listGradingScaleItems(gradingScale)) {
        GradingScaleItemCoordinates newItemKey = new GradingScaleItemCoordinates(
            gradingScaleIdentifier,
            new SchoolDataIdentifier(gradingScaleItem.getIdentifier(), gradingScaleItem.getSchoolDataSource()));
        gradingScaleCache.put(newItemKey, gradingScaleItem);
      }
    }
    return gradingScaleCache.get(key);
  }

  private HopsRESTModel createHopsRESTModelForStudent(SchoolDataIdentifier userIdentifier) {
    User user = userController.findUserByIdentifier(userIdentifier);
    UserEntity userEntity = userEntityController.findUserEntityByUser(user);
    EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
    EnvironmentRoleEntity roleEntity = environmentUser.getRole();

    if (!EnvironmentRoleArchetype.STUDENT.equals(roleEntity.getArchetype())) {
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

    if (!vopsController.shouldShowStudies(userEntity)) {
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
  
  private static class GradingScaleItemCoordinates {
    public GradingScaleItemCoordinates(
        SchoolDataIdentifier gradingScaleIdentifier,
        SchoolDataIdentifier gradingScaleItemIdentifier
    ) {
      this.gradingScaleIdentifier = gradingScaleIdentifier;
      this.gradingScaleItemIdentifier = gradingScaleItemIdentifier;
    }
    
    @Override
    public boolean equals(Object obj) {
      if (obj instanceof GradingScaleItemCoordinates) {
        GradingScaleItemCoordinates coords = (GradingScaleItemCoordinates) obj;
        return coords.gradingScaleIdentifier.equals(this.gradingScaleIdentifier) &&
               coords.gradingScaleItemIdentifier.equals(this.gradingScaleItemIdentifier);
      } else {
        return false;
      }
    }
    
    @Override
    public int hashCode() {
      return gradingScaleIdentifier.hashCode() * 37 + gradingScaleItemIdentifier.hashCode();
    }
    
    private final SchoolDataIdentifier gradingScaleIdentifier;
    private final SchoolDataIdentifier gradingScaleItemIdentifier;
  }
  
  private Map<GradingScaleItemCoordinates, GradingScaleItem> gradingScaleCache = new HashMap<>();
}
