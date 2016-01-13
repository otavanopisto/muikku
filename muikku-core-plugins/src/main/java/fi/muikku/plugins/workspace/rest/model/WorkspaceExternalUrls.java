package fi.muikku.plugins.workspace.rest.model;

public class WorkspaceExternalUrls {

  public WorkspaceExternalUrls() {
  }

  public WorkspaceExternalUrls(String externalViewUrl) {
    super();
    this.externalViewUrl = externalViewUrl;
  }

  public String getExternalViewUrl() {
    return externalViewUrl;
  }

  public void setExternalViewUrl(String externalViewUrl) {
    this.externalViewUrl = externalViewUrl;
  }

  private String externalViewUrl;
}
