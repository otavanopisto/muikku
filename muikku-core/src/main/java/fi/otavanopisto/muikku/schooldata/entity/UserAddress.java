package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface UserAddress extends SchoolDataEntity {
	
	public SchoolDataIdentifier getUserIdentifier();

	public String getStreet();
	
	public void setStreet(String streeat);
	
	public String getPostalCode();
	
	public void setPostalCode(String postalCode);
	
	public String getCity();
	
	public void setCity(String city);
	
	public String getRegion();
	
	public void setRegion(String region);
	
	public String getCountry();
	
	public void setCountry(String country);
  
  public String getType();
  
  public Boolean getDefaultAddress();
	
}