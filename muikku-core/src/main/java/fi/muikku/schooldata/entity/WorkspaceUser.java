package fi.muikku.schooldata.entity;

public interface WorkspaceUser extends SchoolDataEntity {
	
	public String getIdentifier();

	public String getUserIdentifier();
	
	public String getUserSchoolDataSource();
	
	public String getWorkspaceIdentifier();
	
	public String getWorkspaceSchoolDataSource();
	
	public String getRoleSchoolDataSource();
	
	public String getRoleIdentifier();
	
}