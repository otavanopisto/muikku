package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.search.annotations.IndexId;
import fi.otavanopisto.muikku.search.annotations.Indexable;

@Indexable (name = "UserGroup")
public interface UserGroup extends SchoolDataEntity {
	
	public String getIdentifier();
	
	public String getName();
	
  @IndexId
  public String getSearchId();
	
}