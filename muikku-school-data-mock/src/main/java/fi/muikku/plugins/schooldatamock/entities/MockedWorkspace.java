package fi.muikku.plugins.schooldatamock.entities;

import fi.muikku.plugins.schooldatamock.SchoolDataMockPluginDescriptor;
import fi.muikku.schooldata.entity.Workspace;

public class MockedWorkspace implements Workspace {
	
	public MockedWorkspace(String identifier, String name) {
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
	
	@Override
	public void setName(String name) {
		this.name = name;
	}

	private String identifier;
	private String name;
	
}
