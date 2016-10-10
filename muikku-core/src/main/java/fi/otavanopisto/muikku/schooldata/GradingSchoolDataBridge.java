package fi.otavanopisto.muikku.schooldata;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.schooldata.entity.AssessmentRequest;
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

  public GradingScale findGradingScale(String identifier);

  public List<GradingScale> listGradingScales() throws SchoolDataBridgeInternalException;

  /* GradingScaleItems */

  public GradingScaleItem findGradingScaleItem(String gradingScaleIdentifier, String identifier);

  public List<GradingScaleItem> listGradingScaleItems(String gradingScaleIdentifier);

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
      String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String verbalAssessment, Date date);

  /**
   * Finds a workspace assessment
   * 
   * @param identifier
   *          identifier of workspace assessment
   * @param schoolDataSource
   *          school data source of workspace assessment
   * @return found workspace assessment or null of non found
   */
  public WorkspaceAssessment findWorkspaceAssessment(String identifier, String WorkspaceIdentifier, String studentIdentifier);

  /**
   * Lists workspace assesments by workspace and student
   * 
   * @param workspaceIdentifier
   *        identifier of the workspace
   * @param studentIdentifier
   *        identifier of student
   * @return list of workspace assessments (empty if not found)
   */
  public List<WorkspaceAssessment> listWorkspaceAssessments(String workspaceIdentifier, String studentIdentifier);
  
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
      String gradeSchoolDataSource, String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String verbalAssessment, Date date);

  public void deleteWorkspaceAssessment(SchoolDataIdentifier workspaceIdentifier,
      SchoolDataIdentifier studentIdentifier, SchoolDataIdentifier workspaceAssesmentIdentifier);

  public WorkspaceAssessmentRequest createWorkspaceAssessmentRequest(String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier,
      String studentIdentifier, String requestText, Date date);

  public WorkspaceAssessmentRequest findWorkspaceAssessmentRequest(String identifier, String workspaceIdentifier, String studentIdentifier);

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String workspaceIdentifier);

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String workspaceIdentifier, String studentIdentifier);

  public List<WorkspaceAssessmentRequest> listAssessmentRequestsByStudent(String studentIdentifier);
  
  public List<AssessmentRequest> listAssessmentRequestsByStaffMember(String staffMemberIdentifier);
  
  public WorkspaceAssessmentRequest updateWorkspaceAssessmentRequest(String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource,
      String workspaceIdentifier, String studentIdentifier, String requestText, Date date);

  public void deleteWorkspaceAssessmentRequest(String identifier, String workspaceIdentifier, String studentIdentifier);
  
  public List<TransferCredit> listStudentTransferCredits(SchoolDataIdentifier studentIdentifier);

}