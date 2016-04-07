package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.Date;

public class WorkspaceStudent {

  public WorkspaceStudent() {
  }

  public WorkspaceStudent(String id, Long workspaceId, Long userId, String firstName, String lastName, String studyProgrammeName, Date enrolmentTime, Boolean archived) {
    super();
    this.id = id;
    this.workspaceId = workspaceId;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.studyProgrammeName = studyProgrammeName;
    this.enrolmentTime = enrolmentTime;
    this.setArchived(archived);
  }

  public String getId() {
    return id;
  }
  
  public void setId(String id) {
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
  
  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }
  
  public String getStudyProgrammeName() {
    return studyProgrammeName;
  }
  
  public void setStudyProgrammeName(String studyProgrammeName) {
    this.studyProgrammeName = studyProgrammeName;
  }
  
  public Date getEnrolmentTime() {
    return enrolmentTime;
  }
  
  public void setEnrolmentTime(Date enrolmentTime) {
    this.enrolmentTime = enrolmentTime;
  }
  
  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  // TODO: firstName, lastName and studyProgrammeName do not belong to this resource
  
  private String id;
  private String firstName;
  private String lastName;
  private String studyProgrammeName;
  private Long workspaceId;
  private Long userId;
  private Date enrolmentTime;
  private Boolean archived;

}