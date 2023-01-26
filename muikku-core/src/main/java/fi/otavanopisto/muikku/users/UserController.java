package fi.otavanopisto.muikku.users;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibility;
import fi.otavanopisto.muikku.schooldata.entity.StudyProgramme;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.schooldata.entity.UserStudyPeriod;
import fi.otavanopisto.muikku.schooldata.payload.StaffMemberPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentPayload;

public class UserController {
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  public BridgeResponse<StaffMemberPayload> createStaffMember(String dataSource, StaffMemberPayload staffMember) {
    return userSchoolDataController.createStaffMember(dataSource, staffMember);
  }

  public BridgeResponse<StaffMemberPayload> updateStaffMember(String dataSource, StaffMemberPayload staffMember) {
    return userSchoolDataController.updateStaffMember(dataSource, staffMember);
  }

  public BridgeResponse<StudentPayload> createStudent(String dataSource, StudentPayload student) {
    return userSchoolDataController.createStudent(dataSource, student);
  }

  public BridgeResponse<StudentPayload> updateStudent(String dataSource, StudentPayload student) {
    return userSchoolDataController.updateStudent(dataSource, student);
  }

  public User findUserByDataSourceAndIdentifier(String schoolDataSource, String userIdentifier) {
    return userSchoolDataController.findUser(schoolDataSource, userIdentifier);
  }
  
  public User findUserByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String userIdentifier) {
    return userSchoolDataController.findUser(schoolDataSource, userIdentifier);
  }
  
  public String getUserDefaultEmailAddress(SchoolDataIdentifier schoolDataIdentifier) {
    return userSchoolDataController.getUserDefaultEmailAddress(schoolDataIdentifier.getDataSource(), schoolDataIdentifier.getIdentifier());
  }

  public String getUserDefaultEmailAddress(String schoolDataSource, String userIdentifier) {
    return userSchoolDataController.getUserDefaultEmailAddress(schoolDataSource, userIdentifier);
  }

  public User findUserByIdentifier(SchoolDataIdentifier userIdentifier) {
    if (userIdentifier == null) {
      return null; 
    }
    
    return findUserByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
  }

  public User findUserByUserEntityDefaults(UserEntity userEntity) {
    return findUserByDataSourceAndIdentifier(userEntity.getDefaultSchoolDataSource(), userEntity.getDefaultIdentifier());
  }

  public List<User> listUsers() {
    return userSchoolDataController.listUsers();
  }
  
  public List<StudyProgramme> listStudyProgrammes() {
    return userSchoolDataController.listStudyProgrammes();
  }
  
  public List<UserAddress> listUserAddresses(User user) {
    return listUserAddresses(new SchoolDataIdentifier(user.getIdentifier(), user.getSchoolDataSource()));
  }
  
  public List<UserAddress> listUserAddresses(SchoolDataIdentifier userIdentifier) {
    return userSchoolDataController.listUserAddressses(userIdentifier);
  }
  
  public void updateUserAddress(
      SchoolDataIdentifier studentIdentifier,
      SchoolDataIdentifier addressIdentifier,
      String street,
      String postalCode,
      String city,
      String country
  ) {
    userSchoolDataController.updateUserAddress(studentIdentifier, addressIdentifier, street, postalCode, city, country);
  }

  public void updateUser(User user) {
    userSchoolDataController.updateUser(user);
  }

  public List<UserPhoneNumber> listUserPhoneNumbers(User user) {
    return listUserPhoneNumbers(new SchoolDataIdentifier(user.getIdentifier(), user.getSchoolDataSource()));
  }
  
  public List<UserPhoneNumber> listUserPhoneNumbers(SchoolDataIdentifier userIdentifier) {
    return userSchoolDataController.listUserPhoneNumbers(userIdentifier);
  }
  
  public List<UserStudyPeriod> listStudentStudyPeriods(SchoolDataIdentifier userIdentifier) {
    return userSchoolDataController.listStudentStudyPeriods(userIdentifier);
  }
  
  public String findUserSsn(User user) {
    return findUserSsn(new SchoolDataIdentifier(user.getIdentifier(), user.getSchoolDataSource()));
  }
  
  public String findUserSsn(SchoolDataIdentifier userIdentifier) {
    return userSchoolDataController.findUserSsn(userIdentifier);
  }
  
  /**
   * Returns student eligibility to participate matriculation exams
   * 
   * @param studentIdentifier student identifier
   * @param subjectCode subject code
   * @return student eligibility to participate matriculation exams
   */
  public StudentMatriculationEligibility getStudentMatriculationEligibility(SchoolDataIdentifier studentIdentifier, String subjectCode) {
    return userSchoolDataController.getStudentMatriculationEligibility(studentIdentifier, subjectCode);
  }

  public List<UserEmail> listUserEmails(SchoolDataIdentifier userIdentifier) {
    return userSchoolDataController.listUserEmails(userIdentifier);
  }
  
}