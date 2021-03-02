package fi.otavanopisto.muikku.schooldata;

import java.util.List;

import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.GroupUserType;
import fi.otavanopisto.muikku.schooldata.entity.Role;
import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibility;
import fi.otavanopisto.muikku.schooldata.entity.StudyProgramme;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.entity.UserImage;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;
import fi.otavanopisto.muikku.schooldata.payload.CredentialResetPayload;
import fi.otavanopisto.muikku.schooldata.payload.StaffMemberPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentGroupMembersPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentGroupPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentPayload;

public interface UserSchoolDataBridge {
    
  /**
   * Returns school data source identifier
   * 
   * @return school data source identifier
   */
  public String getSchoolDataSource();
  
  /* User */
  
  public BridgeResponse<StaffMemberPayload> createStaffMember(StaffMemberPayload staffMember);
  public BridgeResponse<StaffMemberPayload> updateStaffMember(StaffMemberPayload staffMember);
                    
  public BridgeResponse<StudentPayload> createStudent(StudentPayload student);
  public BridgeResponse<StudentPayload> updateStudent(StudentPayload student);
    
  /**
   * Creates new user
   * 
   * @param firstName new user's first name
   * @param lastName new user's last name
   * @return created user
   */
  public User createUser(String firstName, String lastName);
  
  /**
   * Finds an user by it's identifier. If user cannot be found null is returned.
   * 
   * @param identifier user's identifier
   * @return user or null if user does not exist
   */
  public User findUser(String identifier);

  /**
   * Finds an active user by it's identifier. If user cannot be found null is returned.
   * 
   * @param identifier user's identifier
   * @return user or null if user does not exist
   */
  public User findActiveUser(String identifier);

    /**
     * Lists users by email.
     * 
     * @param email email address
     * @return user or null if user with given email cannot be found
     */
  public List<User> listUsersByEmail(String email);

  // TODO: Search / findUsers

  /**
   * Lists all users
   * 
   * @return list of all users managed by school data bridge.
   */    
  public List<User> listUsers();
  
  /**
   * Updates user
   * 
   * @param user
   * @return updated user
   */
  public User updateUser(User user);
  
  /**
   * Removes a user
   * 
   * @param identifier user's identifier to be removed
   */
  public void removeUser(String identifier);
  
  /* User Email */

  /**
   * Creates new email address for user
   * 
   * @param userIdentifier user's identifier
   * @param address email address
   * @return created UserEmail
   */
  public UserEmail createUserEmail(String userIdentifier, String address);
  
  /**
   * Finds user email by identifier
   * 
   * @param identifier user email identifier
   * @return user email or null if does not exist
   */
  public UserEmail findUserEmail(String identifier);
  
  /**
   * Lists user's email addresses
   * 
   * @param userIdentifier user's identififer
   * @return list of user's emails
   */
  public List<UserEmail> listUserEmailsByUserIdentifier(String userIdentifier);
  
  /**
   * Updates user email
   * 
   * @param userEmail new user email object
   * @return updated user email object
   */
  public UserEmail updateUserEmail(UserEmail userEmail);
  
  /**
   * Removes user email
   * 
   * @param identifier identifier of user email
   */
  public void removeUserEmail(String identifier);
  
  /* User Image */
  
  /**
   * Creates a user image
   * 
   * @param userIdentifier identifier of user
   * @param contentType content type of image
   * @param content image data
   * @return created image
   */
  public UserImage createUserImage(String userIdentifier, String contentType, byte[] content);
  
  /**
   * Finds a user image by identifier
   * 
   * @param identifier identifier of image
   * @return user image or null if image does not exist
   */
  public UserImage findUserImage(String identifier);
  
  /**
   * Lists all user images 
   * 
   * @param userIdentifier identifier of user
   * @return list of user's images
   */
  public List<UserImage> listUserImagesByUserIdentifier(String userIdentifier);
  
  /**
   * Updates user image
   * 
   * @param userImage image update object 
   * @return updated image object
   */
  public UserImage updateUserImage(UserImage userImage);
  
  /**
   * Removes user's image by identifier
   * 
   * @param identifier identifier of image to be removed
   */
  public void removeUserImage(String identifier);
  
  /* User Properties */
  
  /**
   * Sets a property for the user. 
   * 
   * If property does not exist new property is automatically created
   * 
   * @param userIdentifier identifier of user
   * @param key property key
   * @param value property value
   * @return created / updated user property
   */
  public UserProperty setUserProperty(String userIdentifier, String key, String value);

  /**
   * Returns property for the user
   * 
   * @param userIdentifier identifier of user
   * @param key property key
   * @return
   */
  public UserProperty getUserProperty(String userIdentifier, String key);

  /**
   * Returns list of properties for user
   * 
   * @param userIdentifier identifier of user
   * @return list of user property objects
   */
  public List<UserProperty> listUserPropertiesByUser(String userIdentifier);
  
  /* Roles */
  
  public Role findRole(String identifier);

  public List<Role> listRoles();
  
  public Role findUserEnvironmentRole(String userIdentifier);

  /* UserGroups */
  
  public BridgeResponse<StudentGroupPayload> createStudentGroup(StudentGroupPayload payload);
  public BridgeResponse<StudentGroupPayload> updateStudentGroup(StudentGroupPayload payload);
  public void archiveStudentGroup(String identifier);
  
  public UserGroup findUserGroup(String identifier);
  
  public List<UserGroup> listUserGroups();
  
  public BridgeResponse<StudentGroupMembersPayload> addStudentGroupMembers(StudentGroupMembersPayload payload);
  public BridgeResponse<StudentGroupMembersPayload> removeStudentGroupMembers(StudentGroupMembersPayload payload);
  
  /* GroupUsers */
  
  public GroupUser findGroupUser(String groupIdentifier, String identifier);
  
  public List<GroupUser> listGroupUsersByGroup(String groupIdentifier);

  public List<GroupUser> listGroupUsersByGroupAndType(String groupIdentifier, GroupUserType type);

  public void updateUserCredentials(String userIdentifier, String oldPassword, String newUsername, String newPassword);

  public String findUsername(String userIdentifier);
    
  public List<UserAddress> listUserAddresses(SchoolDataIdentifier userIdentifier);

  void updateUserAddress(
      SchoolDataIdentifier studentIdentifier,
      SchoolDataIdentifier identifier,
      String street,
      String postalCode,
      String city,
      String country);
  
  public List<UserPhoneNumber> listUserPhoneNumbers(SchoolDataIdentifier userIdentifier);
  
  public List<StudyProgramme> listStudyProgrammes();
  
  // Authentication

  public String requestCredentialReset(String email);
  
  public BridgeResponse<CredentialResetPayload> getCredentialReset(String hash);
  
  public BridgeResponse<CredentialResetPayload> resetCredentials(CredentialResetPayload payload);

  /**
   * Returns student eligibility to participate matriculation exams
   * 
   * @param studentIdentifier student's identifier
   * @param subjectCode subject code
   * @return student eligibility to participate matriculation exams
   */
  public StudentMatriculationEligibility getStudentMatriculationEligibility(SchoolDataIdentifier studentIdentifier, String subjectCode);
  fi.otavanopisto.muikku.schooldata.entity.StudentCourseStats getStudentCourseStats(
      SchoolDataIdentifier studentIdentifier,
      String educationTypeCode,
      String educationSubtypeCode);

  public boolean isActiveUser(User user);

}