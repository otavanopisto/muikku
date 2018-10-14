package fi.otavanopisto.muikku.plugins.matriculation;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationExamAttendance;
import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationExamEnrollment;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.EducationTypeMappingNotSetException;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.VopsLister;
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
public class MatriculationRESTService {

  @Inject
  private MatriculationSchoolDataController matriculationController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @Inject
  private TranscriptOfRecordsController torController;
  
  @Inject
  private SessionController sessionController;
  
  @GET
  @RESTPermit(MatriculationPermissions.MATRICULATION_GET_EXAM)
  @Path("/currentExam")
  public Response fetchCurrentExam() {
    MatriculationExam exam = matriculationController.getMatriculationExam();
    return Response.ok(exam).build();
  }
  
  @GET
  @RESTPermit(MatriculationPermissions.MATRICULATION_GET_INITIALDATA)
  @Path("/initialData/{USERID}")
  public Response fetchInitialData(@PathParam("USERID") String userId) {
    MatriculationExamInitialData result = new MatriculationExamInitialData();
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(userId);
    if (identifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid user id").build();
    }
    SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
    if (!identifier.equals(loggedUser)) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }
    long studentId = getStudentIdFromIdentifier(identifier);
    User user = userController.findUserByIdentifier(identifier);
    if (user == null) {
      return Response.status(Status.NOT_FOUND).entity("User not found").build();
    }
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(identifier);
    List<UserAddress> userAddresses = userController.listUserAddresses(user);
    List<UserPhoneNumber> phoneNumbers = userController.listUserPhoneNumbers(user);
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
    result.setSsn(user.getSsn());
    result.setEmail(emailAddress);
    result.setPhone(phoneNumber);
    result.setAddress(address);
    result.setPostalCode(postalCode);
    result.setLocality(locality);
    result.setGuidanceCounselor("");
    result.setStudentId(studentId);
    
    try {
      VopsLister.Result listerResult = torController.listVopsCourses(
        userId,
        identifier);

      result.setMandatoryCourses(listerResult.getNumMandatoryCourses());
    } catch (EducationTypeMappingNotSetException ex) {
      result.setMandatoryCourses(0);
    }
    
    return Response.ok(result).build();
  }

  private long getStudentIdFromIdentifier(SchoolDataIdentifier identifier) {
    return matriculationController.getStudentId(identifier);
  }
  
  @POST
  @RESTPermit(MatriculationPermissions.MATRICULATION_SEND_ENROLLMENT)
  @Path("/enrollments")
  public Response sendEnrollment(MatriculationExamEnrollment enrollment) {
    fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment 
      schoolDataEntity = matriculationController.createMatriculationExamEnrollment();

    SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
    if (loggedUser == null) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    Long userId = getStudentIdFromIdentifier(loggedUser);
    if (!Objects.equals(userId, enrollment.getStudentId())) {
      return Response.status(Status.FORBIDDEN).entity("Student is not logged in").build();
    }

    schoolDataEntity.setId(null);
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
    schoolDataEntity.setRestartExam(enrollment.isRestartExam());
    schoolDataEntity.setNumMandatoryCourses(enrollment.getNumMandatoryCourses());
    schoolDataEntity.setLocation(enrollment.getLocation());
    schoolDataEntity.setCanPublishName(enrollment.isCanPublishName());
    schoolDataEntity.setMessage(enrollment.getMessage());
    schoolDataEntity.setStudentId(enrollment.getStudentId());
    schoolDataEntity.setState("PENDING");
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
      attendances.add(resultAttendance);
    }
    schoolDataEntity.setAttendances(attendances);
    matriculationController.submitMatriculationExamEnrollment(schoolDataEntity);
    return Response.ok().build();
  }

}
