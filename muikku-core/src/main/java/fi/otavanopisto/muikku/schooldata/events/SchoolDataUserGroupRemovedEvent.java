package fi.otavanopisto.muikku.schooldata.events;


public class SchoolDataUserGroupRemovedEvent {

  public SchoolDataUserGroupRemovedEvent(String dataSource, String identifier, String searchId) {
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

  public Long getRemovedUserGroupEntityId() {
    return removedUserGroupEntityId;
  }

  public void setRemovedUserGroupEntityId(Long discoveredUserGroupEntityId) {
    this.removedUserGroupEntityId = discoveredUserGroupEntityId;
  }

  public String getSearchId() {
    return searchId;
  }

  public void setSearchId(String searchId) {
    this.searchId = searchId;
  }

  private String dataSource;
  private String identifier;
  private String searchId;
  private Long removedUserGroupEntityId;
}
