package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface WorkspaceUser extends SchoolDataEntity {
	
	public String getIdentifier();

	public String getUserIdentifier();
	
	public String getUserSchoolDataSource();
	
	public String getWorkspaceIdentifier();
	
	public String getWorkspaceSchoolDataSource();
	
}