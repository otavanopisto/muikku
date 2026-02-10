package fi.otavanopisto.muikku.plugins.exam;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationDeleteController;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluation;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssignmentEvaluation;
import fi.otavanopisto.muikku.plugins.exam.dao.ExamAttendanceDAO;
import fi.otavanopisto.muikku.plugins.exam.dao.ExamSettingsDAO;
import fi.otavanopisto.muikku.plugins.exam.model.ExamAttendance;
import fi.otavanopisto.muikku.plugins.exam.model.ExamSettings;
import fi.otavanopisto.muikku.plugins.exam.rest.ExamAssignmentRestModel;
import fi.otavanopisto.muikku.plugins.exam.rest.ExamAttendanceRestModel;
import fi.otavanopisto.muikku.plugins.exam.rest.ExamAttendeeRestModel;
import fi.otavanopisto.muikku.plugins.exam.rest.ExamSettingsCategory;
import fi.otavanopisto.muikku.plugins.exam.rest.ExamSettingsRandom;
import fi.otavanopisto.muikku.plugins.exam.rest.ExamSettingsRestModel;
import fi.otavanopisto.muikku.plugins.workspace.ContentNode;
import fi.otavanopisto.muikku.plugins.workspace.MaterialDeleteController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceFolderDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialFieldAnswerDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceRootFolderDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolderType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;

public class ExamController {
  
  @Inject
  private Logger logger;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private WorkspaceMaterialReplyController replyController;
  
  @Inject
  private MaterialDeleteController materialDeleteController;
  
  @Inject
  private EvaluationController evaluationController;

  @Inject
  private EvaluationDeleteController evaluationDeleteController;
  
  @Inject
  private WorkspaceRootFolderDAO workspaceRootFolderDAO;
  
  @Inject
  private WorkspaceMaterialFieldAnswerDAO workspaceMaterialFieldAnswerDAO;
  
  @Inject
  private WorkspaceFolderDAO workspaceFolderDAO;

  @Inject
  private ExamAttendanceDAO examAttendanceDAO;
  
  @Inject
  private ExamSettingsDAO examSettingsDAO;
  
  public List<WorkspaceMaterial> listContents(Long workspaceFolderId) {
    return Collections.emptyList();
  }
  
  public ExamSettings findExamSettings(Long workspaceFolderId) {
    return examSettingsDAO.findByWorkspaceFolderId(workspaceFolderId);
  }
  
  public ExamSettings createOrUpdateSettings(Long workspaceFolderId, ExamSettingsRestModel settings) {
    ExamSettings settingsEntity = examSettingsDAO.findByWorkspaceFolderId(workspaceFolderId);
    try {
      String json = new ObjectMapper().writeValueAsString(settings);
      if (settingsEntity == null) {
        settingsEntity = examSettingsDAO.create(workspaceFolderId, json);
      }
      else {
        settingsEntity = examSettingsDAO.update(settingsEntity, json);
      }
    }
    catch (JsonProcessingException e) {
      logger.warning(String.format("Malformatted settings: %s", e.getMessage()));
    }
    return settingsEntity;
  }
  
  public ExamAttendance createAttendance(Long workspaceFolderId, Long userEntityId) {
    return examAttendanceDAO.create(workspaceFolderId, userEntityId);
  }
  
  public void removeAttendance(ExamAttendance attendance, boolean permanent) {
    if (permanent) {
      List<Long> assignmentIds = listExamAssignmentIds(attendance.getWorkspaceFolderId());
      for (Long assignmentId : assignmentIds) {
        UserEntity userEntity = userEntityController.findUserEntityById(attendance.getUserEntityId());
        WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(assignmentId);
        if (userEntity != null && workspaceMaterial != null) {
          // Delete field answers
          WorkspaceMaterialReply reply = replyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
          if (reply != null) {
            List<WorkspaceMaterialFieldAnswer> answers = workspaceMaterialFieldAnswerDAO.listByReply(reply); 
            for (WorkspaceMaterialFieldAnswer answer : answers) {
              materialDeleteController.deleteWorkspaceMaterialFieldAnswer(answer);
            }
            materialDeleteController.deleteWorkspaceMaterialReply(reply);
          }
          // Delete assignment evaluation
          WorkspaceNodeEvaluation evaluation = evaluationController.findWorkspaceNodeEvaluationByWorkspaceNodeAndStudent(assignmentId, attendance.getUserEntityId());
          if (evaluation != null) {
            evaluationDeleteController.deleteWorkspaceNodeEvaluation(evaluation);
          }
        }
      }
      // Delete exam evaluation
      WorkspaceNodeEvaluation evaluation = evaluationController.findWorkspaceNodeEvaluationByWorkspaceNodeAndStudent(attendance.getWorkspaceFolderId(), attendance.getUserEntityId());
      if (evaluation != null) {
        evaluationDeleteController.deleteWorkspaceNodeEvaluation(evaluation);
      }
      // Delete attendance
      examAttendanceDAO.delete(attendance);
    }
    else {
      examAttendanceDAO.updateArchived(attendance, true);
    }
  }
  
