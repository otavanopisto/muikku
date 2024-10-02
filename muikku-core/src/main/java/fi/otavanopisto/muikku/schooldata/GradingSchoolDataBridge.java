package fi.otavanopisto.muikku.schooldata;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.schooldata.entity.CompositeAssessmentRequest;
import fi.otavanopisto.muikku.schooldata.entity.CompositeGradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.TransferCredit;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceActivityInfo;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;

public interface GradingSchoolDataBridge {

  /**
   * Returns school data source identifier
   * 
   * @return school data source identifier
   */
  public String getSchoolDataSource();
  
  /* Grades */
  
  /**
   * Lists all available grades.
   * 
   * @return All available grades
   */
  public List<CompositeGradingScale> listCompositeGradingScales();

  /* GradingScales */

  public GradingScale findGradingScale(String identifier);

  public List<GradingScale> listGradingScales() throws SchoolDataBridgeInternalException;

  /* GradingScaleItems */

  public GradingScaleItem findGradingScaleItem(String gradingScaleIdentifier, String identifier);

  public List<GradingScaleItem> listGradingScaleItems(String gradingScaleIdentifier);

  /* Workspace activity */
  
  public WorkspaceActivityInfo listWorkspaceActivities(String studentIdentifier, String workspaceIdentifier, boolean includeTransferCredits);
  
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
      String workspaceSubjectIdentifier, String studentIdentifier, String assessingUserIdentifier, String assessingUserSchoolDataSource, String gradeIdentifier, String gradeSchoolDataSource,
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
   * Lists workspace assessments by workspace and student
   * 
   * @param workspaceIdentifier
   *        identifier of the workspace
   * @param studentIdentifier
   *        identifier of student
   * @return list of workspace assessments (empty if not found)
   */
  public List<WorkspaceAssessment> listWorkspaceAssessments(String workspaceIdentifier, String studentIdentifier);
  
  public List<WorkspaceAssessment> listAssessmentsByStudent(String studentIdentifier);
  
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
      String workspaceIdentifier, String workspaceSubjectIdentifier, String studentIdentifier, String assessingUserIdentifier, String assessingUserSchoolDataSource, String gradeIdentifier,
      String gradeSchoolDataSource, String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String verbalAssessment, Date date);

  public void deleteWorkspaceAssessment(SchoolDataIdentifier workspaceIdentifier,
      SchoolDataIdentifier studentIdentifier, SchoolDataIdentifier workspaceAssesmentIdentifier);

  public WorkspaceAssessmentRequest createWorkspaceAssessmentRequest(String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier,
      String studentIdentifier, String requestText, Date date);

  public WorkspaceAssessmentRequest findWorkspaceAssessmentRequest(String identifier, String workspaceIdentifier, String studentIdentifier);

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String workspaceIdentifier);

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String workspaceIdentifier, String studentIdentifier, Boolean archived);

  public List<WorkspaceAssessmentRequest> listAssessmentRequestsByStudent(String studentIdentifier);
  
  /**
   * Returns the most recent workspace assessment given to the student, or <code>null</code> if none exists.
   * 
   * @param studentIdentifier student identifier
   * 
   * @return the most recent workspace assessment given to the student, or <code>null</code> if none exists
   */
  public WorkspaceAssessment findLatestWorkspaceAssessmentByStudent(String studentIdentifier); 
  
  /**
   * Returns the most recent assessment request sent by the given student and workspace, or <code>null</code> if none exists.
   * 
   * @param studentIdentifier student identifier
   * 
   * @param workspaceIdentifier workspace identifier
   * 
   * @return the most recent assessment request sent by the given student and workspace, or <code>null</code> if none exists
   */
  public WorkspaceAssessmentRequest findLatestAssessmentRequestByWorkspaceAndStudent(String workspaceIdentifier, String studentIdentifier); 
  

  /**
   * Returns the most recent assessment request sent by the given student, or <code>null</code> if none exists.
   * 
   * @param studentIdentifier student identifier
   * 
   * @return the most recent assessment request sent by the given student, or <code>null</code> if none exists
   */
  public WorkspaceAssessmentRequest findLatestAssessmentRequestByStudent(String studentIdentifier); 
  
  /**
   * Returns all assessment requests associated with the given staff member. For example, assessment request of
   * a workspace that the staff member is teaching.  
   * 
   * @param staffMemberIdentifier Staff member identifier
   * 
   * @return All assessment requests associated with the given staff member
   */
  public List<CompositeAssessmentRequest> listCompositeAssessmentRequestsByStaffMember(String staffMemberIdentifier);

  /**
   * Returns all assessment requests associated with the given workspace, possibly filtered to match only the
   * givne workspace students.
   * 
   * @param workspaceIdentifier Workspace identifier
   * 
   * @return All assessment requests associated with the given workspace
   */
  public List<CompositeAssessmentRequest> listCompositeAssessmentRequestsByWorkspace(String workspaceIdentifier, List<String> workspaceStudentIdentifiers);
  
  public WorkspaceAssessmentRequest updateWorkspaceAssessmentRequest(String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource,
      String workspaceIdentifier, String studentIdentifier, String requestText, Date date, Boolean archived, Boolean handled);

  public WorkspaceAssessmentRequest updateWorkspaceAssessmentRequestLock(String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource,
      String workspaceIdentifier, String studentIdentifier, boolean locked);

  public void deleteWorkspaceAssessmentRequest(String identifier, String workspaceIdentifier, String studentIdentifier);
  
  public List<TransferCredit> listStudentTransferCredits(SchoolDataIdentifier studentIdentifier);

  public Long countStudentWorkspaceAssessments(String studentIdentifier, Date fromDate, Date toDate,
      boolean onlyPassingGrades);

}