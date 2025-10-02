package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMemberRoleEnum;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class PyramusIdentifierMapper {
  
  @Inject
  private Logger logger;
  
  private static final String STUDENT_PREFIX = "STUDENT-";
  private static final String STAFF_PREFIX = "STAFF-";
  private static final String STUDENTPARENT_PREFIX = "STUDENTPARENT-";
  private static final String STUDENTPARENTCHILD_PREFIX = "STUDENTPARENTCHILD-";
  private static final String STUDENTPARENTINVITATION_PREFIX = "STUDENTPARENTINV-";
  private static final String WORKSPACE_STUDENT_PREFIX = "STUDENT-";
  private static final String WORKSPACE_STAFF_PREFIX = "STAFF-";
  private static final String ENVIRONMENT_ROLE_PREFIX = "ENV-";
  private static final String STUDENTGROUP_PREFIX = "USERGROUP-";
  private static final String STUDENTGROUPSTUDENT_PREFIX = "USERGROUPSTUDENT-";
  private static final String STUDENTGROUPSTAFFMEMBER_PREFIX = "USERGROUPSTAFFMEMBER-";
  private static final String STUDYPROGRAMME_PREFIX = "STUDYPROGRAMME-";
  private static final String STUDYPROGRAMMESTUDENT_PREFIX = "STUDYPROGRAMMESTUDENT-";
  private static final String TRANSFERCREDIT_PREFIX = "STC-";
  private static final String SCHOOL_PREFIX = "SC-";
  private static final String CREDITLINK_PREFIX = "CREDITLINK-";
  private static final String COURSEMODULE_PREFIX = "COURSEMODULE-";

  public String getWorkspaceIdentifier(Long courseId) {
    return courseId != null ? courseId.toString() : null;
  }
  
  public Long getPyramusCourseId(String workspaceIdentifier) {
    return NumberUtils.createLong(workspaceIdentifier);
  }
  
  public String getWorkspaceStudentIdentifier(Long id) {
    return WORKSPACE_STUDENT_PREFIX + id.toString();
  }
  
  public SchoolDataIdentifier getAssessmentRequestIdentifier(Long id) {
    return id == null ? null : new SchoolDataIdentifier(id.toString(), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }
  
  public SchoolDataIdentifier getGradeIdentifier(Long gradeId) {
    if (gradeId == null) {
      return null;
    }
    
    return new SchoolDataIdentifier(gradeId.toString(), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }
  
  public SchoolDataIdentifier getGradingScaleIdentifier(Long gradingScaleId) {
    if (gradingScaleId == null) {
      return null;
    }
    
    return new SchoolDataIdentifier(gradingScaleId.toString(), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }
  
  public Long getPyramusCourseStudentId(String workspaceStudentIdentifier) {
    if (StringUtils.startsWith(workspaceStudentIdentifier, WORKSPACE_STUDENT_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(workspaceStudentIdentifier, WORKSPACE_STUDENT_PREFIX.length()));
    }
    
    return null;
  }
  
  public String getWorkspaceStaffIdentifier(Long id) {
    return WORKSPACE_STAFF_PREFIX + id.toString();
  }
  
  public Long getPyramusCourseStaffId(String workspaceStudentIdentifier) {
    if (StringUtils.startsWith(workspaceStudentIdentifier, WORKSPACE_STAFF_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(workspaceStudentIdentifier, WORKSPACE_STAFF_PREFIX.length()));
    }
    
    return null;
  }

  public PyramusUserType getIdentifierUserType(SchoolDataIdentifier identifier) {
    return getIdentifierUserType(identifier.getIdentifier());
  }
  
  public PyramusUserType getIdentifierUserType(String identifier) {
    if (StringUtils.startsWith(identifier, STUDENT_PREFIX)) {
      return PyramusUserType.STUDENT;
    }
    if (StringUtils.startsWith(identifier, STAFF_PREFIX)) {
      return PyramusUserType.STAFFMEMBER;
    }
    if (StringUtils.startsWith(identifier, STUDENTPARENT_PREFIX)) {
      return PyramusUserType.STUDENTPARENT;
    }
    
    return null;
  }
  
  public SchoolDataIdentifier getStaffIdentifier(Long id) {
    return new SchoolDataIdentifier(STAFF_PREFIX + id.toString(), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }
  
  public Long getPyramusStaffId(String identifier) {
    if (StringUtils.startsWith(identifier, STAFF_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(identifier, STAFF_PREFIX.length()));
    }
    
    return null;
  }

  // StudentParent
  
  public SchoolDataIdentifier getStudentParentIdentifier(Long id) {
    return new SchoolDataIdentifier(STUDENTPARENT_PREFIX + id.toString(), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }
  
  public Long getStudentParentId(String identifier) {
    if (StringUtils.startsWith(identifier, STUDENTPARENT_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(identifier, STUDENTPARENT_PREFIX.length()));
    }
    
    return null;
  }

  // StudentParentChild
  
  public boolean isStudentParentChildIdentifier(SchoolDataIdentifier identifier) {
    return StringUtils.startsWith(identifier.getIdentifier(), STUDENTPARENTCHILD_PREFIX);
  }
  
  public SchoolDataIdentifier getStudentParentChildIdentifier(Long id) {
    return new SchoolDataIdentifier(STUDENTPARENTCHILD_PREFIX + id.toString(), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }
  
  public Long getStudentParentChildId(SchoolDataIdentifier identifier) {
    if (StringUtils.startsWith(identifier.getIdentifier(), STUDENTPARENTCHILD_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(identifier.getIdentifier(), STUDENTPARENTCHILD_PREFIX.length()));
    }
    
    return null;
  }

  // StudentParentInvitation
  
  public boolean isStudentParentInvitationIdentifier(SchoolDataIdentifier identifier) {
    return StringUtils.startsWith(identifier.getIdentifier(), STUDENTPARENTINVITATION_PREFIX);
  }
  
  public SchoolDataIdentifier getStudentParentInvitationIdentifier(Long id) {
    return new SchoolDataIdentifier(STUDENTPARENTINVITATION_PREFIX + id.toString(), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }
  
  public Long getStudentParentInvitationId(SchoolDataIdentifier identifier) {
    if (StringUtils.startsWith(identifier.getIdentifier(), STUDENTPARENTINVITATION_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(identifier.getIdentifier(), STUDENTPARENTINVITATION_PREFIX.length()));
    }
    
    return null;
  }

  public boolean isStudentIdentifier(String identifier) {
    return StringUtils.startsWith(identifier, STUDENT_PREFIX);
  }
  
  public SchoolDataIdentifier getStudentIdentifier(Long id) {
    return new SchoolDataIdentifier(STUDENT_PREFIX + id.toString(), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }
  
  public Long getPyramusStudentId(String identifier) {
    if (StringUtils.startsWith(identifier, STUDENT_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(identifier, STUDENT_PREFIX.length()));
    }
    
    return null;
  }
  
  public String getEnvironmentRoleIdentifier(UserRole id) {
    return ENVIRONMENT_ROLE_PREFIX + id.name();
  }
  
  public UserRole getPyramusUserRole(String identifier) {
    if (StringUtils.startsWith(identifier, ENVIRONMENT_ROLE_PREFIX)) {
      return UserRole.valueOf(StringUtils.substring(identifier, ENVIRONMENT_ROLE_PREFIX.length()));
    }
    
    return null;
  }
  
  public String getSubjectIdentifier(Long pyramusSubjectId) {
    return pyramusSubjectId == null ? null : String.valueOf(pyramusSubjectId);
  }

  public Long getPyramusSubjectId(String subjectIdentifier) {
    return NumberUtils.createLong(subjectIdentifier);
  }

  public SchoolDataIdentifier getEducationTypeIdentifier(Long pyramusEducationTypeId) {
    return pyramusEducationTypeId == null ? null : new SchoolDataIdentifier(String.valueOf(pyramusEducationTypeId), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }

  public SchoolDataIdentifier getEducationSubtypeIdentifier(Long pyramusEducationSubtypeId) {
    return pyramusEducationSubtypeId == null ? null : new SchoolDataIdentifier(String.valueOf(pyramusEducationSubtypeId), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }

  public Long getPyramusEducationTypeId(String educationTypeIdentifier) {
    return NumberUtils.createLong(educationTypeIdentifier);
  }

  public String getCourseLengthUnitIdentifier(Long pyramusEducationalTimeUnitId) {
    return pyramusEducationalTimeUnitId == null ? null : String.valueOf(pyramusEducationalTimeUnitId);
  }

  public Long getPyramusEducationalTimeUnitId(String lengthUnitIdentifier) {
    if (!StringUtils.isNumeric(lengthUnitIdentifier)) {
      return null;
    }
    
    return NumberUtils.createLong(lengthUnitIdentifier);
  }

  public SchoolDataIdentifier getWorkspaceTypeIdentifier(Long pyramusCourseTypeId) {
    return pyramusCourseTypeId == null ? null : new SchoolDataIdentifier(String.valueOf(pyramusCourseTypeId), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }

  public Long getPyramusCourseTypeId(SchoolDataIdentifier workspaceTypeIdentifier) {
    return workspaceTypeIdentifier != null ? NumberUtils.createLong(workspaceTypeIdentifier.getIdentifier()) : null;
  }
  
  public Long getPyramusStudentGroupId(String studentGroupIdentifier){
    if (StringUtils.startsWith(studentGroupIdentifier, STUDENTGROUP_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(studentGroupIdentifier, STUDENTGROUP_PREFIX.length()));
    }
    
    return null;
  }
  
  public String getStudentGroupIdentifier(Long pyramusStudentGroupId){
    return pyramusStudentGroupId == null ? null : STUDENTGROUP_PREFIX + String.valueOf(pyramusStudentGroupId);
  }
  
  public Long getPyramusStudentGroupStudentId(String groupUserIdentifier) {
    if (StringUtils.startsWith(groupUserIdentifier, STUDENTGROUPSTUDENT_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(groupUserIdentifier, STUDENTGROUPSTUDENT_PREFIX.length()));
    }
    
    return null;
  }
  
  public String getStudentGroupStudentIdentifier(Long pyramusGroupUserId){
    return pyramusGroupUserId == null ? null : STUDENTGROUPSTUDENT_PREFIX + String.valueOf(pyramusGroupUserId);
  }
  
  public Long getPyramusStudentGroupStaffMemberId(String groupUserIdentifier) {
    if (StringUtils.startsWith(groupUserIdentifier, STUDENTGROUPSTAFFMEMBER_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(groupUserIdentifier, STUDENTGROUPSTAFFMEMBER_PREFIX.length()));
    }
    
    return null;
  }
  
  public String getStudentGroupStaffMemberIdentifier(Long pyramusGroupUserId){
    return pyramusGroupUserId == null ? null : STUDENTGROUPSTAFFMEMBER_PREFIX + String.valueOf(pyramusGroupUserId);
  }

  public StudentGroupUserType getStudentGroupUserType(String identifier) {
    if (StringUtils.startsWith(identifier, STUDENTGROUPSTAFFMEMBER_PREFIX))
      return StudentGroupUserType.STAFFMEMBER;
    
    if (StringUtils.startsWith(identifier, STUDENTGROUPSTUDENT_PREFIX))
      return StudentGroupUserType.STUDENT;
    
    return null;
  }
  
  enum StudentGroupUserType {
    STUDENT,
    STAFFMEMBER
  }
  
  public Long getPyramusStudyProgrammeId(String studyProgrammeIdentifier) {
    if (StringUtils.startsWith(studyProgrammeIdentifier, STUDYPROGRAMME_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(studyProgrammeIdentifier, STUDYPROGRAMME_PREFIX.length()));
    }
    
    return null;
  }
  
  public SchoolDataIdentifier getStudyProgrammeIdentifier(Long pyramusStudyProgrammeId){
    return pyramusStudyProgrammeId == null ? null : new SchoolDataIdentifier(STUDYPROGRAMME_PREFIX + String.valueOf(pyramusStudyProgrammeId),
        SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }

  public StudentGroupType getStudentGroupType(String identifier) {
    if (StringUtils.startsWith(identifier, STUDENTGROUP_PREFIX))
      return StudentGroupType.STUDENTGROUP;
    
    if (StringUtils.startsWith(identifier, STUDYPROGRAMME_PREFIX))
      return StudentGroupType.STUDYPROGRAMME;
    
    return null;
  }
  
  public enum StudentGroupType {
    STUDENTGROUP,
    STUDYPROGRAMME
  }

  public String getStudyProgrammeStudentIdentifier(Long pyramusStudentId) {
    return pyramusStudentId == null ? null : STUDYPROGRAMMESTUDENT_PREFIX + String.valueOf(pyramusStudentId);
  }

  public Long getPyramusStudyProgrammeStudentId(String studyProgrammeStudentIdentifier) {
    if (StringUtils.startsWith(studyProgrammeStudentIdentifier, STUDYPROGRAMMESTUDENT_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(studyProgrammeStudentIdentifier, STUDYPROGRAMMESTUDENT_PREFIX.length()));
    }
    
    return null;
  }
  
  public Long getPyramusTransferCredit(SchoolDataIdentifier transferCreditIdentifier) {
    if (transferCreditIdentifier == null) {
      return null;
    }
    
    if (transferCreditIdentifier.getDataSource().equals(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE)) {
      if (StringUtils.startsWith(transferCreditIdentifier.getIdentifier(), TRANSFERCREDIT_PREFIX)) {
        return NumberUtils.createLong(StringUtils.substring(transferCreditIdentifier.getIdentifier(), TRANSFERCREDIT_PREFIX.length()));
      }
    }
    
    logger.severe(String.format("Could not translate %s to pyramus transfer credit id", transferCreditIdentifier));
    
    return null;
  }
  
  public SchoolDataIdentifier getTransferCreditIdentifier(Long transferCreditId) {
    if (transferCreditId == null) {
      return null;
    }
    
    return new SchoolDataIdentifier(String.format("%s%d", TRANSFERCREDIT_PREFIX, transferCreditId), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }
  
  public Long getPyramusSchool(SchoolDataIdentifier schoolIdentifier) {
    if (schoolIdentifier == null) {
      return null;
    }
    
    if (schoolIdentifier.getDataSource().equals(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE)) {
      if (StringUtils.startsWith(schoolIdentifier.getIdentifier(), SCHOOL_PREFIX)) {
        return NumberUtils.createLong(StringUtils.substring(schoolIdentifier.getIdentifier(), SCHOOL_PREFIX.length()));
      }
    }
    
    logger.severe(String.format("Could not translate %s to pyramus transfer school id", schoolIdentifier));
    
    return null;
  }
  
  public SchoolDataIdentifier getSchoolIdentifier(Long schoolId) {
    if (schoolId == null) {
      return null;
    }
    
    return new SchoolDataIdentifier(String.format("%s%d", SCHOOL_PREFIX, schoolId), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }

  public Long getPyramusGradeId(String gradeIdentifier) {
    if (StringUtils.isBlank(gradeIdentifier)) {
      return null;
    }
    
    if (!StringUtils.isNumeric(gradeIdentifier)) {
      return null;
    }
    
    return Long.parseLong(gradeIdentifier);
  }

  public Long getPyramusGradingScaleId(String gradingScaleIdentifier) {
    if (StringUtils.isBlank(gradingScaleIdentifier)) {
      return null;
    }
    
    if (!StringUtils.isNumeric(gradingScaleIdentifier)) {
      return null;
    }
    
    return Long.parseLong(gradingScaleIdentifier);
  }
  
  public String getEmailIdentifier(Long emailId) {
    return emailId != null ? emailId.toString() : null;
  }

  public SchoolDataIdentifier getAddressIdentifier(Long addressId) {
    if (addressId == null) {
      return null;
    } else {
      return new SchoolDataIdentifier(String.valueOf(addressId), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    }
  }

  public Long getPyramusAddressId(String identifier) {
    return NumberUtils.createLong(identifier);
  }
  
  public Long getPyramusEmailId(String emailIdentifier) {
    return NumberUtils.createLong(emailIdentifier);
  }

  public Long getPyramusCourseAssessmentId(String identifier) {
    return NumberUtils.createLong(identifier);
  }

  public SchoolDataIdentifier getCurriculumIdentifier(Long pyramusCurriculumId) {
    return pyramusCurriculumId == null ? null : new SchoolDataIdentifier(String.valueOf(pyramusCurriculumId), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }

  public Long getPyramusCurriculumId(String curriculumIdentifier) {
    return NumberUtils.createLong(curriculumIdentifier);
  }

  public SchoolDataIdentifier getOrganizationIdentifier(Long organizationId) {
    return organizationId == null ? null : new SchoolDataIdentifier(String.valueOf(organizationId), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
  }

  public Long getPyramusOrganizationId(String organizationIdentifier) {
    return NumberUtils.createLong(organizationIdentifier);
  }

  public SchoolDataIdentifier getCreditLinkIdentifier(Long creditLinkId) {
    return creditLinkId != null ? new SchoolDataIdentifier(String.format("%s%d", CREDITLINK_PREFIX, creditLinkId), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE) : null; 
  }

  public Long getPyramusCourseModuleId(String workspaceSubjectIdentifier) {
    if (StringUtils.startsWith(workspaceSubjectIdentifier, COURSEMODULE_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(workspaceSubjectIdentifier, COURSEMODULE_PREFIX.length()));
    }
    
    return null;
  }
  
  public SchoolDataIdentifier getCourseModuleIdentifier(Long courseModuleId) {
    return courseModuleId != null ? new SchoolDataIdentifier(String.format("%s%d", COURSEMODULE_PREFIX, courseModuleId), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE) : null; 
  }

  public WorkspaceRoleArchetype getWorkspaceRoleArchetype(CourseStaffMemberRoleEnum role) {
    switch (role) {
      case COURSE_TEACHER:
        return WorkspaceRoleArchetype.TEACHER;
      case COURSE_TUTOR:
        return WorkspaceRoleArchetype.TUTOR;
      case COURSE_ORGANIZER:
        return WorkspaceRoleArchetype.ORGANIZER;
    }
    return null;
  }
  
  public CourseStaffMemberRoleEnum getCourseStaffMemberRole(WorkspaceRoleArchetype archetype) {
    switch (archetype) {
      case TEACHER:
        return CourseStaffMemberRoleEnum.COURSE_TEACHER;
      case TUTOR:
        return CourseStaffMemberRoleEnum.COURSE_TUTOR;
      case ORGANIZER:
        return CourseStaffMemberRoleEnum.COURSE_ORGANIZER;
      default:
        return null;
    }
  }
  
}
