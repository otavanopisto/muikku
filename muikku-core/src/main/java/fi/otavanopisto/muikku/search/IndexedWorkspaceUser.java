package fi.otavanopisto.muikku.search;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class IndexedWorkspaceUser {

  public IndexedWorkspaceUser() {
  }
  
  /**
   * Constructor
   * 
   * @param userIdentifier SchoolDataIdentifier identifying the user. Converted to string with call to toId(). 
   * @param firstName first name of the user
   * @param lastName last name of the user
   */
  public IndexedWorkspaceUser(SchoolDataIdentifier userIdentifier, 
      String firstName, String lastName) {
    this.userIdentifier = userIdentifier.toId();
    this.firstName = firstName;
    this.lastName = lastName;
  }
  
  public String getUserIdentifierId() {
    return userIdentifier;
  }

  public void setUserIdentifierId(String userIdentifier) {
    this.userIdentifier = userIdentifier;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  private String firstName;
  private String lastName;
  private String userIdentifier;
}