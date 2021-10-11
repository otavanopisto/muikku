package fi.otavanopisto.muikku.plugins.evaluation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.enterprise.event.Event;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.files.TempFileUtils;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.events.CommunicatorMessageSent;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.evaluation.dao.SupplementationRequestDAO;
import fi.otavanopisto.muikku.plugins.evaluation.dao.WorkspaceMaterialEvaluationAudioClipDAO;
import fi.otavanopisto.muikku.plugins.evaluation.dao.WorkspaceMaterialEvaluationDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequest;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluationAudioClip;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssignmentEvaluation;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssignmentEvaluationAudioClip;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssignmentEvaluationType;
import fi.otavanopisto.muikku.plugins.workspace.ContentNode;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialException;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.fieldio.WorkspaceFieldIOException;
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
  private Logger logger;
  
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
  private WorkspaceMaterialEvaluationAudioClipDAO workspaceMaterialEvaluationAudioClipDAO;
  
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

  @Inject
  private Event<CommunicatorMessageSent> communicatorMessageSentEvent;
  
  @Inject
  private EvaluationFileStorageUtils file;
  
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
    if (reply != null) {
      workspaceMaterialReplyController.updateWorkspaceMaterialReply(reply, state);
    }

    return evaluation;
  }
  
  public void deleteSupplementationRequest(SupplementationRequest supplementationRequest) {
    supplementationRequestDAO.archive(supplementationRequest);
  }

  public void deleteWorkspaceMaterialEvaluation(WorkspaceMaterialEvaluation evaluation) {
    if (evaluation != null) {
      List<WorkspaceMaterialEvaluationAudioClip> evaluationAudioClips = listEvaluationAudioClips(evaluation);
      for (WorkspaceMaterialEvaluationAudioClip evaluationAudioClip : evaluationAudioClips) {
        if (file.isFileInFileSystem(evaluation.getStudentEntityId(), evaluationAudioClip.getClipId())) {
          try {
            file.removeFileFromFileSystem(evaluation.getStudentEntityId(), evaluationAudioClip.getClipId());
          } catch (IOException e) {
            logger.log(Level.SEVERE, String.format("Could not remove clip %s", evaluationAudioClip.getClipId()), e);
          }
        }
        
        // Remove db entry
        workspaceMaterialEvaluationAudioClipDAO.delete(evaluationAudioClip);
      }
      
      workspaceMaterialEvaluationDAO.delete(evaluation);
    }
  }
  
  public SupplementationRequest findSupplementationRequestById(Long supplementationRequestId) {
    return supplementationRequestDAO.findById(supplementationRequestId);
  }
  
  public List<SupplementationRequest> listSupplementationRequestsByStudentAndWorkspaceAndArchived(Long studentEntityId, Long workspaceEntityId, Boolean archived) {
    return supplementationRequestDAO.listByStudentAndWorkspaceAndArchived(studentEntityId, workspaceEntityId, archived);
  }
  
  public SupplementationRequest findLatestSupplementationRequestByStudentAndWorkspaceAndArchived(Long studentEntityId, Long workspaceEntityId, Boolean archived) {
    List<SupplementationRequest> supplementationRequests = supplementationRequestDAO.listByStudentAndWorkspaceAndArchived(studentEntityId, workspaceEntityId, archived); 
    if (supplementationRequests.isEmpty()) {
      return null;
    }
    else if (supplementationRequests.size() > 1) {
      supplementationRequests.sort(Comparator.comparing(SupplementationRequest::getRequestDate).reversed());
    }
    return supplementationRequests.get(0);
  }

  public SupplementationRequest findLatestSupplementationRequestByStudentAndWorkspaceMaterialAndArchived(Long studentEntityId, Long workspaceMaterialId, Boolean archived) {
    List<SupplementationRequest> supplementationRequests = supplementationRequestDAO.listByStudentAndWorkspaceMaterialAndArchived(studentEntityId, workspaceMaterialId, archived); 
    if (supplementationRequests.isEmpty()) {
      return null;
    }
    else if (supplementationRequests.size() > 1) {
      supplementationRequests.sort(Comparator.comparing(SupplementationRequest::getRequestDate).reversed());
    }
    return supplementationRequests.get(0);
  }

  public WorkspaceMaterialEvaluation findWorkspaceMaterialEvaluation(Long id) {
    return workspaceMaterialEvaluationDAO.findById(id);
  }
  
  public WorkspaceMaterialEvaluation findLatestWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(WorkspaceMaterial workspaceMaterial, UserEntity student) {
    List<WorkspaceMaterialEvaluation> workspaceMaterialEvaluations = workspaceMaterialEvaluationDAO.listByWorkspaceMaterialIdAndStudentEntityId(workspaceMaterial.getId(), student.getId());
    if (workspaceMaterialEvaluations.isEmpty()) {
      return null;
    }
    else if (workspaceMaterialEvaluations.size() > 1) {
      workspaceMaterialEvaluations.sort(Comparator.comparing(WorkspaceMaterialEvaluation::getEvaluated).reversed());
    }
    return workspaceMaterialEvaluations.get(0);
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
    workspaceMaterialEvaluationDAO.updateGradingScaleIdentifier(workspaceMaterialEvaluation, gradingScale != null ? gradingScale.getIdentifier() : null);
    workspaceMaterialEvaluationDAO.updateGradingScaleSchoolDataSource(workspaceMaterialEvaluation, gradingScale != null ? gradingScale.getSchoolDataSource() : null);
    workspaceMaterialEvaluationDAO.updateVerbalAssessment(workspaceMaterialEvaluation, verbalAssessment);
    workspaceMaterialEvaluationDAO.updateGradeIdentifier(workspaceMaterialEvaluation, grade != null ? grade.getIdentifier() : null);
    workspaceMaterialEvaluationDAO.updateGradeSchoolDataSource(workspaceMaterialEvaluation, grade != null ? grade.getSchoolDataSource() : null);
    workspaceMaterialEvaluationDAO.updateAssessorEntityId(workspaceMaterialEvaluation, assessor.getId());
    workspaceMaterialEvaluationDAO.updateEvaluated(workspaceMaterialEvaluation, evaluated);
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialEvaluation.getWorkspaceMaterialId());
    UserEntity student = userEntityController.findUserEntityById(workspaceMaterialEvaluation.getStudentEntityId());
    
    WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, student);
    // Null grade is translated to passed as it's likely to be an exercise evaluation
    WorkspaceMaterialReplyState state = (grade == null || grade.isPassingGrade()) ? WorkspaceMaterialReplyState.PASSED : WorkspaceMaterialReplyState.FAILED;
    if (reply != null) {
      workspaceMaterialReplyController.updateWorkspaceMaterialReply(reply, state);
    }

    return workspaceMaterialEvaluation;
  }

  public RestAssignmentEvaluation getEvaluationInfo(UserEntity userEntity, WorkspaceMaterial workspaceMaterial) {
    SupplementationRequest supplementationRequest = findLatestSupplementationRequestByStudentAndWorkspaceMaterialAndArchived(userEntity.getId(), workspaceMaterial.getId(), Boolean.FALSE); 
    WorkspaceMaterialEvaluation workspaceMaterialEvaluation = findLatestWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);
    if (supplementationRequest == null && workspaceMaterialEvaluation == null) {
      // No evaluation, no supplementation request 
      return null;
    }
    else if (supplementationRequest != null && (workspaceMaterialEvaluation == null || workspaceMaterialEvaluation.getEvaluated().before(supplementationRequest.getRequestDate()))) {
      // No evaluation or supplementation request is newer
      RestAssignmentEvaluation evaluation = new RestAssignmentEvaluation();
      evaluation.setType(RestAssignmentEvaluationType.INCOMPLETE);
      evaluation.setDate(supplementationRequest.getRequestDate());
      evaluation.setText(supplementationRequest.getRequestText());
      return evaluation;
    }
    else {
      // No supplementation request or evaluation is newer
      
      List<WorkspaceMaterialEvaluationAudioClip> evaluationAudioClips = workspaceMaterialEvaluationAudioClipDAO.listByEvaluation(workspaceMaterialEvaluation);
      
      RestAssignmentEvaluation evaluation = new RestAssignmentEvaluation();
      evaluation.setType(RestAssignmentEvaluationType.PASSED);
      evaluation.setDate(workspaceMaterialEvaluation.getEvaluated());
      evaluation.setText(workspaceMaterialEvaluation.getVerbalAssessment());
      GradingScale gradingScale = gradingController.findGradingScale(
          workspaceMaterialEvaluation.getGradingScaleSchoolDataSource(), workspaceMaterialEvaluation.getGradingScaleIdentifier());
      if (gradingScale != null) {
        GradingScaleItem gradingScaleItem = gradingController.findGradingScaleItem(
            gradingScale, workspaceMaterialEvaluation.getGradeSchoolDataSource(), workspaceMaterialEvaluation.getGradeIdentifier());
        if (gradingScaleItem != null) {
          evaluation.setGrade(gradingScaleItem.getName());
          if (Boolean.FALSE.equals(gradingScaleItem.isPassingGrade())) {
            evaluation.setType(RestAssignmentEvaluationType.FAILED);
          }
        }
      }
      
      evaluationAudioClips.forEach(audioClip -> {
        evaluation.addAudioAssessmentAudioClip(new RestAssignmentEvaluationAudioClip(audioClip.getClipId(), audioClip.getFileName(), audioClip.getContentType()));
      });
      
      return evaluation;
    }
  }

  public List<ContentNode> getAssignmentContentNodes(WorkspaceEntity workspaceEntity, boolean processHtml) throws WorkspaceMaterialException {
    List<ContentNode> result = new ArrayList<>();
    addAssignmentNodes(workspaceMaterialController.listVisibleEvaluableWorkspaceMaterialsAsContentNodes(workspaceEntity), result);
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
    // TODO Could be optimized by only fetching requests that are not yet handled
    
    List<WorkspaceAssessmentRequest> assessmentRequests = gradingController.listWorkspaceAssessmentRequests(
        workspaceEntity.getDataSource().getIdentifier(),
        workspaceEntity.getIdentifier(),
        userEntity.getDefaultIdentifier());
    
    // Mark each assessment request as handled (to Pyramus)
    
    for (WorkspaceAssessmentRequest assessmentRequest : assessmentRequests) {
      if (assessmentRequest.getHandled()) {
        continue;
      }
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
        if (reply != null) {
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
    CommunicatorMessage communicatorMessage = communicatorController.createMessage(
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
    communicatorMessageSentEvent.fire(new CommunicatorMessageSent(communicatorMessage.getId(), student.getId(), baseUrl));
  }
  
  public WorkspaceMaterialEvaluationAudioClip findEvaluationAudioClip(String clipId) {
    return workspaceMaterialEvaluationAudioClipDAO.findByClipId(clipId);
  }
  
  public List<WorkspaceMaterialEvaluationAudioClip> listEvaluationAudioClips(WorkspaceMaterialEvaluation evaluation) {
    return workspaceMaterialEvaluationAudioClipDAO.listByEvaluation(evaluation);
  }
  
  public void synchronizeWorkspaceMaterialEvaluationAudioAssessments(WorkspaceMaterialEvaluation evaluation, List<RestAssignmentEvaluationAudioClip> audioAssessments) {
    List<WorkspaceMaterialEvaluationAudioClip> existingClips = workspaceMaterialEvaluationAudioClipDAO.listByEvaluation(evaluation);

    List<String> existingClipIds = existingClips.stream().map(WorkspaceMaterialEvaluationAudioClip::getClipId).collect(Collectors.toList());

    if (audioAssessments != null) {
      for (RestAssignmentEvaluationAudioClip clip : audioAssessments) {
        if (existingClipIds.contains(clip.getId())) {
          // Already existing clip
          existingClipIds.remove(clip.getId());
        }
        else {
          // New clip
          try {
            byte[] audioData = TempFileUtils.getTempFileData(clip.getId());
            if (audioData == null) {
              throw new WorkspaceFieldIOException("Temp audio does not exist");
            }
            
            // Create file
            Long userEntityId = evaluation.getStudentEntityId();
            file.storeFileToFileSystem(userEntityId, clip.getId(), audioData);
            
            // Create db entry
            workspaceMaterialEvaluationAudioClipDAO.create(evaluation, clip.getContentType(), clip.getId(), clip.getName());
            TempFileUtils.deleteTempFile(clip.getId());
          }
          catch (Exception e) {
            throw new RuntimeException("Failed to retrieve clip data", e);
          }
        }
      }
    }
    
    // Removed clips
    
    for (String existingClipId : existingClipIds) {
      WorkspaceMaterialEvaluationAudioClip workspaceMaterialEvaluationAudioClip = workspaceMaterialEvaluationAudioClipDAO.findByClipId(existingClipId);
      if (workspaceMaterialEvaluationAudioClip != null) {
        try {
          // Remove file
          Long userEntityId = workspaceMaterialEvaluationAudioClip.getEvaluation().getStudentEntityId();
          if (file.isFileInFileSystem(userEntityId, existingClipId)) {
            file.removeFileFromFileSystem(userEntityId, existingClipId);
          }
          
          // Remove db entry
          workspaceMaterialEvaluationAudioClipDAO.delete(workspaceMaterialEvaluationAudioClip);
        }
        catch (Exception e) {
          throw new RuntimeException("Failed to remove audio data", e);
        }
      }
    }
  }
  
}