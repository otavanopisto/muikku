package fi.otavanopisto.muikku.rest.model;

import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.schooldata.entity.GuardianState;

public class GuardianRestModel {

  public GuardianRestModel() {
  }

  public GuardianRestModel(String identifier, Long userEntityId, String firstName, String lastName, boolean continuedViewPermission, OffsetDateTime continuedViewPermissionModified, GuardianState state) {
    this.identifier = identifier;
    this.userEntityId = userEntityId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.continuedViewPermission = continuedViewPermission;
    this.continuedViewPermissionModified = continuedViewPermissionModified;
    this.state = state;
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

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public GuardianState getState() {
    return state;
  }

  public void setState(GuardianState state) {
    this.state = state;
  }

  private String identifier;
  private Long userEntityId;
  private String firstName;
  private String lastName;
  private boolean continuedViewPermission;
  private OffsetDateTime continuedViewPermissionModified;
  private GuardianState state;
}
