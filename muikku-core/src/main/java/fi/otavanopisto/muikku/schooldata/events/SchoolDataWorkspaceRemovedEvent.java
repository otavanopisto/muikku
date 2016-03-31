package fi.otavanopisto.muikku.schooldata.events;

public class SchoolDataWorkspaceRemovedEvent {

  public SchoolDataWorkspaceRemovedEvent(String dataSource, String identifier, String searchId) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.searchId = searchId;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }
  
  public String getSearchId() {
    return searchId;
  }

  private String dataSource;
  private String identifier;
  private String searchId;
}
