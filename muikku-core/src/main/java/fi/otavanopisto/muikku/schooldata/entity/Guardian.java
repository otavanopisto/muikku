package fi.otavanopisto.muikku.schooldata.entity;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class Guardian {

  public Guardian() {
  }
  
  public Guardian(SchoolDataIdentifier identifier, SchoolDataIdentifier studentParentIdentifier, String firstName, String lastName, 
      GuardianState state, boolean continuedViewPermission, OffsetDateTime continuedViewPermissionModified, LocalDate expires) {
    this.identifier = identifier;
    this.studentParentIdentifier = studentParentIdentifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.state = state;
    this.continuedViewPermission = continuedViewPermission;
    this.continuedViewPermissionModified = continuedViewPermissionModified;
    this.expires = expires;
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

  public OffsetDateTime getContinuedViewPermissionModified() {
    return continuedViewPermissionModified;
  }

  public void setContinuedViewPermissionModified(OffsetDateTime continuedViewPermissionModified) {
    this.continuedViewPermissionModified = continuedViewPermissionModified;
  }

  /**
   * @return The School Data Identifier of the User. May not exist especially when the state is INVITED.
   */
  public SchoolDataIdentifier getStudentParentIdentifier() {
    return studentParentIdentifier;
  }

  public void setStudentParentIdentifier(SchoolDataIdentifier studentParentIdentifier) {
    this.studentParentIdentifier = studentParentIdentifier;
  }

  public LocalDate getExpires() {
    return expires;
  }

  public void setExpires(LocalDate expires) {
    this.expires = expires;
  }

  private SchoolDataIdentifier identifier;
  private SchoolDataIdentifier studentParentIdentifier;
  private String firstName;
  private String lastName;
  private GuardianState state;
  private boolean continuedViewPermission;
  private OffsetDateTime continuedViewPermissionModified;
  private LocalDate expires;
}
