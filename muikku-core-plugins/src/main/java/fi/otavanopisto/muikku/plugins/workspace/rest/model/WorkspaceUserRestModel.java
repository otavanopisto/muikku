package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class WorkspaceUserRestModel {

  public WorkspaceUserRestModel() {
  }

  public WorkspaceUserRestModel(Long workspaceUserEntityId, Long userEntityId, SchoolDataIdentifier userIdentifier, String firstName, String lastName, boolean hasImage) {
    this.workspaceUserEntityId = workspaceUserEntityId;
    this.userEntityId = userEntityId;
    this.userIdentifier = userIdentifier.toId();
    this.firstName = firstName;
    this.lastName = lastName;
    this.hasImage = hasImage;
  }

  public Long getWorkspaceUserEntityId() {
    return workspaceUserEntityId;
  }

  public void setWorkspaceUserEntityId(Long workspaceUserEntityId) {
    this.workspaceUserEntityId = workspaceUserEntityId;
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

  public boolean getHasImage() {
    return hasImage;
  }

  public void setHasImage(boolean hasImage) {
    this.hasImage = hasImage;
  }

  public String getUserIdentifier() {
    return userIdentifier;
  }

  public void setUserIdentifier(String userIdentifier) {
    this.userIdentifier = userIdentifier;
  }

  private Long workspaceUserEntityId;
  private Long userEntityId;
  private String userIdentifier;
  private String firstName;
  private String lastName;
  private boolean hasImage;
}