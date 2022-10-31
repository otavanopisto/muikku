package fi.otavanopisto.muikku.plugins.evaluation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
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
import fi.otavanopisto.muikku.model.base.BooleanPredicate;
import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestCancellationDAO;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.events.CommunicatorMessageSent;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.evaluation.dao.InterimEvaluationRequestDAO;
import fi.otavanopisto.muikku.plugins.evaluation.dao.SupplementationRequestDAO;
import fi.otavanopisto.muikku.plugins.evaluation.dao.WorkspaceMaterialEvaluationAudioClipDAO;
import fi.otavanopisto.muikku.plugins.evaluation.dao.WorkspaceMaterialEvaluationDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.AssessmentRequestCancellation;
import fi.otavanopisto.muikku.plugins.evaluation.model.InterimEvaluationRequest;
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
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceActivity;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceActivityState;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceSubject;
import fi.otavanopisto.muikku.servlet.BaseUrl;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;

public class EvaluationController {

  @Inject
  @BaseUrl
  private String baseUrl;

  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;

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

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private CourseMetaController courseMetaController;
  
  @Inject
  private AssessmentRequestCancellationDAO assessmentRequestCancellationDAO;
  
  @Inject
  private InterimEvaluationRequestDAO interimEvaluationRequestDAO;
  
  /* Workspace activity */
  
  public List<WorkspaceActivity> listWorkspaceActivities(SchoolDataIdentifier studentIdentifier,
      SchoolDataIdentifier workspaceIdentifier,
      boolean includeTransferCredits,
      boolean includeAssignmentStatistics) {
    String dataSource = studentIdentifier.getDataSource(); 
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
    
    // Ask base information from Pyramus
    
    List<WorkspaceActivity> activities = new ArrayList<>();
    schoolDataBridgeSessionController.startSystemSession();
    try {
      activities = gradingController.listWorkspaceActivities(
          dataSource,
          studentIdentifier.getIdentifier(),
          workspaceIdentifier == null ? null : workspaceIdentifier.getIdentifier(),
          includeTransferCredits);
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
    
    // Complement the response with data available only in Muikku
    
    for (WorkspaceActivity activity : activities) {
      
      // Skip activity items without a course (basically transfer credits)
      
      if (activity.getIdentifier() == null) {
        continue;
      }
      
      SchoolDataIdentifier workspaceSubjectIdentifier = SchoolDataIdentifier.fromId(activity.getWorkspaceSubjectIdentifier());
      
      // WorkspaceEntityId
      
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(dataSource, activity.getIdentifier());
      if (workspaceEntity == null) {
        logger.warning(String.format("Pyramus course %s not found", activity.getIdentifier()));
        continue;
      }
      activity.setId(workspaceEntity.getId());
      
      // Supplementation request, if one exists and is newer than activity date so far
      
      SupplementationRequest supplementationRequest = findLatestSupplementationRequestByStudentAndWorkspaceAndArchived(
          userEntity.getId(), workspaceEntity.getId(), workspaceSubjectIdentifier, Boolean.FALSE);
      if (supplementationRequest != null && supplementationRequest.getRequestDate().after(activity.getDate())) {
        activity.setText(supplementationRequest.getRequestText());
        activity.setDate(supplementationRequest.getRequestDate());
        activity.setState(WorkspaceActivityState.SUPPLEMENTATION_REQUESTED);
      }
      
      // Interim evaluation request, if one exists and is newer than activity date so far
      
      InterimEvaluationRequest interimEvaluationRequest = findLatestInterimEvaluationRequest(userEntity, workspaceEntity);
      if (interimEvaluationRequest != null && interimEvaluationRequest.getRequestDate().after(activity.getDate())) {
        activity.setText(interimEvaluationRequest.getRequestText());
        activity.setDate(interimEvaluationRequest.getRequestDate());
        activity.setState(WorkspaceActivityState.INTERIM_EVALUATION_REQUESTED);
      }
      
      // Interim evaluation, if one exists and is newer than activity date so far
      
      List<WorkspaceMaterial> workspaceMaterials = workspaceMaterialController.listWorkspaceMaterialsByAssignmentType(
          workspaceEntity,
          WorkspaceMaterialAssignmentType.INTERIM_EVALUATION,
          BooleanPredicate.IGNORE);
      for (WorkspaceMaterial workspaceMaterial : workspaceMaterials) {
        WorkspaceMaterialEvaluation evaluation = findLatestWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);
        if (evaluation != null && evaluation.getEvaluated().after(activity.getDate())) {
          activity.setText(evaluation.getVerbalAssessment());
          activity.setDate(evaluation.getEvaluated());
          activity.setState(WorkspaceActivityState.INTERIM_EVALUATION);
        }
      }
      
      // Optional assignment statistics
      
      if (includeAssignmentStatistics) {
        int exercisesTotal = 0;
        int exercisesAnswered = 0;
        int evaluablesTotal = 0;
        int evaluablesAnswered = 0;
        
        // Exercises
        
        List<WorkspaceMaterial> assignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(
            workspaceEntity, WorkspaceMaterialAssignmentType.EXERCISE);
        exercisesTotal = assignments.size();
        for (WorkspaceMaterial assignment : assignments) {
          WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController
              .findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(assignment, userEntity);
          if (workspaceMaterialReply != null) {
            switch (workspaceMaterialReply.getState()) {
              case SUBMITTED:
              case PASSED:
              case FAILED:
              case INCOMPLETE:
                exercisesAnswered++;
              break;
              default:
              break;
            }
          }
        }
        
        // Evaluables
        
        assignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(
            workspaceEntity, WorkspaceMaterialAssignmentType.EVALUATED);
        evaluablesTotal = assignments.size();
        for (WorkspaceMaterial assignment : assignments) {
          WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController
              .findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(assignment, userEntity);
          if (workspaceMaterialReply != null) {
            switch (workspaceMaterialReply.getState()) {
              case SUBMITTED:
              case PASSED:
              case FAILED:
              case INCOMPLETE:
                evaluablesAnswered++;
              break;
              default:
              break;
            }
          }
        }

        activity.setExercisesTotal(exercisesTotal);
        activity.setExercisesAnswered(exercisesAnswered);
        activity.setEvaluablesTotal(evaluablesTotal);
        activity.setEvaluablesAnswered(evaluablesAnswered);
      }
    }
    return activities;
  }
  
