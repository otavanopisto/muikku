package fi.otavanopisto.muikku.schooldata;

import java.util.List;

import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceType;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;

public interface WorkspaceSchoolDataBridge {
	
	/**
	 * Returns school data source identifier
	 * 
	 * @return school data source identifier
	 */
	public String getSchoolDataSource();
	
	/* Workspaces */

	public Workspace createWorkspace(String name, String description, WorkspaceType type, String courseIdentifierIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

	public Workspace copyWorkspace(SchoolDataIdentifier identifier, String name, String nameExtension, String description);

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
	
	public WorkspaceUser findWorkspaceUser(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier workspaceUserIdentifier) throws UnexpectedSchoolDataBridgeException;
	
	public WorkspaceUser findWorkspaceUserByWorkspaceAndUser(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier userIdentifier);
	
	@Deprecated
	public List<WorkspaceUser> listWorkspaceUsers(String workspaceIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	public List<WorkspaceUser> listWorkspaceStaffMembers(String workspaceIdentifier);
  public List<WorkspaceUser> listWorkspaceStudents(String workspaceIdentifier);
	public List<WorkspaceUser> listWorkspaceStudents(String workspaceIdentifier, boolean active);
	public void updateWorkspaceStudentActivity(WorkspaceUser workspaceUser, boolean active);



}