package fi.otavanopisto.muikku.schooldata;

import java.util.List;

import fi.otavanopisto.muikku.rest.OrganizationContactPerson;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryBatch;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryCommentRestModel;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryRestModel;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.GroupUserType;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependent;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependentWorkspace;
import fi.otavanopisto.muikku.schooldata.entity.SpecEdTeacher;
import fi.otavanopisto.muikku.schooldata.entity.StudentCard;
import fi.otavanopisto.muikku.schooldata.entity.StudentGuidanceRelation;
import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibility;
import fi.otavanopisto.muikku.schooldata.entity.StudyProgramme;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserContactInfo;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.entity.UserImage;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;
import fi.otavanopisto.muikku.schooldata.entity.UserStudyPeriod;
import fi.otavanopisto.muikku.schooldata.payload.CredentialResetPayload;
import fi.otavanopisto.muikku.schooldata.payload.StaffMemberPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentCardRESTModel;
import fi.otavanopisto.muikku.schooldata.payload.StudentGroupMembersPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentGroupPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudyActivityItemRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistApproverRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistItemRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistItemStateChangeRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistItemTemplateRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistSummaryItemRestModel;


public interface UserSchoolDataBridge {
    
  /**
   * Returns school data source identifier
   * 
   * @return school data source identifier
   */
  public String getSchoolDataSource();
  
  /* HOPS */

  public BridgeResponse<List<StudyActivityItemRestModel>> getStudyActivity(String identifier);
  
  /* Worklist */
  
  public BridgeResponse<List<WorklistItemTemplateRestModel>> getWorklistTemplates();
  public BridgeResponse<WorklistItemRestModel> createWorklistItem(WorklistItemRestModel item);
  public BridgeResponse<WorklistItemRestModel> updateWorklistItem(WorklistItemRestModel item);
  public void removeWorklistItem(WorklistItemRestModel item);
  public BridgeResponse<List<WorklistItemRestModel>> listWorklistItemsByOwnerAndTimeframe(String identifier, String beginDate, String endDate);
  public BridgeResponse<List<WorklistSummaryItemRestModel>> getWorklistSummary(String identifier);
  public void updateWorklistItemsState(WorklistItemStateChangeRestModel stateChange);
  public BridgeResponse<List<WorklistApproverRestModel>> listWorklistApprovers();
  
  /* User */
  
  public BridgeResponse<List<OrganizationContactPerson>> listOrganizationContactPersonsByOrganization(String organizationIdentifier);
  
  public BridgeResponse<StudentContactLogEntryBatch> listStudentContactLogEntriesByStudent(SchoolDataIdentifier userIdentifier, Integer firstResult, Integer maxResults);
  public BridgeResponse<StudentContactLogEntryRestModel> createStudentContactLogEntry(SchoolDataIdentifier userIdentifier, StudentContactLogEntryRestModel payload);
  public BridgeResponse<StudentContactLogEntryRestModel> updateStudentContactLogEntry(SchoolDataIdentifier userIdentifier, Long contactLogEntryId, StudentContactLogEntryRestModel payload);
  public void removeStudentContactLogEntry(SchoolDataIdentifier studentIdentifier, Long contactLogEntryId);
  
  public BridgeResponse<StudentContactLogEntryCommentRestModel> createStudentContactLogEntryComment(SchoolDataIdentifier studentIdentifier, Long entryId, StudentContactLogEntryCommentRestModel payload);
  public BridgeResponse<StudentContactLogEntryCommentRestModel> updateStudentContactLogEntryComment(SchoolDataIdentifier studentIdentifier, Long entryId, Long commentId, StudentContactLogEntryCommentRestModel payload);
  public void removeStudentContactLogEntryComment(SchoolDataIdentifier studentIdentifier, Long commentId);
  
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
  
  /**
   * Returns contact info of the given student.
   * 
   * @param userIdentifier Student identifier
   * 
   * @return Student's contact info
   */
  public UserContactInfo getStudentContactInfo(String userIdentifier);
  
  /**
   * Returns the current user's guidance relation to the given student.
   * 
   * @param studentIdentifier Student identifier
   * 
   * @return User's guidance relation to the given student
   */
  public StudentGuidanceRelation getGuidanceRelation(String studentIdentifier);
  
  /**
   * Increases student's study time end by given months.
   * 
   * @param studentIdentifier Student identifier 
   * @param months Months to add to study time end
   * 
   * @return Updated user
   */
  public User increaseStudyTime(String studentIdentifier, int months);
  
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

  public List<GroupUser> listStudentGuidanceCounselors(SchoolDataIdentifier studentIdentifier, Boolean onlyMessageReceivers);
  
  public List<SpecEdTeacher> listStudentSpecEdTeachers(SchoolDataIdentifier studentIdentifier, boolean includeGuidanceCouncelors, boolean onlyMessageReceivers);
  
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
  
  public List<UserStudyPeriod> listStudentStudyPeriods(SchoolDataIdentifier userIdentifier);
  
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
  @Deprecated
  public StudentMatriculationEligibility getStudentMatriculationEligibility(SchoolDataIdentifier studentIdentifier, String subjectCode);
  fi.otavanopisto.muikku.schooldata.entity.StudentCourseStats getStudentCourseStats(
      SchoolDataIdentifier studentIdentifier,
      String educationTypeCode,
      String educationSubtypeCode);

  public boolean isActiveUser(User user);

  public String findUserSsn(SchoolDataIdentifier userIdentifier);

  public boolean amICounselor(String studentIdentifier);

  public List<String> listStudentAlternativeStudyOptions(String userIdentifier);

  public StudentCard getStudentCard(String studentIdentifier);
  
  public BridgeResponse<StudentCardRESTModel> updateActive(String studentIdentifier, Boolean active);
  /**
   * Lists students for who the given user is a guardian for.
   * 
   * @param guardianUserIdentifier guardian, should be of role STUDENT_PARENT
   * @return guardians' students
   */
  public List<GuardiansDependent> listGuardiansDependents(SchoolDataIdentifier guardianUserIdentifier);

  /**
   * Lists workspace information from a data source for given student, who is 
   * expected to be a guardian's dependent.
   * 
   * @param guardianUserIdentifier guardian's identifier
   * @param studentIdentifier identifier for guardian's dependent (Student)
   * @return list of workspace information
   */
  public List<GuardiansDependentWorkspace> listGuardiansDependentsWorkspaces(SchoolDataIdentifier guardianUserIdentifier, SchoolDataIdentifier studentIdentifier);

}