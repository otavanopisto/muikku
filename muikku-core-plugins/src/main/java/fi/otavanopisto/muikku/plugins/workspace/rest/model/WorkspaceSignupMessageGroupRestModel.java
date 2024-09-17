package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceSignupMessageGroupRestModel {

  public WorkspaceSignupMessageGroupRestModel() {
  }

  public WorkspaceSignupMessageGroupRestModel(Long userGroupEntityId, String userGroupName) {
    this.userGroupEntityId = userGroupEntityId;
    this.userGroupName = userGroupName;
  }

  public Long getUserGroupEntityId() {
    return userGroupEntityId;
  }

  public void setUserGroupEntityId(Long userGroupEntityId) {
    this.userGroupEntityId = userGroupEntityId;
  }

  public String getUserGroupName() {
    return userGroupName;
  }

  public void setUserGroupName(String userGroupName) {
    this.userGroupName = userGroupName;
  }

  private Long userGroupEntityId;
  private String userGroupName;

}
