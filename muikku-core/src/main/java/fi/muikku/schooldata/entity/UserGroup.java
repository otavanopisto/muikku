package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface UserGroup extends SchoolDataEntity {
	
	public String getIdentifier();
	
	public String getName();
	
}