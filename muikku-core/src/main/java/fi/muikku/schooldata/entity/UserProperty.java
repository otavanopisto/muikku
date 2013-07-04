package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface UserProperty extends SchoolDataEntity {
	
	public String getIdentifier();

	public String getUserIdentifier();
	
	public String getKey();
	
	public String getValue();

	public void setValue(String value);
}