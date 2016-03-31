package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractWorkspaceType implements WorkspaceType {
  
  public AbstractWorkspaceType() {
  }

  public AbstractWorkspaceType(SchoolDataIdentifier identifier, String name) {
    this.identifier = identifier;
    this.name = name;
  }
  
  @Override
  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  @Override
  public String getName() {
    return name;
  }
  
  private SchoolDataIdentifier identifier;
  private String name;
}
