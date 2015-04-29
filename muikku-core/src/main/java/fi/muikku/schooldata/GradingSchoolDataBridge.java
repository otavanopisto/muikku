package fi.muikku.schooldata;

import java.util.Date;
import java.util.List;

import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;
import fi.muikku.schooldata.entity.WorkspaceAssessment;

public interface GradingSchoolDataBridge {
	
	/**
	 * Returns school data source identifier
	 * 
	 * @return school data source identifier
	 */
	public String getSchoolDataSource();
	
	/* GradingScales */
	
	public GradingScale findGradingScale(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	public List<GradingScale> listGradingScales() throws UnexpectedSchoolDataBridgeException;
	
	/* GradingScaleItems */
	
	public GradingScaleItem findGradingScaleItem(String gradingScaleIdentifier, String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	public List<GradingScaleItem> listGradingScaleItems(String gradingScaleIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
	
	/* Workspace Assessments */
	
	/**
	 * Creates new workspace assessment 
	 * 
	 * @param workspaceUserIdentifier identifier of student to be assessed
	 * @param workspaceUserSchoolDataSource school data source of student to be assessed
	 * @param assessingUserIdentifier identifier of assessing user
	 * @param assessingUserSchoolDataSource school data source of assessing user
	 * @param gradeIdentifier identifier of grade
	 * @param gradeSchoolDataSource school data source of grade 
	 * @param verbalAssessment verbal assessment
	 * @param date assessment date
	 * @return created workspace assessment
	 */
	public WorkspaceAssessment createWorkspaceAssessment(String workspaceUserIdentifier, String workspaceUserSchoolDataSource,
	    String assessingUserIdentifier, String assessingUserSchoolDataSource,
	    String gradeIdentifier, String gradeSchoolDataSource,
	    String verbalAssessment, Date date);
	
	/**
	 * Finds a workspace assessment
	 * 
	 * @param identifier identifier of workspace assessment
	 * @param schoolDataSource school data source of workspace assessment
	 * @return found workspace assessment or null of non found
	 */
	public WorkspaceAssessment findWorkspaceAssessment(String identifier, String schoolDataSource);
	
	/**
	 * Updates a workspace assessment
	 * 
   * @param identifier identifier of workspace assessment
   * @param schoolDataSource school data source of workspace assessment
   * @param workspaceUserIdentifier identifier of student to be assessed
   * @param workspaceUserSchoolDataSource school data source of student to be assessed
   * @param assessingUserIdentifier identifier of assessing user
   * @param assessingUserSchoolDataSource school data source of assessing user
   * @param gradeIdentifier identifier of grade
   * @param gradeSchoolDataSource school data source of grade 
   * @param verbalAssessment verbal assessment
   * @param date assessment date
	 * @return updated workspace assessment
	 */
	public WorkspaceAssessment updateWorkspaceAssessment(String identifier, String schoolDataSource, 
	    String workspaceUserIdentifier, String workspaceUserSchoolDataSource,
	    String assessingUserIdentifier, String assessingUserSchoolDataSource,
	    String gradeIdentifier, String gradeSchoolDataSource,
	    String verbalAssessment, Date date);
	
}