package fi.otavanopisto.muikku.schooldata.events;

public class SchoolDataWorkspaceUserDiscoveredEvent {

  public SchoolDataWorkspaceUserDiscoveredEvent(String dataSource, String identifier, String workspaceDataSource, String workspaceIdentifier,
      String userDataSource, String userIdentifier, String roleDataSource, String roleIdentifier) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.workspaceDataSource = workspaceDataSource;
    this.workspaceIdentifier = workspaceIdentifier;
    this.userDataSource = userDataSource;
    this.userIdentifier = userIdentifier;
    this.roleDataSource = roleDataSource;
    this.roleIdentifier = roleIdentifier;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }

  public String getWorkspaceDataSource() {
    return workspaceDataSource;
  }

  public String getWorkspaceIdentifier() {
    return workspaceIdentifier;
  }

  public String getUserDataSource() {
    return userDataSource;
  }

  public String getUserIdentifier() {
    return userIdentifier;
  }

  public String getRoleDataSource() {
    return roleDataSource;
  }
  
  public String getRoleIdentifier() {
    return roleIdentifier;
  }
  
  public void setDiscoveredWorkspaceUserEntityId(Long discoveredWorkspaceUserEntityId) {
    this.discoveredWorkspaceUserEntityId = discoveredWorkspaceUserEntityId;
  }
  
  public Long getDiscoveredWorkspaceUserEntityId() {
    return discoveredWorkspaceUserEntityId;
  }
  
  private String dataSource;
  private String identifier;
  private String workspaceDataSource;
  private String workspaceIdentifier;
  private String userDataSource;
  private String userIdentifier;
  private String roleDataSource;
  private String roleIdentifier;
  private Long discoveredWorkspaceUserEntityId;
}
