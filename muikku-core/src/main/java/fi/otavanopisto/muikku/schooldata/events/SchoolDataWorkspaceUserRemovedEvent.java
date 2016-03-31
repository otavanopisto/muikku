package fi.otavanopisto.muikku.schooldata.events;

public class SchoolDataWorkspaceUserRemovedEvent {

  public SchoolDataWorkspaceUserRemovedEvent(String dataSource, String identifier, String workspaceDataSource, String workspaceIdentifier,
      String userDataSource, String userIdentifier) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.workspaceDataSource = workspaceDataSource;
    this.workspaceIdentifier = workspaceIdentifier;
    this.userDataSource = userDataSource;
    this.userIdentifier = userIdentifier;
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

  private String dataSource;
  private String identifier;
  private String workspaceDataSource;
  private String workspaceIdentifier;
  private String userDataSource;
  private String userIdentifier;
}
