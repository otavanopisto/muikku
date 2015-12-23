package fi.muikku.schooldata.entity;

import fi.muikku.schooldata.SchoolDataIdentifier;

public interface UserPhoneNumber extends SchoolDataEntity {
	
	public SchoolDataIdentifier getUserIdentifier();

	public String getNumber();
	
	public void setNumber(String number);
	
}