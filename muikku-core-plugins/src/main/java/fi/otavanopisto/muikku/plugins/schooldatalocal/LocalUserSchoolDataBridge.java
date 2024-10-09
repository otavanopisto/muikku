package fi.otavanopisto.muikku.plugins.schooldatalocal;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.plugins.schooldatalocal.entities.LocalUserImpl;
import fi.otavanopisto.muikku.plugins.schooldatalocal.entities.LocalUserPropertyImpl;
import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUser;
import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUserEmail;
import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUserProperty;
import fi.otavanopisto.muikku.rest.OrganizationContactPerson;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryBatch;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryCommentRestModel;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryRestModel;
import fi.otavanopisto.muikku.rest.StudentContactLogWithRecipientsRestModel;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeInternalException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.GroupUserType;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependent;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependentWorkspace;
import fi.otavanopisto.muikku.schooldata.entity.SpecEdTeacher;
import fi.otavanopisto.muikku.schooldata.entity.StudentCard;
import fi.otavanopisto.muikku.schooldata.entity.StudentCourseStats;
import fi.otavanopisto.muikku.schooldata.entity.StudentGuidanceRelation;
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

@Dependent
public class LocalUserSchoolDataBridge implements UserSchoolDataBridge {

  @Inject
  private LocalUserSchoolDataController localUserSchoolDataController;

  @Override
  public String getSchoolDataSource() {
    return LocalUserSchoolDataController.SCHOOL_DATA_SOURCE;
  }

