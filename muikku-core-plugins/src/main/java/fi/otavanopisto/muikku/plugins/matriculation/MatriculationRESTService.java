package fi.otavanopisto.muikku.plugins.matriculation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
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

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.matriculation.dao.SavedMatriculationEnrollmentDAO;
import fi.otavanopisto.muikku.plugins.matriculation.dao.SentMatriculationEnrollmentDAO;
import fi.otavanopisto.muikku.plugins.matriculation.model.SavedMatriculationEnrollment;
import fi.otavanopisto.muikku.plugins.matriculation.model.SentMatriculationEnrollment;
import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationExamAttendance;
import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationExamEnrollment;
import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationExamEnrollmentChangeLogEntryRestModel;
import fi.otavanopisto.muikku.rest.model.UserBasicInfo;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.MatriculationExamListFilter;
import fi.otavanopisto.muikku.schooldata.MatriculationSchoolDataController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentChangeLogEntry;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentState;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.security.rest.RESTPermit;

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
  private SentMatriculationEnrollmentDAO sentMatriculationEnrollmentDAO;

  @Inject
  private MatriculationNotificationController matriculationNotificationController;
  
  @GET
  @RESTPermit(MatriculationPermissions.MATRICULATION_LIST_EXAMS)
  @Path("/exams")
  @Deprecated                           // TODO REMOVE THIS AFTER FRONT IS REFACTORED
  public Response listAvailableExams() {
    return listStudentsExams(sessionController.getLoggedUser().toId(), MatriculationExamListFilter.ALL);
  }
  
  @GET
  @RESTPermit(MatriculationPermissions.MATRICULATION_LIST_EXAMS)
  @Path("/students/{STUDENTIDENTIFIER}/exams")
  public Response listStudentsExams(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr, @QueryParam("filter") @DefaultValue("ALL") MatriculationExamListFilter filter) {
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (studentIdentifierStr == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid identifier").build();
    }
    
    if (!studentIdentifier.equals(sessionController.getLoggedUser())) {
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
  @RESTPermit(MatriculationPermissions.MATRICULATION_LIST_EXAMS)
  @Path("/students/{STUDENTIDENTIFIER}/exams/{EXAMID}/enrollment")
  public Response getEnrollment(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr, @PathParam("EXAMID") Long examId) {
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (studentIdentifierStr == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid identifier").build();
    }
    
    if (!studentIdentifier.equals(sessionController.getLoggedUser())) {
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
  @RESTPermit(MatriculationPermissions.MATRICULATION_LIST_EXAMS)
  @Path("/students/{STUDENTIDENTIFIER}/exams/{EXAMID}/enrollment/changelog")
  public Response getEnrollmentChangeLog(@PathParam("STUDENTIDENTIFIER") String studentIdentifierStr, @PathParam("EXAMID") Long examId) {
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (studentIdentifierStr == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid identifier").build();
    }
    
    if (!studentIdentifier.equals(sessionController.getLoggedUser())) {
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
  @RESTPermit(MatriculationPermissions.MATRICULATION_LIST_EXAMS)
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
  public Response fetchSavedEnrollment(@PathParam("EXAMID") Long examId, @PathParam("USERID") String userId) {
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
  public Response saveEnrollment(@PathParam("EXAMID") Long examId, @PathParam("USERID") String userId, String body) {
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
  @Path("/exams/{EXAMID}/initialData/{USERID}")
  public Response fetchInitialData(@PathParam("EXAMID") Long examId, @PathParam("USERID") String userId) {
    MatriculationExamInitialData result = new MatriculationExamInitialData();
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(userId);
    if (identifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid user id").build();
    }
    SchoolDataIdentifier loggedUserIdentifier = sessionController.getLoggedUser();
    if (!identifier.equals(loggedUserIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }
    User user = userController.findUserByIdentifier(identifier);
    if (user == null) {
      return Response.status(Status.NOT_FOUND).entity("User not found").build();
    }
    SentMatriculationEnrollment sentEnrollment = sentMatriculationEnrollmentDAO.findByUser(examId, identifier);
    if (sentEnrollment != null) {
      result.setEnrollmentSent(true);
    }
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(identifier);
    List<UserAddress> userAddresses = userController.listUserAddresses(user);
    List<UserPhoneNumber> phoneNumbers = userController.listUserPhoneNumbers(user);
    
    String address = "";
    String postalCode = "";
    String locality = "";
    String phoneNumber = "";
    String emailAddress = userEmailEntityController.getUserDefaultEmailAddress(userEntity, false); 
    String ssn = userController.findUserSsn(user);
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
    result.setSsn(ssn);
    result.setEmail(emailAddress);
    result.setPhone(phoneNumber);
    result.setAddress(address);
    result.setPostalCode(postalCode);
    result.setLocality(locality);
    result.setGuidanceCounselor("");
    result.setStudentIdentifier(identifier.toId());
    
    return Response.ok(result).build();
  }

  private long getStudentIdFromIdentifier(SchoolDataIdentifier identifier) {
    return matriculationController.getStudentId(identifier);
  }
  
  @POST
  @RESTPermit(MatriculationPermissions.MATRICULATION_SEND_ENROLLMENT)
  @Path("/exams/{EXAMID}/enrollments")
  public Response sendEnrollment(@PathParam("EXAMID") Long examId, MatriculationExamEnrollment enrollment) {
    fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment 
      schoolDataEntity = matriculationController.createMatriculationExamEnrollment();

    SchoolDataIdentifier loggedUserIdentifier = sessionController.getLoggedUser();
    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(enrollment.getStudentIdentifier());
    if (loggedUserIdentifier == null) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    if (!Objects.equals(loggedUserIdentifier, userIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }
    Long studentId = getStudentIdFromIdentifier(userIdentifier);
    SentMatriculationEnrollment sentEnrollment = sentMatriculationEnrollmentDAO.findByUser(examId, userIdentifier);
    if (sentEnrollment != null) {
      return Response.status(Status.BAD_REQUEST).entity("Enrollment already sent").build();
    }
    
    if (!Objects.equals(examId, enrollment.getExamId()) && examId != null) {
      return Response.status(Status.BAD_REQUEST).entity("Exam ids do not match").build();
    }
    
    schoolDataEntity.setId(null);
    schoolDataEntity.setExamId(enrollment.getExamId());
    schoolDataEntity.setName(enrollment.getName());
    schoolDataEntity.setSsn(enrollment.getSsn());
    schoolDataEntity.setEmail(enrollment.getEmail());
    schoolDataEntity.setPhone(enrollment.getPhone());
    schoolDataEntity.setAddress(enrollment.getAddress());
    schoolDataEntity.setPostalCode(enrollment.getPostalCode());
    schoolDataEntity.setCity(enrollment.getCity());
    schoolDataEntity.setNationalStudentNumber(enrollment.getNationalStudentNumber());
    schoolDataEntity.setGuider(enrollment.getGuider());
    schoolDataEntity.setEnrollAs(enrollment.getEnrollAs());
    schoolDataEntity.setDegreeType(enrollment.getDegreeType());
    schoolDataEntity.setRestartExam(enrollment.isRestartExam());
    schoolDataEntity.setNumMandatoryCourses(enrollment.getNumMandatoryCourses());
    schoolDataEntity.setLocation(enrollment.getLocation());
    schoolDataEntity.setCanPublishName(enrollment.isCanPublishName());
    schoolDataEntity.setMessage(enrollment.getMessage());
    schoolDataEntity.setStudentId(studentId);
    schoolDataEntity.setState(enrollment.getState());
    schoolDataEntity.setDegreeStructure(enrollment.getDegreeStructure());
    List<fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance> attendances = new ArrayList<>();
    for (MatriculationExamAttendance attendance : enrollment.getAttendances()) {
      fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance resultAttendance
        = matriculationController.createMatriculationExamAttendance();
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
    matriculationController.submitMatriculationExamEnrollment(examId, schoolDataEntity);
    sentMatriculationEnrollmentDAO.create(examId, userIdentifier);
    
    try {
      matriculationNotificationController.sendEnrollmentNotification(enrollment);
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Failed to send matriculation enrollment notification email", e);
    }
    
    return Response.ok().build();
  }

  private MatriculationCurrentExam restModel(MatriculationExam exam) {
    MatriculationExamEnrollment enrollment = restModel(exam.getEnrollment());
    return new MatriculationCurrentExam(exam.getId(), exam.getYear(), exam.getTerm(), exam.getStarts(), exam.getEnds(), 
        exam.isCompulsoryEducationEligible(), exam.getStudentStatus(), enrollment);
  }
  
  private MatriculationExamEnrollment restModel(
      fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment enrollment) {
    if (enrollment == null) {
      return null;
    }

    List<MatriculationExamAttendance> attendances = new ArrayList<>();
    
    if (enrollment.getAttendances() != null) {
      for (fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance attendance : enrollment.getAttendances()) {
        MatriculationExamAttendance attendanceRestModel = new MatriculationExamAttendance();
        attendanceRestModel.setFunding(attendance.getFunding());
        attendanceRestModel.setGrade(attendance.getGrade());
        attendanceRestModel.setMandatory(attendance.getMandatory());
        attendanceRestModel.setRepeat(attendance.getRepeat());
        attendanceRestModel.setStatus(attendance.getStatus());
        attendanceRestModel.setSubject(attendance.getSubject());
        attendanceRestModel.setTerm(attendance.getTerm());
        attendanceRestModel.setYear(attendance.getYear());
        attendances.add(attendanceRestModel);
      }
    }
    
    MatriculationExamEnrollment restModel = new MatriculationExamEnrollment();

    restModel.setAddress(enrollment.getAddress());
    restModel.setAttendances(attendances);
    restModel.setCanPublishName(enrollment.isCanPublishName());
    restModel.setCity(enrollment.getCity());
    restModel.setDegreeStructure(enrollment.getDegreeStructure());
    restModel.setDegreeType(enrollment.getDegreeType());
    restModel.setEmail(enrollment.getEmail());
    restModel.setEnrollAs(enrollment.getEnrollAs());
    restModel.setEnrollmentDate(enrollment.getEnrollmentDate());
    restModel.setExamId(enrollment.getExamId());
    restModel.setGuider(enrollment.getGuider());
    restModel.setLocation(enrollment.getLocation());
    restModel.setMessage(enrollment.getMessage());
    restModel.setName(enrollment.getName());
    restModel.setNationalStudentNumber(enrollment.getNationalStudentNumber());
    restModel.setNumMandatoryCourses(enrollment.getNumMandatoryCourses());
    restModel.setPhone(enrollment.getPhone());
    restModel.setPostalCode(enrollment.getPostalCode());
    restModel.setRestartExam(enrollment.isRestartExam());
    restModel.setSsn(enrollment.getSsn());
    restModel.setState(enrollment.getState());
//    restModel.setStudentIdentifier(enrollment.getstudentAddress()); // TODO the id mess
    
    
    return restModel;
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
    return restModel;
  }

}
