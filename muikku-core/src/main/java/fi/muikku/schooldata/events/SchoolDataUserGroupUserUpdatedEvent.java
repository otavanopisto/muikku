package fi.muikku.schooldata.events;


public class SchoolDataUserGroupUserUpdatedEvent {

  public SchoolDataUserGroupUserUpdatedEvent(String dataSource, String identifier) {
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

  public Long getDiscoveredUserGroupUserEntityId() {
    return discoveredUserGroupUserEntityId;
  }

  public void setDiscoveredUserGroupUserEntityId(Long discoveredUserGroupUserEntityId) {
    this.discoveredUserGroupUserEntityId = discoveredUserGroupUserEntityId;
  }

  private String dataSource;
  private String identifier;
  private Long discoveredUserGroupUserEntityId;
}
