package fi.muikku.schooldata.entity;

public interface User extends SchoolDataEntity {
	
	public String getIdentifier();
	
	public String getFirstName();
	
	public void setFirstName(String firstName);

	public String getLastName();

	public void setLastName(String lastName);
	
	public String getDisplayName();

}