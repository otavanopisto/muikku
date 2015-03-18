package fi.muikku.schooldata.entity;

import java.util.Date;

import fi.muikku.search.annotations.IndexId;
import fi.muikku.search.annotations.Indexable;

@Indexable
public interface Workspace extends SchoolDataEntity {
	
	public String getIdentifier();
	
	public String getName();
	
	public void setName(String name);
	
  public String getDescription();
  
  public void setDescription(String description);
  
  // TODO: public String getWorkspaceTypeDataSource();
	
	public String getWorkspaceTypeId();
	
  // TODO: public String getCourseIdentifierDataSource();
	
	public String getCourseIdentifierIdentifier();
	
	public Date getLastModified();
	
	public String getSubjectIdentifier();
	
	public String getEducationTypeIdentifier();
	
	public Double getLength();
	
	public String getLengthUnitIdentifier();
  
  @IndexId
	public String getSearchId();
	
}