  public ExamAttendance restoreAttendance(ExamAttendance attendance) {
    return examAttendanceDAO.updateArchived(attendance, false);
  }
  
  /**
   * Starts an exam for the user, giving them a random set of assignments if exam supports randomization.
   * If this is not the first time the user has started this exam, possible earlier end time is nulled. 
   * 
   * @param workspaceFolderId Exam folder id
   * @param userEntityId User id
   * 
   * @return Exam attendance information
   */
  public ExamAttendance startExam(Long workspaceFolderId, Long userEntityId) {
    ExamAttendance attendance = findAttendance(workspaceFolderId, userEntityId);
    if (attendance == null) {
      attendance = createAttendance(workspaceFolderId, userEntityId);
    }
    attendance = examAttendanceDAO.updateWorkspaceMaterialIds(attendance, randomizeAssignments(workspaceFolderId));
    if (attendance.getEnded() != null) {
      attendance = examAttendanceDAO.updateEnded(attendance, null);
    }
    attendance = examAttendanceDAO.updateStarted(attendance, new Date());
    return attendance;
  }
  
  public ExamAttendance updateExtraMinutes(ExamAttendance attendance, Integer minutes) {
    return examAttendanceDAO.updateExtraMinutes(attendance, minutes);
  }

  /**
   * Ends an exam for the user.
   * 
   * @param workspaceFolderId Exam folder id
   * @param userEntityId User id
   * @param ended Time when the exam ended
   * 
   * @return Exam attendance information
   */
  public ExamAttendance endExam(Long workspaceFolderId, Long userEntityId, Date ended) {
    ExamAttendance attendance = findAttendance(workspaceFolderId, userEntityId);
    if (attendance != null) {
      examAttendanceDAO.updateEnded(attendance, ended);
      
      // Submit all exam assignments that aren't answered at all or are being answered
      
      Set<Long> chosenAssignmentIds = null;
      String assignmentIdStr = attendance.getWorkspaceMaterialIds();
      if (!StringUtils.isEmpty(assignmentIdStr)) {
        chosenAssignmentIds = Stream.of(assignmentIdStr.split(",")).map(Long::parseLong).collect(Collectors.toSet());
      }
      UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
      WorkspaceFolder folder = workspaceMaterialController.findWorkspaceFolderById(workspaceFolderId);
      if (userEntity != null && folder != null) {
        List<Long> assignmentIds = workspaceMaterialController.listVisibleWorkspaceAssignmentIds(folder);
        for (Long assignmentId : assignmentIds) {
          // Skip assignments that aren't part of the user's exam
          if (chosenAssignmentIds != null && !chosenAssignmentIds.contains(assignmentId)) {
            continue;
          }
          WorkspaceMaterial material = workspaceMaterialController.findWorkspaceMaterialById(assignmentId);
          if (material != null) {
            WorkspaceMaterialReply reply = replyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(material, userEntity);
            if (reply == null) {
              replyController.createWorkspaceMaterialReply(material, WorkspaceMaterialReplyState.SUBMITTED, userEntity, false);
            }
            else if (reply.getState() == WorkspaceMaterialReplyState.UNANSWERED || reply.getState() == WorkspaceMaterialReplyState.ANSWERED) {
              replyController.updateWorkspaceMaterialReply(reply, WorkspaceMaterialReplyState.SUBMITTED);
            }
          }
        }
      }
    }
    return attendance;
  }
  
