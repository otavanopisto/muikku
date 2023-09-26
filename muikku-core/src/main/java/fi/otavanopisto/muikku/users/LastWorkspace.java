package fi.otavanopisto.muikku.users;

public class LastWorkspace {

  public LastWorkspace() {
  }

  public LastWorkspace(String url, Long workspaceId, String workspaceName, String materialName) {
    super();
    this.url = url;
    this.workspaceId = workspaceId;
    this.workspaceName = workspaceName;
    this.materialName = materialName;
  }
  
  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  public Long getWorkspaceId() {
    return workspaceId;
  }

  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
  }

  public String getWorkspaceName() {
    return workspaceName;
  }

  public void setWorkspaceName(String workspaceName) {
    this.workspaceName = workspaceName;
  }

  public String getMaterialName() {
    return materialName;
  }

  public void setMaterialName(String materialName) {
    this.materialName = materialName;
  }

  private String url;
  private Long workspaceId;
  private String workspaceName;
  private String materialName;
}
