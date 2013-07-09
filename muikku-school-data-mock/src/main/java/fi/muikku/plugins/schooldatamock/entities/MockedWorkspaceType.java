package fi.muikku.plugins.schooldatamock.entities;

import fi.muikku.plugins.schooldatamock.SchoolDataMockPluginDescriptor;
import fi.muikku.schooldata.entity.WorkspaceType;

public class MockedWorkspaceType implements WorkspaceType {
	
	public MockedWorkspaceType(String identifier, String name) {
		this.identifier = identifier;
		this.name = name;
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
	public String getName() {
		return name;
	}
	
	private String identifier;
	private String name;
}
