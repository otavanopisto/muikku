package fi.muikku.schooldata.events;

public class SchoolDataWorkspaceUpdatedEvent {

  public SchoolDataWorkspaceUpdatedEvent(String dataSource, String identifier, String name) {
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

  private String dataSource;
  private String identifier;
  private String name;
}
