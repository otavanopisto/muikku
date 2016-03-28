package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceRole;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceRoleArchetype;

public class PyramusWorkspaceRole implements WorkspaceRole {

	public PyramusWorkspaceRole(String identifier, String name, WorkspaceRoleArchetype archetype) {
		this.identifier = identifier;
		this.name = name;
		this.archetype = archetype;
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
	public String getName() {
		return name;
	}

  @Override
  public WorkspaceRoleArchetype getArchetype() {
    return archetype;
  }

	private String identifier;

	private String name;
	
	private WorkspaceRoleArchetype archetype;
}
