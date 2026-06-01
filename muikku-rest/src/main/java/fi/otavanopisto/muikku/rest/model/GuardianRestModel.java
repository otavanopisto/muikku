package fi.otavanopisto.muikku.rest.model;

import java.time.OffsetDateTime;

public class GuardianRestModel {

  public GuardianRestModel() {
  }

  public GuardianRestModel(String identifier, String firstName, String lastName, boolean continuedViewPermission, OffsetDateTime continuedViewPermissionModified) {
    this.identifier = identifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.continuedViewPermission = continuedViewPermission;
    this.continuedViewPermissionModified = continuedViewPermissionModified;
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

  public OffsetDateTime getContinuedViewPermissionModified() {
    return continuedViewPermissionModified;
  }

  public void setContinuedViewPermissionModified(OffsetDateTime continuedViewPermissionModified) {
    this.continuedViewPermissionModified = continuedViewPermissionModified;
  }

  private String identifier;
  private String firstName;
  private String lastName;
  private boolean continuedViewPermission;
  private OffsetDateTime continuedViewPermissionModified;
}
