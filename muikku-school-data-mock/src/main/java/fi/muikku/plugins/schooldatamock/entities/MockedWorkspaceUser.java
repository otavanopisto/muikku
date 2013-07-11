package fi.muikku.plugins.schooldatamock.entities;

import fi.muikku.plugins.schooldatamock.SchoolDataMockPluginDescriptor;
import fi.muikku.schooldata.entity.WorkspaceUser;

public class MockedWorkspaceUser implements WorkspaceUser {

	public MockedWorkspaceUser(String identifier, String workspaceIdentifier, String userIdentifier) {
		this.identifier = identifier;
		this.workspaceIdentifier = workspaceIdentifier;
		this.userIdentifier = userIdentifier;
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
	public String getUserIdentifier() {
		return userIdentifier;
	}
	
	@Override
	public String getUserSchoolDataSource() {
		return getSchoolDataSource();
	}

	@Override
	public String getWorkspaceIdentifier() {
		return workspaceIdentifier;
	}

	@Override
	public String getWorkspaceSchoolDataSource() {
		return getSchoolDataSource();
	}

	private String identifier;
	private String workspaceIdentifier;
	private String userIdentifier;
}
