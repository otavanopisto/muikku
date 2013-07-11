package fi.muikku.schooldata;

import java.util.List;

import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceType;
import fi.muikku.schooldata.entity.WorkspaceUser;

public interface WorkspaceSchoolDataBridge {
	
	/**
	 * Returns school data source identifier
	 * 
	 * @return school data source identifier
	 */
	public String getSchoolDataSource();
	
	/* Workspaces */

	public Workspace createWorkspace(String name, WorkspaceType type) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	public Workspace findWorkspace(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	public List<Workspace> listWorkspaces() throws UnexpectedSchoolDataBridgeException;
	
	public Workspace updateWorkspace(Workspace workspace) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	public void removeWorkspace(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/* Workspace Types */
	
	public WorkspaceType findWorkspaceType(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	public List<WorkspaceType> listWorkspaceTypes() throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/* Workspace Users */
	
	public List<WorkspaceUser> listWorkspaceUsers() throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
}