package fi.muikku.plugins.schooldatamock.entities;

import fi.muikku.plugins.schooldatamock.SchoolDataMockPluginDescriptor;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.RoleType;

public class MockedRole implements Role {

	public MockedRole(String identifier, String name, RoleType type) {
		this.identifier = identifier;
		this.name = name;
		this.type = type;
	}

	@Override
	public String getSchoolDataSource() {
		return SchoolDataMockPluginDescriptor.SCHOOL_DATA_SOURCE;
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
