package fi.otavanopisto.muikku.plugins.matriculation;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.matriculation.rest.MatriculationExamAttendance;
import fi.otavanopisto.muikku.plugins.matriculation.rest.MatriculationExamEnrollment;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.EducationTypeMappingNotSetException;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.VopsLister;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.schooldata.MatriculationSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;

@Path("/matriculation")
@Produces("application/json")
@RestCatchSchoolDataExceptions
public class MatriculationRESTService {

  @Inject
  private MatriculationSchoolDataBridge matriculationSchoolDataBridge;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @Inject
  private TranscriptOfRecordsController torController;
  
  @GET
  @RESTPermitUnimplemented
  @Path("/currentExam")
  public Response fetchCurrentExam() {
    MatriculationExam exam = matriculationSchoolDataBridge.getMatriculationExam();
    return Response.ok(exam).build();
  }
  
  @GET
  @RESTPermitUnimplemented
  @Path("/initialData/{USERID}")
  public Response fetchInitialData(@PathParam("USERID") String userId) {
    MatriculationExamInitialData result = new MatriculationExamInitialData();
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(userId);
    if (identifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid user id").build();
    }
    long studentId = Long.valueOf(identifier.getIdentifier().split("-")[1]);
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
  
  @POST
  @RESTPermitUnimplemented
  @Path("/enrollments")
  public Response postMatriculationForm(MatriculationExamEnrollment enrollment) {
    fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment 
      schoolDataEntity = matriculationSchoolDataBridge.createMatriculationExamEnrollment();
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
    schoolDataEntity.setNumMandatoryCourses(enrollment.getNumMandatoryCourses());
    schoolDataEntity.setLocation(enrollment.getLocation());
    schoolDataEntity.setMessage(enrollment.getMessage());
    schoolDataEntity.setStudentId(enrollment.getStudentId());
    schoolDataEntity.setState("PENDING");
    List<fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance> attendances = new ArrayList<>();
    for (MatriculationExamAttendance attendance : enrollment.getAttendances()) {
      fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance resultAttendance
        = matriculationSchoolDataBridge.createMatriculationExamAttendance();
      resultAttendance.setSubject(attendance.getSubject());
      resultAttendance.setGrade(attendance.getGrade());
      resultAttendance.setMandatory(attendance.getMandatory());
      resultAttendance.setRepeat(attendance.getRepeat());
      resultAttendance.setTerm(attendance.getTerm());
      resultAttendance.setStatus(attendance.getStatus());
      attendances.add(resultAttendance);
    }
    schoolDataEntity.setAttendances(attendances);
    matriculationSchoolDataBridge.submitMatriculationExamEnrollment(schoolDataEntity);
    return Response.ok().build();
  }

}
