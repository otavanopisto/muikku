package fi.muikku.plugins.assessmentrequest.rest.model;

public class AssessmentRequestRESTModel {
  
  public AssessmentRequestRESTModel(Long workspaceId, Long studentId, String message) {
    this.workspaceId = workspaceId;
    this.studentId = studentId;
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
