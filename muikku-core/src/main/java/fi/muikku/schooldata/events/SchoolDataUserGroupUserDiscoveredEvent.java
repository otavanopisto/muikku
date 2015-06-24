package fi.muikku.schooldata.events;


public class SchoolDataUserGroupUserDiscoveredEvent {

  public SchoolDataUserGroupUserDiscoveredEvent(String dataSource, String identifier, 
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

  public Long getDiscoveredUserGroupUserEntityId() {
    return discoveredUserGroupUserEntityId;
  }

  public void setDiscoveredUserGroupUserEntityId(Long discoveredUserGroupUserEntityId) {
    this.discoveredUserGroupUserEntityId = discoveredUserGroupUserEntityId;
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

  public void setUserDataSource(String userDataSource) {
    this.userDataSource = userDataSource;
  }

  public String getUserIdentifier() {
    return userIdentifier;
  }

  public void setUserIdentifier(String userIdentifier) {
    this.userIdentifier = userIdentifier;
  }

  private String dataSource;
  private String identifier;
  private Long discoveredUserGroupUserEntityId;
  private String userGroupDataSource;
  private String userGroupIdentifier;
  private String userDataSource;
  private String userIdentifier;
}
