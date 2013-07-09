package fi.muikku.schooldata;

import java.util.List;

import fi.muikku.schooldata.entity.Workspace;

public interface WorkspaceSchoolDataBridge {
	
	/**
	 * Returns school data source identifier
	 * 
	 * @return school data source identifier
	 */
	public String getSchoolDataSource();

	public Workspace createWorkspace(String name) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	public Workspace findWorkspace(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	public List<Workspace> listWorkspaces() throws UnexpectedSchoolDataBridgeException;
	
	public Workspace updateWorkspace(Workspace workspace) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	public void removeWorkspace(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
}