package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;

public class RestWorkspaceJournalFeedback {

  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public Long getStudent() {
    return student;
  }
  public void setStudent(Long student) {
    this.student = student;
  }

  public Long getCreator() {
    return creator;
  }
  public void setCreator(Long creator) {
    this.creator = creator;
  }

  public String getCreatorName() {
    return creatorName;
  }
  public void setCreatorName(String creatorName) {
    this.creatorName = creatorName;
  }
  public Date getCreated() {
    return created;
  }
  public void setCreated(Date created) {
    this.created = created;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public String getFeedback() {
    return feedback;
  }
  public void setFeedback(String feedback) {
    this.feedback = feedback;
  }

  private Long id;
  private Long student;
  private Long creator;
  private String creatorName;
  private Date created;
  private Long workspaceEntityId;
  private String feedback;
}
