package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface UserEmail extends SchoolDataEntity {

	public SchoolDataIdentifier getIdentifier();
	
	public SchoolDataIdentifier getUserIdentifier();
	
	public String getAddress();
	
	public void setAddress(String address);
  
  public String getType();
  
  public Boolean getDefaultAddress();
	
}