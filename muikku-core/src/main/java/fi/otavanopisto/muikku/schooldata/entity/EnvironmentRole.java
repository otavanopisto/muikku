package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;

public interface EnvironmentRole extends Role {

  public EnvironmentRoleArchetype getArchetype();
  
}