  /**
   * Finds exam attendance information for the given exam and user.
   * 
   * @param workspaceFolderId Exam folder id
   * @param userEntityId User id
   * 
   * @return Exam attendance information. Returns <code>null</code> if not found.
   */
  public ExamAttendance findAttendance(Long workspaceFolderId, Long userEntityId) {
    return examAttendanceDAO.findByWorkspaceFolderIdAndUserEntityId(workspaceFolderId, userEntityId);
  }
  
  /**
   * Returns a list of all exam folder ids in a workspace.
   * 
   * @param workspaceEntityId Workspace entity id
   * @param userEntityId User id
   * 
   * @return Exam folder ids
   */
  public List<Long> listExamIds(Long workspaceEntityId) {
    List<Long> ids = new ArrayList<>();
    WorkspaceRootFolder rootFolder = workspaceRootFolderDAO.findByWorkspaceEntityId(workspaceEntityId);
    List<WorkspaceFolder> exams = workspaceFolderDAO.listByParentAndFolderTypeAndExam(rootFolder, WorkspaceFolderType.DEFAULT, true);
    for (WorkspaceFolder exam : exams) {
      ids.add(exam.getId());
    }
    return ids;
  }

  /**
   * Returns a list of all exam folder ids in a workspace that the given user is part of.
   * 
   * @param workspaceEntityId Workspace entity id
   * @param userEntityId User id
   * 
   * @return Exam folder ids the user is part of
   */
  public List<Long> listExamIds(Long workspaceEntityId, Long userEntityId) {
    List<Long> ids = new ArrayList<>();
    WorkspaceRootFolder rootFolder = workspaceRootFolderDAO.findByWorkspaceEntityId(workspaceEntityId);
    List<WorkspaceFolder> exams = workspaceFolderDAO.listByParentAndFolderTypeAndExam(rootFolder, WorkspaceFolderType.DEFAULT, true);
    for (WorkspaceFolder exam : exams) {
      // Exam has to be open for all or the user must have an attendance entity
      if (getSettingsJson(exam.getId()).getOpenForAll() ? true : findAttendance(exam.getId(), userEntityId) != null) {
        ids.add(exam.getId());
      }
    }
    return ids;
  }
  
  /**
   * Returns attendees to the given exam.
   * 
   * @param workspaceFolderId Exam folder id
   * 
   * @return List of attendees to the given exam
   */
  public List<ExamAttendance> listAttendees(Long workspaceFolderId) {
    return examAttendanceDAO.listByWorkspaceFolderIdAndArchived(workspaceFolderId, false);
  }
  
  /**
   * Returns exam settings as JSON object.
   * 
   * @param settingsEntity Exam folder id
   * 
   * @return Exam settings as JSON object
   */
  public ExamSettingsRestModel getSettingsJson(Long workspaceFolderId) {
    ExamSettingsRestModel restSettings = null;
    ExamSettings settings =  findExamSettings(workspaceFolderId);
    if (settings != null && !StringUtils.isEmpty(settings.getSettings())) {
      try {
        ObjectMapper mapper = new ObjectMapper();
        restSettings = mapper.readValue(settings.getSettings(), ExamSettingsRestModel.class);
      }
      catch (Exception e) {
        logger.severe(String.format("Malformatted exam settings: %s", e.getMessage()));
      }
    }
    if (settings == null) {
      restSettings = new ExamSettingsRestModel();
      restSettings.setCategories(Collections.emptyList());
    }
    restSettings.setExamId(workspaceFolderId);
    return restSettings;
  }
  
  /**
   * Returns the id list of all visible assignments in the given exam.
   * 
   * @param workspaceFolderId Exam folder id
   * 
   * @return Assignment ids of the given exam
   */
  public List<Long> listExamAssignmentIds(Long workspaceFolderId) {
    WorkspaceFolder folder = workspaceFolderDAO.findById(workspaceFolderId);
    return workspaceMaterialController.listVisibleWorkspaceAssignmentIds(folder);
  }

