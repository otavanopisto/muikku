package fi.muikku.schooldata.events;

public class SchoolDataGradingScaleItemDiscoveredEvent {

  public SchoolDataGradingScaleItemDiscoveredEvent(String dataSource, String identifier, String gradingScaleDataSource, String gradingScaleIdentifier) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.gradingScaleDataSource = gradingScaleDataSource;
    this.gradingScaleIdentifier = gradingScaleIdentifier;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }
  
  public String getGradingScaleDataSource() {
    return gradingScaleDataSource;
  }
  
  public String getGradingScaleIdentifier() {
    return gradingScaleIdentifier;
  }
  
  private String dataSource;
  private String identifier;
  private String gradingScaleDataSource;
  private String gradingScaleIdentifier;
}
