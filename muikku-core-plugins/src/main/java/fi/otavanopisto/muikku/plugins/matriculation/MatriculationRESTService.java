package fi.otavanopisto.muikku.plugins.matriculation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserIdentifierProperty;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.plugins.hops.HopsController;
import fi.otavanopisto.muikku.plugins.hops.HopsWebsocketMessenger;
import fi.otavanopisto.muikku.plugins.hops.ws.HopsMatriculationPlanWSMessage;
import fi.otavanopisto.muikku.plugins.matriculation.dao.SavedMatriculationEnrollmentDAO;
import fi.otavanopisto.muikku.plugins.matriculation.model.SavedMatriculationEnrollment;
import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationExamAttendance;
import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationExamEnrollment;
import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationExamEnrollmentChangeLogEntryRestModel;
import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationPlanRESTModel;
import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationSubjectResult;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsController;
import fi.otavanopisto.muikku.rest.model.UserBasicInfo;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.MatriculationExamListFilter;
import fi.otavanopisto.muikku.schooldata.MatriculationSchoolDataController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.GroupStaffMember;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentChangeLogEntry;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentState;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationGrade;
import fi.otavanopisto.muikku.schooldata.entity.StudentCourseStats;
import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibilityOPS2021;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserGroupGuidanceController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/matriculation")
@Produces("application/json")
@RestCatchSchoolDataExceptions
@Stateless
public class MatriculationRESTService {

  @Inject
  private Logger logger;
  
  @Inject
  private MatriculationSchoolDataController matriculationController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private SavedMatriculationEnrollmentDAO savedMatriculationEnrollmentDAO;
  
  @Inject
  private MatriculationNotificationController matriculationNotificationController;
  
  @Inject
  private TranscriptOfRecordsController transcriptOfRecordsController;
  
  @Inject
  private UserGroupGuidanceController userGroupGuidanceController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private HopsController hopsController;

  @Inject
  private HopsWebsocketMessenger hopsWebSocketMessenger;

  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  @Path("/students/{STUDENTIDENTIFIER}/exams")
  public Response listStudentsExams(@PathParam("STUDENTIDENTIFIER") SchoolDataIdentifier studentIdentifier, @QueryParam("filter") @DefaultValue("ALL") MatriculationExamListFilter filter) {
    if (!hopsController.canViewHops(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }

    BridgeResponse<List<MatriculationExam>> response = matriculationController.listStudentsExams(studentIdentifier, filter);
    if (response.ok()) {
      List<MatriculationCurrentExam> examRestModels = response.getEntity().stream().map(exam -> restModel(exam)).collect(Collectors.toList());
      return Response.ok(examRestModels).build();
    }
    else {
      Status status = Status.fromStatusCode(response.getStatusCode());
      return status != null ? Response.status(status).build() : Response.status(response.getStatusCode()).build();
    }
  }
  
  @GET
  @RESTPermit(MatriculationPermissions.MATRICULATION_FIND_ENROLLMENT)
  @Path("/students/{STUDENTIDENTIFIER}/exams/{EXAMID}/enrollment")
  public Response getEnrollment(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr, @PathParam("EXAMID") Long examId) {
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (studentIdentifierStr == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid identifier").build();
    }
    
    if (!studentIdentifier.equals(sessionController.getLoggedUser()) && !userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }
    
    BridgeResponse<fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment> response = matriculationController.getEnrollment(studentIdentifier, examId);
    if (response.ok()) {
      return Response.ok().entity(restModel(response.getEntity())).build();
    }
    else {
      Status status = Status.fromStatusCode(response.getStatusCode());
      return status != null ? Response.status(status).build() : Response.status(response.getStatusCode()).build();
    }
  }
  
  @GET
  @RESTPermit(handling = Handling.INLINE)
  @Path("/students/{STUDENTIDENTIFIER}/exams/{EXAMID}/enrollment/changelog")
  public Response getEnrollmentChangeLog(@PathParam("STUDENTIDENTIFIER") SchoolDataIdentifier studentIdentifier, @PathParam("EXAMID") Long examId) {
    if (!hopsController.canViewHops(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }

    BridgeResponse<List<MatriculationExamEnrollmentChangeLogEntry>> response = matriculationController.getEnrollmentChangeLog(studentIdentifier, examId);
    if (response.ok()) {
      return Response.ok().entity(restModel(response.getEntity())).build();
    }
    else {
      Status status = Status.fromStatusCode(response.getStatusCode());
      return status != null ? Response.status(status).build() : Response.status(response.getStatusCode()).build();
    }
  }
  
  @PUT
  @RESTPermit(MatriculationPermissions.MATRICULATION_SEND_ENROLLMENT)
  @Path("/students/{STUDENTIDENTIFIER}/exams/{EXAMID}/enrollment/state")
  public Response setEnrollmentState(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr, @PathParam("EXAMID") Long examId, MatriculationEnrollmentStateChangePayload payload) {
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (studentIdentifierStr == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid identifier").build();
    }
    
    // Allow only CONFIRMED state change
    if (payload == null || payload.getState() != MatriculationExamEnrollmentState.CONFIRMED) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid or missing state").build();
    }
    
    if (!studentIdentifier.equals(sessionController.getLoggedUser())) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }
    
    BridgeResponse<fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment> response = matriculationController.setEnrollmentState(studentIdentifier, examId, payload.getState());
    if (response.ok()) {
      return Response.noContent().build();
    }
    else {
      Status status = Status.fromStatusCode(response.getStatusCode());
      return status != null ? Response.status(status).build() : Response.status(response.getStatusCode()).build();
    }
  }
  
