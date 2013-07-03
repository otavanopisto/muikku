package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface UserAddress {
	
	public String getUserIdentifier();

	public String getStreet();
	
	public String getPostalCode();
	
	public String getCity();
	
	public String getRegion();
	
	public String getCountry();
	
}