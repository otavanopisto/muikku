package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface GroupUser extends SchoolDataEntity {
	
	public String getIdentifier();

	public String getUserIdentifier();
	
	public String getUserSchoolDataSource();
	
	public String getGroupIdentifier();
	
	public String getGroupSchoolDataSource();
	
}