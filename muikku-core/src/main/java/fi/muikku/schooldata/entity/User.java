package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface User {

	public String getIdentifier();
	
	public String getFirstName();
	
	public void setFirstName(String firstName);

	public String getLastName();

	public void setLastName(String lastName);

}