package fi.otavanopisto.muikku.plugins.assessmentrequest;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class AssessmentRequestMessageId {

  public Long getId() {
    return id;
  }
  
  public Long getCommunicatorMessageId() {
    return communicatorMessageId;
  }

  public void setCommunicatorMessageId(Long communicatorMessageId) {
    this.communicatorMessageId = communicatorMessageId;
  }

  public Long getWorkspaceUserId() {
    return workspaceUserId;
  }

  public void setWorkspaceUserId(Long workspaceUserId) {
    this.workspaceUserId = workspaceUserId;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  private Long workspaceUserId;
  
  private Long communicatorMessageId;
}
