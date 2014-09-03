package fi.muikku.schooldata.entity;

public interface UserEmail extends SchoolDataEntity {

	public String getIdentifier();
	
	public String getUserIdentifier();
	
	public String getAddress();
	
	public void setAddress(String address);
	
}