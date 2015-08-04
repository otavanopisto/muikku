package fi.muikku.schooldata.events;


public class SchoolDataUserGroupDiscoveredEvent {

  public SchoolDataUserGroupDiscoveredEvent(String dataSource, String identifier) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }

  public Long getDiscoveredUserGroupEntityId() {
    return discoveredUserGroupEntityId;
  }

  public void setDiscoveredUserGroupEntityId(Long discoveredUserGroupEntityId) {
    this.discoveredUserGroupEntityId = discoveredUserGroupEntityId;
  }

  private String dataSource;
  private String identifier;
  private Long discoveredUserGroupEntityId;
}
