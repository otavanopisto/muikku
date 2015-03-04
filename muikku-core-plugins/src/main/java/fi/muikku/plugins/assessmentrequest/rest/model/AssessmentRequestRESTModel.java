package fi.muikku.plugins.assessmentrequest.rest.model;

public class AssessmentRequestRESTModel {

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

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getState() {
    return state;
  }

  public void setState(String state) {
    this.state = state;
  }

  private Long id;
  private Long workspaceId;
  private Long studentId;
  private String message;
  private String state;
}
