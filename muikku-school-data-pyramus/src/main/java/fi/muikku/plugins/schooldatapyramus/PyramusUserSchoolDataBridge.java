package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusGroupUser;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusUserGroup;
import fi.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.muikku.plugins.schooldatapyramus.rest.PyramusRestClientUnauthorizedException;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.SchoolDataBridgeUnauthorizedException;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.UserSchoolDataBridge;
import fi.muikku.schooldata.entity.GroupUser;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserAddress;
import fi.muikku.schooldata.entity.UserEmail;
import fi.muikku.schooldata.entity.UserGroup;
import fi.muikku.schooldata.entity.UserImage;
import fi.muikku.schooldata.entity.UserPhoneNumber;
import fi.muikku.schooldata.entity.UserProperty;
import fi.pyramus.rest.model.Address;
import fi.pyramus.rest.model.ContactType;
import fi.pyramus.rest.model.CourseStaffMemberRole;
import fi.pyramus.rest.model.Language;
import fi.pyramus.rest.model.Municipality;
import fi.pyramus.rest.model.Nationality;
import fi.pyramus.rest.model.Person;
import fi.pyramus.rest.model.PhoneNumber;
import fi.pyramus.rest.model.School;
import fi.pyramus.rest.model.StaffMember;
import fi.pyramus.rest.model.Student;
import fi.pyramus.rest.model.StudentGroup;
import fi.pyramus.rest.model.StudentGroupStudent;
import fi.pyramus.rest.model.StudentGroupUser;
import fi.pyramus.rest.model.StudyProgramme;
import fi.pyramus.rest.model.UserCredentialReset;
import fi.pyramus.rest.model.UserCredentials;
import fi.pyramus.rest.model.UserRole;

@Dependent
public class PyramusUserSchoolDataBridge implements UserSchoolDataBridge {

  @Inject
  private PyramusIdentifierMapper identifierMapper;
  
  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;
  
