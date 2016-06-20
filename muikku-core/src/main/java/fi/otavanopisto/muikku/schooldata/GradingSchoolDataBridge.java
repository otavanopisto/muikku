package fi.otavanopisto.muikku.schooldata;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.TransferCredit;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;

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

  public GradingScaleItem findGradingScaleItem(String gradingScaleIdentifier, String identifier) throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException;

  public List<GradingScaleItem> listGradingScaleItems(String gradingScaleIdentifier) throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException;

  /* Workspace Assessments */

  /**
   * Creates new workspace assessment
   * 
   * @param workspaceUserIdentifier
   *          identifier of student to be assessed
   * @param workspaceUserSchoolDataSource
   *          school data source of student to be assessed
   * @param assessingUserIdentifier
   *          identifier of assessing user
   * @param assessingUserSchoolDataSource
   *          school data source of assessing user
   * @param gradeIdentifier
   *          identifier of grade
   * @param gradeSchoolDataSource
   *          school data source of grade
   * @param verbalAssessment
   *          verbal assessment
   * @param date
   *          assessment date
   * @return created workspace assessment
   */
  public WorkspaceAssessment createWorkspaceAssessment(String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String WorkspaceIdentifier,
      String studentIdentifier, String assessingUserIdentifier, String assessingUserSchoolDataSource, String gradeIdentifier, String gradeSchoolDataSource,
      String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String verbalAssessment, Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

  /**
   * Finds a workspace assessment
   * 
   * @param identifier
   *          identifier of workspace assessment
   * @param schoolDataSource
   *          school data source of workspace assessment
   * @return found workspace assessment or null of non found
   */
  public WorkspaceAssessment findWorkspaceAssessment(String identifier, String WorkspaceIdentifier, String studentIdentifier)
      throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

  /**
   * Lists workspace assesments by workspace and student
   * 
   * @param workspaceIdentifier
   *        identifier of the workspace
   * @param studentIdentifier
   *        identifier of student
   * @return list of workspace assessments (empty if not found)
   */
  public List<WorkspaceAssessment> listWorkspaceAssessments(String workspaceIdentifier, String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
  
  /**
   * Updates a workspace assessment
   * 
   * @param identifier
   *          identifier of workspace assessment
   * @param schoolDataSource
   *          school data source of workspace assessment
   * @param workspaceUserIdentifier
   *          identifier of student to be assessed
   * @param workspaceUserSchoolDataSource
   *          school data source of student to be assessed
   * @param assessingUserIdentifier
   *          identifier of assessing user
   * @param assessingUserSchoolDataSource
   *          school data source of assessing user
   * @param gradeIdentifier
   *          identifier of grade
   * @param gradeSchoolDataSource
   *          school data source of grade
   * @param verbalAssessment
   *          verbal assessment
   * @param date
   *          assessment date
   * @return updated workspace assessment
   */
  public WorkspaceAssessment updateWorkspaceAssessment(String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource,
      String workspaceIdentifier, String studentIdentifier, String assessingUserIdentifier, String assessingUserSchoolDataSource, String gradeIdentifier,
      String gradeSchoolDataSource, String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String verbalAssessment, Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

  public void deleteWorkspaceAssessment(SchoolDataIdentifier workspaceIdentifier,
      SchoolDataIdentifier studentIdentifier, SchoolDataIdentifier workspaceAssesmentIdentifier);

  public WorkspaceAssessmentRequest createWorkspaceAssessmentRequest(String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier,
      String studentIdentifier, String requestText, Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

  public WorkspaceAssessmentRequest findWorkspaceAssessmentRequest(String identifier, String workspaceIdentifier, String studentIdentifier)
      throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String workspaceIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String workspaceIdentifier, String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

  public List<WorkspaceAssessmentRequest> listAssessmentRequestsByStudent(String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
  
  public WorkspaceAssessmentRequest updateWorkspaceAssessmentRequest(String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource,
      String workspaceIdentifier, String studentIdentifier, String requestText, Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;

  public void deleteWorkspaceAssessmentRequest(String identifier, String workspaceIdentifier, String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException;
  
  public List<TransferCredit> listStudentTransferCredits(SchoolDataIdentifier studentIdentifier);

}