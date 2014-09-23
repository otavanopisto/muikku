package fi.muikku.plugins.schooldatapyramus.entities;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.RoleType;

public class PyramusRole implements Role {

	public PyramusRole(String identifier, String name, RoleType type) {
		this.identifier = identifier;
		this.name = name;
		this.type = type;
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
	public RoleType getType() {
		return type;
	}
	
	@Override
	public String getName() {
		return name;
	}

	private String identifier;
	
	private RoleType type;

	private String name;
}
