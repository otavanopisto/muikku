package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface Role extends SchoolDataEntity {

	public String getIdentifier();
	
	public String getName();
	
	public UserRoleType getType();
	
}