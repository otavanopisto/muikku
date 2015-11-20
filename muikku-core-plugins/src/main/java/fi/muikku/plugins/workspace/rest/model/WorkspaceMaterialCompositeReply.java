package fi.muikku.plugins.workspace.rest.model;

import java.util.Date;
import java.util.List;

import fi.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;

public class WorkspaceMaterialCompositeReply {

  public WorkspaceMaterialCompositeReply(){
  }
  
  public WorkspaceMaterialCompositeReply(List<WorkspaceMaterialFieldAnswer> answers, WorkspaceMaterialReplyState state, Date created, Date lastModified, Date submitted, Date withdrawn) {
    this.answers = answers;
    this.state = state;
    this.created = created;
    this.lastModified = lastModified;
    this.submitted = submitted;
    this.withdrawn = withdrawn;
  }
  
  public WorkspaceMaterialReplyState getState() {
    return state;
  }
  
  public void setState(WorkspaceMaterialReplyState state) {
    this.state = state;
  }

  public List<WorkspaceMaterialFieldAnswer> getAnswers() {
    return answers;
  }

  public void setAnswers(List<WorkspaceMaterialFieldAnswer> answers) {
    this.answers = answers;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  public Date getSubmitted() {
    return submitted;
  }

  public void setSubmitted(Date submitted) {
    this.submitted = submitted;
  }

  public Date getWithdrawn() {
    return withdrawn;
  }

  public void setWithdrawn(Date withdrawn) {
    this.withdrawn = withdrawn;
  }

  private List<WorkspaceMaterialFieldAnswer> answers;
  private WorkspaceMaterialReplyState state;
  private Date created;
  private Date lastModified;
  private Date submitted;
  private Date withdrawn;
}