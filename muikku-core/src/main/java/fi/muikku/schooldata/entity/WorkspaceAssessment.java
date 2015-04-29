package fi.muikku.schooldata.entity;

import java.util.Date;

public interface WorkspaceAssessment extends SchoolDataEntity {
	
  /**
   * Returns identifier of workspace assessment 
   * 
   * @return identifier of workspace assessment
   */
	public String getIdentifier();
	
	/**
   * Returns school data source of workspace assessment 
   * 
   * @return school data source of workspace assessment
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
	 * Returns identifier of assessing user
	 * 
	 * @return identifier of assessing user
	 */
  public String getAssessingUserIdentifier();
  
  /**
   * Returns school data source of assessing user
   * 
   * @return school data source of assessing user
   */
  public String getAssessingUserSchoolDataSource();
	
  /**
   * Returns identifier of grade
   * 
   * @return identifier of grade
   */
	public String getGradeIdentifier();
	
	/**
   * Returns school data source of grade
   * 
   * @return school data source of grade
   */
  public String getGradeSchoolDataSource();
  
	/**
	 * Returns verbal assessment
	 * 
	 * @return verbal assessment
	 */
  public String getVerbalAssessment();
  
  /**
   * Returns assessment date
   * 
   * @return assessment date
   */
  public Date getDate();
	
}