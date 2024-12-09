package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

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
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusGroupUser;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusGuardiansDependent;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusGuardiansDependentWorkspace;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusSpecEdTeacher;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusStudentCourseStats;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusUserGroup;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusUserProperty;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusRestClientUnauthorizedException;
import fi.otavanopisto.muikku.rest.OrganizationContactPerson;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryBatch;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryCommentRestModel;
import fi.otavanopisto.muikku.rest.StudentContactLogEntryRestModel;
import fi.otavanopisto.muikku.rest.StudentContactLogWithRecipientsRestModel;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeInternalException;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeUnauthorizedException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.GroupStaffMember;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.GroupUserType;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependent;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependentWorkspace;
import fi.otavanopisto.muikku.schooldata.entity.SpecEdTeacher;
import fi.otavanopisto.muikku.schooldata.entity.StudentCard;
import fi.otavanopisto.muikku.schooldata.entity.StudentGuidanceRelation;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserContactInfo;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;
import fi.otavanopisto.muikku.schooldata.entity.UserStudyPeriod;
import fi.otavanopisto.muikku.schooldata.entity.UserStudyPeriodType;
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
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.pyramus.rest.model.Address;
import fi.otavanopisto.pyramus.rest.model.ContactType;
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
import fi.otavanopisto.pyramus.rest.model.StudentParent;
import fi.otavanopisto.pyramus.rest.model.StudentParentChild;
import fi.otavanopisto.pyramus.rest.model.StudyProgramme;
import fi.otavanopisto.pyramus.rest.model.UserCredentials;
import fi.otavanopisto.pyramus.rest.model.students.StudentParentStudentCourseRestModel;
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

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private UserEntityController userEntityController;
  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public BridgeResponse<List<StudyActivityItemRestModel>> getStudyActivity(String identifier) {

    // Convert identifier to Pyramus student id

    Long studentId = identifierMapper.getPyramusStudentId(identifier);
    if (studentId == null) {
      throw new SchoolDataBridgeInternalException("User is not a Pyramus student");
    }

    // Service call

    BridgeResponse<StudyActivityItemRestModel[]> response = pyramusClient.responseGet(
        String.format("/muikku/students/%d/studyActivity", studentId),
        StudyActivityItemRestModel[].class);

    // Convert Pyramus course ids in response to Muikku workspace entity ids

    List<StudyActivityItemRestModel> items = null;
    if (response.getEntity() != null) {
      items = new ArrayList<>();
      for (StudyActivityItemRestModel item : response.getEntity()) {
        if (item.getCourseId() != null) {
          WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(
              getSchoolDataSource(),
              identifierMapper.getWorkspaceIdentifier(item.getCourseId()));
          if (workspaceEntity == null) {
            logger.severe(String.format("Pyramus course %d not found in Muikku", item.getCourseId()));
            item.setCourseId(null);
          }
          else {
            item.setCourseId(workspaceEntity.getId());
          }
        }
        items.add(item);
      }
    }
    return new BridgeResponse<List<StudyActivityItemRestModel>>(response.getStatusCode(), items);
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
        Person person = findPyramusPerson(student.getPersonId());
        if (person != null) {
          hidden = person.getSecureInfo() != null ? person.getSecureInfo() : false;
        }
      }

      SchoolDataIdentifier curriculumIdentifier = student.getCurriculumId() != null ? identifierMapper.getCurriculumIdentifier(student.getCurriculumId()) : null;
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
          organizationIdentifier,
          student.getMatriculationEligibility() != null ? student.getMatriculationEligibility().isUpperSecondarySchoolCurriculum() : false
        )
      );
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

    Long studentParentId = identifierMapper.getStudentParentId(identifier);
    if (studentParentId != null) {
      StudentParent studentParent = findPyramusStudentParent(studentParentId);
      if (studentParent == null) {
        return null;
      }
      Person person = findPyramusPerson(studentParent.getPersonId());
      if (!studentParent.getId().equals(person.getDefaultUserId())) {
        return findUserByPyramusUser(person.getDefaultUserId());
      }

      return entityFactory.createEntity(studentParent);
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

    Long studentParentId = identifierMapper.getStudentParentId(identifier);
    if (studentParentId != null) {
      StudentParent studentParent = findPyramusStudentParent(studentParentId);
      return studentParent == null ? null : entityFactory.createEntity(studentParent);
    }

    logger.warning(String.format("PyramusUserSchoolDataBridge.findUser malformed user identifier %s\n%s",
        identifier,
        ExceptionUtils.getStackTrace(new Throwable())));
    throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s", identifier));
  }

  @Override
  public String findUserSsn(SchoolDataIdentifier userIdentifier) {
    String identifier = userIdentifier.getIdentifier();

    Long studentId = identifierMapper.getPyramusStudentId(identifier);
    if (studentId != null) {
      Student student = findPyramusStudent(studentId);

      if (student.getPersonId() != null) {
        Person person = pyramusClient.get(
            "/persons/persons/" + student.getPersonId(),
            Person.class);
        if (person != null) {
          return person.getSocialSecurityNumber();
        }
      }
    }

    Long staffId = identifierMapper.getPyramusStaffId(identifier);
    if (staffId != null) {
      throw new SchoolDataBridgeInternalException(String.format("Not supported for staff members", identifier));
    }

    logger.warning(String.format("PyramusUserSchoolDataBridge.findUserSsn malformed user identifier %s\n%s",
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

    for (StudentParent studentParent : pyramusClient.get("/studentparents/studentparents?email=" + email, StudentParent[].class)) {
      userMap.put(studentParent.getId(), entityFactory.createEntity(studentParent));
      personId = studentParent.getPersonId();
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
  public UserProperty getUserProperty(String userIdentifier, String key) {
    PyramusUserType identifierUserType = identifierMapper.getIdentifierUserType(userIdentifier);

    if (identifierUserType != null) {
      switch (identifierUserType) {
        case STUDENT:
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
        break;
        case STAFFMEMBER:
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
        break;
        case STUDENTPARENT:
          Long studentParentId = identifierMapper.getStudentParentId(userIdentifier);
          if (studentParentId != null) {
            StudentParent studentParent = findPyramusStudentParent(studentParentId);
            if (studentParent != null) {
              Map<String, String> variables = studentParent.getVariables();
              if (variables != null) {
                String value = variables.get(key);
                return value == null ? null : new PyramusUserProperty(userIdentifier, key, value);
              }
              else {
                return null;
              }
            }
          }
        break;
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
  public BridgeResponse<StudentGroupPayload> createStudentGroup(StudentGroupPayload payload) {
    BridgeResponse<StudentGroupPayload> response = pyramusClient.responsePost("/muikku/studentgroups", Entity.entity(payload, MediaType.APPLICATION_JSON), StudentGroupPayload.class);
    if (response.getEntity() != null && NumberUtils.isNumber(response.getEntity().getIdentifier())) {

      // Convert Pyramus student group id to Muikku userGroupEntityId

      SchoolDataIdentifier userGroupIdentifier = new SchoolDataIdentifier(
          identifierMapper.getStudentGroupIdentifier(Long.valueOf(response.getEntity().getIdentifier())),
          SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
      Long userGroupEntityId = userGroupDiscoveryWaiter.waitDiscovered(userGroupIdentifier);
      response.getEntity().setIdentifier(userGroupEntityId.toString());
    }
    return response;
  }

  @Override
  public BridgeResponse<StudentGroupPayload> updateStudentGroup(StudentGroupPayload payload) {

    // Convert Muikku userGroupEntityId to Pyramus student group id

    Long userGroupEntityId = Long.valueOf(payload.getIdentifier());
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

    Long userGroupEntityId = Long.valueOf(payload.getGroupIdentifier());
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(userGroupEntityId);
    Long pyramusStudentGroupId = identifierMapper.getPyramusStudentGroupId(userGroupEntity.getIdentifier());
    payload.setGroupIdentifier(pyramusStudentGroupId.toString());

    // Convert user identifiers to Pyramus user ids

    String[] originalIdentifiers = payload.getUserIdentifiers();
    String[] pyramusIdentifiers = originalIdentifiers.clone();
    for (int i = 0; i < pyramusIdentifiers.length; i++) {
      // Lazy shortcut since identifier style is either PYRAMUS-STUDENT-123 or PYRAMUS-STAFF-456
      pyramusIdentifiers[i] = StringUtils.substringAfterLast(pyramusIdentifiers[i], "-");
    }
    payload.setUserIdentifiers(pyramusIdentifiers);

    // Add student group members

    BridgeResponse<StudentGroupMembersPayload> response = pyramusClient.responsePut(
        "/muikku/addstudentgroupmembers",
        Entity.entity(payload, MediaType.APPLICATION_JSON),
        StudentGroupMembersPayload.class);
    if (response.getEntity() != null && NumberUtils.isNumber(response.getEntity().getGroupIdentifier())) {

      // Restore identifiers

      response.getEntity().setGroupIdentifier(userGroupEntityId.toString());
      response.getEntity().setUserIdentifiers(originalIdentifiers);
    }
    return response;
  }

  @Override
  public BridgeResponse<StudentGroupMembersPayload> removeStudentGroupMembers(StudentGroupMembersPayload payload) {

    // Convert Muikku userGroupEntityId to Pyramus student group id

    Long userGroupEntityId = Long.valueOf(payload.getGroupIdentifier());
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(userGroupEntityId);
    Long pyramusStudentGroupId = identifierMapper.getPyramusStudentGroupId(userGroupEntity.getIdentifier());
    payload.setGroupIdentifier(pyramusStudentGroupId.toString());

    // Convert user identifiers to Pyramus user ids

    String[] originalIdentifiers = payload.getUserIdentifiers();
    String[] pyramusIdentifiers = originalIdentifiers.clone();
    for (int i = 0; i < pyramusIdentifiers.length; i++) {
      // Lazy shortcut since identifier style is either PYRAMUS-STUDENT-123 or PYRAMUS-STAFF-456
      pyramusIdentifiers[i] = StringUtils.substringAfterLast(pyramusIdentifiers[i], "-");
    }
    payload.setUserIdentifiers(pyramusIdentifiers);

    // Remove student group members

    BridgeResponse<StudentGroupMembersPayload> response = pyramusClient.responsePut(
        "/muikku/removestudentgroupmembers",
        Entity.entity(payload, MediaType.APPLICATION_JSON),
        StudentGroupMembersPayload.class);
    if (response.getEntity() != null && NumberUtils.isNumber(response.getEntity().getGroupIdentifier())) {

      // Restore identifiers

      response.getEntity().setGroupIdentifier(userGroupEntityId.toString());
      response.getEntity().setUserIdentifiers(originalIdentifiers);
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
            return entityFactory.createEntities(GroupUser.class, pyramusClient.get(String.format("/students/studentGroups/%d/staffmembers", userGroupId), StudentGroupUser[].class));
          }
        }
      break;

      // TODO: Studyprogramme groups, Pyramus needs endpoint to list students by studyprogramme - too costly to implement it otherwise
      case STUDYPROGRAMME:
        throw new SchoolDataBridgeInternalException("PyramusUserSchoolDataBridge.listGroupUsersByGroupAndType - not implemented");
    }

    throw new SchoolDataBridgeInternalException("Malformed group identifier");
  }

  @Override
  public List<GroupStaffMember> listStudentGuidanceCounselors(SchoolDataIdentifier studentIdentifier, Boolean onlyMessageReceivers) {
    Long pyramusStudentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    
    String path = String.format("/students/students/%d/guidanceCounselors", pyramusStudentId);
    if (onlyMessageReceivers != null) {
      path += "?onlyMessageRecipients=" + onlyMessageReceivers.toString().toLowerCase();
    }
    
    return entityFactory.createEntities(GroupStaffMember.class, pyramusClient.get(path, StudentGroupUser[].class));
  }
  
  @Override
  public List<SpecEdTeacher> listStudentSpecEdTeachers(SchoolDataIdentifier studentIdentifier,
      boolean includeGuidanceCouncelors, boolean onlyMessageReceivers) {
    Long pyramusStudentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    String path = String.format("/students/students/%d/specEdTeachers", pyramusStudentId);
    if (includeGuidanceCouncelors) {
      path += "?includeGuidanceCouncelors=true";
    }
    if (onlyMessageReceivers) {
      path += includeGuidanceCouncelors ? "&" : "?" + "onlyMessageReceivers=true";
    }
    fi.otavanopisto.pyramus.rest.model.SpecEdTeacher[] pyramusTeachers = pyramusClient.get(path, fi.otavanopisto.pyramus.rest.model.SpecEdTeacher[].class);
    List<SpecEdTeacher> muikkuTeachers = new ArrayList<>();
    for (fi.otavanopisto.pyramus.rest.model.SpecEdTeacher teacher : pyramusTeachers) {
      muikkuTeachers.add(new PyramusSpecEdTeacher(identifierMapper.getStaffIdentifier(teacher.getId()), teacher.isGuidanceCouncelor()));
    }
    return muikkuTeachers;
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

  private StudentParent findPyramusStudentParent(Long studentParentId) {
    return pyramusClient.get("/studentparents/studentparents/" + studentParentId, StudentParent.class);
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

    Long studentParentId = identifierMapper.getStudentParentId(userIdentifier);
    if (studentParentId != null) {
      StudentParent studentParent = findPyramusStudentParent(studentParentId);
      personId = studentParent.getPersonId();
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
    
    PyramusUserType userType = identifierMapper.getIdentifierUserType(userIdentifier);

    if (userType != null) {
      switch (userType) {
        case STUDENT:
          Long pyramusStudentId = identifierMapper.getPyramusStudentId(userIdentifier.getIdentifier());
          if (pyramusStudentId != null) {
            phoneNumbers = pyramusClient.get(String.format("/students/students/%d/phoneNumbers", pyramusStudentId), PhoneNumber[].class);
            if (phoneNumbers == null) {
              return Collections.emptyList();
            }
          }
        break;
        
        case STAFFMEMBER:
          Long pyramusStaffId = identifierMapper.getPyramusStaffId(userIdentifier.getIdentifier());
          if (pyramusStaffId != null) {
            phoneNumbers = pyramusClient.get(String.format("/staff/members/%d/phoneNumbers", pyramusStaffId), PhoneNumber[].class);
            if (phoneNumbers == null) {
              return Collections.emptyList();
            }
          }
        break;
        
        // Student parent has no phonenumbers at the moment.
        case STUDENTPARENT:
          return Collections.emptyList();
      }
    }

    List<UserPhoneNumber> result = new ArrayList<>();

    if (phoneNumbers != null) {
      for (PhoneNumber phoneNumber : phoneNumbers) {
        ContactType contactType = phoneNumber.getContactTypeId() != null
            ? pyramusClient.get(String.format("/common/contactTypes/%d", phoneNumber.getContactTypeId()), ContactType.class)
            : null;
  
        result.add(entityFactory.createEntity(userIdentifier, phoneNumber, contactType));
      }
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
    return new PyramusStudentCourseStats(courseStats.getNumberCompletedCourses(), courseStats.getNumberCreditPoints(), courseStats.isPersonHasCourseAssessments());
  }

  public boolean isActiveUser(User user) {
    /**
     * If student has study end date set we check if the date has passed
     */
    if (user.getStudyEndDate() != null) {
      /**
       * user.getStudyEndDate really should be either just LocalDate or have 
       * proper zoned time on it but it doesn't. That's the reason for all the 
       * zone stuff here. This zone conversion probably only works when the 
       * user.getStudyEndDate is same zone as the current server is.
       */
      LocalDate studyEndDateAsLocalDate = user.getStudyEndDate().atZoneSameInstant(ZoneId.systemDefault()).toLocalDate();
      LocalDateTime studyEndDate = studyEndDateAsLocalDate.atTime(23, 59, 59);
      
      // If current time is past the studyEndDate the studies have ended - otherwise continue to the other checks
      if (LocalDateTime.now().isAfter(studyEndDate)) {
        return false;
      }
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


  @Override
  public BridgeResponse<List<OrganizationContactPerson>> listOrganizationContactPersonsByOrganization(
      String organizationIdentifier) {

    BridgeResponse<OrganizationContactPerson[]> response = pyramusClient.responseGet(String.format("/organizations/%d/contactPersons", identifierMapper.getPyramusOrganizationId(organizationIdentifier)), OrganizationContactPerson[].class);
    List<OrganizationContactPerson> contactPersons = null;
    if(response.getEntity() != null) {
      contactPersons = new ArrayList<>();
      for (OrganizationContactPerson contactPerson : response.getEntity()) {
        contactPersons.add(contactPerson);
      }
    }
    return new BridgeResponse<List<OrganizationContactPerson>>(response.getStatusCode(), contactPersons);
  }

  @Override
  public List<UserStudyPeriod> listStudentStudyPeriods(SchoolDataIdentifier userIdentifier) {
    if (identifierMapper.isStudentIdentifier(userIdentifier.getIdentifier())) {
      Long pyramusStudentId = identifierMapper.getPyramusStudentId(userIdentifier.getIdentifier());
      StudentStudyPeriod[] studyPeriods = listStudentStudyPeriods(pyramusStudentId);
      List<UserStudyPeriod> userStudyPeriods = new ArrayList<>();
      
      for (StudentStudyPeriod studyPeriod : studyPeriods) {
        if (studyPeriod.getType() == StudentStudyPeriodType.TEMPORARILY_SUSPENDED) {
          userStudyPeriods.add(new UserStudyPeriod(studyPeriod.getBegin(), studyPeriod.getEnd(), UserStudyPeriodType.TEMPORARILY_SUSPENDED));
        }
      }
      
      return userStudyPeriods;
    }
    
    return Collections.emptyList();
  }

  @Override
  public boolean isUnder18CompulsoryEducationStudent(SchoolDataIdentifier studentIdentifier) {
    PyramusUserType userType = identifierMapper.getIdentifierUserType(studentIdentifier);

    // This method may be called for non-students, just return false
    if (userType != PyramusUserType.STUDENT) {
      return false;
    }
    
    Long pyramusStudentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    
    Student student = findPyramusStudent(pyramusStudentId);
    if (student.getPersonId() != null) {
      Person person = findPyramusPerson(student.getPersonId());
      if (person != null) {
        // Birthday is null or the student is over 18 years old - return false
        if (person.getBirthday() == null || person.getBirthday().plusYears(18).isBefore(OffsetDateTime.now())) {
          return false;
        }

        StudentStudyPeriod[] studyPeriods = listStudentStudyPeriods(pyramusStudentId);
        if (ArrayUtils.isNotEmpty(studyPeriods)) {
          EnumSet<StudentStudyPeriodType> states = EnumSet.of(
              StudentStudyPeriodType.COMPULSORY_EDUCATION, 
              StudentStudyPeriodType.NON_COMPULSORY_EDUCATION, 
              StudentStudyPeriodType.EXTENDED_COMPULSORY_EDUCATION
          );
          LocalDate now = LocalDate.now();
          LocalDate date = null;
          StudentStudyPeriodType state = null;

          /*
           * Loop through study periods and for the periods
           * that are active, check that they are one of the
           * states that correspond to the compulsory state.
           * After the loop is done, we should have the state
           * in state variable that is the currently active one.
           */
          for (StudentStudyPeriod studyPeriod : studyPeriods) {
            if (states.contains(studyPeriod.getType()) && isActiveStudyPeriod(studyPeriod, now)) {
              if (date == null || studyPeriod.getBegin().isAfter(date)) {
                date = studyPeriod.getBegin();
                state = studyPeriod.getType();
              }
            }
          }
          
          EnumSet<StudentStudyPeriodType> activeStates = EnumSet.of(
              StudentStudyPeriodType.COMPULSORY_EDUCATION, 
              StudentStudyPeriodType.EXTENDED_COMPULSORY_EDUCATION
          );
          if (activeStates.contains(state)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  private StudentStudyPeriod[] listStudentStudyPeriods(Long pyramusStudentId) {
    return pyramusClient.get(String.format("/students/students/%d/studyPeriods", pyramusStudentId), StudentStudyPeriod[].class);
  }

  /**
   * Returns true if the given period is active at given date.
   * 
   * @param period period
   * @param atDate date
   * @return true if the period is considered active at given date
   */
  private boolean isActiveStudyPeriod(StudentStudyPeriod period, LocalDate atDate) {
    LocalDate begin = period.getBegin();
    LocalDate end = period.getEnd();

    return
        (begin == null || begin.equals(atDate) || begin.isBefore(atDate)) &&
        (end == null || end.equals(atDate) || end.isAfter(atDate));
  }
  
  private Long toUserEntityId(Long pyramusStaffMemberId) {
    SchoolDataIdentifier identifier = identifierMapper.getStaffIdentifier(pyramusStaffMemberId);

    if (identifier != null) {
      UserSchoolDataIdentifier usdi = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(identifier);
      if (usdi != null) {
        return usdi.getUserEntity().getId();
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  
  @Override
  public BridgeResponse<StudentContactLogEntryBatch> listStudentContactLogEntriesByStudent(SchoolDataIdentifier userIdentifier, Integer resultsPerPage, Integer page){
    Long pyramusStudentId = identifierMapper.getPyramusStudentId(userIdentifier.getIdentifier());

    if (pyramusStudentId != null) {
      StudentContactLogEntryBatch studentContactLogEntryBatch = new StudentContactLogEntryBatch();
      BridgeResponse<StudentContactLogEntryBatch> response = pyramusClient.responseGet(String.format("/students/students/%d/contactLogEntries?resultsPerPage=%d&page=%d", pyramusStudentId, resultsPerPage, page), StudentContactLogEntryBatch.class);
      List<StudentContactLogEntryRestModel> contactLogEntries = null;
      if(response.getEntity() != null) {
        contactLogEntries = new ArrayList<>();
        
        if (response.getEntity().getResults() != null) {
          for (StudentContactLogEntryRestModel contactLogEntry : response.getEntity().getResults()) {
            boolean hasImage = false;
            if (contactLogEntry.getCreatorId() != null) {
              contactLogEntry.setCreatorId(toUserEntityId(contactLogEntry.getCreatorId()));
              
              UserEntity userEntity = userEntityController.findUserEntityById(contactLogEntry.getCreatorId());
              
              if (userEntity != null) {
                hasImage = userEntityFileController.hasProfilePicture(userEntity);
              }
            }
            contactLogEntry.setHasImage(hasImage);
  
            List<StudentContactLogEntryCommentRestModel> comments = contactLogEntry.getComments();
            
            for (StudentContactLogEntryCommentRestModel comment : comments) {
              boolean hasProfileImage = false;
              UserEntity userEntity = null;
              if (comment.getCreatorId() != null) {
                Long userEntityId = toUserEntityId(comment.getCreatorId());
                userEntity = userEntityController.findUserEntityById(userEntityId);
                
                if (userEntity != null) {
                  hasProfileImage = userEntityFileController.hasProfilePicture(userEntity);
                  comment.setCreatorId(userEntity.getId());
                }
              }
              
              comment.setHasImage(hasProfileImage);
            }
            contactLogEntries.add(contactLogEntry);
          }
          studentContactLogEntryBatch.setFirstResult(response.getEntity().getFirstResult());
          studentContactLogEntryBatch.setResults(contactLogEntries);
          studentContactLogEntryBatch.setTotalHitCount(response.getEntity().getTotalHitCount());
          studentContactLogEntryBatch.setAllPrivileges(response.getEntity().getAllPrivileges());
        }
      }
      return new BridgeResponse<StudentContactLogEntryBatch>(response.getStatusCode(), studentContactLogEntryBatch);
    }
    logger.warning(String.format("PyramusUserSchoolDataBridge.listStudentContactLogEntriesByStudent malformed user identifier %s\n%s",
      userIdentifier,
      ExceptionUtils.getStackTrace(new Throwable())));
    throw new SchoolDataBridgeInternalException(String.format("Malformed user identifier %s", userIdentifier));
  }

  @Override
  public BridgeResponse<StudentContactLogEntryRestModel> createStudentContactLogEntry(SchoolDataIdentifier studentIdentifier, StudentContactLogEntryRestModel payload){
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());

    if (studentId == null) {
      logger.severe(String.format("Student for identifier %s not found", studentIdentifier));
      return null;
    }
    BridgeResponse<StudentContactLogEntryRestModel> response =  pyramusClient.responsePost(String.format("/students/students/%d/contactLogEntries", studentId), Entity.entity(payload, MediaType.APPLICATION_JSON), StudentContactLogEntryRestModel.class);

    if (response.getEntity() != null && response.getEntity().getCreatorId() != null) {
      response.getEntity().setCreatorId(toUserEntityId(response.getEntity().getCreatorId()));

      boolean hasImage = false;
      UserEntity userEntity = userEntityController.findUserEntityById(response.getEntity().getCreatorId());
      
      if (userEntity != null) {
        hasImage = userEntityFileController.hasProfilePicture(userEntity);
      }
        
      response.getEntity().setHasImage(hasImage);
    }

    return response;
  }
  
  @Override
  public BridgeResponse<StudentContactLogWithRecipientsRestModel> createMultipleStudentContactLogEntries(List<SchoolDataIdentifier> recipients, StudentContactLogEntryRestModel payload){
    StudentContactLogWithRecipientsRestModel entry = new StudentContactLogWithRecipientsRestModel();
    entry.setEntryDate(payload.getEntryDate());
    entry.setText(payload.getText());
    entry.setType(payload.getType());
    
    List<Long> recipientList = new ArrayList<>();
    if (!recipients.isEmpty()) {
      for (SchoolDataIdentifier studentIdentifier : recipients) {
        recipientList.add(identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier()));
      }
    }
    
    entry.setRecipients(recipientList);
    BridgeResponse<StudentContactLogWithRecipientsRestModel> response =  pyramusClient.responsePost(String.format("/students/students/contactLogEntries/batch"), Entity.entity(entry, MediaType.APPLICATION_JSON), StudentContactLogWithRecipientsRestModel.class);
    
    if (response.getEntity() != null) {
        
        if (response.getEntity().getCreatorId() != null) {
          response.getEntity().setCreatorId(toUserEntityId(response.getEntity().getCreatorId()));

          boolean hasImage = false;
          UserEntity userEntity = userEntityController.findUserEntityById(response.getEntity().getCreatorId());
          
          if (userEntity != null) {
            hasImage = userEntityFileController.hasProfilePicture(userEntity);
          }
            
          response.getEntity().setHasImage(hasImage);
        }
    }
      
    return new BridgeResponse<StudentContactLogWithRecipientsRestModel>(response.getStatusCode(), response.getEntity());
  }

  @Override
  public BridgeResponse<StudentContactLogEntryRestModel> updateStudentContactLogEntry(SchoolDataIdentifier studentIdentifier, Long contactLogEntryId, StudentContactLogEntryRestModel payload) {
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());

    if (studentId == null) {
      logger.severe(String.format("Student for identifier %s not found", studentIdentifier));
      return null;
    }
    BridgeResponse<StudentContactLogEntryRestModel> response = pyramusClient.responsePut(String.format("/students/students/%d/contactLogEntries/%d", studentId, contactLogEntryId), Entity.entity(payload, MediaType.APPLICATION_JSON), StudentContactLogEntryRestModel.class);
    boolean hasImage = false;
    if (response.getEntity() != null) {
      if (response.getEntity().getCreatorId() != null) {
        response.getEntity().setCreatorId(toUserEntityId(response.getEntity().getCreatorId()));

        UserEntity userEntity = userEntityController.findUserEntityById(response.getEntity().getCreatorId());
        hasImage = userEntityFileController.hasProfilePicture(userEntity);
      }
      response.getEntity().setHasImage(hasImage);
    }

    return response;
  }

  @Override
  public void removeStudentContactLogEntry(SchoolDataIdentifier studentIdentifier, Long contactLogEntryId) {
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());

    if (studentId == null) {
      throw new SchoolDataBridgeInternalException(String.format("StudentId for identifier %s not found", studentIdentifier));
    }
    pyramusClient.delete("/students/students/" + studentId + "/contactLogEntries/" + contactLogEntryId);
  }

  @Override
  public BridgeResponse<StudentContactLogEntryCommentRestModel> createStudentContactLogEntryComment(SchoolDataIdentifier studentIdentifier, Long entryId, StudentContactLogEntryCommentRestModel payload){
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());

    if (studentId == null) {
      logger.severe(String.format("Student for identifier %s not found", studentIdentifier));
      return null;
    }
    BridgeResponse<StudentContactLogEntryCommentRestModel> response = pyramusClient.responsePost(String.format("/students/students/%d/contactLogEntries/%d/comments", studentId, entryId), Entity.entity(payload, MediaType.APPLICATION_JSON), StudentContactLogEntryCommentRestModel.class);

    if (response.getEntity() != null && response.getEntity().getCreatorId() != null) {
      response.getEntity().setCreatorId(toUserEntityId(response.getEntity().getCreatorId()));

      boolean hasImage = false;
          
      UserEntity userEntity = userEntityController.findUserEntityById(response.getEntity().getCreatorId());
      if (userEntity != null) {
        hasImage = userEntityFileController.hasProfilePicture(userEntity);
      }
      response.getEntity().setHasImage(hasImage);
    }

    return response;
  }

  @Override
  public BridgeResponse<StudentContactLogEntryCommentRestModel> updateStudentContactLogEntryComment(SchoolDataIdentifier studentIdentifier, Long entryId, Long commentId, StudentContactLogEntryCommentRestModel payload) {
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());

    if (studentId == null) {
      logger.severe(String.format("Student for identifier %s not found", studentIdentifier));
      return null;
    }
    BridgeResponse<StudentContactLogEntryCommentRestModel> response = pyramusClient.responsePut(String.format("/students/students/%d/contactLogEntries/%d/comments/%d", studentId, entryId, commentId), Entity.entity(payload, MediaType.APPLICATION_JSON), StudentContactLogEntryCommentRestModel.class);

    if (response.getEntity() != null && response.getEntity().getCreatorId() != null) {
      response.getEntity().setCreatorId(toUserEntityId(response.getEntity().getCreatorId()));

      boolean hasImage = false;
      
      UserEntity userEntity = userEntityController.findUserEntityById(response.getEntity().getCreatorId());
      if (userEntity != null) {  
        hasImage = userEntityFileController.hasProfilePicture(userEntity);
      }
      
      response.getEntity().setHasImage(hasImage);
    }
    return response;
  }

  @Override
  public void removeStudentContactLogEntryComment(SchoolDataIdentifier studentIdentifier, Long commentId) {
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());

    if (studentId == null) {
      throw new SchoolDataBridgeInternalException(String.format("StudentId for identifier %s not found", studentIdentifier));
    }
    pyramusClient.delete("/students/students/" + studentId + "/contactLogEntries/entryComments/" + commentId);
  }

  @Override
  public BridgeResponse<List<WorklistItemTemplateRestModel>> getWorklistTemplates() {
    BridgeResponse<WorklistItemTemplateRestModel[]> response = pyramusClient.responseGet("/worklist/templates", WorklistItemTemplateRestModel[].class);
    List<WorklistItemTemplateRestModel> templates = null;
    if (response.getEntity() != null) {
      templates = new ArrayList<>();
      for (WorklistItemTemplateRestModel template : response.getEntity()) {
        templates.add(template);
      }
    }
    return new BridgeResponse<List<WorklistItemTemplateRestModel>>(response.getStatusCode(), templates);
  }

  @Override
  public BridgeResponse<WorklistItemRestModel> createWorklistItem(WorklistItemRestModel item) {
    return pyramusClient.responsePost("/worklist/worklistItems", Entity.entity(item, MediaType.APPLICATION_JSON), WorklistItemRestModel.class);
  }

  @Override
  public BridgeResponse<WorklistItemRestModel> updateWorklistItem(WorklistItemRestModel item) {
    return pyramusClient.responsePut("/worklist/worklistItems", Entity.entity(item, MediaType.APPLICATION_JSON), WorklistItemRestModel.class);
  }

  @Override
  public void removeWorklistItem(WorklistItemRestModel item) {
    pyramusClient.delete("/worklist/worklistItems/" + item.getId());
  }

  @Override
  public BridgeResponse<List<WorklistItemRestModel>> listWorklistItemsByOwnerAndTimeframe(String identifier, String beginDate, String endDate) {
    SchoolDataIdentifier sdIdentifier = SchoolDataIdentifier.fromId(identifier);
    Long staffMemberId = identifierMapper.getPyramusStaffId(sdIdentifier.getIdentifier());
    if (staffMemberId == null) {
      throw new SchoolDataBridgeInternalException("User is not a Pyramus staff member");
    }
    String queryString = String.format("?owner=%d", staffMemberId);
    if (beginDate != null && endDate != null) {
      queryString += String.format("&beginDate=%s&endDate=%s", beginDate, endDate);
    }
    BridgeResponse<WorklistItemRestModel[]> response = pyramusClient.responseGet(
        String.format("/worklist/worklistItems%s", queryString),
        WorklistItemRestModel[].class);
    List<WorklistItemRestModel> items = null;
    if (response.getEntity() != null) {
      items = new ArrayList<>();
      for (WorklistItemRestModel item : response.getEntity()) {
        items.add(item);
      }
    }
    return new BridgeResponse<List<WorklistItemRestModel>>(response.getStatusCode(), items);
  }

  @Override
  public BridgeResponse<List<WorklistSummaryItemRestModel>> getWorklistSummary(String identifier) {
    SchoolDataIdentifier sdIdentifier = SchoolDataIdentifier.fromId(identifier);
    Long staffMemberId = identifierMapper.getPyramusStaffId(sdIdentifier.getIdentifier());
    if (staffMemberId == null) {
      throw new SchoolDataBridgeInternalException("User is not a Pyramus staff member");
    }
    BridgeResponse<WorklistSummaryItemRestModel[]> response = pyramusClient.responseGet(
        String.format("/worklist/worklistItemsSummary?owner=%d", staffMemberId),
        WorklistSummaryItemRestModel[].class);
    List<WorklistSummaryItemRestModel> items = null;
    if (response.getEntity() != null) {
      items = new ArrayList<>();
      for (WorklistSummaryItemRestModel item : response.getEntity()) {
        items.add(item);
      }
    }
    return new BridgeResponse<List<WorklistSummaryItemRestModel>>(response.getStatusCode(), items);
  }

  @Override
  public void updateWorklistItemsState(WorklistItemStateChangeRestModel stateChange) {

    // Convert user identifier (PYRAMUS-STAFF-123) to Pyramus user id (123)

    SchoolDataIdentifier sdIdentifier = SchoolDataIdentifier.fromId(stateChange.getUserIdentifier());
    Long staffMemberId = identifierMapper.getPyramusStaffId(sdIdentifier.getIdentifier());
    if (staffMemberId == null) {
      throw new SchoolDataBridgeInternalException("User is not a Pyramus staff member");
    }
    stateChange.setUserIdentifier(staffMemberId.toString());

    // Pyramus update

    pyramusClient.responsePut(
        "/worklist/changeItemsState",
        Entity.entity(stateChange, MediaType.APPLICATION_JSON), WorklistItemStateChangeRestModel.class);

    // Restore user identifier

    stateChange.setUserIdentifier(sdIdentifier.toId());
  }

  @Override
  public BridgeResponse<List<WorklistApproverRestModel>> listWorklistApprovers() {
    BridgeResponse<WorklistApproverRestModel[]> response = pyramusClient.responseGet(
        "/worklist/approvers",
        WorklistApproverRestModel[].class);
    List<WorklistApproverRestModel> approvers = null;
    if (response.getEntity() != null) {
      approvers = new ArrayList<>();
      for (WorklistApproverRestModel approver : response.getEntity()) {
        approvers.add(approver);
      }
    }
    return new BridgeResponse<List<WorklistApproverRestModel>>(response.getStatusCode(), approvers);
  }

  @Override
  public User increaseStudyTime(String studentIdentifier, int months) {
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    if (studentId == null) {
      logger.severe(String.format("Student for identifier %s not found", studentIdentifier));
      return null;
    }
    BridgeResponse<Student> response = pyramusClient.responsePost(
        String.format("/students/students/%d/increaseStudyTime?months=%d", studentId, months),
        null,
        Student.class);
    if (response.getEntity() == null) {
      logger.severe(String.format("Failed to increase study time of student %s: %d %s",
          studentIdentifier,
          response.getStatusCode(),
          response.getMessage()));
    }
    return createStudentEntity(response.getEntity());
  }

  @Override
  public UserContactInfo getStudentContactInfo(String userIdentifier) {
    Long userId = identifierMapper.getPyramusStudentId(userIdentifier);
    if (userId == null) {
      return null;
    }
    fi.otavanopisto.pyramus.rest.model.UserContactInfo contactInfo = pyramusClient.get(
        String.format("/students/students/%d/contactInfo", userId),
        fi.otavanopisto.pyramus.rest.model.UserContactInfo.class);
    return contactInfo == null ? null : entityFactory.createEntity(contactInfo);
  }
  
  @Override
  public boolean amICounselor(String studentIdentifier) {
    
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    if (studentId == null) {
      logger.severe(String.format("Student for identifier %s not found", studentIdentifier));
      return false;
    }
    
    return pyramusClient.get(String.format("/students/students/%d/amICounselor", studentId), Boolean.class);

  }
  
  @Override
  public List<String> listStudentAlternativeStudyOptions(String userIdentifier) {
    Long studentId = identifierMapper.getPyramusStudentId(userIdentifier);
    if (studentId == null) {
      return Collections.emptyList();
    }
    String results[] = pyramusClient.get(String.format("/students/students/%d/subjectChoices", studentId), String[].class);
      
    List<String> subjectChoices = new ArrayList<>();
    
    if (results != null) {
      for (String result : results) {
        subjectChoices.addAll(Arrays.asList(result.split(",")));
      }    
    }
    return subjectChoices;
  }

  @Override
  public StudentGuidanceRelation getGuidanceRelation(String studentIdentifier) {
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    if (studentId == null) {
      return null;
    }
    fi.otavanopisto.pyramus.rest.model.StudentGuidanceRelation relation = pyramusClient.get(
        String.format("/students/students/%d/guidanceRelation", studentId),
        fi.otavanopisto.pyramus.rest.model.StudentGuidanceRelation.class);
    return relation == null ? null : entityFactory.createEntity(relation);
  }

  @Override
  public StudentCard getStudentCard(String studentIdentifier) {
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    if (studentId == null) {
      return null;
    }
    fi.otavanopisto.pyramus.rest.model.StudentCard studentCard = pyramusClient.get(
        String.format("/students/students/%d/studentCard", studentId),
        fi.otavanopisto.pyramus.rest.model.StudentCard.class);
    return studentCard == null ? null : entityFactory.createEntity(studentCard);
  }

  @Override
  public BridgeResponse<fi.otavanopisto.muikku.schooldata.payload.StudentCardRESTModel> updateActive(String studentIdentifier, Boolean active) {

    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier);
    if (studentId == null) {
      return null;
    }
    
    return pyramusClient.responsePut(String.format("/students/students/%d/studentCard/active", studentId), Entity.entity(active, MediaType.APPLICATION_JSON), StudentCardRESTModel.class);
  }
  
  public List<GuardiansDependent> listGuardiansDependents(SchoolDataIdentifier guardianUserIdentifier) {
    Long studentParentId = identifierMapper.getStudentParentId(guardianUserIdentifier.getIdentifier());
    if (studentParentId == null) {
      return null;
    }
    
    BridgeResponse<fi.otavanopisto.pyramus.rest.model.StudentParentChild[]> studentParentStudents = pyramusClient.responseGet(
        String.format("/studentparents/studentparents/%d/students", studentParentId),
        fi.otavanopisto.pyramus.rest.model.StudentParentChild[].class);
    
    List<GuardiansDependent> result = new ArrayList<>();
    
    if (studentParentStudents.ok()) {
      for (StudentParentChild student : studentParentStudents.getEntity()) {
        String address = null;
        if (student.getDefaultAddress() != null) {
          Address addobj = student.getDefaultAddress();
          
          String pcc = StringUtils.trim(
              (StringUtils.isNotBlank(addobj.getPostalCode()) ? addobj.getPostalCode() + " " : "") +
              (StringUtils.isNotBlank(addobj.getCity()) ? addobj.getCity() : "")
          );
          
          List<String> sequence = Arrays.asList(
              addobj.getName(),
              addobj.getStreetAddress(),
              pcc,
              addobj.getCountry()
          );
          
          address = sequence.stream().filter(s -> StringUtils.isNotBlank(s)).collect(Collectors.joining(", "));
        }
        
        result.add(new PyramusGuardiansDependent(
            identifierMapper.getStudentIdentifier(student.getStudentId()), 
            student.getFirstName(), 
            student.getLastName(), 
            student.getNickname(),
            student.getStudyProgrammeName(),
            student.getDefaultEmail(),
            student.getDefaultPhoneNumber(),
            address,
            student.getStudyStartDate(),
            student.getStudyTimeEnd(),
            student.getStudyEndDate()
        ));
      }
    }
    
    return result;
  }

  @Override
  public List<GuardiansDependentWorkspace> listGuardiansDependentsWorkspaces(SchoolDataIdentifier guardianUserIdentifier, SchoolDataIdentifier studentIdentifier) {
    Long studentParentId = identifierMapper.getStudentParentId(guardianUserIdentifier.getIdentifier());
    if (studentParentId == null) {
      return null;
    }
    
    Long studentId = identifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (studentId == null) {
      return null;
    }
    
    BridgeResponse<fi.otavanopisto.pyramus.rest.model.students.StudentParentStudentCourseRestModel[]> studentParentStudents = pyramusClient.responseGet(
        String.format("/studentparents/studentparents/%d/students/%d/courses", studentParentId, studentId),
        fi.otavanopisto.pyramus.rest.model.students.StudentParentStudentCourseRestModel[].class);
    
    List<GuardiansDependentWorkspace> result = new ArrayList<>();
    
    if (studentParentStudents.ok()) {
      for (StudentParentStudentCourseRestModel course : studentParentStudents.getEntity()) {
        result.add(new PyramusGuardiansDependentWorkspace(
            new SchoolDataIdentifier(identifierMapper.getWorkspaceIdentifier(course.getCourseId()), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE),
            new SchoolDataIdentifier(identifierMapper.getWorkspaceStudentIdentifier(course.getCourseStudentId()), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE),
            course.getName(),
            course.getNameExtension(),
            course.getEnrolmentDate(),
            course.getLatestAssessmentRequestDate()
        ));
      }
    }
    
    return result;
  }

}