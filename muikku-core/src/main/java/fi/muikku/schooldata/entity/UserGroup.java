package fi.muikku.schooldata.entity;

import fi.muikku.search.annotations.IndexId;
import fi.muikku.search.annotations.Indexable;

@Indexable (name = "UserGroup")
public interface UserGroup extends SchoolDataEntity {
	
	public String getIdentifier();
	
	public String getName();
	
  @IndexId
  public String getSearchId();
	
}