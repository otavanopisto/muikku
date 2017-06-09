package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusGroupUser;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusUserGroup;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusUserProperty;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusRestClientUnauthorizedException;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeInternalException;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeUnauthorizedException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.GroupUserType;
import fi.otavanopisto.muikku.schooldata.entity.Role;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.entity.UserImage;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;
import fi.otavanopisto.pyramus.rest.model.Address;
import fi.otavanopisto.pyramus.rest.model.ContactType;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMemberRole;
import fi.otavanopisto.pyramus.rest.model.Email;
import fi.otavanopisto.pyramus.rest.model.Language;
import fi.otavanopisto.pyramus.rest.model.Municipality;
import fi.otavanopisto.pyramus.rest.model.Nationality;
import fi.otavanopisto.pyramus.rest.model.Person;
import fi.otavanopisto.pyramus.rest.model.PhoneNumber;
import fi.otavanopisto.pyramus.rest.model.School;
import fi.otavanopisto.pyramus.rest.model.StaffMember;
import fi.otavanopisto.pyramus.rest.model.Student;
import fi.otavanopisto.pyramus.rest.model.StudentGroup;
import fi.otavanopisto.pyramus.rest.model.StudentGroupStudent;
import fi.otavanopisto.pyramus.rest.model.StudentGroupUser;
import fi.otavanopisto.pyramus.rest.model.StudyProgramme;
import fi.otavanopisto.pyramus.rest.model.UserCredentialReset;
import fi.otavanopisto.pyramus.rest.model.UserCredentials;
import fi.otavanopisto.pyramus.rest.model.UserRole;

@Dependent
public class PyramusUserSchoolDataBridge implements UserSchoolDataBridge {
  
