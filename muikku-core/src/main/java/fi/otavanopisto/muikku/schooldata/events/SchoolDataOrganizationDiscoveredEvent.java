package fi.otavanopisto.muikku.schooldata.events;

public class SchoolDataOrganizationDiscoveredEvent {

  public SchoolDataOrganizationDiscoveredEvent(String dataSource, String identifier, String name) {
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
  
  public Long getDiscoveredOrganizationEntityId() {
    return discoveredOrganizationEntityId;
  }

  public void setDiscoveredOrganizationEntityId(Long discoveredOrganizationEntityId) {
    this.discoveredOrganizationEntityId = discoveredOrganizationEntityId;
  }

  private String dataSource;
  private String identifier;
  private String name;
  private Long discoveredOrganizationEntityId;
}
