package fi.otavanopisto.muikku.schooldata.entity;

import java.util.Date;

public interface WorkspaceAssessmentRequest extends SchoolDataEntity {
	
  /**
   * Returns identifier of workspace assessment request
   * 
   * @return identifier of workspace assessment request
   */
	public String getIdentifier();
	
	/**
   * Returns school data source of workspace assessment request 
   * 
   * @return school data source of workspace assessment request
   */
  public String getSchoolDataSource();
	
  /**
   * Returns identifier of workspace user
   * 
   * @return identifier of workspace user
   */
	public String getWorkspaceUserIdentifier();

	/**
   * Returns school data source of workspace user
   * 
   * @return school data source of workspace user
   */
	public String getWorkspaceUserSchoolDataSource();
  
	/**
	 * Returns request text
	 * 
	 * @return request text
	 */
  public String getRequestText();
  
  /**
   * Returns assessment request date
   * 
   * @return assessment request date
   */
  public Date getDate();

  /**
   * Returns assessment request archived flag
   * 
   * @return assessment request archived flag
   */
  public Boolean getArchived();

  /**
   * Returns assessment request handled flag
   * 
   * @return assessment request handled flag
   */
  public Boolean getHandled();
  
}