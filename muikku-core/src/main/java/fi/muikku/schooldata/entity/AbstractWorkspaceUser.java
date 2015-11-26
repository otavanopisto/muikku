package fi.muikku.schooldata.entity;

import fi.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractWorkspaceUser implements WorkspaceUser {

  public AbstractWorkspaceUser(SchoolDataIdentifier identifier, SchoolDataIdentifier userIdentifier, SchoolDataIdentifier workspaceIdentifier,
      SchoolDataIdentifier roleIdentifier, Boolean active) {
    super();
    this.identifier = identifier;
    this.userIdentifier = userIdentifier;
    this.workspaceIdentifier = workspaceIdentifier;
    this.roleIdentifier = roleIdentifier;
    this.active = active;
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
  public Boolean getActive() {
    return active;
  }

  private SchoolDataIdentifier identifier;
  private SchoolDataIdentifier userIdentifier;
  private SchoolDataIdentifier workspaceIdentifier;
  private SchoolDataIdentifier roleIdentifier;
  private Boolean active;
}
