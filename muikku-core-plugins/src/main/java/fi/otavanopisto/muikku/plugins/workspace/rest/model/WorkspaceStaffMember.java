package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.Map;

public class WorkspaceStaffMember {

  public WorkspaceStaffMember() {
  }

  public WorkspaceStaffMember(String id, String userIdentifier, Long userEntityId, String firstName, String lastName, String email, Map<String, String> properties) {
    super();
    this.id = id;
    this.userIdentifier = userIdentifier;
    this.userEntityId = userEntityId;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public String getId() {
    return id;
  }
  
  public void setId(String id) {
    this.id = id;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }
  
  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
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

  public String getUserIdentifier() {
    return userIdentifier;
  }

  public void setUserIdentifier(String userIdentifier) {
    this.userIdentifier = userIdentifier;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Map<String, String> getProperties() {
    return properties;
  }

  public void setProperties(Map<String, String> properties) {
    this.properties = properties;
  }

  private String id;
  private String userIdentifier;
  private Long userEntityId;
  private String firstName;
  private String lastName;
  private String email;
  private Map<String, String> properties;

}