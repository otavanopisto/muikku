package fi.otavanopisto.muikku.schooldata.events;

import fi.otavanopisto.muikku.schooldata.entity.WorkspaceRoleArchetype;

public class SchoolDataWorkspaceRoleDiscoveredEvent {

  public SchoolDataWorkspaceRoleDiscoveredEvent(String dataSource, String identifier, WorkspaceRoleArchetype archetype, String name) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.archetype = archetype;
    this.name = name;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }
  
  public WorkspaceRoleArchetype getArchetype() {
    return archetype;
  }
  
  public String getName() {
    return name;
  }
  
  public Long getDiscoveredWorkspaceRoleEntityId() {
    return discoveredWorkspaceRoleEntityId;
  }
  
  public void setDiscoveredWorkspaceRoleEntityId(Long discoveredWorkspaceRoleEntityId) {
    this.discoveredWorkspaceRoleEntityId = discoveredWorkspaceRoleEntityId;
  }
  
  private String dataSource;
  private String identifier;
  private WorkspaceRoleArchetype archetype;
  private String name;
  private Long discoveredWorkspaceRoleEntityId;
}
