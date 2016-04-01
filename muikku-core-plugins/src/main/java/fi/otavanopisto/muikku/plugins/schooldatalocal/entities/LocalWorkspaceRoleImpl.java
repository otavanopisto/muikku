package fi.otavanopisto.muikku.plugins.schooldatalocal.entities;

import fi.otavanopisto.muikku.plugins.schooldatalocal.LocalUserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceRole;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceRoleArchetype;

public class LocalWorkspaceRoleImpl implements WorkspaceRole {

	public LocalWorkspaceRoleImpl(String identifier, String name, WorkspaceRoleArchetype archetype) {
		this.identifier = identifier;
		this.name = name;
		this.archetype = archetype;
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
