package fi.otavanopisto.muikku.plugins.assessmentrequest.rest.model;

import java.util.Date;

public class AssessmentRequestRESTModel {

  public AssessmentRequestRESTModel() {
  }

  public AssessmentRequestRESTModel(String id, String userIdentifier, String workspaceUserIdentifier, Long workspaceEntityId, Long userEntityId, String requestText, Date date, Boolean locked) {
    this.id = id;
    this.userIdentifier = userIdentifier;
    this.workspaceUserIdentifier = workspaceUserIdentifier;
    this.workspaceEntityId = workspaceEntityId;
    this.userEntityId = userEntityId;
    this.requestText = requestText;
    this.date = date;
    this.locked = locked;
  }
  
  public String getRequestText() {
    return requestText;
  }

  public void setRequestText(String requestText) {
    this.requestText = requestText;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }
  
  public String getUserIdentifier() {
    return userIdentifier;
  }
  
  public void setUserIdentifier(String userIdentifier) {
    this.userIdentifier = userIdentifier;
  }
  
  public String getWorkspaceUserIdentifier() {
    return workspaceUserIdentifier;
  }
  
  public void setWorkspaceUserIdentifier(String workspaceUserIdentifier) {
    this.workspaceUserIdentifier = workspaceUserIdentifier;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Boolean getLocked() {
    return locked;
  }

  public void setLocked(Boolean locked) {
    this.locked = locked;
  }

  private String id;
  private String userIdentifier;
  private String workspaceUserIdentifier;
  private String requestText;
  private Date date;
  private Long workspaceEntityId;
  private Long userEntityId;
  private Boolean locked;
}
