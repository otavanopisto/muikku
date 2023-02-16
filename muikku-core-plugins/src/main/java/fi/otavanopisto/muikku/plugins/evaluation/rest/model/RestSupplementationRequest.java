package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;

public class RestSupplementationRequest {
  
  public RestSupplementationRequest() {
  }

  public RestSupplementationRequest(Long id, Long userEntityId, Long studentEntityId, Long workspaceEntityId, String workspaceSubjectIdentifier, Date requestDate, String requestText) {
    this.id = id;
    this.userEntityId = userEntityId;
    this.studentEntityId = studentEntityId;
    this.workspaceEntityId = workspaceEntityId;
    this.workspaceSubjectIdentifier = workspaceSubjectIdentifier;
    this.requestDate = requestDate;
    this.requestText = requestText;
  }
  
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Long getStudentEntityId() {
    return studentEntityId;
  }

  public void setStudentEntityId(Long studentEntityId) {
    this.studentEntityId = studentEntityId;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public Date getRequestDate() {
    return requestDate;
  }

  public void setRequestDate(Date requestDate) {
    this.requestDate = requestDate;
  }

  public String getRequestText() {
    return requestText;
  }

  public void setRequestText(String requestText) {
    this.requestText = requestText;
  }

  public String getWorkspaceSubjectIdentifier() {
    return workspaceSubjectIdentifier;
  }

  public void setWorkspaceSubjectIdentifier(String workspaceSubjectIdentifier) {
    this.workspaceSubjectIdentifier = workspaceSubjectIdentifier;
  }

  private Long id;
  private Long userEntityId;
  private Long studentEntityId;
  private Long workspaceEntityId;
  private String workspaceSubjectIdentifier;
  private Date requestDate;
  private String requestText;

}
