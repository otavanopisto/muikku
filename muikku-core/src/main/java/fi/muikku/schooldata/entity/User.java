package fi.muikku.schooldata.entity;

import fi.muikku.search.annotations.IndexId;
import fi.muikku.search.annotations.Indexable;

@Indexable
public interface User extends SchoolDataEntity {
	
	public String getIdentifier();
	
	public String getFirstName();
	
	public void setFirstName(String firstName);

	public String getLastName();

	public void setLastName(String lastName);
	
	public String getDisplayName();

  @IndexId
	public String getSearchId();

}