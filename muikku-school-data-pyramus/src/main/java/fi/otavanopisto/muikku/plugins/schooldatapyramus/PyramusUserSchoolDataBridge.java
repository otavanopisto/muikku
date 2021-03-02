package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusGroupUser;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusStudentCourseStats;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusStudentMatriculationEligibility;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusUserGroup;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusUserProperty;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusRestClientUnauthorizedException;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeInternalException;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeUnauthorizedException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.GroupUserType;
import fi.otavanopisto.muikku.schooldata.entity.Role;
import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibility;
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
import fi.otavanopisto.muikku.users.UserGroupEntityController;
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
import fi.otavanopisto.pyramus.rest.model.StudentCourseStats;
import fi.otavanopisto.pyramus.rest.model.StudentGroup;
import fi.otavanopisto.pyramus.rest.model.StudentGroupStudent;
import fi.otavanopisto.pyramus.rest.model.StudentGroupUser;
import fi.otavanopisto.pyramus.rest.model.StudyProgramme;
import fi.otavanopisto.pyramus.rest.model.UserCredentials;
import fi.otavanopisto.pyramus.rest.model.UserRole;
import fi.otavanopisto.pyramus.rest.model.students.StudentStudyPeriod;
import fi.otavanopisto.pyramus.rest.model.students.StudentStudyPeriodType;

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

  @Inject
  private UserGroupDiscoveryWaiter userGroupDiscoveryWaiter;
  
  @Inject 
  private UserGroupEntityController userGroupEntityController;
 
  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public BridgeResponse<StaffMemberPayload> createStaffMember(StaffMemberPayload staffMember) {
    BridgeResponse<StaffMemberPayload> response = pyramusClient.responsePost("/muikku/users", Entity.entity(staffMember, MediaType.APPLICATION_JSON), StaffMemberPayload.class);
    if (response.getEntity() != null && NumberUtils.isNumber(response.getEntity().getIdentifier())) {
      response.getEntity().setIdentifier(identifierMapper.getStaffIdentifier(Long.valueOf(response.getEntity().getIdentifier())).toId());
    }
    return response;
  }

  @Override
  public BridgeResponse<StaffMemberPayload> updateStaffMember(StaffMemberPayload staffMember) {

    // Identifier to Pyramus entity id
    
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(staffMember.getIdentifier());
    Long staffMemberId = identifierMapper.getPyramusStaffId(identifier.getIdentifier());
    if (staffMemberId == null) {
      throw new SchoolDataBridgeInternalException("User is not a Pyramus staff member");
    }
    staffMember.setIdentifier(staffMemberId.toString());
    
    // Update
    
    BridgeResponse<StaffMemberPayload> response = pyramusClient.responsePut(String.format("/muikku/users/%d", staffMemberId), Entity.entity(staffMember, MediaType.APPLICATION_JSON), StaffMemberPayload.class);
    
    // Pyramus entity id to identifier
    
    if (response.getEntity() != null && NumberUtils.isNumber(response.getEntity().getIdentifier())) {
      response.getEntity().setIdentifier(identifierMapper.getStaffIdentifier(Long.valueOf(response.getEntity().getIdentifier())).toId());
    }
    return response;
  }
  
  @Override
  public BridgeResponse<StudentPayload> createStudent(StudentPayload student) {
    
    // Convert Muikku study programme identifier to Pyramus study programme id
    
    SchoolDataIdentifier studyProgrammeIdentifier = SchoolDataIdentifier.fromId(student.getStudyProgrammeIdentifier());
    Long studyProgrammeId = identifierMapper.getPyramusStudyProgrammeId(studyProgrammeIdentifier.getIdentifier());
    student.setStudyProgrammeIdentifier(String.valueOf(studyProgrammeId));
    
    // Create student
    
    BridgeResponse<StudentPayload> response = pyramusClient.responsePost("/muikku/students", Entity.entity(student, MediaType.APPLICATION_JSON), StudentPayload.class);
    if (response.getEntity() != null && NumberUtils.isNumber(response.getEntity().getIdentifier())) {
      response.getEntity().setIdentifier(identifierMapper.getStudentIdentifier(Long.valueOf(response.getEntity().getIdentifier())).toId());
      response.getEntity().setStudyProgrammeIdentifier(studyProgrammeIdentifier.toId()); // restore original study programme identifier
    }
    return response;
  }

  @Override
  public BridgeResponse<StudentPayload> updateStudent(StudentPayload student) {
    
    // Convert Muikku study programme identifier to Pyramus study programme id
    
    SchoolDataIdentifier studyProgrammeIdentifier = SchoolDataIdentifier.fromId(student.getStudyProgrammeIdentifier());
    Long studyProgrammeId = identifierMapper.getPyramusStudyProgrammeId(studyProgrammeIdentifier.getIdentifier());
    student.setStudyProgrammeIdentifier(String.valueOf(studyProgrammeId));
    
    // Identifier to Pyramus entity id
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(student.getIdentifier());
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (studentId == null) {
      throw new SchoolDataBridgeInternalException("User is not a Pyramus student");
    }
    student.setIdentifier(studentId.toString());
    
    // Create student
    
    BridgeResponse<StudentPayload> response = pyramusClient.responsePut(String.format("/muikku/students/%d", studentId), Entity.entity(student, MediaType.APPLICATION_JSON), StudentPayload.class);
    if (response.getEntity() != null && NumberUtils.isNumber(response.getEntity().getIdentifier())) {
      response.getEntity().setIdentifier(identifierMapper.getStudentIdentifier(Long.valueOf(response.getEntity().getIdentifier())).toId());
      response.getEntity().setStudyProgrammeIdentifier(studyProgrammeIdentifier.toId()); // restore original study programme identifier
    }
    return response;
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
      String ssn = null;
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
        if (person != null) {
          hidden = person.getSecureInfo() != null ? person.getSecureInfo() : false;
          ssn = person.getSocialSecurityNumber();
        }
      }
      
      String curriculumIdentifier = student.getCurriculumId() != null ? identifierMapper.getCurriculumIdentifier(student.getCurriculumId()).toId() : null;
      SchoolDataIdentifier organizationIdentifier = (studyProgramme != null && studyProgramme.getOrganizationId() != null) ? identifierMapper.getOrganizationIdentifier(studyProgramme.getOrganizationId()) : null;
      
      boolean evaluationFees = studyProgramme != null && Boolean.TRUE.equals(studyProgramme.getHasEvaluationFees());
      
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
          curriculumIdentifier,
          ssn,
          organizationIdentifier));
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

    logger.warning(String.format("PyramusUserSchoolDataBridge.findActiveUser malformed user identifier %s\n%s",
        identifier,
        ExceptionUtils.getStackTrace(new Throwable())));
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

    logger.warning(String.format("PyramusUserSchoolDataBridge.findUser malformed user identifier %s\n%s",
        identifier,
        ExceptionUtils.getStackTrace(new Throwable())));
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
      }
      else {
        logger.severe(String.format("PyramusUserSchoolDataBridge.listUserEmailsByUserIdentifier malformed user identifier %s\n%s",
            userIdentifier,
            ExceptionUtils.getStackTrace(new Throwable())
            ));
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
      Student student = findPyramusStudent(studentId);
      if (student != null) {
        Map<String, String> variables = student.getVariables();
        if (variables != null) {
          String value = variables.get(key);
          return value == null ? null : new PyramusUserProperty(userIdentifier, key, value);
        }
        else {
          return null;
        }
      }
    }
    else {
      Long staffMemberId = identifierMapper.getPyramusStaffId(userIdentifier);
      if (staffMemberId != null) {
        StaffMember staffMember = findPyramusStaffMember(staffMemberId);
        if (staffMember != null) {
          Map<String, String> variables = staffMember.getVariables();
          if (variables != null) {
            String value = variables.get(key);
            return value == null ? null : new PyramusUserProperty(userIdentifier, key, value);
          }
          else {
            return null;
          }
        }
      }
    }
    logger.warning(String.format("PyramusUserSchoolDataBridge.getUserProperty malformed user identifier %s\n%s",
        userIdentifier,
        ExceptionUtils.getStackTrace(new Throwable())));
    throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s", userIdentifier));
  }

  @Override
  public UserProperty setUserProperty(String userIdentifier, String key, String value) {
    Long studentId = identifierMapper.getPyramusStudentId(userIdentifier);
    if (studentId != null) {
      Student student = findPyramusStudent(studentId);
      if (student != null) {
        Map<String, String> variables = student.getVariables();
        if (variables == null) {
          variables = new HashMap<String, String>();
        }
        variables.put(key, value);
        student.setVariables(variables);
        pyramusClient.put(String.format("/students/students/%d", studentId), student);
        return new PyramusUserProperty(userIdentifier, key, value);
      }
    }
    // TODO Staff member user variables (separate endpoint for user variables?) 
    logger.warning(String.format("PyramusUserSchoolDataBridge.setUserProperty malformed user identifier %s\n%s",
        userIdentifier,
        ExceptionUtils.getStackTrace(new Throwable())));
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
    logger.warning(String.format("PyramusUserSchoolDataBridge.listUserPropertiesByUser malformed user identifier %s\n%s",
        userIdentifier,
        ExceptionUtils.getStackTrace(new Throwable())));
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
  public List<fi.otavanopisto.muikku.schooldata.entity.StudyProgramme> listStudyProgrammes() {
    List<fi.otavanopisto.muikku.schooldata.entity.StudyProgramme> studyProgrammeEntities = new ArrayList<fi.otavanopisto.muikku.schooldata.entity.StudyProgramme>();
    StudyProgramme[] studyProgrammes = pyramusClient.get("/students/studyProgrammes", StudyProgramme[].class);
    if (studyProgrammes != null && studyProgrammes.length > 0) {
      for (int i = 0; i < studyProgrammes.length; i++) {
        studyProgrammeEntities.add(entityFactory.createEntity(studyProgrammes[i]));
      }
    }
    return studyProgrammeEntities;
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
    logger.warning(String.format("PyramusUserSchoolDataBridge.findUserEnvironmentRole malformed user identifier %s\n%s",
        userIdentifier,
        ExceptionUtils.getStackTrace(new Throwable())));
    throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s", userIdentifier));
  }
  
  @Override
  public BridgeResponse<StudentGroupPayload> createStudentGroup(StudentGroupPayload payload) {
    BridgeResponse<StudentGroupPayload> response = pyramusClient.responsePost("/muikku/studentgroups", Entity.entity(payload, MediaType.APPLICATION_JSON), StudentGroupPayload.class);
    if (response.getEntity() != null && NumberUtils.isNumber(response.getEntity().getIdentifier())) {
      
      // Convert Pyramus student group id to Muikku userGroupEntityId
      
      SchoolDataIdentifier userGroupIdentifier = new SchoolDataIdentifier(
          identifierMapper.getStudentGroupIdentifier(new Long(response.getEntity().getIdentifier())),
          SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
      Long userGroupEntityId = userGroupDiscoveryWaiter.waitDiscovered(userGroupIdentifier);
      response.getEntity().setIdentifier(userGroupEntityId.toString());
    }
    return response;
  }

  @Override
  public BridgeResponse<StudentGroupPayload> updateStudentGroup(StudentGroupPayload payload) {

    // Convert Muikku userGroupEntityId to Pyramus student group id
    
    Long userGroupEntityId = new Long(payload.getIdentifier());
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(userGroupEntityId);
    Long pyramusStudentGroupId = identifierMapper.getPyramusStudentGroupId(userGroupEntity.getIdentifier());
    payload.setIdentifier(pyramusStudentGroupId.toString());
    
    BridgeResponse<StudentGroupPayload> response = pyramusClient.responsePut("/muikku/studentgroups", Entity.entity(payload, MediaType.APPLICATION_JSON), StudentGroupPayload.class);
    if (response.getEntity() != null && NumberUtils.isNumber(response.getEntity().getIdentifier())) {

      // Restore identifier
      
      response.getEntity().setIdentifier(userGroupEntityId.toString());
    }
    return response;
  }

  @Override
  public void archiveStudentGroup(String identifier) {
    Long userGroupId = identifierMapper.getPyramusStudentGroupId(identifier);
    if (userGroupId != null) {
      pyramusClient.delete(String.format("/muikku/studentgroups/%d", userGroupId));
      return;
    }
    throw new SchoolDataBridgeInternalException(String.format("Malformed student group identifier %s", identifier));
  }

  @Override
  public BridgeResponse<StudentGroupMembersPayload> addStudentGroupMembers(StudentGroupMembersPayload payload) {

    // Convert Muikku userGroupEntityId to Pyramus student group id
    
    Long userGroupEntityId = new Long(payload.getGroupIdentifier());
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(userGroupEntityId);
    Long pyramusStudentGroupId = identifierMapper.getPyramusStudentGroupId(userGroupEntity.getIdentifier());
    payload.setGroupIdentifier(pyramusStudentGroupId.toString());
    
    // Add student group members
    
    BridgeResponse<StudentGroupMembersPayload> response = pyramusClient.responsePut(
        "/muikku/addstudentgroupmembers",
        Entity.entity(payload, MediaType.APPLICATION_JSON),
        StudentGroupMembersPayload.class);
    if (response.getEntity() != null && NumberUtils.isNumber(response.getEntity().getGroupIdentifier())) {

      // Restore identifier
      
      response.getEntity().setGroupIdentifier(userGroupEntityId.toString());
    }
    return response;
  }
  
  @Override
  public BridgeResponse<StudentGroupMembersPayload> removeStudentGroupMembers(StudentGroupMembersPayload payload) {

    // Convert Muikku userGroupEntityId to Pyramus student group id
    
    Long userGroupEntityId = new Long(payload.getGroupIdentifier());
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(userGroupEntityId);
    Long pyramusStudentGroupId = identifierMapper.getPyramusStudentGroupId(userGroupEntity.getIdentifier());
    payload.setGroupIdentifier(pyramusStudentGroupId.toString());
    
    // Remove student group members
    
    BridgeResponse<StudentGroupMembersPayload> response = pyramusClient.responsePut(
        "/muikku/removestudentgroupmembers",
        Entity.entity(payload, MediaType.APPLICATION_JSON),
        StudentGroupMembersPayload.class);
    if (response.getEntity() != null && NumberUtils.isNumber(response.getEntity().getGroupIdentifier())) {

      // Restore identifier
      
      response.getEntity().setGroupIdentifier(userGroupEntityId.toString());
    }
    return response;
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
          if (studyProgramme != null) {
            SchoolDataIdentifier organizationIdentifier = studyProgramme.getOrganizationId() != null ? 
                identifierMapper.getOrganizationIdentifier(studyProgramme.getOrganizationId()) : null;
            return new PyramusUserGroup(identifierMapper.getStudyProgrammeIdentifier(
                studyProgramme.getId()).getIdentifier(),
                studyProgramme.getName(),
                "STUDYPROGRAMME",
                false,
                organizationIdentifier);
          }
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
              identifierMapper.getStudentIdentifier(studentId).getIdentifier());
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
      logger.warning(String.format("PyramusUserSchoolDataBridge.updateUserCredentials malformed user identifier %s", userIdentifier));
      throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s\n%s",
          userIdentifier,
          ExceptionUtils.getStackTrace(new Throwable())));
    }
    
    try {
      UserCredentials change = new UserCredentials(oldPassword, newUsername, newPassword);
      
      pyramusClient.put("/persons/persons/" + personId + "/credentials", change);
    } catch (PyramusRestClientUnauthorizedException purr) {
      throw new SchoolDataBridgeUnauthorizedException(purr.getMessage());
    }
  }

  @Override
  public String requestCredentialReset(String email) {
    return pyramusClient.get("/muikku/requestCredentialReset?email=" + email, String.class);
  }

  @Override
  public BridgeResponse<CredentialResetPayload> getCredentialReset(String hash) {
    String clientApplicationSecret = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "rest.clientSecret");
    String secret = DigestUtils.md5Hex(hash + clientApplicationSecret);
    BridgeResponse<CredentialResetPayload> response = pyramusClient.responseGet(String.format("/muikku/resetCredentials/%s", secret), CredentialResetPayload.class);
    if (response.getEntity() != null) {
      response.getEntity().setSecret(hash); // restore Muikku hash
    }
    return response;
  }
  
  @Override
  public BridgeResponse<CredentialResetPayload> resetCredentials(CredentialResetPayload payload) {
    String clientApplicationSecret = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "rest.clientSecret");
    String hash = payload.getSecret();
    payload.setSecret(DigestUtils.md5Hex(hash + clientApplicationSecret));
    BridgeResponse<CredentialResetPayload> response = pyramusClient.responsePost("/muikku/resetCredentials", Entity.entity(payload, MediaType.APPLICATION_JSON), CredentialResetPayload.class);
    if (response.getEntity() != null) {
      response.getEntity().setSecret(hash); // restore Muikku hash
    }
    return response;
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
  public String findUsername(String userIdentifier) {
    Long personId = getPersonId(userIdentifier);
    
    if (personId == null) {
      logger.warning(String.format("PyramusUserSchoolDataBridge.findUsername malformed user identifier %s\n%s",
          userIdentifier,
          ExceptionUtils.getStackTrace(new Throwable())));
      throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s", userIdentifier));
    }
    
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

  @Override
  public StudentMatriculationEligibility getStudentMatriculationEligibility(SchoolDataIdentifier studentIdentifier, String subjectCode) {
    if (!StringUtils.equals(studentIdentifier.getDataSource(), getSchoolDataSource())) {
      throw new SchoolDataBridgeInternalException(String.format("Could not evaluate students' matriculation eligibility from school data source %s", studentIdentifier.getDataSource()));
    }
    
    Long pyramusStudentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (pyramusStudentId != null) {
      fi.otavanopisto.pyramus.rest.model.StudentMatriculationEligibility result = pyramusClient.get(String.format("/students/students/%d/matriculationEligibility?subjectCode=%s", pyramusStudentId, subjectCode), fi.otavanopisto.pyramus.rest.model.StudentMatriculationEligibility.class);
      if (result == null) {
        throw new SchoolDataBridgeInternalException(String.format("Could not resolve matriculation eligibility for student %s", studentIdentifier));
      }
      
      return new PyramusStudentMatriculationEligibility(result.getEligible(), result.getRequirePassingGrades(), result.getAcceptedCourseCount(), result.getAcceptedTransferCreditCount());
    } else {
      throw new SchoolDataBridgeInternalException(String.format("Failed to resolve Pyramus user from studentIdentifier %s", studentIdentifier));
    }
    
  }
 
  @Override
  public fi.otavanopisto.muikku.schooldata.entity.StudentCourseStats getStudentCourseStats(
      SchoolDataIdentifier studentIdentifier,
      String educationTypeCode,
      String educationSubtypeCode
  ) {
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    StudentCourseStats courseStats = pyramusClient.get(
        String.format(
            "/students/students/%d/courseStats?educationTypeCode=%s&educationSubtypeCode=%s",
            studentId,
            educationTypeCode,
            educationSubtypeCode), StudentCourseStats.class); 
    return new PyramusStudentCourseStats(courseStats.getNumberCompletedCourses());
  }
  
  public boolean isActiveUser(User user) {
    // Student with set study end date has ended studies
    if (user.getStudyEndDate() != null) {
      return false;
    }
    
    if (identifierMapper.isStudentIdentifier(user.getIdentifier())) {
      // Student on a temporary study suspension/break is not active either
      Long pyramusStudentId = identifierMapper.getPyramusStudentId(user.getIdentifier());
      StudentStudyPeriod[] studyPeriods = listStudentStudyPeriods(pyramusStudentId);
      if (ArrayUtils.isNotEmpty(studyPeriods)) {
        LocalDate now = LocalDate.now();
        
        for (StudentStudyPeriod period : studyPeriods) {
          if (period.getType() == StudentStudyPeriodType.TEMPORARILY_SUSPENDED) {
            LocalDate periodBegin = period.getBegin();
            LocalDate periodEnd = period.getEnd();
            
            if (periodBegin != null) {
              if (periodBegin.equals(now) || periodBegin.isBefore(now)) {
                if ((periodEnd == null) || periodEnd.equals(now) || periodEnd.isAfter(now)) {
                  // When period has started before current date and period is ending after current date or is null
                  // the student is considered inactive.
                  return false;
                }
              }
            } else {
              // Start date of temporary suspension is undefined so consider the student inactive
              return false;
            }
          }
        }
      }
    }
    
    // Student is active if above steps are not triggered
    return true;
  }
  
  private StudentStudyPeriod[] listStudentStudyPeriods(Long pyramusStudentId) {
    return pyramusClient.get(String.format("/students/students/%d/studyPeriods", pyramusStudentId), StudentStudyPeriod[].class);
  }

}