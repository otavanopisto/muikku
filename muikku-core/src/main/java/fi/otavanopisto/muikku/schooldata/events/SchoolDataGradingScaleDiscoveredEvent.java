package fi.otavanopisto.muikku.schooldata.events;

public class SchoolDataGradingScaleDiscoveredEvent {

  public SchoolDataGradingScaleDiscoveredEvent(String dataSource, String identifier) {
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
  
  public Long getDiscoveredGradingScaleEntityId() {
    return discoveredGradingScaleEntityId;
  }
  
  public void setDiscoveredGradingScaleEntityId(Long discoveredGradingScaleEntityId) {
    this.discoveredGradingScaleEntityId = discoveredGradingScaleEntityId;
  }
  
  private String dataSource;
  private String identifier;
  private Long discoveredGradingScaleEntityId;
}
