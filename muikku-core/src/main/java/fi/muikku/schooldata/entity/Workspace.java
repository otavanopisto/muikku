package fi.muikku.schooldata.entity;

import java.util.Date;

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
	
}