  @Inject
  private PyramusClient pyramusClient;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
 
  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public User createUser(String firstName, String lastName)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    return null;
  }

  private List<User> createStudentEntities(Student... students) {
    Map<Long, StudyProgramme> studyProgrammeMap = new HashMap<Long, StudyProgramme>();
    List<User> users = new ArrayList<User>();

    for (Student student : students) {
      StudyProgramme studyProgramme;
      String nationality = null;
      String language = null;
      String municipality = null;
      String school = null;
      boolean hidden = false;
      
      if (student.getStudyProgrammeId() != null) {
        if (!studyProgrammeMap.containsKey(student.getStudyProgrammeId())) {
          StudyProgramme studyProgrammeO = pyramusClient.get(
              "/students/studyProgrammes/" + student.getStudyProgrammeId(),
              StudyProgramme.class);
          
          if (studyProgrammeO != null)
            studyProgrammeMap.put(student.getStudyProgrammeId(), studyProgrammeO);
        }

        studyProgramme = studyProgrammeMap.get(student.getStudyProgrammeId());
      } else {
        studyProgramme = null;
      }
      
      if (student.getNationalityId() != null) {
        Nationality nationalityO = pyramusClient.get(
            "/students/nationalities/" + student.getNationalityId(),
            Nationality.class);
        if (nationalityO != null)
          nationality = nationalityO.getName();
      }
      
      if (student.getLanguageId() != null) {
        Language languageO = pyramusClient.get(
            "/students/languages/" + student.getLanguageId(),
            Language.class);
        if (languageO != null)
          language = languageO.getName();
      }
      
      if (student.getMunicipalityId() != null) {
        Municipality municipalityO = pyramusClient.get(
            "/students/municipalities/" + student.getMunicipalityId(),
            Municipality.class);
        if (municipalityO != null)
          municipality = municipalityO.getName();
      }
      
      if (student.getSchoolId() != null) {
        School schoolO = pyramusClient.get(
            "/schools/schools/" + student.getSchoolId(),
            School.class);
        if (schoolO != null)
          school = schoolO.getName();
      }

      if (student.getPersonId() != null) {
        Person person = pyramusClient.get(
            "/persons/persons/" + student.getPersonId(),
            Person.class);
        if (person != null)
          hidden = person.getSecureInfo() != null ? person.getSecureInfo() : false;
      }
      
      users.add(entityFactory.createEntity(
          student,
          studyProgramme,
          nationality,
          language,
          municipality,
          school,
          student.getStudyStartDate(),
          student.getStudyEndDate(),
          student.getStudyTimeEnd(),
          hidden));
    }
    
    return users;
  }

  private User createStudentEntity(Student student) {
    if (student == null) {
      return null;
    }
    
    List<User> users = createStudentEntities(new Student[] { student });
    if (users.isEmpty()) {
      return null;
    }

    return users.get(0);
  }

  @Override
  public User findActiveUser(String identifier)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    Long studentId = identifierMapper.getPyramusStudentId(identifier);
    if (studentId != null) {
      Student student = findPyramusStudent(studentId);
      Person person = findPyramusPerson(student.getPersonId());
      if (!student.getId().equals(person.getDefaultUserId())) {
        return findUserByPyramusUser(person.getDefaultUserId());
      }

      return createStudentEntity(student);
    }

    Long staffId = identifierMapper.getPyramusStaffId(identifier);
    if (staffId != null) {
      StaffMember staffMember = findPyramusStaffMember(staffId);
      Person person = findPyramusPerson(staffMember.getPersonId());
      if (!staffMember.getId().equals(person.getDefaultUserId())) {
        return findUserByPyramusUser(person.getDefaultUserId());
      }

      return entityFactory.createEntity(staffMember);
    }

    throw new SchoolDataBridgeRequestException("Malformed user identifier");
  }

  @Override
  public User findUser(String identifier)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    Long studentId = identifierMapper.getPyramusStudentId(identifier);
    if (studentId != null) {
      Student student = findPyramusStudent(studentId);
      return createStudentEntity(student);
    }

    Long staffId = identifierMapper.getPyramusStaffId(identifier);
    if (staffId != null) {
      return entityFactory.createEntity(findPyramusStaffMember(staffId));
    }

    throw new SchoolDataBridgeRequestException("Malformed user identifier");
  }

  @Override
  public List<User> listUsersByEmail(String email)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    Map<Long, User> userMap = new HashMap<Long, User>();
    Long personId = null;

    for (Student student : pyramusClient.get("/students/students?email="
        + email, Student[].class)) {
      userMap.put(student.getId(), createStudentEntity(student));
      personId = student.getPersonId();
    }

    for (StaffMember staffMember : pyramusClient.get("/staff/members?email="
        + email, fi.pyramus.rest.model.StaffMember[].class)) {
      userMap.put(staffMember.getId(), entityFactory.createEntity(staffMember));
      personId = staffMember.getPersonId();
    }

    List<User> result = new ArrayList<User>();

    if (personId != null) {
      Person person = findPyramusPerson(personId);
      if (userMap.containsKey(person.getDefaultUserId())) {
        result.add(userMap.remove(person.getDefaultUserId()));
      }
    }

    result.addAll(userMap.values());

    return result;
  }

  @Override
  public List<User> listUsers() throws UnexpectedSchoolDataBridgeException {
    List<User> result = new ArrayList<User>();

    result.addAll(createStudentEntities(pyramusClient.get("/students/students",
        Student[].class)));
    result.addAll(entityFactory.createEntity(pyramusClient.get(
        "/staff/members", fi.pyramus.rest.model.StaffMember[].class)));

    return result;
  }

  @Override
  public User updateUser(User user) throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    if (!StringUtils.isNumeric(user.getIdentifier())) {
      throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
    }

    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public void removeUser(String identifier)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    if (!NumberUtils.isNumber(identifier)) {
      throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
    }

    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public UserEmail createUserEmail(String userIdentifier, String address)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");

  }

  @Override
  public UserEmail findUserEmail(String identifier)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public List<UserEmail> listUserEmailsByUserIdentifier(String userIdentifier)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public UserEmail updateUserEmail(UserEmail userEmail)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public void removeUserEmail(String identifier)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public UserImage createUserImage(String userIdentifier, String contentType,
      byte[] content) throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public UserImage findUserImage(String identifier)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public List<UserImage> listUserImagesByUserIdentifier(String userIdentifier)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public UserImage updateUserImage(UserImage userImage)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public void removeUserImage(String identifier)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public UserProperty getUserProperty(String userIdentifier, String key)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public UserProperty setUserProperty(String userIdentifier, String key,
      String value) throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public List<UserProperty> listUserPropertiesByUser(String userIdentifier)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    throw new UnexpectedSchoolDataBridgeException("Not implemented");
  }

  @Override
  public Role findRole(String identifier)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    UserRole pyramusUserRole = identifierMapper.getPyramusUserRole(identifier);
    if (pyramusUserRole != null) {
      return entityFactory.createEntity(pyramusUserRole);
    }

    String id = identifierMapper.getPyramusCourseRoleId(identifier);
    if (StringUtils.isBlank(id)) {
      throw new SchoolDataBridgeRequestException("Malformed role identifier");
    }

    if ("STUDENT".equals(id)) {
      return entityFactory.createCourseStudentRoleEntity();
    }

    return entityFactory.createEntity(pyramusClient.get(
        "/courses/staffMemberRoles/" + id, CourseStaffMemberRole.class));
  }

  @Override
  public List<Role> listRoles() throws UnexpectedSchoolDataBridgeException {
    List<Role> result = new ArrayList<>();

    result.addAll(entityFactory.createEntity(UserRole.values()));
    result.addAll(entityFactory.createEntity(pyramusClient.get(
        "/courses/staffMemberRoles", CourseStaffMemberRole[].class)));
    result.add(entityFactory.createCourseStudentRoleEntity());

    return result;
  }

  @Override
  public Role findUserEnvironmentRole(String userIdentifier)
      throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    Long studentId = identifierMapper.getPyramusStudentId(userIdentifier);
    if (studentId != null) {
      Student student = pyramusClient.get("/students/students/" + studentId,
          Student.class);
      return student != null ? entityFactory
          .createStudentEnvironmentRoleEntity() : null;
    }

    Long staffId = identifierMapper.getPyramusStaffId(userIdentifier);
    if (staffId != null) {
      fi.pyramus.rest.model.StaffMember staffMember = pyramusClient.get(
          "/staff/members/" + staffId, fi.pyramus.rest.model.StaffMember.class);
      return staffMember != null ? entityFactory.createEntity(staffMember
          .getRole()) : null;
    }

    throw new SchoolDataBridgeRequestException("Malformed user identifier");
  }
  
  @Override
  public UserGroup findUserGroup(String identifier) throws SchoolDataBridgeRequestException {
    switch (identifierMapper.getStudentGroupType(identifier)) {
      case STUDENTGROUP:
        Long userGroupId = identifierMapper.getPyramusStudentGroupId(identifier);
        if (userGroupId != null) {
          StudentGroup studentGroup = pyramusClient.get(String.format("/students/studentGroups/%d", userGroupId), StudentGroup.class);
          return studentGroup != null ? entityFactory.createEntity(studentGroup) : null;
        }
      break;
      
      case STUDYPROGRAMME:
        Long studyProgrammeId = identifierMapper.getPyramusStudyProgrammeId(identifier);
        if (studyProgrammeId != null) {
          StudyProgramme studyProgramme = pyramusClient.get(String.format("/students/studyProgrammes/%d", studyProgrammeId), StudyProgramme.class);
          if (studyProgramme != null)
            return new PyramusUserGroup(identifierMapper.getStudyProgrammeIdentifier(studyProgramme.getId()), studyProgramme.getName());
        }
      break;
    }
    
    throw new SchoolDataBridgeRequestException("Malformed group identifier");
  }

  @Override
  public List<UserGroup> listUserGroups() {
    return entityFactory.createEntities(pyramusClient.get("/students/studentGroups", StudentGroup[].class));
  }

  @Override
  public GroupUser findGroupUser(String groupIdentifier, String identifier) throws SchoolDataBridgeRequestException {
    switch(identifierMapper.getStudentGroupType(groupIdentifier)) {
      case STUDENTGROUP:
        Long userGroupId = identifierMapper.getPyramusStudentGroupId(groupIdentifier);
        Long groupUserId = null;
        
        switch (identifierMapper.getStudentGroupUserType(identifier)) {
          case STAFFMEMBER:
            groupUserId = identifierMapper.getPyramusStudentGroupStaffMemberId(identifier);

            if (userGroupId != null && groupUserId != null){
              return entityFactory.createEntity(
                  pyramusClient.get(String.format("/students/studentGroups/%d/staffmembers/%d", userGroupId, groupUserId) , StudentGroupUser.class));
            }
          break;
          
          case STUDENT:
            groupUserId = identifierMapper.getPyramusStudentGroupStudentId(identifier);

            if (userGroupId != null && groupUserId != null){
              return entityFactory.createEntity(
                  pyramusClient.get(String.format("/students/studentGroups/%d/students/%d", userGroupId, groupUserId) , StudentGroupStudent.class));
            }
          break;
        }
      break;
      case STUDYPROGRAMME:
        // TODO: Tis not the elegant
        Long studentId = identifierMapper.getPyramusStudyProgrammeStudentId(identifier);

        if (studentId != null) {
          return new PyramusGroupUser(identifier,
              identifierMapper.getStudentIdentifier(studentId));
        }
      break;
    }

    throw new SchoolDataBridgeRequestException("Malformed group identifier");
  }

  @Override
  public List<GroupUser> listGroupUsersByGroup(String groupIdentifier) throws SchoolDataBridgeRequestException {
    switch (identifierMapper.getStudentGroupType(groupIdentifier)) {
      case STUDENTGROUP:
        Long userGroupId = identifierMapper.getPyramusStudentGroupId(groupIdentifier);
        if (userGroupId != null) {
          return entityFactory.createEntities(pyramusClient.get(String.format("/students/studentGroups/%d/students", userGroupId), StudentGroupStudent[].class));
        }
      break;
      
      // TODO: Studyprogramme groups, Pyramus needs endpoint to list students by studyprogramme - too costly to implement it otherwise
      case STUDYPROGRAMME:
        throw new SchoolDataBridgeRequestException("PyramusUserSchoolDataBridge.listGroupUsersByGroup - not implemented");
    }

    throw new SchoolDataBridgeRequestException("Malformed group identifier");
  }
  

  private Person findPyramusPerson(Long personId) {
    Person person = pyramusClient.get("/persons/persons/" + personId,
        fi.pyramus.rest.model.Person.class);
    return person;
  }

  private User findUserByPyramusUser(Long userId) {
    Student student = findPyramusStudent(userId);
    if (student != null) {
      return createStudentEntity(student);
    }

    StaffMember staffMember = findPyramusStaffMember(userId);

    return entityFactory.createEntity(staffMember);
  }

  private StaffMember findPyramusStaffMember(Long staffId) {
    return pyramusClient.get("/staff/members/" + staffId,
        fi.pyramus.rest.model.StaffMember.class);
  }

  private Student findPyramusStudent(Long studentId) {
    return pyramusClient.get("/students/students/" + studentId, Student.class);
  }
  
  private Long getPersonId(String userIdentifier) {
    Long personId = null;
    
    Long studentId = identifierMapper.getPyramusStudentId(userIdentifier);
    if (studentId != null) {
      Student student = findPyramusStudent(studentId);
      personId = student.getPersonId();
    }

    Long staffId = identifierMapper.getPyramusStaffId(userIdentifier);
    if (staffId != null) {
      StaffMember staffMember = findPyramusStaffMember(staffId);
      personId = staffMember.getPersonId();
    }

    return personId;
  }

  @Override
  public void updateUserCredentials(String userIdentifier, String oldPassword, String newUsername, String newPassword)
      throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    
    Long personId = getPersonId(userIdentifier);
    
    if (personId == null)
      throw new SchoolDataBridgeRequestException("Malformed user identifier");

    try {
      UserCredentials change = new UserCredentials(oldPassword, newUsername, newPassword);
      
      pyramusClient.put("/persons/persons/" + personId + "/credentials", change);
    } catch (PyramusRestClientUnauthorizedException purr) {
      throw new SchoolDataBridgeUnauthorizedException(purr.getMessage());
    }
  }

  @Override
  public String requestPasswordResetByEmail(String email) {
    return pyramusClient.get("/persons/resetpasswordbyemail?email=" + email, String.class);
  }

  @Override
  public List<UserAddress> listUserAddresses(SchoolDataIdentifier userIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    if (!StringUtils.equals(userIdentifier.getDataSource(), getSchoolDataSource())) {
      throw new SchoolDataBridgeRequestException(String.format("Could not list email addresses for user from school data source %s", userIdentifier.getDataSource()));
    }
    
    Address[] addresses = null;
    Long pyramusStudentId = identifierMapper.getPyramusStudentId(userIdentifier.getIdentifier());
    if (pyramusStudentId != null) {
      addresses = pyramusClient.get(String.format("/students/students/%d/addresses", pyramusStudentId), Address[].class);
    } else {
      Long pyramusStaffId = identifierMapper.getPyramusStaffId(userIdentifier.getIdentifier());
      if (pyramusStaffId != null) {
        addresses = pyramusClient.get(String.format("/staff/members/%d/addresses", pyramusStaffId), Address[].class);
      }
    }
    
    return entityFactory.createEntities(userIdentifier, addresses);
  }

  @Override
  public List<UserPhoneNumber> listUserPhoneNumbers(SchoolDataIdentifier userIdentifier)
      throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    
    if (!StringUtils.equals(userIdentifier.getDataSource(), getSchoolDataSource())) {
      throw new SchoolDataBridgeRequestException(String.format("Could not list phone numbers for user from school data source %s", userIdentifier.getDataSource()));
    }
    
    PhoneNumber[] phoneNumbers = null;
    Long pyramusStudentId = identifierMapper.getPyramusStudentId(userIdentifier.getIdentifier());
    if (pyramusStudentId != null) {
      phoneNumbers = pyramusClient.get(String.format("/students/students/%d/phoneNumbers", pyramusStudentId), PhoneNumber[].class);
      if (phoneNumbers == null) {
        return Collections.emptyList();
      }
    } else {
      Long pyramusStaffId = identifierMapper.getPyramusStaffId(userIdentifier.getIdentifier());
      if (pyramusStaffId != null) {
        phoneNumbers = pyramusClient.get(String.format("/staff/members/%d/phoneNumbers", pyramusStaffId), PhoneNumber[].class);
        if (phoneNumbers == null) {
          return Collections.emptyList();
        }
      }
    }
    
    List<UserPhoneNumber> result = new ArrayList<>();
    
    for (PhoneNumber phoneNumber : phoneNumbers) {
      ContactType contactType = phoneNumber.getContactTypeId() != null 
          ? pyramusClient.get(String.format("/common/contactTypes/%d", phoneNumber.getContactTypeId()), ContactType.class) 
          : null;
          
      result.add(entityFactory.createEntity(userIdentifier, phoneNumber, contactType));
    }
    
    return result;
  }

  @Override
  public boolean confirmResetPassword(String resetCode, String newPassword) {
    String clientApplicationSecret = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "rest.clientSecret");
    
    String secret = DigestUtils.md5Hex(resetCode + clientApplicationSecret);
    
    UserCredentialReset reset = new UserCredentialReset(secret, newPassword);
    
    try {
      pyramusClient.post("/persons/resetpasswordbyemail", reset);
      
      return true;
    } catch (Exception ex) {
      return false;
    }
  }

  @Override
  public String findUsername(String userIdentifier) throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    Long personId = getPersonId(userIdentifier);
    
    if (personId == null)
      throw new SchoolDataBridgeRequestException("Malformed user identifier");
    
    try {
      UserCredentials userCredentials = pyramusClient.get("/persons/persons/" + personId + "/credentials", UserCredentials.class);
      
      return userCredentials.getUsername();
    } catch (PyramusRestClientUnauthorizedException purr) {
      throw new SchoolDataBridgeUnauthorizedException(purr.getMessage());
    }
  }


}