  @Override
  public BridgeResponse<StaffMemberPayload> createStaffMember(StaffMemberPayload payload) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<StaffMemberPayload> updateStaffMember(StaffMemberPayload staffMember) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<StudentPayload> createStudent(StudentPayload payload) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<StudentPayload> updateStudent(StudentPayload payload) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  public List<StudyProgramme> listStudyProgrammes() {
    return Collections.emptyList();
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public User createUser(String firstName, String lastName) {
    if (StringUtils.isBlank(firstName)) {
      throw new SchoolDataBridgeInternalException("firstName is required");
    }

    if (StringUtils.isBlank(lastName)) {
      throw new SchoolDataBridgeInternalException("lastName is required");
    }

    User userImpl = toLocalUserImpl(localUserSchoolDataController.createUser(firstName, lastName));
    if (userImpl == null) {
      throw new SchoolDataBridgeInternalException("Failed to create local user");
    }

    return userImpl;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public User findUser(String identifier) {
    if (!StringUtils.isNumeric(identifier)) {
      throw new SchoolDataBridgeInternalException("identifier is invalid");
    }

    return toLocalUserImpl(localUserSchoolDataController.findUser(identifier));
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public User findActiveUser(String identifier) {
    return findUser(identifier);
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public List<User> listUsersByEmail(String email) {
    LocalUser user = localUserSchoolDataController.findUserByEmail(email);
    if (user == null) {
      return Collections.emptyList();
    }

    return Arrays.asList(toLocalUserImpl(user));
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public User updateUser(User user) {
    if (StringUtils.isNotBlank(user.getFirstName())) {
      throw new SchoolDataBridgeInternalException("firstName is required");
    }

    if (StringUtils.isNotBlank(user.getLastName())) {
      throw new SchoolDataBridgeInternalException("lastName is required");
    }

    LocalUser localUser = localUserSchoolDataController.findUser(user.getIdentifier());
    if (localUser != null) {
      localUserSchoolDataController.updateUserFirstName(localUser, user.getFirstName());
      localUserSchoolDataController.updateUserLastName(localUser, user.getLastName());
      return toLocalUserImpl(localUser);
    }

    throw new SchoolDataBridgeInternalException("Unexpected error occured while creating LocalUser");
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public List<UserEmail> listUserEmailsByUserIdentifier(String userIdentifier) {
    if (!StringUtils.isNumeric(userIdentifier)) {
      throw new SchoolDataBridgeInternalException("userIdentifier is invalid");
    }

    List<UserEmail> result = new ArrayList<>();

    List<LocalUserEmail> emails = localUserSchoolDataController.listUserEmailsByUserIdentifier(userIdentifier);
    for (LocalUserEmail email : emails) {
      UserEmail emailImpl = toLocalUserEmailImpl(email);
      if (emailImpl != null) {
        result.add(emailImpl);
      } else {
        throw new SchoolDataBridgeInternalException("Unexpected error occured while listing LocalUserEmails");
      }
    }

    return result;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public UserProperty setUserProperty(String userIdentifier, String key, String value) {
    if (!StringUtils.isNumeric(userIdentifier)) {
      throw new SchoolDataBridgeInternalException("userIdentifier is invalid");
    }

    LocalUserProperty userProperty = localUserSchoolDataController.findUserPropertyByUserAndKey(userIdentifier, key);
    if (userProperty != null) {
      if (value == null) {
        localUserSchoolDataController.removeUserProperty(userProperty);
        return null;
      } else {
        return toLocalUserPropertyImpl(localUserSchoolDataController.updateUserProperty(userIdentifier, key, value));
      }
    } else {
      return toLocalUserPropertyImpl(localUserSchoolDataController.createUserProperty(userIdentifier, key, value));
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public UserProperty getUserProperty(String userIdentifier, String key) {
    if (!StringUtils.isNumeric(userIdentifier)) {
      throw new SchoolDataBridgeInternalException("userIdentifier is invalid");
    }

    LocalUserProperty userProperty = localUserSchoolDataController.findUserPropertyByUserAndKey(userIdentifier, key);
    if (userProperty != null) {
      return toLocalUserPropertyImpl(userProperty);
    }

    return null;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public List<UserProperty> listUserPropertiesByUser(String userIdentifier) {
    if (!StringUtils.isNumeric(userIdentifier)) {
      throw new SchoolDataBridgeInternalException("userIdentifier is invalid");
    }

    List<UserProperty> result = new ArrayList<>();

    for (LocalUserProperty property : localUserSchoolDataController.listUserPropertiesByUser(userIdentifier)) {
      UserProperty propertyImpl = toLocalUserPropertyImpl(property);
      if (propertyImpl != null) {
        result.add(propertyImpl);
      }
    }

    return result;
  }

  private User toLocalUserImpl(LocalUser localUser) {
    if (localUser != null) {
      return new LocalUserImpl(
          localUser.getId().toString(),
          localUser.getFirstName(),
          localUser.getLastName(),
          null,
          localUser.getFirstName() + ' ' + localUser.getLastName() + " (Local)",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          false,
          new HashSet<>());
    }

    return null;
  }

  private UserEmail toLocalUserEmailImpl(LocalUserEmail localUserEmail) {
    return null;
  }

  private UserProperty toLocalUserPropertyImpl(LocalUserProperty localUserProperty) {
    if (localUserProperty != null) {
      return new LocalUserPropertyImpl(localUserProperty.getUser().getId().toString(), localUserProperty.getKey().getName(), localUserProperty.getValue());
    }

    return null;
  }

  @Override
  public BridgeResponse<StudentGroupPayload> createStudentGroup(StudentGroupPayload payload) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<StudentGroupPayload> updateStudentGroup(StudentGroupPayload payload) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public void archiveStudentGroup(String identifier) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<StudentGroupMembersPayload> addStudentGroupMembers(StudentGroupMembersPayload studentGroupMembersPayload) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<StudentGroupMembersPayload> removeStudentGroupMembers(StudentGroupMembersPayload studentGroupMembersPayload) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public UserGroup findUserGroup(String identifier) {
    // TODO implement
    return null;
  }

  @Override
  public List<UserGroup> listUserGroups() {
    // TODO implement
    return null;
  }

  public void updateUserCredentials(String userIdentifier, String oldPassword, String newUsername, String newPassword) {
    // TODO Auto-generated method stub
  }

  @Override
  public String requestCredentialReset(String email) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public BridgeResponse<CredentialResetPayload> getCredentialReset(String hash) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public BridgeResponse<CredentialResetPayload> resetCredentials(CredentialResetPayload payload) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public GroupUser findGroupUser(String groupIdentifier, String identifier) {
    // TODO implement
    return null;
  }

  @Override
  public List<GroupUser> listGroupUsersByGroup(String groupIdentifier) {
    // TODO implement
    return null;
  }

  @Override
  public String findUsername(String identifier) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public List<UserAddress> listUserAddresses(SchoolDataIdentifier userIdentifier) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public List<UserPhoneNumber> listUserPhoneNumbers(SchoolDataIdentifier userIdentifier) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public List<GroupUser> listGroupUsersByGroupAndType(String groupIdentifier, GroupUserType type) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public List<GroupUser> listStudentGuidanceCounselors(SchoolDataIdentifier studentIdentifier, Boolean onlyMessageReceivers) {
    // TODO Auto-generated method stub
    return null;
  }

  public void updateUserAddress(SchoolDataIdentifier studentIdentifier, SchoolDataIdentifier identifier, String street,
      String postalCode, String city, String country) {
    // TODO Auto-generated method stub

  }

  @Override
  public StudentCourseStats getStudentCourseStats(SchoolDataIdentifier studentIdentifier, String educationTypeCode,
      String educationSubtypeCode) {
    // TODO Auto-generated method stub
    return null;
  }

  public boolean isActiveUser(User user) {
    return user.getStudyEndDate() == null;
  }

  @Override
  public BridgeResponse<List<OrganizationContactPerson>> listOrganizationContactPersonsByOrganization(
      String organizationIdentifier) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<StudentContactLogEntryBatch> listStudentContactLogEntriesByStudent(
      SchoolDataIdentifier studentIdentifier, Integer resultsPerPage, Integer page) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<StudentContactLogEntryRestModel> createStudentContactLogEntry(SchoolDataIdentifier userIdentifier,
      StudentContactLogEntryRestModel payload) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }
  
  @Override
  public BridgeResponse<StudentContactLogWithRecipientsRestModel> createMultipleStudentContactLogEntries(List<SchoolDataIdentifier> recipientList, StudentContactLogEntryRestModel payload) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<StudentContactLogEntryRestModel> updateStudentContactLogEntry(SchoolDataIdentifier userIdentifier,
      Long contactLogEntryId, StudentContactLogEntryRestModel payload) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public void removeStudentContactLogEntry(SchoolDataIdentifier userIdentifier,
      Long contactLogEntryId) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<StudentContactLogEntryCommentRestModel> createStudentContactLogEntryComment(
      SchoolDataIdentifier studentIdentifier, Long entryId, StudentContactLogEntryCommentRestModel payload) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<StudentContactLogEntryCommentRestModel> updateStudentContactLogEntryComment(SchoolDataIdentifier userIdentifier, Long entryId,
      Long commentId, StudentContactLogEntryCommentRestModel payload) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public void removeStudentContactLogEntryComment(SchoolDataIdentifier userIdentifier, Long commentId) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<List<WorklistItemTemplateRestModel>> getWorklistTemplates() {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<WorklistItemRestModel> createWorklistItem(WorklistItemRestModel item) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<WorklistItemRestModel> updateWorklistItem(WorklistItemRestModel item) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public void removeWorklistItem(WorklistItemRestModel item) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<List<WorklistItemRestModel>> listWorklistItemsByOwnerAndTimeframe(String identifier, String beginDate, String endDate) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<List<WorklistSummaryItemRestModel>> getWorklistSummary(String identifier) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public void updateWorklistItemsState(WorklistItemStateChangeRestModel stateChange) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<List<WorklistApproverRestModel>> listWorklistApprovers() {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public User increaseStudyTime(String studentIdentifier, int months) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<List<StudyActivityItemRestModel>> getStudyActivity(String identifier) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public String findUserSsn(SchoolDataIdentifier userIdentifier) {
    return null;
  }

  @Override
  public boolean amICounselor(String studentIdentifier) {
    return false;
  }

  @Override
  public List<UserStudyPeriod> listStudentStudyPeriods(SchoolDataIdentifier userIdentifier) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public List<String> listStudentAlternativeStudyOptions(String userIdentifier) {
    throw new SchoolDataBridgeInternalException("Not supported");

  }
  public UserContactInfo getStudentContactInfo(String userIdentifier) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public StudentGuidanceRelation getGuidanceRelation(String studentIdentifier) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public List<SpecEdTeacher> listStudentSpecEdTeachers(SchoolDataIdentifier studentIdentifier,
      boolean includeGuidanceCouncelors, boolean onlyMessageReceivers) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public StudentCard getStudentCard(String studentIdentifier) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public BridgeResponse<StudentCardRESTModel> updateActive(String studentIdentifier, Boolean active) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }
  
  public List<GuardiansDependent> listGuardiansDependents(SchoolDataIdentifier guardianUserIdentifier) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

  @Override
  public List<GuardiansDependentWorkspace> listGuardiansDependentsWorkspaces(SchoolDataIdentifier guardianUserIdentifier, SchoolDataIdentifier studentIdentifier) {
    throw new SchoolDataBridgeInternalException("Not supported");
  }

}