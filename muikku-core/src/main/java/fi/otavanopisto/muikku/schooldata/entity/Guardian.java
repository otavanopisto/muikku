package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class Guardian {

  public Guardian() {
  }
  
  public Guardian(SchoolDataIdentifier identifier, String firstName, String lastName, GuardianState state, boolean continuedViewPermission) {
    this.identifier = identifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.state = state;
    this.continuedViewPermission = continuedViewPermission;
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

  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  public void setIdentifier(SchoolDataIdentifier identifier) {
    this.identifier = identifier;
  }

  public boolean isContinuedViewPermission() {
    return continuedViewPermission;
  }

  public void setContinuedViewPermission(boolean continuedViewPermission) {
    this.continuedViewPermission = continuedViewPermission;
  }

  public GuardianState getState() {
    return state;
  }

  public void setState(GuardianState state) {
    this.state = state;
  }

  private SchoolDataIdentifier identifier;
  private String firstName;
  private String lastName;
  private GuardianState state;
  private boolean continuedViewPermission;
}
