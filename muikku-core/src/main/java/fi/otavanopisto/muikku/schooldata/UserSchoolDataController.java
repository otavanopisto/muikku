package fi.otavanopisto.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.rest.OrganizationContactPerson;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryBatch;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryCommentRestModel;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryRestModel;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.GroupUserType;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependent;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependentWorkspace;
import fi.otavanopisto.muikku.schooldata.entity.SpecEdTeacher;
import fi.otavanopisto.muikku.schooldata.entity.StudentCourseStats;
import fi.otavanopisto.muikku.schooldata.entity.StudentGuidanceRelation;
import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibility;
import fi.otavanopisto.muikku.schooldata.entity.StudyProgramme;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserContactInfo;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;
import fi.otavanopisto.muikku.schooldata.entity.UserStudyPeriod;
import fi.otavanopisto.muikku.schooldata.payload.CredentialResetPayload;
import fi.otavanopisto.muikku.schooldata.payload.StaffMemberPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentGroupMembersPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentGroupPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudyActivityItemRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistApproverRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistItemRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistItemStateChangeRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistItemTemplateRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistSummaryItemRestModel;

public class UserSchoolDataController {

  // TODO: Caching
  // TODO: Events

  @Inject
  private Logger logger;

  @Inject
  @Any
  private Instance<UserSchoolDataBridge> userBridges;

  @Inject
  private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  public boolean isActiveUser(User user) {
    return getUserBridge(user.getSchoolDataSource()).isActiveUser(user);
  }
  
  /* HOPS */
  
  public BridgeResponse<List<StudyActivityItemRestModel>> getStudyActivity(String dataSource, String identifier) {
    return getUserBridge(dataSource).getStudyActivity(identifier);
  }
  
  /* Worklist */
  
  public BridgeResponse<List<WorklistItemTemplateRestModel>> listWorklistTemplates(String dataSource) {
    return getUserBridge(dataSource).getWorklistTemplates();
  }

  public BridgeResponse<WorklistItemRestModel> createWorklistItem(String dataSource, WorklistItemRestModel item) {
    return getUserBridge(dataSource).createWorklistItem(item);
  }

  public BridgeResponse<WorklistItemRestModel> updateWorklistItem(String dataSource, WorklistItemRestModel item) {
    return getUserBridge(dataSource).updateWorklistItem(item);
  }

  public void removeWorklistItem(String dataSource, WorklistItemRestModel item) {
    getUserBridge(dataSource).removeWorklistItem(item);
  }

  public BridgeResponse<List<WorklistItemRestModel>> listWorklistItemsByOwnerAndTimeframe(String dataSource, String identifier, String beginDate, String endDate) {
    return getUserBridge(dataSource).listWorklistItemsByOwnerAndTimeframe(identifier, beginDate, endDate);
  }

  public BridgeResponse<List<WorklistSummaryItemRestModel>> getWorklistSummary(String dataSource, String identifier) {
    return getUserBridge(dataSource).getWorklistSummary(identifier);
  }
  
  public void updateWorklistItemsState(String dataSource, WorklistItemStateChangeRestModel stateChange) {
    getUserBridge(dataSource).updateWorklistItemsState(stateChange);
  }
  
  public BridgeResponse<List<WorklistApproverRestModel>> listWorklistApprovers(String dataSource) {
    return getUserBridge(dataSource).listWorklistApprovers();
  }
  
  /* User */
  
  public BridgeResponse<StudentContactLogEntryBatch> listStudentContactLogEntries(String dataSource, SchoolDataIdentifier userIdentifier, Integer resultsPerPage, Integer page) {
    return getUserBridge(dataSource).listStudentContactLogEntriesByStudent(userIdentifier, resultsPerPage, page);
  }
  
  public BridgeResponse<StudentContactLogEntryRestModel> createStudentContactLogEntry(String dataSource, SchoolDataIdentifier userIdentifier, StudentContactLogEntryRestModel payload) {
    return getUserBridge(dataSource).createStudentContactLogEntry(userIdentifier,payload);
  }
  
