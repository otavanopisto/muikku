package fi.muikku.plugins.assessmentrequest.rest.model;

public class AssessmentRequestRESTModel {
  
  public AssessmentRequestRESTModel() {
  }

  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
  }

  public void setStudentId(Long studentId) {
    this.studentId = studentId;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public Long getWorkspaceId() {
    return workspaceId;
  }

  public Long getStudentId() {
    return studentId;
  }

  public String getMessage() {
    return message;
  }

  private Long workspaceId;
  private Long studentId;
  private String message;
}