  @Inject
  private Logger logger;

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
  public User createUser(String firstName, String lastName) {
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
      
      String curriculumIdentifier = student.getCurriculumId() != null ? identifierMapper.getCurriculumIdentifier(student.getCurriculumId()).toId() : null;
      
      // #3069: User has evaluation fees if their study program begins with Internetix/
      
      boolean evaluationFees = studyProgramme != null && StringUtils.startsWith(studyProgramme.getName(), "Internetix/");
      
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
          evaluationFees,
          hidden,
          curriculumIdentifier));
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
  public User findActiveUser(String identifier) {
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
      if (staffMember == null) {
        return null;
      }
      Person person = findPyramusPerson(staffMember.getPersonId());
      if (!staffMember.getId().equals(person.getDefaultUserId())) {
        return findUserByPyramusUser(person.getDefaultUserId());
      }

      return entityFactory.createEntity(staffMember);
    }

    throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s", identifier));
  }

  @Override
  public User findUser(String identifier) {
    Long studentId = identifierMapper.getPyramusStudentId(identifier);
    if (studentId != null) {
      Student student = findPyramusStudent(studentId);
      return createStudentEntity(student);
    }

    Long staffId = identifierMapper.getPyramusStaffId(identifier);
    if (staffId != null) {
      StaffMember staffMember = findPyramusStaffMember(staffId);
      return staffMember == null ? null : entityFactory.createEntity(staffMember);
    }

    throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s", identifier));
  }

  @Override
  public List<User> listUsersByEmail(String email) {
    Map<Long, User> userMap = new HashMap<Long, User>();
    Long personId = null;

    for (Student student : pyramusClient.get("/students/students?email="
        + email, Student[].class)) {
      userMap.put(student.getId(), createStudentEntity(student));
      personId = student.getPersonId();
    }

    for (StaffMember staffMember : pyramusClient.get("/staff/members?email=" + email, StaffMember[].class)) {
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
  public List<User> listUsers() throws SchoolDataBridgeInternalException {
    List<User> result = new ArrayList<User>();
    result.addAll(createStudentEntities(pyramusClient.get("/students/students", Student[].class)));
    result.addAll(entityFactory.createEntity(pyramusClient.get("/staff/members", StaffMember[].class)));
    return result;
  }

  @Override
  public User updateUser(User user) {
    Long studentId = identifierMapper.getPyramusStudentId(user.getIdentifier());
    
    // This updates only the municipality field, add other fields as necessary
    
    if (studentId == null) {
      throw new SchoolDataBridgeInternalException("User is not a Pyramus student");
    }
    
    Student student = pyramusClient.get(String.format("/students/students/%d", studentId), Student.class);
    Municipality[] municipalities = pyramusClient.get("/students/municipalities", Municipality[].class);

    // There's no search endpoint in Pyramus REST, and the municipality field is text, so we need to do this
    boolean municipalityFound = false;
    for (Municipality municipality : Arrays.asList(municipalities)) {
      if (StringUtils.equalsIgnoreCase(municipality.getName(), user.getMunicipality())) {
        student.setMunicipalityId(municipality.getId());
        municipalityFound = true;
        break;
      }
    }
    if (!municipalityFound) {
      throw new SchoolDataBridgeInternalException("Municipality not found");
    }
    
    pyramusClient.put(String.format("/students/students/%d", studentId), student);
    return user;
  }

  @Override
  public void removeUser(String identifier) {
    if (!NumberUtils.isNumber(identifier)) {
      throw new SchoolDataBridgeInternalException("Identifier has to be numeric");
    }

    throw new SchoolDataBridgeInternalException("Not implemented");
  }

  @Override
  public UserEmail createUserEmail(String userIdentifier, String address) {
    throw new SchoolDataBridgeInternalException("Not implemented");

  }

  @Override
  public UserEmail findUserEmail(String identifier) {
    throw new SchoolDataBridgeInternalException("Not implemented");
  }

  @Override
  public List<UserEmail> listUserEmailsByUserIdentifier(String userIdentifier) {
    
    Email[] emails = null;
    
    Long studentId = identifierMapper.getPyramusStudentId(userIdentifier);
    if (studentId != null) {
      emails = pyramusClient.get(String.format("/students/students/%d/emails", studentId), Email[].class);
    } else {
      Long staffId = identifierMapper.getPyramusStaffId(userIdentifier);
      if (staffId != null) {
        emails = pyramusClient.get(String.format("/staff/members/%d/emails", staffId), Email[].class);
      } else {
        logger.severe(String.format("Malformed user identifier %s", userIdentifier));
      }
    }
    
    if (emails != null) {
      List<UserEmail> result = new ArrayList<>(emails.length);
      
      for (Email email : emails) {
        ContactType contactType = email != null ? pyramusClient.get("/common/contactTypes/" + email.getContactTypeId(), ContactType.class) : null;
        UserEmail userEmail = entityFactory.createEntity(new SchoolDataIdentifier(userIdentifier, getSchoolDataSource()), email, contactType);
        if (userEmail != null) {
          result.add(userEmail);
        }
      }
      
      return result;
    }
    
    return Collections.emptyList();
  }

  @Override
  public UserEmail updateUserEmail(UserEmail userEmail) {
    throw new SchoolDataBridgeInternalException("Not implemented");
  }

  @Override
  public void removeUserEmail(String identifier) {
    throw new SchoolDataBridgeInternalException("Not implemented");
  }

  @Override
  public UserImage createUserImage(String userIdentifier, String contentType,
      byte[] content) {
    throw new SchoolDataBridgeInternalException("Not implemented");
  }

  @Override
  public UserImage findUserImage(String identifier) {
    throw new SchoolDataBridgeInternalException("Not implemented");
  }

  @Override
  public List<UserImage> listUserImagesByUserIdentifier(String userIdentifier) {
    throw new SchoolDataBridgeInternalException("Not implemented");
  }

  @Override
  public UserImage updateUserImage(UserImage userImage) {
    throw new SchoolDataBridgeInternalException("Not implemented");
  }

  @Override
  public void removeUserImage(String identifier) {
    throw new SchoolDataBridgeInternalException("Not implemented");
  }

  @Override
  public UserProperty getUserProperty(String userIdentifier, String key) {
    Long studentId = identifierMapper.getPyramusStudentId(userIdentifier);
    if (studentId != null) {
      Student student = pyramusClient.get("/students/students/" + studentId, Student.class);
      Map<String, String> variables = student.getVariables();
      String value = variables.get(key);
      if (value == null) {
        return null;
      } else {
        return new PyramusUserProperty(userIdentifier, key, value);
      }
    }
    throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s", userIdentifier));
  }

  @Override
  public UserProperty setUserProperty(String userIdentifier, String key, String value) {
    Long studentId = identifierMapper.getPyramusStudentId(userIdentifier);
    if (studentId != null) {
      Student student = pyramusClient.get("/students/students/" + studentId, Student.class);
      Map<String, String> variables = student.getVariables();
      variables.put(key, value);
      student.setVariables(variables);
      pyramusClient.put(String.format("/students/students/%d", studentId), student);
      return new PyramusUserProperty(userIdentifier, key, value);
    }
    throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s", userIdentifier));
  }

  @Override
  public List<UserProperty> listUserPropertiesByUser(String userIdentifier) {
    Long studentId = identifierMapper.getPyramusStudentId(userIdentifier);
    if (studentId != null) {
      Student student = pyramusClient.get("/students/students/" + studentId, Student.class);
      Map<String, String> variables = student.getVariables();
      
      List<UserProperty> userProperties = new ArrayList<>();
      
      for (String key : variables.keySet()) {
        String value = variables.get(key);
        if (value != null) {
          userProperties.add(new PyramusUserProperty(userIdentifier, key, value));
        }
      }
      
      return userProperties;
    }
    
    throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s", userIdentifier));
  }

  @Override
  public Role findRole(String identifier) {
    UserRole pyramusUserRole = identifierMapper.getPyramusUserRole(identifier);
    if (pyramusUserRole != null) {
      return entityFactory.createEntity(pyramusUserRole);
    }

    String id = identifierMapper.getPyramusCourseRoleId(identifier);
    if (StringUtils.isBlank(id)) {
      throw new SchoolDataBridgeInternalException("Malformed role identifier");
    }

    if ("STUDENT".equals(id)) {
      return entityFactory.createCourseStudentRoleEntity();
    }

    return entityFactory.createEntity(pyramusClient.get("/courses/staffMemberRoles/" + id, CourseStaffMemberRole.class));
  }

  @Override
  public List<Role> listRoles() {
    List<Role> result = new ArrayList<>();

    result.addAll(entityFactory.createEntity(UserRole.values()));
    result.addAll(entityFactory.createEntity(pyramusClient.get("/courses/staffMemberRoles", CourseStaffMemberRole[].class)));
    result.add(entityFactory.createCourseStudentRoleEntity());

    return result;
  }

  @Override
  public Role findUserEnvironmentRole(String userIdentifier) {
    Long studentId = identifierMapper.getPyramusStudentId(userIdentifier);
    if (studentId != null) {
      Student student = pyramusClient.get("/students/students/" + studentId,
          Student.class);
      return student != null ? entityFactory
          .createStudentEnvironmentRoleEntity() : null;
    }

    Long staffId = identifierMapper.getPyramusStaffId(userIdentifier);
    if (staffId != null) {
      StaffMember staffMember = pyramusClient.get("/staff/members/" + staffId, StaffMember.class);
      return staffMember != null ? entityFactory.createEntity(staffMember.getRole()) : null;
    }

    throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s", userIdentifier));
  }
  
  @Override
  public UserGroup findUserGroup(String identifier) {
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
            return new PyramusUserGroup(identifierMapper.getStudyProgrammeIdentifier(studyProgramme.getId()), studyProgramme.getName(), false);
        }
      break;
    }
    
    throw new SchoolDataBridgeInternalException(String.format("Malformed group identifier %s", identifier));
  }

  @Override
  public List<UserGroup> listUserGroups() {
    return entityFactory.createEntities(pyramusClient.get("/students/studentGroups", StudentGroup[].class));
  }

  @Override
  public GroupUser findGroupUser(String groupIdentifier, String identifier) {
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

    throw new SchoolDataBridgeInternalException("Malformed group identifier");
  }

  @Override
  public List<GroupUser> listGroupUsersByGroup(String groupIdentifier) {
    return listGroupUsersByGroupAndType(groupIdentifier, GroupUserType.STUDENT);
  }
  
  @Override
  public List<GroupUser> listGroupUsersByGroupAndType(String groupIdentifier, GroupUserType type) {
    switch (identifierMapper.getStudentGroupType(groupIdentifier)) {
      case STUDENTGROUP:
        Long userGroupId = identifierMapper.getPyramusStudentGroupId(groupIdentifier);
        if (userGroupId != null) {
          switch (type) {
          case STUDENT:
            return entityFactory.createEntities(pyramusClient.get(String.format("/students/studentGroups/%d/students", userGroupId), StudentGroupStudent[].class));
          case STAFF_MEMBER:
            return entityFactory.createEntities(pyramusClient.get(String.format("/students/studentGroups/%d/staffmembers", userGroupId), StudentGroupUser[].class));
          }
        }
      break;
      
      // TODO: Studyprogramme groups, Pyramus needs endpoint to list students by studyprogramme - too costly to implement it otherwise
      case STUDYPROGRAMME:
        throw new SchoolDataBridgeInternalException("PyramusUserSchoolDataBridge.listGroupUsersByGroupAndType - not implemented");
    }

    throw new SchoolDataBridgeInternalException("Malformed group identifier");
  }
  

  private Person findPyramusPerson(Long personId) {
    Person person = pyramusClient.get("/persons/persons/" + personId,
        fi.otavanopisto.pyramus.rest.model.Person.class);
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
    return pyramusClient.get("/staff/members/" + staffId, StaffMember.class);
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
  public void updateUserCredentials(String userIdentifier, String oldPassword, String newUsername, String newPassword) {
    
    Long personId = getPersonId(userIdentifier);
    
    if (personId == null) {
      throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s", userIdentifier));
    }
    
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
  public List<UserAddress> listUserAddresses(SchoolDataIdentifier userIdentifier) {
    if (!StringUtils.equals(userIdentifier.getDataSource(), getSchoolDataSource())) {
      throw new SchoolDataBridgeInternalException(String.format("Could not list email addresses for user from school data source %s", userIdentifier.getDataSource()));
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
    
    if (addresses == null) {
      return Collections.emptyList();
    }
    
    List<UserAddress> result = new ArrayList<>(addresses.length);
    for (Address address : addresses) {
      ContactType contactType = address.getContactTypeId() != null 
        ? pyramusClient.get(String.format("/common/contactTypes/%d", address.getContactTypeId()), ContactType.class) 
        : null;
      result.add(entityFactory.createEntity(userIdentifier, address, contactType));
    }
    
    return result;
  }

  @Override
  public List<UserPhoneNumber> listUserPhoneNumbers(SchoolDataIdentifier userIdentifier) {
    
    if (!StringUtils.equals(userIdentifier.getDataSource(), getSchoolDataSource())) {
      throw new SchoolDataBridgeInternalException(String.format("Could not list phone numbers for user from school data source %s", userIdentifier.getDataSource()));
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
  public String findUsername(String userIdentifier) {
    Long personId = getPersonId(userIdentifier);
    
    if (personId == null)
      throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s", userIdentifier));
    
    try {
      UserCredentials userCredentials = pyramusClient.get("/persons/persons/" + personId + "/credentials", UserCredentials.class);
      
      return userCredentials.getUsername();
    } catch (PyramusRestClientUnauthorizedException purr) {
      throw new SchoolDataBridgeUnauthorizedException(purr.getMessage());
    }
  }

  @Override
  public void updateUserAddress(
      SchoolDataIdentifier studentIdentifier,
      SchoolDataIdentifier identifier,
      String street,
      String postalCode,
      String city,
      String country
  ) {
    Long addressId = identifierMapper.getPyramusAddressId(identifier.getIdentifier());
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    
    if (addressId == null) {
      throw new SchoolDataBridgeInternalException(String.format("Malformed identifier %s", identifier));
    }

    if (studentId == null) {
      throw new SchoolDataBridgeInternalException(String.format("Malformed identifier %s", studentIdentifier));
    }
    
    try {
      Address address = pyramusClient.get(String.format("/students/students/%d/addresses/%d", studentId, addressId), Address.class);
      if (address == null) {
        throw new SchoolDataBridgeInternalException(String.format("Address %d of student %d not found", addressId, studentId));
      }
      address.setStreetAddress(street);
      address.setPostalCode(postalCode);
      address.setCity(city);
      address.setCountry(country);
      pyramusClient.put(String.format("/students/students/%d/addresses/%s", studentId, addressId), address);
    } catch (PyramusRestClientUnauthorizedException purr) {
      throw new SchoolDataBridgeUnauthorizedException(purr.getMessage());
    }
  }
}
