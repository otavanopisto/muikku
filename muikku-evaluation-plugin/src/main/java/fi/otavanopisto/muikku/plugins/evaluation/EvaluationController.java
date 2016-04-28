package fi.otavanopisto.muikku.plugins.evaluation;

import java.text.MessageFormat;
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
import fi.otavanopisto.muikku.plugins.evaluation.dao.WorkspaceMaterialEvaluationDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.otavanopisto.muikku.plugins.workspace.ContentNode;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialException;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
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
  private UserEntityController userEntityController;

  @Inject
  private LocaleController localeController;
  
  @Inject
  private CommunicatorController communicatorController;

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
    
    // #1669: Notification on non-passing grade on an assignment
    if (state == WorkspaceMaterialReplyState.FAILED) {
      notifyOfFailedAssignment(assessor, student, workspaceMaterial, grade, verbalAssessment);
    }
    
    return evaluation;
  }

  public void deleteWorkspaceMaterialEvaluation(WorkspaceMaterialEvaluation evaluation) {
    if (evaluation != null) {
      workspaceMaterialEvaluationDAO.delete(evaluation);
    }
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

    // #1669: Notification on non-passing grade on an assignment
    if (state == WorkspaceMaterialReplyState.FAILED) {
      notifyOfFailedAssignment(assessor, student, workspaceMaterial, grade, verbalAssessment);
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

  private void notifyOfFailedAssignment(UserEntity assessor, UserEntity student, WorkspaceMaterial workspaceMaterial, GradingScaleItem grade, String verbalAssessment) {
    Locale locale = student.getLocale() == null ? new Locale("fi") : new Locale(student.getLocale());
    
    // Workspace
    Long workspaceEntityId = workspaceMaterialController.getWorkspaceEntityId(workspaceMaterial);
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    String workspaceUrl = String.format("%s/workspace/%s/materials", baseUrl, workspaceEntity.getUrlName());
    String workspaceName = workspace.getName();
    if (!StringUtils.isBlank(workspace.getNameExtension())) {
      workspaceName = String.format("%s (%s)", workspaceName, workspace.getNameExtension());
    }
    
    // Notification
    String assignmentName = workspaceMaterial.getTitle();
    String gradeName = grade.getName();
    String notificationCaption = localeController.getText(locale, "plugin.evaluation.assignmentFailed.notificationCaption");
    String notificationText = localeController.getText(locale, "plugin.evaluation.assignmentFailed.notificationText");
    notificationCaption = MessageFormat.format(notificationCaption, gradeName);
    notificationText = MessageFormat.format(notificationText, assignmentName, workspaceUrl, workspaceName, gradeName, verbalAssessment == null ? "" : verbalAssessment);
    
    // Communicator message
    CommunicatorMessageCategory category = communicatorController.persistCategory("assessments");
    communicatorController.createMessage(
        communicatorController.createMessageId(),
        assessor,
        Arrays.asList(student),
        category,
        notificationCaption,
        notificationText,
        Collections.<Tag>emptySet());
  }
  
}
