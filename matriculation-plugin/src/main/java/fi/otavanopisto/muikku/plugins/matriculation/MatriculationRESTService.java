package fi.otavanopisto.muikku.plugins.matriculation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.matriculation.persistence.dao.SavedMatriculationEnrollmentDAO;
import fi.otavanopisto.muikku.matriculation.persistence.dao.SentMatriculationEnrollmentDAO;
import fi.otavanopisto.muikku.matriculation.persistence.model.SavedMatriculationEnrollment;
import fi.otavanopisto.muikku.matriculation.persistence.model.SentMatriculationEnrollment;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationExamAttendance;
import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationExamEnrollment;
import fi.otavanopisto.muikku.schooldata.MatriculationSchoolDataController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
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
  public Response listAvailableExams() {
    List<MatriculationExam> exams = matriculationController.listMatriculationExams(true);
    List<MatriculationCurrentExam> examRestModels = exams.stream().map(exam -> restModel(exam)).collect(Collectors.toList());
    return Response.ok(examRestModels).build();
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
    return new MatriculationCurrentExam(exam.getId(), exam.getStarts(), exam.getEnds(), exam.isEligible(), exam.isEnrolled(), exam.getEnrollmentDate(), exam.isCompulsoryEducationEligible());
  }
}
