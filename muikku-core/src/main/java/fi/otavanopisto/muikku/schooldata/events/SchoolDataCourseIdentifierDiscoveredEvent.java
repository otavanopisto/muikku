package fi.otavanopisto.muikku.schooldata.events;

public class SchoolDataCourseIdentifierDiscoveredEvent {

  public SchoolDataCourseIdentifierDiscoveredEvent(String dataSource, String identifier) {
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
  
  public void setDiscoveredCourseIdentifierEntityId(Long discoveredCourseIdentifierEntityId) {
    this.discoveredCourseIdentifierEntityId = discoveredCourseIdentifierEntityId;
  }
  
  public Long getDiscoveredCourseIdentifierEntityId() {
    return discoveredCourseIdentifierEntityId;
  }
  
  private String dataSource;
  private String identifier;
  private Long discoveredCourseIdentifierEntityId;
}