  public InterimEvaluationRequest findLatestInterimEvaluationRequest(UserEntity userEntity, WorkspaceEntity workspaceEntity) {
    List<InterimEvaluationRequest> requests = interimEvaluationRequestDAO.listByUserAndWorkspaceAndArchived(userEntity.getId(), workspaceEntity.getId(), Boolean.FALSE);
    if (requests.size() == 0) {
      return null;
    }
    else if (requests.size() > 1) {
      requests.sort(Comparator.comparing(InterimEvaluationRequest::getRequestDate).reversed());
    }
    return requests.get(0);
  }
  
  public InterimEvaluationRequest findLatestInterimEvaluationRequest(UserEntity userEntity, WorkspaceMaterial workspaceMaterial) {
    List<InterimEvaluationRequest> requests = interimEvaluationRequestDAO.listByUserAndMaterialAndArchived(userEntity.getId(), workspaceMaterial.getId(), Boolean.FALSE);
    if (requests.size() == 0) {
      return null;
    }
    else if (requests.size() > 1) {
      requests.sort(Comparator.comparing(InterimEvaluationRequest::getRequestDate).reversed());
    }
    return requests.get(0);
  }
  
  public List<InterimEvaluationRequest> listInterimEvaluationRequests(Long workspaceEntityId, Boolean archived) {
    return interimEvaluationRequestDAO.listByWorkspaceAndArchived(workspaceEntityId, archived);
  }

  public List<InterimEvaluationRequest> listInterimEvaluationRequests(Collection<Long> workspaceEntityIds, Boolean archived) {
    return interimEvaluationRequestDAO.listByWorkspacesAndArchived(workspaceEntityIds, archived);
  }
  
  public List<InterimEvaluationRequest> listInterimEvaluationRequests(Long userEntityId, Long workspaceEntityId) {
    return interimEvaluationRequestDAO.listByUserAndWorkspace(userEntityId, workspaceEntityId);
  }

  public List<InterimEvaluationRequest> listInterimEvaluationRequests(UserEntity userEntity, WorkspaceMaterial workspaceMaterial, Boolean archived) {
    return interimEvaluationRequestDAO.listByUserAndMaterialAndArchived(userEntity.getId(), workspaceMaterial.getId(), archived);
  }
  
  public void archiveInterimEvaluationRequest(InterimEvaluationRequest interimEvaluationRequest) {
    interimEvaluationRequestDAO.archive(interimEvaluationRequest);
  }
  
  public InterimEvaluationRequest createInterimEvaluationRequest(Long workspaceMaterialId, String requestText) {
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    WorkspaceEntity workspaceEntity = workspaceMaterialController.findWorkspaceEntityByNode(workspaceMaterial);
    Long userEntityId = sessionController.getLoggedUserEntity().getId();
    Date requestDate = new Date();
    return interimEvaluationRequestDAO.createInterimEvaluationRequest(userEntityId, workspaceEntity.getId(), workspaceMaterialId, requestDate, requestText);
  }
  
