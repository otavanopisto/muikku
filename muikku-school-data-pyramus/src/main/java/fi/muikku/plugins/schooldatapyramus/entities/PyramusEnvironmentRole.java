package fi.muikku.plugins.schooldatapyramus.entities;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.entity.EnvironmentRole;
import fi.muikku.schooldata.entity.EnvironmentRoleArchetype;

public class PyramusEnvironmentRole implements EnvironmentRole {

	public PyramusEnvironmentRole(String identifier, EnvironmentRoleArchetype archetype, String name) {
		this.identifier = identifier;
    this.archetype = archetype;
		this.name = name;
	}

	@Override
	public String getSchoolDataSource() {
		return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
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
