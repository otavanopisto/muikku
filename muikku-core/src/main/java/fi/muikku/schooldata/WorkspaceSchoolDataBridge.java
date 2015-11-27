package fi.muikku.schooldata;

import java.util.List;

import fi.muikku.schooldata.entity.User;
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

	public Workspace createWorkspace(String name, String description, WorkspaceType type, String courseIdentifierIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	public Workspace findWorkspace(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	public List<Workspace> listWorkspaces() throws UnexpectedSchoolDataBridgeException;

	public List<Workspace> listWorkspacesByCourseIdentifier(String courseIdentifierIdentifier) throws UnexpectedSchoolDataBridgeException;

	public Workspace updateWorkspace(Workspace workspace) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	public void removeWorkspace(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/* Workspace Types */
	
	public WorkspaceType findWorkspaceType(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	public List<WorkspaceType> listWorkspaceTypes() throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/* Workspace Users */

  public WorkspaceUser createWorkspaceUser(Workspace workspace, User user, String roleSchoolDataSource, String roleIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	public WorkspaceUser findWorkspaceUser(String workspaceIdentifier, String workspaceSchoolDataSource, String userIdentifier) throws UnexpectedSchoolDataBridgeException;
	
	@Deprecated
	public List<WorkspaceUser> listWorkspaceUsers(String workspaceIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	public List<WorkspaceUser> listWorkspaceStaffMembers(String workspaceIdentifier);
	public List<WorkspaceUser> listWorkspaceStudents(String workspaceIdentifier, boolean active);
	public void updateWorkspaceStudentActivity(WorkspaceUser workspaceUser, boolean active);


}