  /**
   * Randomizes assignments of the given exam and returns their ids as a comma-limited string.
   * If the exam does not support randomization, returns <code>null</code>.
   * 
   * @param workspaceFolderId Exam folder id
   * 
   * @return Comma-limited string of randomized assignment ids, or <code>null</code> if randomization not supported
   */
  private String randomizeAssignments(Long workspaceFolderId) {
    ExamSettings settings = examSettingsDAO.findByWorkspaceFolderId(workspaceFolderId);
    if (settings == null) {
      return null;
    }
    ExamSettingsRestModel settingsJson = getSettingsJson(workspaceFolderId);
    if (settingsJson.getRandom() == ExamSettingsRandom.GLOBAL) {
      // List all assignment ids and remove random ids until we're down to desired random count
      int count = settingsJson.getRandomCount();
      List<Long> ids = listExamAssignmentIds(workspaceFolderId);
      if (count > 0) {
        Random r = new Random();
        while (ids.size() > count) {
          ids.remove(r.nextInt(ids.size()));
        }
      }
      return ids.isEmpty() ? null : StringUtils.join(ids, ',');
    }
    else if (settingsJson.getRandom() == ExamSettingsRandom.CATEGORY) {
      // Same as above but assignment ids are listed in categories
      Set<Long> ids = new HashSet<>();
      List<ExamSettingsCategory> categories = settingsJson.getCategories();
      if (categories != null) {
        for (ExamSettingsCategory category : categories) {
          List<Long> categoryIds = category.getWorkspaceMaterialIds();
          if (category.getRandomCount() > 0 ) {
            Random r = new Random();
            while (categoryIds.size() > category.getRandomCount()) {
              categoryIds.remove(r.nextInt(categoryIds.size()));
            }
          }
          ids.addAll(categoryIds);
        }
      }
      return ids.isEmpty() ? null : StringUtils.join(ids, ',');
    }
    return null;
  }
  
