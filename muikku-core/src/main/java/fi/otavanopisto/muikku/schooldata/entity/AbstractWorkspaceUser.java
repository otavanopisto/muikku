package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractWorkspaceUser implements WorkspaceUser {

  public AbstractWorkspaceUser(SchoolDataIdentifier identifier, SchoolDataIdentifier userIdentifier, SchoolDataIdentifier workspaceIdentifier,
      WorkspaceRoleArchetype role, OffsetDateTime enrolmentTime) {
    super();
    this.identifier = identifier;
    this.userIdentifier = userIdentifier;
    this.workspaceIdentifier = workspaceIdentifier;
    this.role = role;
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
  public OffsetDateTime getEnrolmentTime() {
    return enrolmentTime;
  }

  @Override
  public WorkspaceRoleArchetype getRoleArchetype() {
    return role;
  }

  private SchoolDataIdentifier identifier;
  private SchoolDataIdentifier userIdentifier;
  private SchoolDataIdentifier workspaceIdentifier;
  private WorkspaceRoleArchetype role;
  private OffsetDateTime enrolmentTime;
}
