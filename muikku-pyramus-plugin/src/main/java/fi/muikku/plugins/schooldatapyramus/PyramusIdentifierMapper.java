package fi.muikku.plugins.schooldatapyramus;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.pyramus.rest.model.UserRole;

public class PyramusIdentifierMapper {
  
  private static final String STUDENT_PREFIX = "STUDENT-";
  private static final String STAFF_PREFIX = "STAFF-";
  private static final String WORKSPACE_STUDENT_PREFIX = "STUDENT-";
  private static final String WORKSPACE_STAFF_PREFIX = "STAFF-";
  private static final String WORKSPACE_STAFF_ROLE_PREFIX = "WS-";
  private static final String ENVIRONMENT_ROLE_PREFIX = "ENV-";
  private static final String STUDENTGROUP_PREFIX = "USERGROUP-";
  private static final String STUDENTGROUPSTUDENT_PREFIX = "USERGROUPSTUDENT-";
  private static final String STUDENTGROUPSTAFFMEMBER_PREFIX = "USERGROUPSTAFFMEMBER-";
  private static final String STUDYPROGRAMME_PREFIX = "STUDYPROGRAMME-";
  private static final String STUDYPROGRAMMESTUDENT_PREFIX = "STUDYPROGRAMMESTUDENT-";

  public String getWorkspaceIdentifier(Long courseId) {
    return courseId.toString();
  }
  
  public Long getPyramusCourseId(String workspaceIdentifier) {
    return NumberUtils.createLong(workspaceIdentifier);
  }
  
  public String getWorkspaceStudentIdentifier(Long id) {
    return WORKSPACE_STUDENT_PREFIX + id.toString();
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
  
  public String getStaffIdentifier(Long id) {
    return STAFF_PREFIX + id.toString();
  }
  
  public Long getPyramusStaffId(String identifier) {
    if (StringUtils.startsWith(identifier, STAFF_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(identifier, STAFF_PREFIX.length()));
    }
    
    return null;
  }
  
  public String getStudentIdentifier(Long id) {
    return STUDENT_PREFIX + id.toString();
  }
  
  public Long getPyramusStudentId(String identifier) {
    if (StringUtils.startsWith(identifier, STUDENT_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(identifier, STUDENT_PREFIX.length()));
    }
    
    return null;
  }
  
  public String getWorkspaceStaffRoleIdentifier(Long id) {
    return WORKSPACE_STAFF_ROLE_PREFIX + id;
  }
  
  public String getPyramusCourseRoleId(String identifier) {
    if (StringUtils.startsWith(identifier, WORKSPACE_STAFF_ROLE_PREFIX)) {
      return StringUtils.substring(identifier, WORKSPACE_STAFF_ROLE_PREFIX.length());
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
  
  public String getWorkspaceStudentRoleIdentifier() {
    return "WS-STUDENT";
  }
  
  public String getSubjectIdentifier(Long pyramusSubjectId) {
    return String.valueOf(pyramusSubjectId);
  }

  public Long getPyramusSubjectId(String subjectIdentifier) {
    return NumberUtils.createLong(subjectIdentifier);
  }

  public String getEducationTypeIdentifier(Long pyramusEducationTypeId) {
    return String.valueOf(pyramusEducationTypeId);
  }

  public Long getPyramusEducationTypeId(String educationTypeIdentifier) {
    return NumberUtils.createLong(educationTypeIdentifier);
  }

  public String getCourseLengthUnitIdentifier(Long pyramusEducationalTimeUnitId) {
    return String.valueOf(pyramusEducationalTimeUnitId);
  }

  public Long getPyramusEducationalTimeUnitId(String lengthUnitIdentifier) {
    if (!StringUtils.isNumeric(lengthUnitIdentifier)) {
      return null;
    }
    
    return NumberUtils.createLong(lengthUnitIdentifier);
  }

  public String getWorkspaceTypeIdentifier(Long pyramusCourseTypeId) {
    return pyramusCourseTypeId != null ? String.valueOf(pyramusCourseTypeId) : null;
  }

  public Long getPyramusCourseTypeId(String workspaceTypeIdentifier) {
    return workspaceTypeIdentifier != null ? NumberUtils.createLong(workspaceTypeIdentifier) : null;
  }
  
  public String getWorkspaceCourseIdentifier(Long subjectId, Integer courseNumber) {
    return (subjectId == null)||(courseNumber == null) ? null : String.format("%d/%d", subjectId, courseNumber);
  }
  
  public Long getPyramusStudentGroupId(String studentGroupIdentifier){
    if (StringUtils.startsWith(studentGroupIdentifier, STUDENTGROUP_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(studentGroupIdentifier, STUDENTGROUP_PREFIX.length()));
    }
    
    return null;
  }
  
  public String getStudentGroupIdentifier(Long pyramusStudentGroupId){
    return STUDENTGROUP_PREFIX + String.valueOf(pyramusStudentGroupId);
  }
  
  public Long getPyramusStudentGroupStudentId(String groupUserIdentifier) {
    if (StringUtils.startsWith(groupUserIdentifier, STUDENTGROUPSTUDENT_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(groupUserIdentifier, STUDENTGROUPSTUDENT_PREFIX.length()));
    }
    
    return null;
  }
  
  public String getStudentGroupStudentIdentifier(Long pyramusGroupUserId){
    return STUDENTGROUPSTUDENT_PREFIX + String.valueOf(pyramusGroupUserId);
  }
  
  public Long getPyramusStudentGroupStaffMemberId(String groupUserIdentifier) {
    if (StringUtils.startsWith(groupUserIdentifier, STUDENTGROUPSTAFFMEMBER_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(groupUserIdentifier, STUDENTGROUPSTAFFMEMBER_PREFIX.length()));
    }
    
    return null;
  }
  
  public String getStudentGroupStaffMemberIdentifier(Long pyramusGroupUserId){
    return STUDENTGROUPSTAFFMEMBER_PREFIX + String.valueOf(pyramusGroupUserId);
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
  
  public String getStudyProgrammeIdentifier(Long pyramusStudyProgrammeId){
    return STUDYPROGRAMME_PREFIX + String.valueOf(pyramusStudyProgrammeId);
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
    return STUDYPROGRAMMESTUDENT_PREFIX + String.valueOf(pyramusStudentId);
  }

  public Long getPyramusStudyProgrammeStudentId(String studyProgrammeStudentIdentifier) {
    if (StringUtils.startsWith(studyProgrammeStudentIdentifier, STUDYPROGRAMMESTUDENT_PREFIX)) {
      return NumberUtils.createLong(StringUtils.substring(studyProgrammeStudentIdentifier, STUDYPROGRAMMESTUDENT_PREFIX.length()));
    }
    
    return null;
  }
  
  
}