  @GET
  @RESTPermit(MatriculationPermissions.MATRICULATION_LOAD_DRAFT)
  @Path("/exams/{EXAMID}/savedEnrollments/{USERID}")
  public Response fetchEnrollmentDraft(@PathParam("EXAMID") Long examId, @PathParam("USERID") String userId) {
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(userId);
    if (identifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid user id").build();
    }
    SchoolDataIdentifier loggedUserIdentifier = sessionController.getLoggedUser();
    if (!identifier.equals(loggedUserIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }
    SavedMatriculationEnrollment savedEnrollment = savedMatriculationEnrollmentDAO.findByUser(examId, identifier);
    if (savedEnrollment != null) {
      return Response.ok(savedEnrollment.getSavedEnrollmentJson()).build();
    }
    return Response.status(Status.NOT_FOUND).build();
  }

  @PUT
  @RESTPermit(MatriculationPermissions.MATRICULATION_SAVE_DRAFT)
  @Path("/exams/{EXAMID}/savedEnrollments/{USERID}")
  public Response saveEnrollmentDraft(@PathParam("EXAMID") Long examId, @PathParam("USERID") String userId, String body) {
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(userId);
    if (identifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid user id").build();
    }
    SchoolDataIdentifier loggedUserIdentifier = sessionController.getLoggedUser();
    if (!identifier.equals(loggedUserIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }
    SavedMatriculationEnrollment savedEnrollment = savedMatriculationEnrollmentDAO.findByUser(examId, identifier);
    if (savedEnrollment != null) {
      savedMatriculationEnrollmentDAO.updateSavedEnrollmentJson(savedEnrollment, body);
    } else {
      savedEnrollment = savedMatriculationEnrollmentDAO.create(examId, identifier, body);
    }
    return Response.ok(savedEnrollment).build();
  }
  
  @GET
  @RESTPermit(MatriculationPermissions.MATRICULATION_GET_INITIALDATA)
  @Path("/students/{STUDENTIDENTIFIER}/initialData")
  public Response fetchInitialData(@PathParam("STUDENTIDENTIFIER") SchoolDataIdentifier studentIdentifier) {
    MatriculationExamInitialData result = new MatriculationExamInitialData();

    SchoolDataIdentifier loggedUserIdentifier = sessionController.getLoggedUser();
    if (!studentIdentifier.equals(loggedUserIdentifier) && !userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }
    User user = userController.findUserByIdentifier(studentIdentifier);
    if (user == null) {
      return Response.status(Status.NOT_FOUND).entity("User not found").build();
    }
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
    List<UserAddress> userAddresses = userController.listUserAddresses(user);
    List<UserPhoneNumber> phoneNumbers = userController.listUserPhoneNumbers(user);
    StudentCourseStats studentCourseStats = transcriptOfRecordsController.fetchStudentCourseStats(studentIdentifier);

    // Group and Study Advisors

    List<String> studyAdvisors = new ArrayList<>();
    
    List<GroupStaffMember> guidanceCounselors = userGroupGuidanceController.getGuidanceCounselors(studentIdentifier);
    
    List<String> guidanceCounselorList = new ArrayList<>();

    // Guidance counselors
    for (GroupStaffMember guidanceCounselor : guidanceCounselors) {
      if (guidanceCounselor.isGroupAdvisor()) {
        UserEntity guidanceCounselorUserEntity = userEntityController.findUserEntityByUserIdentifier(guidanceCounselor.userSchoolDataIdentifier());
        UserEntityName guidanceCounselorUserEntityName = userEntityController.getName(guidanceCounselorUserEntity, false);

        if (guidanceCounselorUserEntityName != null) {
          guidanceCounselorList.add(guidanceCounselorUserEntityName.getDisplayName());
        }
      }
      // Study advisors
      if (guidanceCounselor.isStudyAdvisor()) {
        UserEntity guidanceCounselorUserEntity = userEntityController.findUserEntityByUserIdentifier(guidanceCounselor.userSchoolDataIdentifier());
        UserEntityName guidanceCounselorUserEntityName = userEntityController.getName(guidanceCounselorUserEntity, false);
        if (guidanceCounselorUserEntityName != null) {
          studyAdvisors.add(guidanceCounselorUserEntityName.getDisplayName());
        }
      }
    }

    String address = "";
    String postalCode = "";
    String locality = "";
    String phoneNumber = "";
    String emailAddress = userEmailEntityController.getUserDefaultEmailAddress(userEntity, false); 
    String name = "";
    if (user.getFirstName() != null) {
      name += user.getFirstName();
    }
    if (user.getLastName() != null) {
      name += " " + user.getLastName();
    }
    for (UserAddress userAddress : userAddresses) {
      if (userAddress.getDefaultAddress()) {
        address = userAddress.getStreet();
        postalCode = userAddress.getPostalCode();
        locality = userAddress.getCity();
      }
    }
    for (UserPhoneNumber userPhoneNumber : phoneNumbers) {
      if (userPhoneNumber.getDefaultNumber()) {
        phoneNumber = userPhoneNumber.getNumber();
      }
    }
    
    result.setName(name);
    result.setEmail(emailAddress);
    result.setPhone(phoneNumber);
    result.setAddress(address);
    result.setPostalCode(postalCode);
    result.setLocality(locality);
    result.setGuidanceCounselors(guidanceCounselorList);
    result.setStudyAdvisors(studyAdvisors);
    result.setStudentIdentifier(studentIdentifier.toId());
    result.setCompletedCreditPointsCount(studentCourseStats != null ? studentCourseStats.getSumMandatoryCompletedCreditPoints() : null);
    
    return Response.ok(result).build();
  }

  private long getStudentIdFromIdentifier(SchoolDataIdentifier identifier) {
    return matriculationController.getStudentId(identifier);
  }
  
  @POST
  @RESTPermit(MatriculationPermissions.MATRICULATION_SEND_ENROLLMENT)
  @Path("/exams/{EXAMID}/enrollments")
  public Response sendEnrollment(@PathParam("EXAMID") Long examId, MatriculationExamEnrollment enrollment) {
    if (enrollment.getStudentIdentifier() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing StudentIdentifier").build();
    }

    SchoolDataIdentifier loggedUserIdentifier = sessionController.getLoggedUser();
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(enrollment.getStudentIdentifier());
    if (loggedUserIdentifier == null) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    if (!Objects.equals(loggedUserIdentifier, studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }
    Long studentId = getStudentIdFromIdentifier(studentIdentifier);
    
    /*
     * Validation
     */
    
    if (examId == null) {
      return Response.status(Status.BAD_REQUEST).entity("Exam ids cannot be null").build();
    }
    
    if (!Objects.equals(examId, enrollment.getExamId())) {
      return Response.status(Status.BAD_REQUEST).entity("Exam ids do not match").build();
    }

    List<String> validAttendanceStatus = Arrays.asList("FINISHED", "PLANNED", "ENROLLED");
    
    for (MatriculationExamAttendance attendance : enrollment.getAttendances()) {
      if (!validAttendanceStatus.contains(attendance.getStatus())) {
        return Response.status(Status.BAD_REQUEST).entity("Attendance has invalid status").build();
      }

      /*
       * Validate term and year.
       */
      if (StringUtils.equals(attendance.getStatus(), "FINISHED") || StringUtils.equals(attendance.getStatus(), "PLANNED")) {
        if (attendance.getTerm() == null) {
          return Response.status(Status.BAD_REQUEST).entity("Attendance missing term").build();
        }
        if (attendance.getYear() == null) {
          return Response.status(Status.BAD_REQUEST).entity("Attendance missing year").build();
        }
      }
    }
    
    fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment schoolDataEntity = 
        matriculationController.createMatriculationExamEnrollment();
    
    schoolDataEntity.setId(enrollment.getId());
    schoolDataEntity.setExamId(enrollment.getExamId());
    schoolDataEntity.setNationalStudentNumber(enrollment.getNationalStudentNumber());
    schoolDataEntity.setEnrollAs(enrollment.getEnrollAs());
    schoolDataEntity.setDegreeType(enrollment.getDegreeType());
    schoolDataEntity.setRestartExam(enrollment.isRestartExam());
    schoolDataEntity.setNumMandatoryCourses(enrollment.getNumMandatoryCourses());
    schoolDataEntity.setLocation(enrollment.getLocation());
    schoolDataEntity.setCanPublishName(enrollment.isCanPublishName());
    schoolDataEntity.setContactInfoChange(enrollment.getContactInfoChange());
    schoolDataEntity.setMessage(enrollment.getMessage());
    schoolDataEntity.setStudentId(studentId);
    schoolDataEntity.setState(enrollment.getState());
    schoolDataEntity.setDegreeStructure(enrollment.getDegreeStructure());
    
    List<fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance> attendances = new ArrayList<>();
    for (MatriculationExamAttendance attendance : enrollment.getAttendances()) {
      fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance resultAttendance
        = matriculationController.createMatriculationExamAttendance();
      resultAttendance.setId(attendance.getId());
      resultAttendance.setSubject(attendance.getSubject());
      resultAttendance.setGrade(attendance.getGrade());
      resultAttendance.setMandatory(attendance.getMandatory());
      resultAttendance.setRepeat(attendance.getRepeat());
      resultAttendance.setTerm(attendance.getTerm());
      resultAttendance.setStatus(attendance.getStatus());
      resultAttendance.setYear(attendance.getYear());
      resultAttendance.setFunding(attendance.getFunding());
      attendances.add(resultAttendance);
    }
    schoolDataEntity.setAttendances(attendances);
    BridgeResponse<fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment> response = matriculationController.submitMatriculationExamEnrollment(studentIdentifier, examId, schoolDataEntity);
    
    if (response.ok()) {
      try {
        matriculationNotificationController.sendEnrollmentNotification(enrollment, studentIdentifier);
      } catch (IOException e) {
        logger.log(Level.SEVERE, "Failed to send matriculation enrollment notification email", e);
      }
      
      return Response.ok().build();
    }
    else {
      Status status = Status.fromStatusCode(response.getStatusCode());
      return status != null ? Response.status(status).build() : Response.status(response.getStatusCode()).build();
    }
  }

  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  @Path("/students/{STUDENTIDENTIFIER}/plan")
  public Response getStudentsMatriculationPlan(@PathParam("STUDENTIDENTIFIER") SchoolDataIdentifier studentIdentifier) {
    if (!hopsController.canViewHops(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }

    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    if (userSchoolDataIdentifier == null || !userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      return Response.status(Status.FORBIDDEN).entity("Must be a student").build();
    }

    MatriculationPlanRESTModel planRestModel = null;
    UserIdentifierProperty hopsProperty = userEntityController.getUserIdentifierPropertyByKey(studentIdentifier.getIdentifier(), "matriculationPlan");
    if (hopsProperty != null && !StringUtils.isBlank(hopsProperty.getValue())) {
      try {
        planRestModel = new ObjectMapper().readValue(hopsProperty.getValue(), MatriculationPlanRESTModel.class);
      }
      catch (Exception e) {
        logger.log(Level.SEVERE, "Error deserializing HOPS form", e);
      }
    }

    if (planRestModel == null) {
      planRestModel = new MatriculationPlanRESTModel();
    }
    
    return Response.ok(planRestModel).build();
  }
  
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  @Path("/students/{STUDENTIDENTIFIER}/plan")
  public Response updateStudentsMatriculationPlan(@PathParam("STUDENTIDENTIFIER") SchoolDataIdentifier studentIdentifier, MatriculationPlanRESTModel model) {
    if (model == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing payload").build();
    }

    if (!hopsController.canModifyHops(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    if (userSchoolDataIdentifier == null || !userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      return Response.status(Status.FORBIDDEN).entity("Must be a student").build();
    }

    try {
      userEntityController.setUserIdentifierProperty(studentIdentifier.getIdentifier(), "matriculationPlan", new ObjectMapper().writeValueAsString(model));
    }
    catch (Exception e) {
      logger.log(Level.SEVERE, "Error serializing matriculation plan", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Error serializing matriculation plan").build();
    }
    
    HopsMatriculationPlanWSMessage msg = new HopsMatriculationPlanWSMessage();
    msg.setGoalMatriculationExam(model.getGoalMatriculationExam());
    msg.setPlannedSubjects(model.getPlannedSubjects());
    msg.setStudentIdentifier(studentIdentifier.toId());
    hopsWebSocketMessenger.sendMessage(studentIdentifier.toId(), "hops:matriculationplan-updated", msg);

    return Response.ok().entity(model).build();
  }

  @GET
  @Path("/students/{STUDENTIDENTIFIER}/matriculationEligibility")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response findMatriculationEligibility(
      @PathParam("STUDENTIDENTIFIER") SchoolDataIdentifier studentIdentifier,
      @QueryParam ("subjectCode") String subjectCode) {
    if (!hopsController.canViewHops(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }
    
    BridgeResponse<StudentMatriculationEligibilityOPS2021> result = matriculationController.getStudentMatriculationEligibility(studentIdentifier, subjectCode);

    if (result.ok()) {
      return Response.ok(result.getEntity()).build();
    } 
    else {
      Status status = Status.fromStatusCode(result.getStatusCode());
      return status != null ? Response.status(status).build() : Response.status(result.getStatusCode()).build();
    }
  }

  @GET
  @Path("/students/{STUDENTIDENTIFIER}/results")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response findMatriculationResults(@PathParam("STUDENTIDENTIFIER") SchoolDataIdentifier studentIdentifier) {
    if (!hopsController.canViewHops(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }
    
    BridgeResponse<List<MatriculationGrade>> bridgeResponse = matriculationController.listStudentsMatriculationGrades(studentIdentifier);

    if (bridgeResponse.ok()) {
      List<MatriculationSubjectResult> result = new ArrayList<>();
      
      List<MatriculationGrade> pastExams = bridgeResponse.getEntity();
      
      Map<String, List<MatriculationGrade>> subjectGroups = pastExams.stream()
        .filter(grade -> StringUtils.isNotBlank(grade.getGrade()))
        .filter(grade -> grade.getGradeDate() != null)
        .collect(Collectors.groupingBy(grade -> grade.getSubject()));

      for (String subjectCode : subjectGroups.keySet()) {
        List<MatriculationGrade> attendances = subjectGroups.get(subjectCode);
        
        List<fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationGrade> gradeRestModels = attendances.stream()
          .sorted(Comparator.comparing(MatriculationGrade::getGradeDate))
          .map(attendance -> restModel(attendance))
          .collect(Collectors.toList());
        
        MatriculationSubjectResult subjectResult = new MatriculationSubjectResult();
        subjectResult.setSubjectCode(subjectCode);
        subjectResult.setGrades(gradeRestModels);
        result.add(subjectResult);
      }
      
      return Response.ok(result).build();
    } 
    else {
      Status status = Status.fromStatusCode(bridgeResponse.getStatusCode());
      return status != null ? Response.status(status).build() : Response.status(bridgeResponse.getStatusCode()).build();
    }
  }

  private MatriculationCurrentExam restModel(MatriculationExam exam) {
    MatriculationExamEnrollment enrollment = restModel(exam.getEnrollment());
    return new MatriculationCurrentExam(exam.getId(), exam.getYear(), exam.getTerm(), exam.getStarts(), exam.getEnds(), 
        exam.getConfirmDate(), exam.isCompulsoryEducationEligible(), exam.getStudentStatus(), enrollment);
  }
  
  private MatriculationExamEnrollment restModel(
      fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment enrollment) {
    if (enrollment == null) {
      return null;
    }

    List<MatriculationExamAttendance> attendances = new ArrayList<>();
    
    if (enrollment.getAttendances() != null) {
      for (fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance attendance : enrollment.getAttendances()) {
        attendances.add(restModel(attendance));
      }
    }
    
    MatriculationExamEnrollment restModel = new MatriculationExamEnrollment();

    restModel.setId(enrollment.getId());
    restModel.setAttendances(attendances);
    restModel.setCanPublishName(enrollment.isCanPublishName());
    restModel.setDegreeStructure(enrollment.getDegreeStructure());
    restModel.setDegreeType(enrollment.getDegreeType());
    restModel.setEnrollAs(enrollment.getEnrollAs());
    restModel.setEnrollmentDate(enrollment.getEnrollmentDate());
    restModel.setExamId(enrollment.getExamId());
    restModel.setLocation(enrollment.getLocation());
    restModel.setContactInfoChange(enrollment.getContactInfoChange());
    restModel.setMessage(enrollment.getMessage());
    restModel.setNationalStudentNumber(enrollment.getNationalStudentNumber());
    restModel.setNumMandatoryCourses(enrollment.getNumMandatoryCourses());
    restModel.setRestartExam(enrollment.isRestartExam());
    restModel.setState(enrollment.getState());
//    restModel.setStudentIdentifier(enrollment.getstudentAddress()); // TODO the id mess
    
    
    return restModel;
  }

  private MatriculationExamAttendance restModel(
      fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance attendance) {
    MatriculationExamAttendance attendanceRestModel = new MatriculationExamAttendance();
    attendanceRestModel.setId(attendance.getId());
    attendanceRestModel.setFunding(attendance.getFunding());
    attendanceRestModel.setGrade(attendance.getGrade());
    attendanceRestModel.setGradeDate(attendance.getGradeDate());
    attendanceRestModel.setMandatory(attendance.getMandatory());
    attendanceRestModel.setRepeat(attendance.getRepeat());
    attendanceRestModel.setStatus(attendance.getStatus());
    attendanceRestModel.setSubject(attendance.getSubject());
    attendanceRestModel.setTerm(attendance.getTerm());
    attendanceRestModel.setYear(attendance.getYear());
    return attendanceRestModel;
  }

  private List<MatriculationExamEnrollmentChangeLogEntryRestModel> restModel(List<MatriculationExamEnrollmentChangeLogEntry> entryList) {
    return entryList != null 
        ? entryList.stream()
            .sorted(Comparator.comparing(MatriculationExamEnrollmentChangeLogEntry::getTimestamp).reversed())
            .map(entry -> restModel(entry))
            .collect(Collectors.toList()) 
        : Collections.emptyList();
  }

  private MatriculationExamEnrollmentChangeLogEntryRestModel restModel(MatriculationExamEnrollmentChangeLogEntry entry) {
    SchoolDataIdentifier modifierIdentifier = entry.getModifierIdentifier();
    UserEntityName modifierName = userEntityController.getName(modifierIdentifier, false);
    UserEntity modifierUserEntity = userEntityController.findUserEntityByUserIdentifier(modifierIdentifier);
    boolean hasImage = modifierUserEntity != null ? userEntityController.hasProfilePicture(modifierUserEntity) : false;
    
    UserBasicInfo modifier = (modifierUserEntity != null && modifierName != null) ? new UserBasicInfo(modifierUserEntity.getId(), modifierIdentifier.toId(), 
        modifierName.getFirstName(), modifierName.getLastName(), modifierName.getNickName(), hasImage) : null;
    
    MatriculationExamEnrollmentChangeLogEntryRestModel restModel = new MatriculationExamEnrollmentChangeLogEntryRestModel();
    restModel.setModifier(modifier);
    restModel.setTimestamp(entry.getTimestamp());
    restModel.setChangeType(entry.getChangeType());
    restModel.setNewState(entry.getNewState());
    restModel.setMessage(entry.getMessage());
    return restModel;
  }

  private fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationGrade restModel(MatriculationGrade grade) {
    fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationGrade result = new fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationGrade();

    result.setSubject(grade.getSubject());
    result.setYear(grade.getYear());
    result.setTerm(grade.getTerm());
    result.setGrade(grade.getGrade());
    result.setGradeDate(grade.getGradeDate());

    return result;
  }
  
}
