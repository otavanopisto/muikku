package fi.otavanopisto.muikku.plugins.organizationmanagement.rest.model;

import java.util.ArrayList;
import java.util.List;

public class OrganizationStudentsCreateResponse {

  public StudentIdentifier createStudentIdentifier(String identifier, StudentStatus status) {
    StudentIdentifier studentIdentifier = new StudentIdentifier(identifier, status);
    studentIdentifiers.add(studentIdentifier);
    return studentIdentifier;
  }
  
  public StudentGroupId createUserGroupIdentifier(Long userGroupId) {
    StudentGroupId studentGroupId = new StudentGroupId(userGroupId);
    studentGroupIds.add(studentGroupId);
    return studentGroupId;
  }
  
  public List<StudentIdentifier> getStudentIdentifiers() {
    return studentIdentifiers;
  }

  public void setStudentIdentifiers(List<StudentIdentifier> studentIdentifiers) {
    this.studentIdentifiers = studentIdentifiers;
  }

  public List<StudentGroupId> getStudentGroupIds() {
    return studentGroupIds;
  }

  public void setStudentGroupIds(List<StudentGroupId> studentGroupIds) {
    this.studentGroupIds = studentGroupIds;
  }

  private List<StudentIdentifier> studentIdentifiers = new ArrayList<>();
  private List<StudentGroupId> studentGroupIds = new ArrayList<>();
  
  public enum StudentStatus {
    OK,
    FAILED,
    ALREADYEXISTS
  }
  
  public class StudentIdentifier {
    
    public StudentIdentifier(String identifier, StudentStatus status) {
      this.identifier = identifier;
      this.status = status;
    }
    
    public String getIdentifier() {
      return identifier;
    }
    
    public void setIdentifier(String identifier) {
      this.identifier = identifier;
    }
    
    public StudentStatus getStatus() {
      return status;
    }
    
    public void setStatus(StudentStatus status) {
      this.status = status;
    }

    private String identifier;
    private StudentStatus status;
  }
  
  public class StudentGroupId {
    
    public StudentGroupId(Long id) {
      this.userGroupId = id;
    }
    
    public void addStudentIdentifier(StudentIdentifier studentIdentifier) {
      this.studentIdentifiers.add(studentIdentifier);
    }
    
    public StudentIdentifier addStudentIdentifier(String identifier, StudentStatus status) {
      StudentIdentifier studentIdentifier = new StudentIdentifier(identifier, status);
      this.studentIdentifiers.add(studentIdentifier);
      return studentIdentifier;
    }
    
    public List<StudentIdentifier> getStudentIdentifiers() {
      return studentIdentifiers;
    }

    public void setStudentIdentifiers(List<StudentIdentifier> studentIdentifiers) {
      this.studentIdentifiers = studentIdentifiers;
    }

    public Long getUserGroupId() {
      return userGroupId;
    }

    public void setUserGroupId(Long userGroupId) {
      this.userGroupId = userGroupId;
    }

    private Long userGroupId;
    private List<StudentIdentifier> studentIdentifiers = new ArrayList<>();
  }
}
