package fi.muikku.schooldata.events;


public class SchoolDataUserGroupUserUpdatedEvent {

  public SchoolDataUserGroupUserUpdatedEvent(String dataSource, String identifier,
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

  public String getUserGroupIdentifier() {
    return userGroupIdentifier;
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