  public ExamAttendanceRestModel toRestModel(Long workspaceFolderId, Long userEntityId, boolean listContentsOfEndedExam, boolean includeTheoryPages) {
    WorkspaceFolder folder = workspaceMaterialController.findWorkspaceFolderById(workspaceFolderId);
    ExamSettingsRestModel settingsJson = getSettingsJson(workspaceFolderId);
    ExamAttendanceRestModel attendance = new ExamAttendanceRestModel();
    attendance.setFolderId(workspaceFolderId);
    attendance.setName(folder.getTitle());
    attendance.setDescription(settingsJson.getDescription());
    attendance.setContents(Collections.emptyList());
    attendance.setMinutes(settingsJson.getMinutes());
    attendance.setAllowRestart(settingsJson.getAllowMultipleAttempts());
    attendance.setEvaluationInfo(evaluationController.getEvaluationInfo(userEntityId, workspaceFolderId));
    ExamAttendance attendanceEntity = findAttendance(workspaceFolderId, userEntityId);
    if (attendanceEntity != null) {
      // If exam has been evaluated, include a summary of points per assignment
      if (attendance.getEvaluationInfo() != null) {
        Set<Long> assignmentIds = new HashSet<>(); 
        boolean randomInPlay = settingsJson.getRandom() != ExamSettingsRandom.NONE && !StringUtils.isEmpty(attendanceEntity.getWorkspaceMaterialIds());
        if (randomInPlay) {
          assignmentIds.addAll(Stream.of(attendanceEntity.getWorkspaceMaterialIds().split(",")).map(Long::parseLong).collect(Collectors.toSet()));
        }
        else {
          assignmentIds.addAll(workspaceMaterialController.listVisibleWorkspaceAssignmentIds(folder));
        }
        for (Long id : assignmentIds) {
          WorkspaceMaterial assignment = workspaceMaterialController.findWorkspaceMaterialById(id);
          if (assignment == null) {
            continue;
          }
          RestAssignmentEvaluation evaluation = evaluationController.getEvaluationInfo(userEntityId, id);
          attendance.addAssignmentInfo(new ExamAssignmentRestModel(assignment.getTitle(), evaluation == null ? null : evaluation.getPoints()));
        }
      }
      if (attendance.getMinutes() > 0 && attendanceEntity.getExtraMinutes() != null) {
        attendance.setMinutes(attendance.getMinutes() + attendanceEntity.getExtraMinutes());
      }
      if (attendanceEntity.getStarted() != null) {
        attendance.setStarted(toOffsetDateTime(attendanceEntity.getStarted()));
      }
      if (attendanceEntity.getEnded() != null) {
        attendance.setEnded(toOffsetDateTime(attendanceEntity.getEnded()));
      }
      // Exam has been started so list its contents...
      if (attendance.getStarted() != null) {
        // ...unless it has ended too, in which case honor listContentsOfEndedExam flag
        if (listContentsOfEndedExam || attendance.getEnded() == null) {
          List<WorkspaceNode> nodes = workspaceMaterialController.listWorkspaceNodesByParentAndFolderTypeSortByOrderNumber(folder, WorkspaceFolderType.DEFAULT);
          List<ContentNode> contentNodes = new ArrayList<>();
          // See if assignment randomization is used
          boolean randomInPlay = settingsJson.getRandom() != ExamSettingsRandom.NONE && !StringUtils.isEmpty(attendanceEntity.getWorkspaceMaterialIds());
          Set<Long> randomAssignmentIds = null;
          if (randomInPlay) {
            randomAssignmentIds = Stream.of(attendanceEntity.getWorkspaceMaterialIds().split(",")).map(Long::parseLong).collect(Collectors.toSet());
          }
          for (WorkspaceNode node : nodes) {
            if (node instanceof WorkspaceMaterial) { // everything under folders is a page but let's be extra sure
              // Always skip hidden theory pages
              if (node.getHidden() && !((WorkspaceMaterial) node).isAssignment()) {
                continue;
              }
              // Skip hidden assignments unless the student has answered them 
              if (node.getHidden() && ((WorkspaceMaterial) node).isAssignment()) {
                if (replyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntityId((WorkspaceMaterial) node, attendanceEntity.getUserEntityId()) == null) {
                  continue;
                }
              }
              // Skip assignments that were not randomly selected for the student 
              if (randomInPlay && ((WorkspaceMaterial) node).isAssignment() && !randomAssignmentIds.contains(node.getId())) {
                continue;
              }
              // Skip theory pages (used in evaluation)
              if (!includeTheoryPages && !((WorkspaceMaterial) node).isAssignment()) {
                continue;
              }
              contentNodes.add(workspaceMaterialController.createContentNode(node, null));
            }
          }
          // Since we probably skipped quite a few nodes, adjust content node sibling ids manually
          for (int i = 1; i < contentNodes.size(); i++) {
            contentNodes.get(i).setNextSiblingId(contentNodes.get(i - 1).getMaterialId());
          }
          attendance.setContents(contentNodes);
        }
      }
      // For ongoing exams, calculate minutes left
      if (attendance.getStarted() != null && attendance.getEnded() == null && attendance.getMinutes() > 0) {
        attendance.setMinutesLeft(Math.max(0, attendance.getMinutes() - ChronoUnit.MINUTES.between(attendance.getStarted(), toOffsetDateTime(new Date()))));
      }
    }
    return attendance;
  }

  public ExamAttendeeRestModel toRestModel(ExamAttendance attendance) {
    UserEntity userEntity = userEntityController.findUserEntityById(attendance.getUserEntityId());
    ExamAttendeeRestModel attendee = new ExamAttendeeRestModel();
    attendee.setId(attendance.getUserEntityId());
    attendee.setStarted(attendance.getStarted() == null ? null : toOffsetDateTime(attendance.getStarted()));
    attendee.setEnded(attendance.getEnded() == null ? null : toOffsetDateTime(attendance.getEnded()));
    UserEntityName name = userEntityController.getName(userEntity, true);
    attendee.setFirstName(name.getFirstName());
    attendee.setLastName(name.getLastName());
    attendee.setLine(name.getStudyProgrammeName());
    attendee.setExtraMinutes(attendance.getExtraMinutes());
    return attendee;
  }
  
  private OffsetDateTime toOffsetDateTime(Date date) {
    Instant instant = date.toInstant();
    ZoneId systemId = ZoneId.systemDefault();
    ZoneOffset offset = systemId.getRules().getOffset(instant);
    return date.toInstant().atOffset(offset);
  }

}
