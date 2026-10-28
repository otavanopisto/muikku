package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;

public class RestInterimEvaluationRequest {
  
  public RestInterimEvaluationRequest() {
  }

  public RestInterimEvaluationRequest(Long id, Long userEntityId, Long workspaceMaterialId, Date requestDate, Date cancellationDate, Date deadline, String requestText, Long evaluationNoteCount, Boolean archived) {
    this.id = id;
    this.userEntityId = userEntityId;
    this.workspaceMaterialId = workspaceMaterialId;
    this.requestDate = requestDate;
    this.cancellationDate = cancellationDate;
    this.deadline = deadline;
    this.requestText = requestText;
    this.evaluationNoteCount = evaluationNoteCount;
    this.archived = archived;
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

  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }

  public void setWorkspaceMaterialId(Long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
  }

  public Date getRequestDate() {
    return requestDate;
  }

  public void setRequestDate(Date requestDate) {
    this.requestDate = requestDate;
  }

  public Date getCancellationDate() {
    return cancellationDate;
  }

  public void setCancellationDate(Date cancellationDate) {
    this.cancellationDate = cancellationDate;
  }

  public Date getDeadline() {
    return deadline;
  }

  public void setDeadline(Date deadline) {
    this.deadline = deadline;
  }

  public String getRequestText() {
    return requestText;
  }

  public void setRequestText(String requestText) {
    this.requestText = requestText;
  }

  public Long getEvaluationNoteCount() {
    return evaluationNoteCount;
  }

  public void setEvaluationNoteCount(Long evaluationNoteCount) {
    this.evaluationNoteCount = evaluationNoteCount;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  private Long id;
  private Long userEntityId;
  private Long workspaceEntityId;
  private Long workspaceMaterialId;
  private Date requestDate;
  private Date cancellationDate;
  private Date deadline;
  private String requestText;
  private Long evaluationNoteCount;
  private Boolean archived;
  
}