  public BridgeResponse<StudentContactLogEntryRestModel> updateStudentContactLogEntry(String dataSource, SchoolDataIdentifier userIdentifier, Long contactLogEntryId, StudentContactLogEntryRestModel payload) {
    return getUserBridge(dataSource).updateStudentContactLogEntry(userIdentifier, contactLogEntryId, payload);
  }
  
  public void removeStudentContactLogEntry(String dataSource, SchoolDataIdentifier studentIdentifier, Long contactLogEntryId) {
    getUserBridge(dataSource).removeStudentContactLogEntry(studentIdentifier, contactLogEntryId);
  }
  
  public BridgeResponse<StudentContactLogEntryCommentRestModel> createStudentContactLogEntryComment(String dataSource, SchoolDataIdentifier userIdentifier, Long entryId, StudentContactLogEntryCommentRestModel payload) {
    return getUserBridge(dataSource).createStudentContactLogEntryComment(userIdentifier, entryId, payload);
  }
  
  public BridgeResponse<StudentContactLogEntryCommentRestModel> updateStudentContactLogEntryComment(String dataSource, SchoolDataIdentifier userIdentifier, Long entryId, Long commentId, StudentContactLogEntryCommentRestModel payload) {
    return getUserBridge(dataSource).updateStudentContactLogEntryComment(userIdentifier, entryId, commentId, payload);
  }
  
  public void removeStudentContactLogEntryComment(String dataSource, SchoolDataIdentifier studentIdentifier, Long commentId) {
    getUserBridge(dataSource).removeStudentContactLogEntryComment(studentIdentifier, commentId);
  }
  
  public BridgeResponse<List<OrganizationContactPerson>> listOrganizationContactPersons(String dataSource, String organizationIdentifier) {
    return getUserBridge(dataSource).listOrganizationContactPersonsByOrganization(organizationIdentifier);
  }

  public BridgeResponse<StaffMemberPayload> createStaffMember(String dataSource, StaffMemberPayload staffMember) {
    return getUserBridge(dataSource).createStaffMember(staffMember);
  }
  
  public BridgeResponse<StaffMemberPayload> updateStaffMember(String dataSource, StaffMemberPayload staffMember) {
    return getUserBridge(dataSource).updateStaffMember(staffMember);
  }
  
  public BridgeResponse<StudentPayload> createStudent(String dataSource, StudentPayload student) {
    return getUserBridge(dataSource).createStudent(student);
  }

  public BridgeResponse<StudentPayload> updateStudent(String dataSource, StudentPayload student) {
    return getUserBridge(dataSource).updateStudent(student);
  }
  
  public User findUser(SchoolDataSource schoolDataSource, String userIdentifier) {
    return getUserBridge(schoolDataSource).findUser(userIdentifier);
  }
  
  public UserContactInfo getStudentContactInfo(String schoolDataSource, String userIdentifier) {
    return getUserBridge(schoolDataSource).getStudentContactInfo(userIdentifier);
  }
  
  public StudentGuidanceRelation getGuidanceRelation(String schoolDataSource, String studentIdentifier) {
    return getUserBridge(schoolDataSource).getGuidanceRelation(studentIdentifier);
  }
  
  public User increaseStudyTime(SchoolDataIdentifier schoolDataIdentifier, Integer months) {
    return getUserBridge(schoolDataIdentifier.getDataSource()).increaseStudyTime(schoolDataIdentifier.getIdentifier(), months);
  }

  public User findUser(SchoolDataIdentifier userIdentifier) {
    return getUserBridge(userIdentifier.getDataSource()).findUser(userIdentifier.getIdentifier());
  }

