package fi.otavanopisto.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.evaluation.dao.SupplementationRequestDAO;
import fi.otavanopisto.muikku.plugins.evaluation.dao.WorkspaceMaterialEvaluationDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequest;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.otavanopisto.muikku.plugins.workspace.ContentNode;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialException;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.servlet.BaseUrl;
import fi.otavanopisto.muikku.users.UserEntityController;

public class EvaluationController {

  @Inject
  @BaseUrl
  private String baseUrl;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;
  
  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private WorkspaceMaterialEvaluationDAO workspaceMaterialEvaluationDAO;

  @Inject
  private SupplementationRequestDAO supplementationRequestDAO;
  
  @Inject
  private GradingController gradingController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private LocaleController localeController;
  
  @Inject
  private CommunicatorController communicatorController;
  
  public SupplementationRequest createSupplementationRequest(Long userEntityId, Long studentEntityId, Long workspaceEntityId, Long workspaceMaterialId, Date requestDate, String requestText) {
    SupplementationRequest supplementationRequest = supplementationRequestDAO.createSupplementationRequest(
        userEntityId,
        studentEntityId,
        workspaceEntityId,
        workspaceMaterialId,
        requestDate,
        requestText);
    // For workspace supplementation requests, mark respective workspace assessment requests as handled 
    if (studentEntityId != null && workspaceEntityId != null) {
      markWorkspaceAssessmentRequestsAsHandled(studentEntityId, workspaceEntityId);      
    }
    handleSupplementationNotifications(supplementationRequest);    
    return supplementationRequest;
  }

