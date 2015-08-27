package fi.muikku.schooldata.entity;

public interface GroupUser extends SchoolDataEntity {
	
	public String getIdentifier();

	public String getUserIdentifier();
	
	public String getUserSchoolDataSource();
	
	/*public String getGroupIdentifier();
	
	public String getGroupSchoolDataSource(); TODO: needed? */
	
}