package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.joda.time.DateTime;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusIdentifierMapper;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.CourseLengthUnit;
import fi.otavanopisto.muikku.schooldata.entity.EnvironmentRole;
import fi.otavanopisto.muikku.schooldata.entity.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.TransferCredit;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceRole;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceType;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
import fi.pyramus.rest.model.Address;
import fi.pyramus.rest.model.ContactType;
import fi.pyramus.rest.model.Course;
import fi.pyramus.rest.model.CourseAssessment;
import fi.pyramus.rest.model.CourseAssessmentRequest;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.CourseStaffMemberRole;
import fi.pyramus.rest.model.CourseStudent;
import fi.pyramus.rest.model.CourseType;
import fi.pyramus.rest.model.EducationalTimeUnit;
import fi.pyramus.rest.model.Email;
import fi.pyramus.rest.model.PhoneNumber;
import fi.pyramus.rest.model.StudentGroup;
import fi.pyramus.rest.model.StudentGroupStudent;
import fi.pyramus.rest.model.StudentGroupUser;
import fi.pyramus.rest.model.UserRole;

@ApplicationScoped
public class PyramusSchoolDataEntityFactory {
  
  @Inject
  private Logger logger;
  
  @Inject
  private PyramusIdentifierMapper identifierMapper;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @PostConstruct
  public void init() {
    pyramusHost = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "pyramusHost");
    teacherRoleSetting = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "roles.workspace.TEACHER");

  }
  
  public WorkspaceRole createCourseStudentRoleEntity() {
    // TODO: Localize
    return new PyramusWorkspaceRole(identifierMapper.getWorkspaceStudentRoleIdentifier(), "Course Student",
        WorkspaceRoleArchetype.STUDENT);
  }

  @SuppressWarnings("incomplete-switch")
  public User createEntity(fi.pyramus.rest.model.StaffMember staffMember) {
    String displayName = staffMember.getFirstName() + " " + staffMember.getLastName();
    switch (staffMember.getRole()) {
      case ADMINISTRATOR:
        displayName += " (Administrator)";
      break;
      case GUEST:
        displayName += " (Guest)";
      break;
      case MANAGER:
        displayName += " (Manager)";
      break;
      case USER:
        displayName += " (User)";
      break;
    }

    boolean hidden = false;
    boolean startedStudies = false;
    boolean finishedStudies = false;
    boolean active = true;
    
    return new PyramusUser(
        identifierMapper.getStaffIdentifier(staffMember.getId()),
        staffMember.getFirstName(),
        staffMember.getLastName(),
        displayName,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        hidden,
        startedStudies,
        finishedStudies,
        active);
  }

  public List<User> createEntity(fi.pyramus.rest.model.StaffMember... staffMembers) {
    List<User> result = new ArrayList<>();

    for (fi.pyramus.rest.model.StaffMember staffMember : staffMembers) {
      result.add(createEntity(staffMember));
    }

    return result;
  }

  public User createEntity(fi.pyramus.rest.model.Student student, fi.pyramus.rest.model.StudyProgramme studyProgramme,
      String nationality, String language, String municipality, String school, DateTime studyStartDate, DateTime studyEndDate,
      DateTime studyTimeEnd, boolean hidden) {
    StringBuilder displayName = new StringBuilder();

    displayName.append(student.getFirstName()).append(' ').append(student.getLastName());

    String studyProgrammeName = studyProgramme != null ? studyProgramme.getName() : null;

    if (studyProgrammeName != null) {
      displayName.append(String.format(" (%s)", studyProgrammeName));
    }
    
    boolean startedStudies = studyStartDate != null && studyStartDate.isBefore(System.currentTimeMillis());
    boolean finishedStudies = studyEndDate != null && studyEndDate.isBefore(System.currentTimeMillis());
    boolean active = studyStartDate == null && studyEndDate == null ? true : startedStudies && !finishedStudies;
    
    return new PyramusUser(
        identifierMapper.getStudentIdentifier(student.getId()),
        student.getFirstName(),
        student.getLastName(),
        displayName.toString(),
        studyProgrammeName,
        nationality,
        language,
        municipality,
        school,
        studyStartDate,
        studyEndDate,
        studyTimeEnd,
        hidden,
        startedStudies,
        finishedStudies,
        active);
  }

  public EnvironmentRole createEntity(fi.pyramus.rest.model.UserRole role) {
    if (role == null) {
      return null;
    }

    EnvironmentRoleArchetype archetype = getEnvironmentRoleArchetype(role);

    return new PyramusEnvironmentRole("ENV-" + role.name(), archetype, role.name());
  }

  public EnvironmentRole createStudentEnvironmentRoleEntity() {
    // TODO: Localize
    EnvironmentRoleArchetype archetype = EnvironmentRoleArchetype.STUDENT;
    return new PyramusEnvironmentRole("ENV-STUDENT", archetype, "Student");
  }

  public List<EnvironmentRole> createEntity(fi.pyramus.rest.model.UserRole... roles) {
    List<EnvironmentRole> result = new ArrayList<>();

    for (fi.pyramus.rest.model.UserRole role : roles) {
      result.add(createEntity(role));
    }

    return result;
  }

  public WorkspaceRole createEntity(CourseStaffMemberRole staffMemberRole) {
    if (staffMemberRole == null) {
      return null;
    }

    WorkspaceRoleArchetype archetype = getWorkspaceRoleArchetype(staffMemberRole.getId());
    return new PyramusWorkspaceRole(identifierMapper.getWorkspaceStaffRoleIdentifier(staffMemberRole.getId()),
        staffMemberRole.getName(), archetype);
  }

  public List<WorkspaceRole> createEntity(CourseStaffMemberRole[] staffMemberRoles) {
    List<WorkspaceRole> result = new ArrayList<>();

    for (fi.pyramus.rest.model.CourseStaffMemberRole staffMemberRole : staffMemberRoles) {
      result.add(createEntity(staffMemberRole));
    }

    return result;
  }

  public WorkspaceUser createEntity(CourseStaffMember staffMember) {
    if (staffMember == null) {
      return null;
    }
    
    SchoolDataIdentifier identifier = toIdentifier(identifierMapper.getWorkspaceStaffIdentifier(staffMember.getId()));
    SchoolDataIdentifier userIdentifier = toIdentifier(identifierMapper.getStaffIdentifier(staffMember.getStaffMemberId()));
    SchoolDataIdentifier workspaceIdentifier = toIdentifier(identifierMapper.getWorkspaceIdentifier(staffMember.getCourseId()));
    SchoolDataIdentifier roleIdentifier = toIdentifier(identifierMapper.getWorkspaceStaffRoleIdentifier(staffMember.getRoleId()));
    
    return new PyramusWorkspaceUser(
      identifier, 
      userIdentifier, 
      workspaceIdentifier,
      roleIdentifier
    );
  }
  
  private SchoolDataIdentifier toIdentifier(String identifier) {
    return new SchoolDataIdentifier(identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }

  public List<WorkspaceUser> createEntity(CourseStaffMember... staffMembers) {
    List<WorkspaceUser> result = new ArrayList<>();

    for (CourseStaffMember staffMember : staffMembers) {
      result.add(createEntity(staffMember));
    }

    return result;
  }

  public WorkspaceUser createEntity(CourseStudent courseStudent) {
    if (courseStudent == null) {
      return null;
    }

    SchoolDataIdentifier identifier = toIdentifier(identifierMapper.getWorkspaceStudentIdentifier(courseStudent.getId()));
    SchoolDataIdentifier userIdentifier = toIdentifier(identifierMapper.getStudentIdentifier(courseStudent.getStudentId()));
    SchoolDataIdentifier workspaceIdentifier = toIdentifier(identifierMapper.getWorkspaceIdentifier(courseStudent.getCourseId()));
    SchoolDataIdentifier roleIdentifier = toIdentifier(createCourseStudentRoleEntity().getIdentifier());
    
    return new PyramusWorkspaceUser(
      identifier, 
      userIdentifier, 
      workspaceIdentifier,
      roleIdentifier
    );
  }

  public List<WorkspaceUser> createEntity(CourseStudent... courseStudents) {
    List<WorkspaceUser> result = new ArrayList<>();
    
    if (courseStudents != null) {
      for (CourseStudent courseStudent : courseStudents) {
        result.add(createEntity(courseStudent));
      }
    }

    return result;
  }

  public Workspace createEntity(
      Course course,
      SchoolDataIdentifier educationTypeIdentifier,
      Map<String, List<String>> educationTypeCodeMap
  ) {
    if (course == null) {
      return null;
    }

    DateTime modified = course.getLastModified();
    if (modified == null) {
      modified = course.getCreated();
    }
    
    boolean courseFeeApplicable = true;
    
    for (Map.Entry<String, List<String>> typeCodeEntry : educationTypeCodeMap.entrySet()) {
      String educationTypeCode = typeCodeEntry.getKey();
      for (String educationSubtypeCode : typeCodeEntry.getValue()) {
        if ((Objects.equals(educationTypeCode, "lukio") && Objects.equals(educationSubtypeCode, "pakollinen")) ||    
            (Objects.equals(educationTypeCode, "lukio") && Objects.equals(educationSubtypeCode, "valtakunnallinensyventava")) ||    
            (Objects.equals(educationTypeCode, "peruskoulu") && Objects.equals(educationSubtypeCode, "pakollinen")) ||    
            (Objects.equals(educationTypeCode, "peruskoulu") && Objects.equals(educationSubtypeCode, "valinnainen"))) {
          courseFeeApplicable = false;
        }
      }
    }

    String viewLink = String.format("https://%s/courses/viewcourse.page?course=%d", pyramusHost, course.getId());
    
    return new PyramusWorkspace(
        identifierMapper.getWorkspaceIdentifier(course.getId()),
        course.getName(),
        course.getNameExtension(),
        viewLink,
        identifierMapper.getWorkspaceTypeIdentifier(course.getTypeId()),
        identifierMapper.getWorkspaceCourseIdentifier(course.getSubjectId(), course.getCourseNumber()),
        course.getDescription(),
        identifierMapper.getSubjectIdentifier(course.getSubjectId()), 
        educationTypeIdentifier,
        modified.toDate(), 
        course.getLength(), 
        identifierMapper.getCourseLengthUnitIdentifier(course.getLengthUnitId()),
        course.getBeginDate(), 
        course.getEndDate(), 
        course.getArchived(), 
        courseFeeApplicable);
  }

  public WorkspaceType createEntity(CourseType courseType) {
    return new PyramusWorkspaceType(identifierMapper.getWorkspaceTypeIdentifier(courseType.getId()),
        courseType.getName());
  }

  public WorkspaceAssessment createEntity(CourseAssessment courseAssessment) {
    if (courseAssessment == null) {
      logger.severe("Attempted to translate null course assessment into school data entity");
      return null;
    }
    
    SchoolDataIdentifier gradeIdentifier = identifierMapper.getGradeIdentifier(courseAssessment.getGradeId());
    SchoolDataIdentifier gradingScaleIdentifier = identifierMapper.getGradingScaleIdentifier(courseAssessment.getGradingScaleId());
    
    return new PyramusWorkspaceAssessment(courseAssessment.getId().toString(),
        identifierMapper.getWorkspaceStudentIdentifier(courseAssessment.getCourseStudentId()),
        identifierMapper.getStaffIdentifier(courseAssessment.getAssessorId()),
        gradeIdentifier.getIdentifier(), gradingScaleIdentifier.getIdentifier(),
        courseAssessment.getVerbalAssessment(), courseAssessment.getDate().toDate());
  }

  public List<WorkspaceAssessment> createEntity(CourseAssessment... courseAssessments) {
    List<WorkspaceAssessment> result = new ArrayList<>();
    
    if (courseAssessments != null) {
      for (CourseAssessment courseAssessment : courseAssessments) {
        result.add(createEntity(courseAssessment));
      }
    }
    
    return result;
  }

  public WorkspaceAssessmentRequest createEntity(CourseAssessmentRequest courseAssessmentRequest) {
    if (courseAssessmentRequest == null) {
      logger.severe("Attempted to translate null course assessment request into school data entity");
      return null;
    }
    
    return new PyramusWorkspaceAssessmentRequest(courseAssessmentRequest.getId().toString(),
        identifierMapper.getWorkspaceStudentIdentifier(courseAssessmentRequest.getCourseStudentId()),
        courseAssessmentRequest.getRequestText(), courseAssessmentRequest.getCreated().toDate());
  }

  public List<WorkspaceAssessmentRequest> createEntity(CourseAssessmentRequest... courseAssessmentRequests) {
    List<WorkspaceAssessmentRequest> result = new ArrayList<>();

    if (courseAssessmentRequests != null) {
      for (CourseAssessmentRequest courseAssessment : courseAssessmentRequests) {
        result.add(createEntity(courseAssessment));
      }
    }

    return result;
  }

  public UserGroup createEntity(StudentGroup studentGroup) {
    return new PyramusUserGroup(identifierMapper.getStudentGroupIdentifier(studentGroup.getId()),
        studentGroup.getName());
  }

  public List<UserGroup> createEntities(StudentGroup... studentGroups) {
    List<UserGroup> result = new ArrayList<>();

    for (StudentGroup studentGroup : studentGroups) {
      result.add(createEntity(studentGroup));
    }
    return result;
  }

  public GroupUser createEntity(StudentGroupStudent studentGroupStudent) {
    return new PyramusGroupUser(identifierMapper.getStudentGroupStudentIdentifier(studentGroupStudent.getId()),
        identifierMapper.getStudentIdentifier(studentGroupStudent.getStudentId()));
  }

  public GroupUser createEntity(StudentGroupUser studentGroupUser) {
    return new PyramusGroupUser(identifierMapper.getStudentGroupStaffMemberIdentifier(studentGroupUser.getId()),
        identifierMapper.getStaffIdentifier(studentGroupUser.getStaffMemberId()));
  }

  public List<GroupUser> createEntities(StudentGroupStudent... studentGroupStudents) {
    List<GroupUser> results = new ArrayList<>();
    for (StudentGroupStudent studentGroupStudent : studentGroupStudents) {
      results.add(createEntity(studentGroupStudent));
    }
    return results;
  }

  public List<WorkspaceType> createEntities(CourseType... courseTypes) {
    List<WorkspaceType> result = new ArrayList<>();

    for (CourseType courseType : courseTypes) {
      result.add(createEntity(courseType));
    }

    return result;
  }

  public CourseLengthUnit getCourseLengthUnit(EducationalTimeUnit educationalTimeUnit) {
    if (educationalTimeUnit == null) {
      return null;
    }
    
    return new PyramusCourseLengthUnit(identifierMapper.getCourseLengthUnitIdentifier(educationalTimeUnit.getId()),
        educationalTimeUnit.getSymbol(), educationalTimeUnit.getName());
  }

  private EnvironmentRoleArchetype getEnvironmentRoleArchetype(UserRole role) {
    switch (role) {
    case ADMINISTRATOR:
      return EnvironmentRoleArchetype.ADMINISTRATOR;
    case MANAGER:
      return EnvironmentRoleArchetype.MANAGER;
    case STUDENT:
      return EnvironmentRoleArchetype.STUDENT;
    case USER:
    case TEACHER:
    case STUDY_GUIDER:
      return EnvironmentRoleArchetype.TEACHER;
    default:
      return EnvironmentRoleArchetype.CUSTOM;
    }
  }

  private WorkspaceRoleArchetype getWorkspaceRoleArchetype(Long staffMemberRoleId) {
    if (StringUtils.isNumeric(teacherRoleSetting)) {
      if (staffMemberRoleId.equals(NumberUtils.createLong(teacherRoleSetting))) {
        return WorkspaceRoleArchetype.TEACHER;
      }
    }
    return WorkspaceRoleArchetype.CUSTOM;
  }

  public UserAddress createEntity(SchoolDataIdentifier userIdentifier, Address address, ContactType contactType) {
    return new PyramusUserAddress(userIdentifier, 
      address.getStreetAddress(), 
      address.getPostalCode(), 
      address.getCity(), 
      null, 
      address.getCountry(),
      contactType != null ? contactType.getName() : null,
      address.getDefaultAddress());
  }

  public UserPhoneNumber createEntity(SchoolDataIdentifier userIdentifier, PhoneNumber phoneNumber, ContactType contactType) {
    if (phoneNumber != null) {
      return new PyramusUserPhoneNumber(userIdentifier, 
        phoneNumber.getNumber(),
        contactType != null ? contactType.getName() : null,
        phoneNumber.getDefaultNumber());
    }
    
    return null;
  }

  public UserEmail createEntity(SchoolDataIdentifier userIdentifier, Email email, ContactType contactType) {
    return new PyramusUserEmail(toIdentifier(identifierMapper.getEmailIdentifier(email.getId())), 
        userIdentifier, 
        email.getAddress(), 
        contactType != null ? contactType.getName() : null,
        email.getDefaultAddress());
  }
  
  public TransferCredit createEntity(fi.pyramus.rest.model.TransferCredit transferCredit) {
    SchoolDataIdentifier identifier = identifierMapper.getTransferCreditIdentifier(transferCredit.getId());
    SchoolDataIdentifier studentIdentifier = transferCredit.getStudentId() != null ? toIdentifier(identifierMapper.getStudentIdentifier(transferCredit.getStudentId())) : null;
    SchoolDataIdentifier gradeIdentifier = transferCredit.getGradeId() != null ? identifierMapper.getGradeIdentifier(transferCredit.getGradeId()) : null;
    SchoolDataIdentifier gradingScaleIdentifier = transferCredit.getGradingScaleId() != null ? identifierMapper.getGradingScaleIdentifier(transferCredit.getGradingScaleId()) : null;
    SchoolDataIdentifier assessorIdentifier = transferCredit.getAssessorId() != null ? toIdentifier(identifierMapper.getStaffIdentifier(transferCredit.getAssessorId())) : null;
    SchoolDataIdentifier lengthUnitIdentifier = transferCredit.getLengthUnitId() != null ? toIdentifier(identifierMapper.getCourseLengthUnitIdentifier(transferCredit.getLengthUnitId())) : null;
    SchoolDataIdentifier subjectIdentifier = transferCredit.getSubjectId() != null ? toIdentifier(identifierMapper.getSubjectIdentifier(transferCredit.getSubjectId())) : null;
    SchoolDataIdentifier schoolIdentifier = transferCredit.getSchoolId() != null ? identifierMapper.getSchoolIdentifier(transferCredit.getSchoolId()) : null;
    
    return new PyramusTransferCredit(identifier, 
        studentIdentifier, 
        transferCredit.getDate(), 
        gradeIdentifier, 
        gradingScaleIdentifier,
        transferCredit.getVerbalAssessment(), 
        assessorIdentifier, 
        transferCredit.getCourseName(), 
        transferCredit.getCourseNumber(), 
        transferCredit.getLength(), 
        lengthUnitIdentifier, 
        schoolIdentifier, 
        subjectIdentifier);
  }

  private String pyramusHost;
  private String teacherRoleSetting;
}
