package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.Date;

public class WorkspaceUserSignup {

  public WorkspaceUserSignup() {
  }

  public WorkspaceUserSignup(Long id, Long workspaceId, Long userId, Date date, String message) {
    super();
    this.id = id;
    this.workspaceId = workspaceId;
    this.userId = userId;
    this.setDate(date);
    this.setMessage(message);
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getWorkspaceId() {
    return workspaceId;
  }

  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  private Date date;
  private String message;
  private Long id;
  private Long workspaceId;
  private Long userId;
}