  public WorkspaceMaterialEvaluation createWorkspaceMaterialEvaluation(UserEntity student, WorkspaceMaterial workspaceMaterial, GradingScale gradingScale, GradingScaleItem grade, UserEntity assessor, Date evaluated, String verbalAssessment) {
    WorkspaceMaterialEvaluation evaluation = workspaceMaterialEvaluationDAO.create(student.getId(), 
        workspaceMaterial.getId(),  
        gradingScale.getIdentifier(), 
        gradingScale.getSchoolDataSource(), 
        grade.getIdentifier(), 
        grade.getSchoolDataSource(), 
        assessor.getId(), 
        evaluated, 
        verbalAssessment);
    WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, student);
    WorkspaceMaterialReplyState state = grade.isPassingGrade() ? WorkspaceMaterialReplyState.PASSED : WorkspaceMaterialReplyState.FAILED;
    if (reply == null) {
      workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, state, student);
    }
    else {
      workspaceMaterialReplyController.updateWorkspaceMaterialReply(reply, state);
    }
    
    return evaluation;
  }
  
  public void deleteSupplementationRequest(SupplementationRequest supplementationRequest) {
    supplementationRequestDAO.archive(supplementationRequest);
  }

  public void deleteWorkspaceMaterialEvaluation(WorkspaceMaterialEvaluation evaluation) {
    if (evaluation != null) {
      workspaceMaterialEvaluationDAO.delete(evaluation);
    }
  }
  
  public SupplementationRequest findSupplementationRequestByStudentAndWorkspace(Long studentEntityId, Long workspaceEntityId) {
    return supplementationRequestDAO.findByStudentAndWorkspace(studentEntityId, workspaceEntityId);
  }

  public SupplementationRequest findSupplementationRequestByStudentAndWorkspaceAndArchived(Long studentEntityId, Long workspaceEntityId, Boolean archived) {
    return supplementationRequestDAO.findByStudentAndWorkspaceAndArchived(studentEntityId, workspaceEntityId, archived);
  }

  public SupplementationRequest findSupplementationRequestByStudentAndWorkspaceMaterial(Long studentEntityId, Long workspaceMaterialId) {
    return supplementationRequestDAO.findByStudentAndWorkspaceMaterial(studentEntityId, workspaceMaterialId);
  }

  public SupplementationRequest findSupplementationRequestByStudentAndWorkspaceMaterialAndArchived(Long studentEntityId, Long workspaceMaterialId, Boolean archived) {
    return supplementationRequestDAO.findByStudentAndWorkspaceMaterialAndArchived(studentEntityId, workspaceMaterialId, archived);
  }

  public WorkspaceMaterialEvaluation findWorkspaceMaterialEvaluation(Long id) {
    return workspaceMaterialEvaluationDAO.findById(id);
  }
  
  public WorkspaceMaterialEvaluation findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(WorkspaceMaterial workspaceMaterial, UserEntity student) {
    return workspaceMaterialEvaluationDAO.findByWorkspaceMaterialIdAndStudentEntityId(workspaceMaterial.getId(), student.getId());
  }
  
  public List<WorkspaceMaterialEvaluation> listWorkspaceMaterialEvaluationsByWorkspaceMaterialId(Long workspaceMaterialId){
    return workspaceMaterialEvaluationDAO.listByWorkspaceMaterialId(workspaceMaterialId);
  }

  public SupplementationRequest updateSupplementationRequest(SupplementationRequest supplementationRequest, Long userEntityId, Date requestDate, String requestText) {
    supplementationRequest = supplementationRequestDAO.updateSupplementationRequest(
        supplementationRequest,
        userEntityId,
        supplementationRequest.getStudentEntityId(),
        supplementationRequest.getWorkspaceEntityId(),
        supplementationRequest.getWorkspaceMaterialId(),
        requestDate,
        requestText,
        Boolean.FALSE);
    // For workspace supplementation requests, mark respective workspace assessment requests as handled 
    if (supplementationRequest.getStudentEntityId() != null && supplementationRequest.getWorkspaceEntityId() != null) {
      markWorkspaceAssessmentRequestsAsHandled(supplementationRequest.getStudentEntityId(), supplementationRequest.getWorkspaceEntityId());
    }
    handleSupplementationNotifications(supplementationRequest);
    return supplementationRequest;
  }
  
  public WorkspaceMaterialEvaluation updateWorkspaceMaterialEvaluation(WorkspaceMaterialEvaluation workspaceMaterialEvaluation, GradingScale gradingScale, GradingScaleItem grade, UserEntity assessor, Date evaluated, String verbalAssessment) {
    workspaceMaterialEvaluationDAO.updateGradingScaleIdentifier(workspaceMaterialEvaluation, gradingScale.getIdentifier());
    workspaceMaterialEvaluationDAO.updateGradingScaleSchoolDataSource(workspaceMaterialEvaluation, gradingScale.getSchoolDataSource());
    workspaceMaterialEvaluationDAO.updateVerbalAssessment(workspaceMaterialEvaluation, verbalAssessment);
    workspaceMaterialEvaluationDAO.updateGradeIdentifier(workspaceMaterialEvaluation, grade.getIdentifier());
    workspaceMaterialEvaluationDAO.updateGradeSchoolDataSource(workspaceMaterialEvaluation, grade.getSchoolDataSource());
    workspaceMaterialEvaluationDAO.updateAssessorEntityId(workspaceMaterialEvaluation, assessor.getId());
    workspaceMaterialEvaluationDAO.updateEvaluated(workspaceMaterialEvaluation, evaluated);
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialEvaluation.getWorkspaceMaterialId());
    UserEntity student = userEntityController.findUserEntityById(workspaceMaterialEvaluation.getStudentEntityId());
    
    WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, student);
    WorkspaceMaterialReplyState state = grade.isPassingGrade() ? WorkspaceMaterialReplyState.PASSED : WorkspaceMaterialReplyState.FAILED;
    if (reply == null) {
      workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, state, student);
    } else {
      workspaceMaterialReplyController.updateWorkspaceMaterialReply(reply, state);
    }
    
    return workspaceMaterialEvaluation;
  }

  public List<ContentNode> getAssignmentContentNodes(WorkspaceEntity workspaceEntity, boolean processHtml) throws WorkspaceMaterialException {
    List<ContentNode> result = new ArrayList<>();
    addAssignmentNodes(workspaceMaterialController.listVisibleEvaluableWorkspaceMaterialsAsContentNodes(workspaceEntity, processHtml), result);
    return result;
  }
  
  private void addAssignmentNodes(List<ContentNode> contentNodes, List<ContentNode> result) {
    for (ContentNode contentNode : contentNodes) {
      if (contentNode.getAssignmentType() == WorkspaceMaterialAssignmentType.EVALUATED) {
        result.add(contentNode);
      } else {
        addAssignmentNodes(contentNode.getChildren(), result);
      }
    }
  }
  
  /**
   * Marks the assessment requests of student <code>userEntityId</code> in workspace
   * <code>workspaceEntityId</code> as handled.
   * 
   * @param userEntityId Student id (in Muikku)
   * @param workspaceEntityId Workspace id (in Muikku)
   */
  private void markWorkspaceAssessmentRequestsAsHandled(Long userEntityId, Long workspaceEntityId) {
    // TODO Performance bottleneck?
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    
    // List assessment requests (from Pyramus)  
    
    List<WorkspaceAssessmentRequest> assessmentRequests = gradingController.listWorkspaceAssessmentRequests(
        workspaceEntity.getDataSource().getIdentifier(),
        workspaceEntity.getIdentifier(),
        userEntity.getDefaultIdentifier());
    
    // Mark each assessment request as handled (to Pyramus)
    
    for (WorkspaceAssessmentRequest assessmentRequest : assessmentRequests) {
      gradingController.updateWorkspaceAssessmentRequest(
          assessmentRequest.getSchoolDataSource(),
          assessmentRequest.getIdentifier(),
          assessmentRequest.getWorkspaceUserIdentifier(),
          assessmentRequest.getWorkspaceUserSchoolDataSource(),
          workspaceEntity.getIdentifier(),
          userEntity.getDefaultIdentifier(),
          assessmentRequest.getRequestText(),
          assessmentRequest.getDate(),
          assessmentRequest.getArchived(),
          Boolean.TRUE); // handled
    }
  }
  
  /**
   * Handles all notification messages related to the given supplementation request.
   * 
   * @param supplementationRequest Supplementation request
   */
  private void handleSupplementationNotifications(SupplementationRequest supplementationRequest) {
    Long teacherEntityId = supplementationRequest.getUserEntityId();
    Long studentEntityId = supplementationRequest.getStudentEntityId();
    Long workspaceEntityId = supplementationRequest.getWorkspaceEntityId();
    Long workspaceMaterialId = supplementationRequest.getWorkspaceMaterialId();
    String requestText = supplementationRequest.getRequestText();

    // If the supplementation request is for an assignment, mark student's reply as INCOMPLETE
    
    if (studentEntityId != null && workspaceMaterialId != null) {
      UserEntity student = userEntityController.findUserEntityById(studentEntityId);
      WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
      if (student != null && workspaceMaterial != null) {
        WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, student);
        if (reply == null) {
          workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, WorkspaceMaterialReplyState.INCOMPLETE, student);
        }
        else {
          workspaceMaterialReplyController.updateWorkspaceMaterialReply(reply, WorkspaceMaterialReplyState.INCOMPLETE);
        }
      }
    }
    else if (studentEntityId != null && workspaceEntityId != null) {

      // Send notification of an incomplete workspace
      
      UserEntity teacher = userEntityController.findUserEntityById(teacherEntityId);
      UserEntity student = userEntityController.findUserEntityById(studentEntityId);
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      notifyOfIncompleteWorkspace(teacher, student, workspaceEntity, requestText);
    }
  }

  private void notifyOfIncompleteWorkspace(UserEntity teacher, UserEntity student, WorkspaceEntity workspaceEntity, String verbalAssessment) {

    // Workspace
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    String workspaceUrl = String.format("%s/workspace/%s/materials", baseUrl, workspaceEntity.getUrlName());
    String workspaceName = workspace.getName();
    if (!StringUtils.isBlank(workspace.getNameExtension())) {
      workspaceName = String.format("%s (%s)", workspaceName, workspace.getNameExtension());
    }

    Locale locale = userEntityController.getLocale(student);
    CommunicatorMessageCategory category = communicatorController.persistCategory("assessments");
    communicatorController.createMessage(
        communicatorController.createMessageId(),
        teacher,
        Arrays.asList(student),
        null,
        null,
        null,
        category,
        localeController.getText(locale, "plugin.evaluation.workspaceIncomplete.notificationCaption"),
        localeController.getText(locale, "plugin.evaluation.workspaceIncomplete.notificationText", new Object[] {workspaceUrl, workspaceName, verbalAssessment}),
        Collections.<Tag>emptySet());
  }
  
}
