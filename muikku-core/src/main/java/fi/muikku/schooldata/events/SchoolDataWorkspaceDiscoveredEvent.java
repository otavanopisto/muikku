package fi.muikku.schooldata.events;

public class SchoolDataWorkspaceDiscoveredEvent {

  public SchoolDataWorkspaceDiscoveredEvent(String dataSource, String identifier, String name) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.name = name;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }
  
  public String getName() {
    return name;
  }

  public void setDiscoveredWorkspaceEntityId(Long discoveredWorkspaceEntityId) {
    this.discoveredWorkspaceEntityId = discoveredWorkspaceEntityId;
  }
  
  public Long getDiscoveredWorkspaceEntityId() {
    return discoveredWorkspaceEntityId;
  }

  private String dataSource;
  private String identifier;
  private String name;
  private Long discoveredWorkspaceEntityId;
}
