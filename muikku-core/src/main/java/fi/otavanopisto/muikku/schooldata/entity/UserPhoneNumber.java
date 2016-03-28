package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface UserPhoneNumber extends SchoolDataEntity {
	
	public SchoolDataIdentifier getUserIdentifier();

	public String getNumber();
	
	public void setNumber(String number);
	
	public String getType();
	
	public Boolean getDefaultNumber();
	
}