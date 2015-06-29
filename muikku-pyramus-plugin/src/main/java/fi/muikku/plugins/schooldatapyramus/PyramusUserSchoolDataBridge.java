package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateful;
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
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.UserSchoolDataBridge;
import fi.muikku.schooldata.entity.GroupUser;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserEmail;
import fi.muikku.schooldata.entity.UserGroup;
import fi.muikku.schooldata.entity.UserImage;
import fi.muikku.schooldata.entity.UserProperty;
import fi.pyramus.rest.model.CourseStaffMemberRole;
import fi.pyramus.rest.model.Language;
import fi.pyramus.rest.model.Municipality;
import fi.pyramus.rest.model.Nationality;
import fi.pyramus.rest.model.Person;
import fi.pyramus.rest.model.School;
import fi.pyramus.rest.model.StaffMember;
import fi.pyramus.rest.model.Student;
import fi.pyramus.rest.model.StudentGroup;
import fi.pyramus.rest.model.StudentGroupStudent;
import fi.pyramus.rest.model.StudentGroupUser;
import fi.pyramus.rest.model.StudyProgramme;
import fi.pyramus.rest.model.UserCredentials;
import fi.pyramus.rest.model.UserCredentialReset;
import fi.pyramus.rest.model.UserRole;

@Dependent
@Stateful
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
    List<StudyProgramme> studyProgrammes = new ArrayList<>(students.length);
    Map<Long, StudyProgramme> studyProgrammeMap = new HashMap<Long, StudyProgramme>();
    List<String> nationalities = new ArrayList<>();
    List<String> languages = new ArrayList<>();
    List<String> municipalities = new ArrayList<>();
    List<String> schools = new ArrayList<>();

    for (Student student : students) {
      if (student.getStudyProgrammeId() != null) {
        if (!studyProgrammeMap.containsKey(student.getStudyProgrammeId())) {
          StudyProgramme studyProgramme = pyramusClient.get(
              "/students/studyProgrammes/" + student.getStudyProgrammeId(),
              StudyProgramme.class);
          studyProgrammeMap.put(student.getStudyProgrammeId(), studyProgramme);
        }

        studyProgrammes
            .add(studyProgrammeMap.get(student.getStudyProgrammeId()));
      } else {
        studyProgrammes.add(null);
      }
      
      if (student.getNationalityId() != null) {
        Nationality nationality = pyramusClient.get(
            "/students/nationalities/" + student.getNationalityId(),
            Nationality.class);
        if (nationality != null)
          nationalities.add(nationality.getName());
        else
          nationalities.add(null);
      } else {
        nationalities.add(null);
      }
      
      if (student.getLanguageId() != null) {
        Language language = pyramusClient.get(
            "/students/languages/" + student.getLanguageId(),
            Language.class);
        if (language != null)
          languages.add(language.getName());
        else
          languages.add(null);
      } else {
        languages.add(null);
      }
      
      if (student.getMunicipalityId() != null) {
          Municipality municipality = pyramusClient.get(
              "/students/municipalities/" + student.getMunicipalityId(),
              Municipality.class);
          if (municipality != null)
            municipalities.add(municipality.getName());
          else
            municipalities.add(null);
      } else {
        municipalities.add(null);
      }
      
      if (student.getSchoolId() != null) {
        School school = pyramusClient.get(
            "/schools/schools/" + student.getSchoolId(),
            School.class);
        if (school != null)
          schools.add(school.getName());
        else
          schools.add(null);
      } else {
        schools.add(null);
      }
     
    }

    return entityFactory.createEntity(students,
        studyProgrammes.toArray(new StudyProgramme[0]),
        nationalities.toArray(new String[0]),
        languages.toArray(new String[0]),
        municipalities.toArray(new String[0]),
        schools.toArray(new String[0]));
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
      return createStudentEntity(findPyramusStudent(studentId));
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
