package fi.muikku.plugins.schooldatalocal.entities;

import fi.muikku.plugins.schooldatalocal.LocalUserSchoolDataController;
import fi.muikku.schooldata.entity.EnvironmentRole;
import fi.muikku.schooldata.entity.EnvironmentRoleArchetype;

public class LocalEnvironmentRoleImpl implements EnvironmentRole {

	public LocalEnvironmentRoleImpl(String identifier, EnvironmentRoleArchetype archetype, String name) {
		this.identifier = identifier;
		this.archetype = archetype;
		this.name = name;
	}
	
	@Override
	public String getSchoolDataSource() {
		return LocalUserSchoolDataController.SCHOOL_DATA_SOURCE;
	}
	
	@Override
	public String getIdentifier() {
		return identifier;
	}

  @Override
  public EnvironmentRoleArchetype getArchetype() {
    return archetype;
  }

	@Override
	public String getName() {
		return name;
	}
  
	private String identifier;
  private EnvironmentRoleArchetype archetype;
	private String name;
}