  public InterimEvaluationRequest cancelInterimEvaluationRequest(InterimEvaluationRequest interimEvaluationRequest) {
    return interimEvaluationRequestDAO.updateInterimEvalutionRequest(interimEvaluationRequest, new Date(), interimEvaluationRequest.getRequestText(), Boolean.TRUE);
  }
  
  public SupplementationRequest createSupplementationRequest(Long userEntityId, Long studentEntityId, Long workspaceEntityId, SchoolDataIdentifier workspaceSubjectIdentifier, Long workspaceMaterialId, Date requestDate, String requestText) {
    SupplementationRequest supplementationRequest = supplementationRequestDAO.createSupplementationRequest(
        userEntityId,
        studentEntityId,
        workspaceEntityId,
        workspaceSubjectIdentifier,
        workspaceMaterialId,
        requestDate,
        requestText);
    // For workspace supplementation requests, mark respective workspace assessment requests as handled 
    if (studentEntityId != null && workspaceEntityId != null) {
      markWorkspaceAssessmentRequestsAsHandled(studentEntityId, workspaceEntityId, requestDate);      
    }
    handleSupplementationNotifications(supplementationRequest);    
    return supplementationRequest;
  }
  
  public AssessmentRequestCancellation createAssessmentRequestCancellation(Long studentEntityId, Long workspaceEntityId, Date cancellationDate) {
    AssessmentRequestCancellation assessmentRequestCancellation = assessmentRequestCancellationDAO.createAssessmentRequestCancellation(
        studentEntityId, 
        workspaceEntityId, 
        cancellationDate);
    
    return assessmentRequestCancellation;
  }
  
  public void deleteAssessmentRequestCancellation(AssessmentRequestCancellation assessmentRequestCancellation) {
    assessmentRequestCancellationDAO.delete(assessmentRequestCancellation);
  }
  
  public List<AssessmentRequestCancellation> listAssessmentRequestCancellationsByStudentAndWorkspace(Long studentEntityId, Long workspaceEntityId){
    return assessmentRequestCancellationDAO.listByStudentAndWorkspace(studentEntityId, workspaceEntityId);
  }

  public WorkspaceMaterialEvaluation createWorkspaceMaterialEvaluation(UserEntity student, WorkspaceMaterial workspaceMaterial, GradingScale gradingScale, GradingScaleItem grade, UserEntity assessor, Date evaluated, String verbalAssessment) {
    WorkspaceMaterialEvaluation evaluation = workspaceMaterialEvaluationDAO.create(student.getId(), 
        workspaceMaterial.getId(),  
        gradingScale != null ? gradingScale.getIdentifier() : null, 
        gradingScale != null ? gradingScale.getSchoolDataSource() : null, 
        grade != null ? grade.getIdentifier() : null, 
        grade != null ? grade.getSchoolDataSource() : null, 
        assessor.getId(), 
        evaluated, 
        verbalAssessment);
    WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, student);
    // Null grade is translated to passed as it's likely to be an exercise evaluation
    WorkspaceMaterialReplyState state = (grade == null || grade.isPassingGrade()) ? WorkspaceMaterialReplyState.PASSED : WorkspaceMaterialReplyState.FAILED;
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
  
  public List<SupplementationRequest> listSupplementationRequestsByStudentAndWorkspaceAndArchived(Long studentEntityId, Long workspaceEntityId, SchoolDataIdentifier workspaceSubjectIdentifier, Boolean archived) {
    return supplementationRequestDAO.listByStudentAndWorkspaceAndArchived(studentEntityId, workspaceEntityId, workspaceSubjectIdentifier, archived);
  }
  
  public SupplementationRequest findLatestSupplementationRequestByStudentAndWorkspaceAndArchived(Long studentEntityId, Long workspaceEntityId, Boolean archived) {
    return supplementationRequestDAO.findLatestByStudentAndWorkspaceAndArchived(studentEntityId, workspaceEntityId, archived);
  }

