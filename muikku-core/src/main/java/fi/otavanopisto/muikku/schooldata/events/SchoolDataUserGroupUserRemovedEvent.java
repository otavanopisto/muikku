package fi.otavanopisto.muikku.schooldata.events;


public class SchoolDataUserGroupUserRemovedEvent {

  public SchoolDataUserGroupUserRemovedEvent(String dataSource, String identifier, 
      String userGroupDataSource, String userGroupIdentifier, 
      String userDataSource, String userIdentifier) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.userGroupDataSource = userGroupDataSource;
    this.userGroupIdentifier = userGroupIdentifier;
    this.userDataSource = userDataSource;
    this.userIdentifier = userIdentifier;
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

  public String getUserDataSource() {
    return userDataSource;
  }
  
  public String getUserIdentifier() {
    return userIdentifier;
  }
  
  private String dataSource;
  private String identifier;
  private String userGroupDataSource;
  private String userGroupIdentifier;
  private String userDataSource;
  private String userIdentifier;
}
