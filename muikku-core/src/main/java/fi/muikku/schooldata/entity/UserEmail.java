package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface UserEmail {

	public String getIdentifier();
	
	public String getUserIdentifier();
	
	public String getAddress();
	
}