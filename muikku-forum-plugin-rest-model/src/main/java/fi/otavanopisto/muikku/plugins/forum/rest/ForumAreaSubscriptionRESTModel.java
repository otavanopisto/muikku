package fi.otavanopisto.muikku.plugins.forum.rest;

public class ForumAreaSubscriptionRESTModel {

  public ForumAreaSubscriptionRESTModel() {
  }
  
  public ForumAreaSubscriptionRESTModel(Long id, Long areaId, Long userEntityId, ForumAreaRESTModel area, Long workspaceId, String workspaceUrlName, String workspaceName) {
    super();
    this.setAreaId(areaId);
    this.setUserEntityId(userEntityId);
    this.setArea(area);
    this.setWorkspaceId(workspaceId);
    this.setWorkspaceUrlName(workspaceUrlName);
    this.setWorkspaceName(workspaceName);
  }

  public Long getAreaId() {
    return areaId;
  }

  public void setAreaId(Long areaId) {
    this.areaId = areaId;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public ForumAreaRESTModel getArea() {
    return area;
  }

  public void setArea(ForumAreaRESTModel area) {
    this.area = area;
  }

  public Long getWorkspaceId() {
    return workspaceId;
  }

  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  public String getWorkspaceName() {
    return workspaceName;
  }

  public void setWorkspaceName(String workspaceName) {
    this.workspaceName = workspaceName;
  }

  private Long areaId;
  private Long userEntityId;
  private ForumAreaRESTModel area;
  private Long workspaceId;
  private String workspaceUrlName;
  private String workspaceName;
}
