package fi.otavanopisto.muikku.plugins.schooldatalocal;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.plugins.schooldatalocal.entities.LocalEnvironmentRoleImpl;
import fi.otavanopisto.muikku.plugins.schooldatalocal.entities.LocalUserImageImpl;
import fi.otavanopisto.muikku.plugins.schooldatalocal.entities.LocalUserImpl;
import fi.otavanopisto.muikku.plugins.schooldatalocal.entities.LocalUserPropertyImpl;
import fi.otavanopisto.muikku.plugins.schooldatalocal.entities.LocalWorkspaceRoleImpl;
import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUser;
import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUserEmail;
import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUserImage;
import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUserProperty;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeInternalException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.entity.EnvironmentRole;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.GroupUserType;
import fi.otavanopisto.muikku.schooldata.entity.Role;
import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibility;
import fi.otavanopisto.muikku.schooldata.entity.StudentCourseStats;
import fi.otavanopisto.muikku.schooldata.entity.StudyProgramme;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.entity.UserImage;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceRole;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.schooldata.payload.CredentialResetPayload;
import fi.otavanopisto.muikku.schooldata.payload.StaffMemberPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentGroupMembersPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentGroupPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentPayload;

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
  public List<User> listUsers() {
    List<User> result = new ArrayList<>();
    
    for (LocalUser localUser : localUserSchoolDataController.listUsers()) {
      User user = toLocalUserImpl(localUser);
      if (user != null) {
        result.add(user);
      } else {
        throw new SchoolDataBridgeInternalException("Unexpected error occured while listing LocalUsers");
      }
    }
    
    return result;
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
  public void removeUser(String identifier) {
    LocalUser localUser = localUserSchoolDataController.findUser(identifier);
    if (localUser != null) {
      localUserSchoolDataController.removeUser(localUser);
    } else {
      throw new SchoolDataBridgeInternalException("Failed to remove user because it does not exist");
    }
  }
  
  /**
   * {@inheritDoc}
   */
  @Override
  public UserEmail createUserEmail(String userIdentifier, String address) {
    if (!StringUtils.isNumeric(userIdentifier)) {
      throw new SchoolDataBridgeInternalException("userIdentifier is invalid");
    }
    
    UserEmail userEmail = toLocalUserEmailImpl(localUserSchoolDataController.createUserEmail(userIdentifier, address));
    if (userEmail != null) {
      return userEmail;
    }
    
    throw new SchoolDataBridgeInternalException("Unexpected error occured while creating LocalUserEmail");
  }
  
  /**
   * {@inheritDoc}
   */
  @Override
  public UserEmail findUserEmail(String identifier) {
    if (!StringUtils.isNumeric(identifier)) {
      throw new SchoolDataBridgeInternalException("identifier is invalid");
    }
    
    return toLocalUserEmailImpl(localUserSchoolDataController.findUserEmail(identifier));
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
  public UserEmail updateUserEmail(UserEmail userEmail) {
    throw new SchoolDataBridgeInternalException("Unexpected error occured while updating LocalUserEmail");
  }
  
  /**
   * {@inheritDoc}
   */
  @Override
  public void removeUserEmail(String identifier) {
    LocalUserEmail localUserEmail = localUserSchoolDataController.findUserEmail(identifier);
    if (localUserEmail == null) {
      throw new SchoolDataBridgeInternalException("UserEmail can not be removed because it does not exist");
    }
    
    localUserSchoolDataController.removeUserEmail(localUserEmail);
  }
  
  /**
   * {@inheritDoc}
   */
  @Override
  public UserImage createUserImage(String userIdentifier, String contentType, byte[] content) {
    if (!StringUtils.isNumeric(userIdentifier)) {
      throw new SchoolDataBridgeInternalException("userIdentifier is invalid");
    }

    UserImage userImage = toLocalUserImageImpl(localUserSchoolDataController.createUserImage(userIdentifier, contentType, content));
    if (userImage != null) {
      return userImage;
    }
    
    throw new SchoolDataBridgeInternalException("Unexpected error occured while creating LocalUserImage");
  }
  
  /**
   * {@inheritDoc}
   */
  @Override
  public UserImage findUserImage(String identifier) {
    if (!StringUtils.isNumeric(identifier)) {
      throw new SchoolDataBridgeInternalException("identifier is invalid");
    }

    return toLocalUserImageImpl(localUserSchoolDataController.findUserImage(identifier));
  }
  
  /**
   * {@inheritDoc}
   */
  @Override
  public List<UserImage> listUserImagesByUserIdentifier(String userIdentifier) {
    List<UserImage> result = new ArrayList<>();
    
    List<LocalUserImage> images = localUserSchoolDataController.listUserImagesByUserIdentifier(userIdentifier);
    for (LocalUserImage image : images) {
      UserImage userImage = toLocalUserImageImpl(image);
      if (userImage != null) {
        result.add(userImage);
      } else {
        throw new SchoolDataBridgeInternalException("Unexpected error occured while listing LocalUserImages");
      }
    }
    
    return result;
  }
  
  /**
   * {@inheritDoc}
   */
  @Override
  public UserImage updateUserImage(UserImage userImage) {
    UserImage image = toLocalUserImageImpl(localUserSchoolDataController.updateUserImage(userImage.getIdentifier(), userImage.getContentType(), userImage.getContent()));
    if (image != null) {
      return image;
    }
    
    throw new SchoolDataBridgeInternalException("Unexpected error occured while updating LocalUserImage");
  }
  
  /**
   * {@inheritDoc}
   */
  @Override
  public void removeUserImage(String identifier) {
    LocalUserImage localUserImage = localUserSchoolDataController.findUserImage(identifier);
    if (localUserImage == null) {
      throw new SchoolDataBridgeInternalException("UserImage can not be removed because it does not exist");
    }
    
    localUserSchoolDataController.removeUserImage(localUserImage);    
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

  /**
   * {@inheritDoc}
   */
  @Override
  public List<Role> listRoles() throws SchoolDataBridgeInternalException {
    List<Role> result = new ArrayList<>();
    
    List<RoleEntity> roleEntities = localUserSchoolDataController.listCoreRoleEntities();
    for (RoleEntity roleEntity : roleEntities) {
      result.add(toLocalRoleEntity(roleEntity));
    }
    
    return result;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public Role findRole(String identifier) {
    if (!StringUtils.isNumeric(identifier)) {
      throw new SchoolDataBridgeInternalException("identifier is invalid");
    }

    RoleEntity roleEntity = localUserSchoolDataController.findCoreRoleEntityByIdentifier(identifier);
    return toLocalRoleEntity(roleEntity);
  }

  /**
   * {@inheritDoc}
   */
  public Role findUserEnvironmentRole(String userIdentifier) {
    LocalUser user = localUserSchoolDataController.findUser(userIdentifier);
    if (user == null) {
      throw new SchoolDataBridgeInternalException("User not found");
    }
    
    Long roleId = user.getRoleId();
    if (roleId != null) {
      RoleEntity roleEntity = localUserSchoolDataController.findCoreRoleEntityById(roleId);
      if (roleEntity == null) {
        throw new SchoolDataBridgeInternalException("User role could not be found");
      }
      
      return toLocalRoleEntity(roleEntity);
    }
    
    return null;
  };
  
  private User toLocalUserImpl(LocalUser localUser) {
    if (localUser != null) {
      return new LocalUserImpl(
          localUser.getId().toString(), 
          localUser.getFirstName(), 
          localUser.getLastName(),
          null,
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
          null);
    }
    
    return null;
  }

  private UserEmail toLocalUserEmailImpl(LocalUserEmail localUserEmail) {
    return null;
  }

  private UserImage toLocalUserImageImpl(LocalUserImage localUserImage) {
    if (localUserImage != null) {
      return new LocalUserImageImpl(localUserImage.getId().toString(), localUserImage.getUser().getId().toString(), localUserImage.getContentType(), localUserImage.getContent());
    }
    
    return null;
  }

  private UserProperty toLocalUserPropertyImpl(LocalUserProperty localUserProperty) {
    if (localUserProperty != null) {
      return new LocalUserPropertyImpl(localUserProperty.getUser().getId().toString(), localUserProperty.getKey().getName(), localUserProperty.getValue());
    }
    
    return null;
  }
  
  private Role toLocalRoleEntity(RoleEntity roleEntity) {
    if (roleEntity instanceof EnvironmentRoleEntity) {
      return toLocalEnvironmentRoleEntity((EnvironmentRoleEntity) roleEntity);
    } else {
      return toLocalWorkspaceRoleEntity((WorkspaceRoleEntity) roleEntity);
    }
  }

  private WorkspaceRole toLocalWorkspaceRoleEntity(WorkspaceRoleEntity workspaceRoleEntity) {
    return new LocalWorkspaceRoleImpl(workspaceRoleEntity.getId().toString(), workspaceRoleEntity.getName(), WorkspaceRoleArchetype.valueOf(workspaceRoleEntity.getArchetype().toString()));
  }

  private EnvironmentRole toLocalEnvironmentRoleEntity(EnvironmentRoleEntity environmentRoleEntity) {
    EnvironmentRoleArchetype archetype = EnvironmentRoleArchetype.valueOf(environmentRoleEntity.getArchetype().name());
    return new LocalEnvironmentRoleImpl(environmentRoleEntity.getId().toString(), archetype, environmentRoleEntity.getName());
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
  
  public void updateUserAddress(SchoolDataIdentifier studentIdentifier, SchoolDataIdentifier identifier, String street,
      String postalCode, String city, String country) {
    // TODO Auto-generated method stub
    
  }

  @Override
  public StudentMatriculationEligibility getStudentMatriculationEligibility(SchoolDataIdentifier studentIdentifier,
      String subjectCode) {
    // TODO Auto-generated method stub
    return null;
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

}