  public SupplementationRequest findLatestSupplementationRequestByStudentAndWorkspaceAndArchived(Long studentEntityId, Long workspaceEntityId, SchoolDataIdentifier workspaceSubjectIdentifier, Boolean archived) {
    return supplementationRequestDAO.findLatestByStudentAndWorkspaceAndArchived(studentEntityId, workspaceEntityId, workspaceSubjectIdentifier, archived);
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
    SchoolDataIdentifier workspaceSubjectIdentifier = supplementationRequest.getWorkspaceSubjectIdentifier() != null ? SchoolDataIdentifier.fromId(supplementationRequest.getWorkspaceSubjectIdentifier()) : null;
    supplementationRequest = supplementationRequestDAO.updateSupplementationRequest(
        supplementationRequest,
        userEntityId,
        supplementationRequest.getStudentEntityId(),
        supplementationRequest.getWorkspaceEntityId(),
        workspaceSubjectIdentifier,
        supplementationRequest.getWorkspaceMaterialId(),
        requestDate,
        requestText,
        Boolean.FALSE);
    // For workspace supplementation requests, mark respective workspace assessment requests as handled 
    if (supplementationRequest.getStudentEntityId() != null && supplementationRequest.getWorkspaceEntityId() != null) {
      markWorkspaceAssessmentRequestsAsHandled(supplementationRequest.getStudentEntityId(), supplementationRequest.getWorkspaceEntityId(), requestDate);
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
  private void markWorkspaceAssessmentRequestsAsHandled(Long userEntityId, Long workspaceEntityId, Date when) {
    // TODO Performance bottleneck?
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    
    // List assessment requests (from Pyramus)
    // TODO Could be optimized by only fetching requests that are not yet handled
    
    List<WorkspaceAssessmentRequest> assessmentRequests = gradingController.listWorkspaceAssessmentRequests(
        workspaceEntity.getDataSource().getIdentifier(),
        workspaceEntity.getIdentifier(),
        userEntity.getDefaultIdentifier(),
        false);
    
    // Mark each assessment request as handled (to Pyramus)
    
    for (WorkspaceAssessmentRequest assessmentRequest : assessmentRequests) {
      if (assessmentRequest.getHandled()) {
        continue;
      }
      
      /**
       * If assessment request date is after the given date, skip it - this is so that 
       * the assessment requests are not changed if a supplementation request is edited 
       * and there are later assessment requests. 
       */
      if (assessmentRequest.getDate() != null && assessmentRequest.getDate().after(when)) {
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
  
  protected void sendAssessmentNotification(WorkspaceEntity workspaceEntity, WorkspaceSubject workspaceSubject, WorkspaceAssessment workspaceAssessment, UserEntity evaluator, UserEntity student, Workspace workspace, String grade, boolean isMultiSubjectWorkspace) {
    String workspaceUrl = String.format("%s/workspace/%s/materials", baseUrl, workspaceEntity.getUrlName());
    Locale locale = userEntityController.getLocale(student);

    Subject subject = null;
    
    // If workspaceSubject or subject cannot be resolved, revert back to non-multiSubjectWorkspace handling
    isMultiSubjectWorkspace = 
        isMultiSubjectWorkspace 
        && (workspaceSubject != null) 
        && ((subject = courseMetaController.findSubject(workspaceSubject.getSubjectIdentifier())) != null) 
        && (StringUtils.isNotBlank(subject.getCode()));

    String messageTitle;
    String messageContent;
    
    if (isMultiSubjectWorkspace) {
      // Workspace has multiple WorkspaceSubjects and workspaceSubject, subject and subject.code all exist

      StringBuilder workspaceSubjectDescription = new StringBuilder();
      workspaceSubjectDescription.append(subject.getCode());

      if (workspaceSubject.getCourseNumber() != null) {
        workspaceSubjectDescription.append(workspaceSubject.getCourseNumber());
      }

      messageTitle = localeController.getText(
          locale,
          "plugin.workspace.assessment.notificationTitleMultiSubject",
          new Object[] {workspace.getName(), grade});
      
      messageContent = localeController.getText(
          locale,
          "plugin.workspace.assessment.notificationContentMultiSubject",
          new Object[] {workspaceUrl, workspace.getName(), grade, workspaceAssessment.getVerbalAssessment(), workspaceSubjectDescription.toString()});
    } else {
      messageTitle = localeController.getText(
          locale,
          "plugin.workspace.assessment.notificationTitle",
          new Object[] {workspace.getName(), grade});
      
      messageContent = localeController.getText(
          locale,
          "plugin.workspace.assessment.notificationContent",
          new Object[] {workspaceUrl, workspace.getName(), grade, workspaceAssessment.getVerbalAssessment()});
    }
    
    CommunicatorMessageCategory category = communicatorController.persistCategory("assessments");
    CommunicatorMessage communicatorMessage = communicatorController.createMessage(
        communicatorController.createMessageId(),
        evaluator,
        Arrays.asList(student),
        null,
        null,
        null,
        category,
        messageTitle,
        messageContent,
        Collections.<Tag>emptySet());
    communicatorMessageSentEvent.fire(new CommunicatorMessageSent(communicatorMessage.getId(), student.getId(), baseUrl));
  }

}