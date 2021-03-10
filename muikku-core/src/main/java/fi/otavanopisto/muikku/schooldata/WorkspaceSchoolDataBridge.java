package fi.otavanopisto.muikku.schooldata;

import java.util.List;
import java.util.Set;

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

  public Workspace createWorkspace(String name, String description, WorkspaceType type, String courseIdentifierIdentifier);

  public Workspace copyWorkspace(SchoolDataIdentifier sourceWorkspaceIdentifier, String name, String nameExtension, String description, SchoolDataIdentifier destinationOrganizationIdentifier);

  public Workspace findWorkspace(String identifier);

  public List<Workspace> listWorkspaces();

  public List<Workspace> listWorkspacesByCourseIdentifier(String courseIdentifierIdentifier);

  public Workspace updateWorkspace(Workspace workspace);
  
  public void removeWorkspace(String identifier);
  
  /* Workspace Types */
  
  public WorkspaceType findWorkspaceType(String identifier);

  public List<WorkspaceType> listWorkspaceTypes();
  
  /* Workspace Users */

  public WorkspaceUser createWorkspaceUser(Workspace workspace, User user, String roleSchoolDataSource, String roleIdentifier);
  
  public WorkspaceUser findWorkspaceUser(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier workspaceUserIdentifier);
  
  public WorkspaceUser findWorkspaceUserByWorkspaceAndUser(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier userIdentifier);
  
  @Deprecated
  public List<WorkspaceUser> listWorkspaceUsers(String workspaceIdentifier);
  
  public List<WorkspaceUser> listWorkspaceStaffMembers(String workspaceIdentifier);
  public List<WorkspaceUser> listWorkspaceStudents(String workspaceIdentifier);
  public List<WorkspaceUser> listWorkspaceStudents(String workspaceIdentifier, boolean active);
  public void updateWorkspaceStudentActivity(WorkspaceUser workspaceUser, boolean active);

  public void addWorkspaceSignupGroup(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier userGroupIdentifier);
  public void removeWorkspaceSignupGroup(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier userGroupIdentifier);
  public Set<SchoolDataIdentifier> listWorkspaceSignupGroups(SchoolDataIdentifier workspaceIdentifier);

}