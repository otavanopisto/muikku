package fi.muikku.plugins.schooldatapyramus.entities;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.entity.WorkspaceUser;

public class PyramusWorkspaceUser implements WorkspaceUser {

	public PyramusWorkspaceUser(String identifier, String workspaceSchoolDataSource, String workspaceIdentifier, String userSchoolDataSource, String userIdentifier, String roleSchoolDataSource, String roleIdentifier) {
		this.identifier = identifier;
		this.workspaceSchoolDataSource = workspaceSchoolDataSource;
		this.workspaceIdentifier = workspaceIdentifier;
		this.userSchoolDataSource = userSchoolDataSource;
		this.userIdentifier = userIdentifier;
	  this.roleIdentifier = roleIdentifier;
	  this.roleSchoolDataSource = roleSchoolDataSource;
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
	public String getUserIdentifier() {
		return userIdentifier;
	}
	
	@Override
	public String getUserSchoolDataSource() {
		return userSchoolDataSource;
	}

	@Override
	public String getWorkspaceIdentifier() {
		return workspaceIdentifier;
	}

	@Override
	public String getWorkspaceSchoolDataSource() {
		return workspaceSchoolDataSource;
	}

	@Override
	public String getRoleIdentifier() {
	  return roleIdentifier;
	}
	
	@Override
	public String getRoleSchoolDataSource() {
	  return roleSchoolDataSource;
	}
	
	private String identifier;
	private String workspaceIdentifier;
	private String workspaceSchoolDataSource;
	private String userIdentifier;
	private String userSchoolDataSource;
  private String roleIdentifier;
  private String roleSchoolDataSource;
}
