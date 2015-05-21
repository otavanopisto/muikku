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

}
