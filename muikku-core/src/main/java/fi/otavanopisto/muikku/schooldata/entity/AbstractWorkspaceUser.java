package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractWorkspaceUser implements WorkspaceUser {

  public AbstractWorkspaceUser(SchoolDataIdentifier identifier, SchoolDataIdentifier userIdentifier, SchoolDataIdentifier workspaceIdentifier,
      SchoolDataIdentifier roleIdentifier, OffsetDateTime enrolmentTime) {
    super();
    this.identifier = identifier;
    this.userIdentifier = userIdentifier;
    this.workspaceIdentifier = workspaceIdentifier;
    this.roleIdentifier = roleIdentifier;
    this.enrolmentTime = enrolmentTime;
  }

  @Override
  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  @Override
  public SchoolDataIdentifier getUserIdentifier() {
    return userIdentifier;
  }

  @Override
  public SchoolDataIdentifier getWorkspaceIdentifier() {
    return workspaceIdentifier;
  }

  @Override
  public SchoolDataIdentifier getRoleIdentifier() {
    return roleIdentifier;
  }
  
  @Override
  public OffsetDateTime getEnrolmentTime() {
    return enrolmentTime;
  }
  
  private SchoolDataIdentifier identifier;
  private SchoolDataIdentifier userIdentifier;
  private SchoolDataIdentifier workspaceIdentifier;
  private SchoolDataIdentifier roleIdentifier;
  private OffsetDateTime enrolmentTime;
}
