package fi.muikku.schooldata.events;


public class SchoolDataUserGroupUserRemovedEvent {

  public SchoolDataUserGroupUserRemovedEvent(String dataSource, String identifier, 
      String userGroupDataSource, String userGroupIdentifier) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.userGroupDataSource = userGroupDataSource;
    this.userGroupIdentifier = userGroupIdentifier;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }

  public String getUserGroupDataSource() {
    return userGroupDataSource;
  }

  public void setUserGroupDataSource(String userGroupDataSource) {
    this.userGroupDataSource = userGroupDataSource;
  }

  public String getUserGroupIdentifier() {
    return userGroupIdentifier;
  }

  public void setUserGroupIdentifier(String userGroupIdentifier) {
    this.userGroupIdentifier = userGroupIdentifier;
  }

  private String dataSource;
  private String identifier;
  private String userGroupDataSource;
  private String userGroupIdentifier;
}
