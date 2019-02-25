package fi.otavanopisto.muikku.plugins.chat;

public class WorkspaceChatSettingsEnabledEvent {

  public WorkspaceChatSettingsEnabledEvent(String workspaceDataSource, String workspaceIdentifier, Boolean isEnabled) {
    super();
    this.workspaceDataSource = workspaceDataSource;
    this.workspaceIdentifier = workspaceIdentifier;
    this.isEnabled = isEnabled;
  }

  public String getWorkspaceDataSource() {
    return workspaceDataSource;
  }

  public String getWorkspaceIdentifier() {
    return workspaceIdentifier;
  }

  public Boolean getIsEnabled() {
    return isEnabled;
  }
  
  private String workspaceDataSource;
  private String workspaceIdentifier;
  private Boolean isEnabled;
}
