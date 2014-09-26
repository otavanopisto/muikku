package fi.muikku.schooldata.entity;

public interface Role extends SchoolDataEntity {

	public String getIdentifier();
	
	public String getName();
	
	public RoleType getType();
	
}