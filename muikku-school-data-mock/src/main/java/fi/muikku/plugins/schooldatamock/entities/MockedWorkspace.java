package fi.muikku.plugins.schooldatamock.entities;

import fi.muikku.plugins.schooldatamock.SchoolDataMockPluginDescriptor;
import fi.muikku.schooldata.entity.Workspace;

public class MockedWorkspace implements Workspace {
	
	public MockedWorkspace(String identifier, String name, String workspaceTypeId, String courseIdentifierIdentifier) {
		this.identifier = identifier;
		this.name = name;
		this.workspaceTypeId = workspaceTypeId;
		this.courseIdentifierIdentifier = courseIdentifierIdentifier;
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
	
	@Override
	public String getWorkspaceTypeId() {
		return workspaceTypeId;
	}
	
	@Override
	public String getCourseIdentifierIdentifier() {
		return courseIdentifierIdentifier;
	}
	
	private String identifier;
	private String name;
	private String workspaceTypeId;
	private String courseIdentifierIdentifier;
}
