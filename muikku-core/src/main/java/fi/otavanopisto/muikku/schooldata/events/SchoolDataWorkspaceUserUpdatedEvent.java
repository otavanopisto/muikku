package fi.otavanopisto.muikku.schooldata.events;

import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;

public class SchoolDataWorkspaceUserUpdatedEvent {

  public SchoolDataWorkspaceUserUpdatedEvent(String dataSource, String identifier, String workspaceDataSource, String workspaceIdentifier,
      String userDataSource, String userIdentifier, WorkspaceRoleArchetype role, Boolean isActive) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.workspaceDataSource = workspaceDataSource;
    this.workspaceIdentifier = workspaceIdentifier;
    this.userDataSource = userDataSource;
    this.userIdentifier = userIdentifier;
    this.role = role;
    this.isActive = isActive;
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

  public Boolean getIsActive() {
    return isActive;
  }
  
  public WorkspaceRoleArchetype getRole() {
    return role;
  }

  private final String dataSource;
  private final String identifier;
  private final String workspaceDataSource;
  private final String workspaceIdentifier;
  private final String userDataSource;
  private final String userIdentifier;
  private final WorkspaceRoleArchetype role;
  private final Boolean isActive;
}
