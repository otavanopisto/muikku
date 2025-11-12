package fi.otavanopisto.muikku.rest.model;

public class GuardianRestModel {

  public GuardianRestModel() {
  }

  public GuardianRestModel(String identifier, String firstName, String lastName, boolean continuedViewPermission) {
    this.identifier = identifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.continuedViewPermission = continuedViewPermission;
  }
  
  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String id) {
    this.identifier = id;
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

  public boolean isContinuedViewPermission() {
    return continuedViewPermission;
  }

  public void setContinuedViewPermission(boolean continuedViewPermission) {
    this.continuedViewPermission = continuedViewPermission;
  }

  private String identifier;
  private String firstName;
  private String lastName;
  private boolean continuedViewPermission;
}
