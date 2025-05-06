package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;

public class WorkspaceMaterialCompositeReply {

  public WorkspaceMaterialCompositeReply(){
  }
  
  public WorkspaceMaterialCompositeReply(List<WorkspaceMaterialFieldAnswer> answers, WorkspaceMaterialReplyState state, Date created, Date lastModified, Date submitted, Date withdrawn, boolean locked) {
    this.answers = answers;
    this.state = state;
    this.created = created;
    this.lastModified = lastModified;
    this.submitted = submitted;
    this.withdrawn = withdrawn;
    this.locked = locked;
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

  public boolean getLocked() {
    return locked;
  }

  public void setLocked(boolean locked) {
    this.locked = locked;
  }

  private List<WorkspaceMaterialFieldAnswer> answers;
  private WorkspaceMaterialReplyState state;
  private Date created;
  private Date lastModified;
  private Date submitted;
  private Date withdrawn;
  private boolean locked;

}