  public User findUser(String schoolDataSource, String userIdentifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", schoolDataSource));
    }
    return findUser(dataSource, userIdentifier);
  }

  public User findActiveUser(SchoolDataSource schoolDataSource, String identifier) {
    return getUserBridge(schoolDataSource).findActiveUser(identifier);
  }

  public List<User> listUsers() {
    // TODO: This method WILL cause performance problems, replace with something more sensible

    List<User> result = new ArrayList<User>();

    for (UserSchoolDataBridge userBridge : getUserBridges()) {
      try {
        result.addAll(userBridge.listUsers());
      } catch (SchoolDataBridgeInternalException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing users", e);
      }
    }

    return result;
  }

  public List<User> listUsersByEntity(UserEntity userEntity) {
    List<User> result = new ArrayList<>();

    List<UserSchoolDataIdentifier> identifiers = userSchoolDataIdentifierDAO.listByUserEntityAndArchived(userEntity, Boolean.FALSE);
    for (UserSchoolDataIdentifier identifier : identifiers) {
      UserSchoolDataBridge userBridge = getUserBridge(identifier.getDataSource());
      User user = findUserByIdentifier(userBridge, identifier.getIdentifier());
      if (user != null) {
        result.add(user);
      }
    }

    return result;
  }

  public List<User> listUsersByEmail(String email) {
    List<User> result = new ArrayList<User>();

    for (UserSchoolDataBridge userBridge : getUserBridges()) {
      result.addAll(userBridge.listUsersByEmail(email));
    }

    return result;
  }

  public List<User> listUsersByEmails(List<String> emails) {
    List<User> result = new ArrayList<>();

    for (String email : emails) {
      List<User> users = listUsersByEmail(email);
      for (User user : users) {
        if (!userListContains(result, user)) {
          result.add(user);
        }
      }
    }

    return result;
  }

  private boolean userListContains(List<User> listUsers, User user) {
    for (User listUser : listUsers) {
      if (listUser.getSchoolDataSource().equals(user.getSchoolDataSource()) && listUser.getIdentifier().equals(user.getIdentifier())) {
        return true;
      }
    }

    return false;
  }

  /* User Entity */

  public UserEntity findUserEntity(User user) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifierAndArchived(schoolDataSource, user.getIdentifier(), Boolean.FALSE);
    return userSchoolDataIdentifier == null ? null : userSchoolDataIdentifier.getUserEntity();
  }

  public UserEntity findUserEntityByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifierAndArchived(dataSource, identifier, Boolean.FALSE);
    return userSchoolDataIdentifier == null ? null : userSchoolDataIdentifier.getUserEntity();
  }

  public String findUserSsn(SchoolDataIdentifier userIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(userIdentifier.getDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", userIdentifier.getDataSource()));
    }
    return getUserBridge(schoolDataSource).findUserSsn(userIdentifier);
  }

  /* User Emails */

  public List<UserEmail> listUserEmails(User user) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", user.getSchoolDataSource()));
    }
    return getUserBridge(schoolDataSource).listUserEmailsByUserIdentifier(user.getIdentifier());
  }

  public List<UserEmail> listUserEmails(SchoolDataIdentifier userIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(userIdentifier.getDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", userIdentifier.getDataSource()));
    }
    return getUserBridge(schoolDataSource).listUserEmailsByUserIdentifier(userIdentifier.getIdentifier());
  }

  public UserEmail findUserEmail(SchoolDataSource schoolDataSource, String identifier) {
    return getUserBridge(schoolDataSource).findUserEmail(identifier);
  }

  /* User properties */

  public List<UserProperty> listUserProperties(User user) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", user.getSchoolDataSource()));
    }
    return getUserBridge(schoolDataSource).listUserPropertiesByUser(user.getIdentifier());
  }

  public UserProperty getUserProperty(User user, String key) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", user.getSchoolDataSource()));
    }
    return getUserBridge(schoolDataSource).getUserProperty(user.getIdentifier(), key);
  }

  public UserProperty setUserProperty(User user, String key, String value) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", user.getSchoolDataSource()));
    }
    return getUserBridge(schoolDataSource).setUserProperty(user.getIdentifier(), key, value);
  }

  public List<StudyProgramme> listStudyProgrammes() {
    List<StudyProgramme> result = new ArrayList<>();
    for (UserSchoolDataBridge userBridge : getUserBridges()) {
      result.addAll(userBridge.listStudyProgrammes());
    }
    return result;
  }

  /* UserGroups */
  
  public BridgeResponse<StudentGroupPayload> createStudentGroup(String dataSource, StudentGroupPayload studentGroup) {
    return getUserBridge(dataSource).createStudentGroup(studentGroup);
  }

  public BridgeResponse<StudentGroupPayload> updateStudentGroup(String dataSource, StudentGroupPayload studentGroup) {
    return getUserBridge(dataSource).updateStudentGroup(studentGroup);
  }
  
  public void archiveStudentGroup(String dataSource, String identifier) {
    getUserBridge(dataSource).archiveStudentGroup(identifier);
  }

  public UserGroup findUserGroup(SchoolDataSource schoolDataSource, String identifier) {
    return getUserBridge(schoolDataSource).findUserGroup(identifier);
  }

  public List<UserGroup> listUserGroups(SchoolDataSource schoolDataSource) {
    return getUserBridge(schoolDataSource).listUserGroups();
  }
  
  public BridgeResponse<StudentGroupMembersPayload> addStudentGroupMembers(String dataSource, StudentGroupMembersPayload payload) {
    return getUserBridge(dataSource).addStudentGroupMembers(payload);
  }

  public BridgeResponse<StudentGroupMembersPayload> removeStudentGroupMembers(String dataSource, StudentGroupMembersPayload payload) {
    return getUserBridge(dataSource).removeStudentGroupMembers(payload);
  }

  /* Group users */

  public GroupUser findGroupUser(SchoolDataSource schoolDataSource, String groupIdentifier, String identifier) {
    return getUserBridge(schoolDataSource).findGroupUser(groupIdentifier, identifier);
  }

  public List<GroupUser> listGroupUsersByGroup(UserGroup userGroup){
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(userGroup.getSchoolDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", userGroup.getSchoolDataSource()));
    }
    return getUserBridge(schoolDataSource).listGroupUsersByGroup(userGroup.getIdentifier());
  }

  public List<GroupUser> listGroupUsersByGroupAndType(UserGroup userGroup, GroupUserType type){
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(userGroup.getSchoolDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", userGroup.getSchoolDataSource()));
    }
    return getUserBridge(schoolDataSource).listGroupUsersByGroupAndType(userGroup.getIdentifier(), type);
  }

  public List<UserAddress> listUserAddressses(SchoolDataIdentifier userIdentifier){
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(userIdentifier.getDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", userIdentifier.getDataSource()));
    }
    return getUserBridge(schoolDataSource).listUserAddresses(userIdentifier);
  }

  public void updateUser(User user) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", user.getSchoolDataSource()));
    }
    getUserBridge(schoolDataSource).updateUser(user);
  }

  public void updateUserAddress(
    SchoolDataIdentifier studentIdentifier,
    SchoolDataIdentifier addressIdentifier,
    String street,
    String postalCode,
    String city,
    String country
  ) throws SchoolDataBridgeUnauthorizedException {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(addressIdentifier.getDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", addressIdentifier.getDataSource()));
    }
    getUserBridge(schoolDataSource).updateUserAddress(
      studentIdentifier,
      addressIdentifier,
      street,
      postalCode,
      city,
      country);
  }

  public List<UserPhoneNumber> listUserPhoneNumbers(SchoolDataIdentifier userIdentifier){
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(userIdentifier.getDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", userIdentifier.getDataSource()));
    }
    return getUserBridge(schoolDataSource).listUserPhoneNumbers(userIdentifier);
  }

  public List<UserStudyPeriod> listStudentStudyPeriods(SchoolDataIdentifier userIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(userIdentifier.getDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", userIdentifier.getDataSource()));
    }
    return getUserBridge(schoolDataSource).listStudentStudyPeriods(userIdentifier);
  }

  /**
   * Returns student eligibility to participate matriculation exams
   * 
   * @param studentIdentifier student identifier
   * @param subjectCode subject code
   * @return student eligibility to participate matriculation exams
   */
  public StudentMatriculationEligibility getStudentMatriculationEligibility(SchoolDataIdentifier studentIdentifier, String subjectCode) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(studentIdentifier.getDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", studentIdentifier.getDataSource()));
    }

    return getUserBridge(schoolDataSource).getStudentMatriculationEligibility(studentIdentifier, subjectCode);
  }

  private UserSchoolDataBridge getUserBridge(SchoolDataSource schoolDataSource) {
    return getUserBridge(schoolDataSource.getIdentifier());
  }

  private UserSchoolDataBridge getUserBridge(String schoolDataSourceIdentifier) {
    Iterator<UserSchoolDataBridge> iterator = userBridges.iterator();
    while (iterator.hasNext()) {
      UserSchoolDataBridge userSchoolDataBridge = iterator.next();
      if (userSchoolDataBridge.getSchoolDataSource().equals(schoolDataSourceIdentifier)) {
        return userSchoolDataBridge;
      }
    }
    throw new SchoolDataBridgeInternalException(String.format("No UserBridge for data source %s", schoolDataSourceIdentifier));
  }

  private User findUserByIdentifier(UserSchoolDataBridge userBridge, String identifier) {
    return userBridge.findUser(identifier);
  }

  private List<UserSchoolDataBridge> getUserBridges() {
    List<UserSchoolDataBridge> result = new ArrayList<UserSchoolDataBridge>();

    Iterator<UserSchoolDataBridge> iterator = userBridges.iterator();
    while (iterator.hasNext()) {
      result.add(iterator.next());
    }

    return Collections.unmodifiableList(result);
  }

  public String findUsername(User user) throws SchoolDataBridgeUnauthorizedException {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", user.getSchoolDataSource()));
    }
    return getUserBridge(schoolDataSource).findUsername(user.getIdentifier());
  }

  public void updateUserCredentials(User user, String oldPassword, String newUsername, String newPassword) throws SchoolDataBridgeUnauthorizedException {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", user.getSchoolDataSource()));
    }
    getUserBridge(schoolDataSource).updateUserCredentials(user.getIdentifier(), oldPassword, newUsername, newPassword);
  }

  public String requestCredentialReset(SchoolDataSource schoolDataSource, String email) throws SchoolDataBridgeUnauthorizedException {
    return getUserBridge(schoolDataSource).requestCredentialReset(email);
  }

  public BridgeResponse<CredentialResetPayload> getCredentialReset(SchoolDataSource schoolDataSource, String hash) {
    return getUserBridge(schoolDataSource).getCredentialReset(hash);
  }

  public BridgeResponse<CredentialResetPayload> resetCredentials(SchoolDataSource schoolDataSource, CredentialResetPayload payload) {
    return getUserBridge(schoolDataSource).resetCredentials(payload);
  }

  public StudentCourseStats getStudentCourseStats(SchoolDataIdentifier studentIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(studentIdentifier.getDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", studentIdentifier.getDataSource()));
    }
    return getUserBridge(schoolDataSource).getStudentCourseStats(
        studentIdentifier,
        "lukio",
        "pakollinen"
    );
  }
  
  public boolean amICounselor(SchoolDataIdentifier studentIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(studentIdentifier.getDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", studentIdentifier.getDataSource()));
    }
    return getUserBridge(schoolDataSource).amICounselor(studentIdentifier.getIdentifier());
  }
  
  public List<GroupUser> listStudentGuidanceCounselors(SchoolDataIdentifier studentIdentifier, Boolean onlyMessageReceivers) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(studentIdentifier.getDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", studentIdentifier.getDataSource()));
    }
    return getUserBridge(schoolDataSource).listStudentGuidanceCounselors(studentIdentifier, onlyMessageReceivers);
  }
  
  public List<SpecEdTeacher> listStudentSpecEdTeachers(SchoolDataIdentifier studentIdentifier,
      boolean includeGuidanceCouncelors, boolean onlyMessageReceivers) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(studentIdentifier.getDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", studentIdentifier.getDataSource()));
    }
    return getUserBridge(schoolDataSource).listStudentSpecEdTeachers(studentIdentifier, includeGuidanceCouncelors, onlyMessageReceivers);
    
  }
  
  public List<GuardiansDependent> listGuardiansDependents(SchoolDataIdentifier guardianUserIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(guardianUserIdentifier.getDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", guardianUserIdentifier.getDataSource()));
    }

    return getUserBridge(schoolDataSource).listGuardiansDependents(guardianUserIdentifier);
  }
  
  public List<GuardiansDependentWorkspace> listGuardiansDependentsWorkspaces(SchoolDataIdentifier guardianUserIdentifier, SchoolDataIdentifier studentIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(guardianUserIdentifier.getDataSource());
    if (schoolDataSource == null) {
      throw new SchoolDataBridgeInternalException(String.format("Invalid data source %s", guardianUserIdentifier.getDataSource()));
    }

    return getUserBridge(schoolDataSource).listGuardiansDependentsWorkspaces(guardianUserIdentifier, studentIdentifier);
  }
  
}