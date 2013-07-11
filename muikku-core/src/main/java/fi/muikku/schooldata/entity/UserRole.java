package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface UserRole extends SchoolDataEntity {

	public String getIdentifier();
	
	public String getUserIdentifier();
	
	public String getRoleIdentifier();
	
}