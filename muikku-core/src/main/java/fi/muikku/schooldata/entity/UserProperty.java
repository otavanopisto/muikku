package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface UserProperty extends SchoolDataEntity {
	
	public String getUserIdentifier();
	
	public String getKey();
	
	public String getValue();

}