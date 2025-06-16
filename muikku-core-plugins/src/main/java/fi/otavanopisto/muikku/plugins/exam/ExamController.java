package fi.otavanopisto.muikku.plugins.exam;

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

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.exam.dao.ExamAttendanceDAO;
import fi.otavanopisto.muikku.plugins.exam.dao.ExamSettingsDAO;
import fi.otavanopisto.muikku.plugins.exam.model.ExamAttendance;
import fi.otavanopisto.muikku.plugins.exam.model.ExamSettings;
import fi.otavanopisto.muikku.plugins.exam.rest.ExamSettingsCategory;
import fi.otavanopisto.muikku.plugins.exam.rest.ExamSettingsRandom;
import fi.otavanopisto.muikku.plugins.exam.rest.ExamSettingsRestModel;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceFolderDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.users.UserEntityController;

public class ExamController {
  
  @Inject
  private Logger logger;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;
  
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
  
  public ExamAttendance createAttendance(Long workspaceFolderId, Long userEntityId, boolean randomizeAssignments) {
    if (randomizeAssignments) {
      return examAttendanceDAO.create(workspaceFolderId, userEntityId, randomizeAssignments(workspaceFolderId));
    }
    else {
      return examAttendanceDAO.create(workspaceFolderId, userEntityId);
    }
  }
  
  public void removeAttendance(ExamAttendance attendance) {
    examAttendanceDAO.delete(attendance);
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
      attendance = createAttendance(workspaceFolderId, userEntityId, true);
    }
    else {
      attendance = examAttendanceDAO.updateWorkspaceMaterialIds(attendance, randomizeAssignments(workspaceFolderId));
      if (attendance.getEnded() != null) {
        attendance = examAttendanceDAO.updateEnded(attendance, null);
      }
      attendance = examAttendanceDAO.updateStarted(attendance, new Date());
    }
    return attendance;
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
            WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(material, userEntity);
            if (reply == null) {
              workspaceMaterialReplyController.createWorkspaceMaterialReply(material, WorkspaceMaterialReplyState.SUBMITTED, userEntity, false);
            }
            else if (reply.getState() == WorkspaceMaterialReplyState.UNANSWERED || reply.getState() == WorkspaceMaterialReplyState.ANSWERED) {
              workspaceMaterialReplyController.updateWorkspaceMaterialReply(reply, WorkspaceMaterialReplyState.SUBMITTED);
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
   * Returns attendees to the given exam.
   * 
   * @param workspaceFolderId Exam folder id
   * 
   * @return List of attendees to the given exam
   */
  public List<ExamAttendance> listAttendees(Long workspaceFolderId) {
    return examAttendanceDAO.listByWorkspaceFolderId(workspaceFolderId);
  }
  
  /**
   * Returns exam settings as JSON object.
   * 
   * @param settingsEntity Exam folder id
   * 
   * @return Exam settings as JSON object
   */
  public ExamSettingsRestModel getSettingsJson(Long workspaceFolderId) {
    return getSettingsJson(findExamSettings(workspaceFolderId));
  }

  /**
   * Returns exam settings as JSON object.
   * 
   * @param settingsEntity Exam settings database entity
   * 
   * @return Exam settings as JSON object
   */
  public ExamSettingsRestModel getSettingsJson(ExamSettings settingsEntity) {
    if (settingsEntity != null && !StringUtils.isEmpty(settingsEntity.getSettings())) {
      try {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(settingsEntity.getSettings(), ExamSettingsRestModel.class);
      }
      catch (Exception e) {
        logger.severe(String.format("Malformatted exam settings: %s", e.getMessage()));
      }
    }
    return new ExamSettingsRestModel();
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
    ExamSettingsRestModel settingsJson = getSettingsJson(settings);
    if (settingsJson.getRandom() == ExamSettingsRandom.GLOBAL) {
      WorkspaceFolder folder = workspaceFolderDAO.findById(settings.getWorkspaceFolderId());
      // List all assignment ids and remove random ids until we're down to desired random count
      int count = settingsJson.getRandomCount();
      List<Long> ids = workspaceMaterialController.listVisibleWorkspaceAssignmentIds(folder);
      Random r = new Random();
      while (ids.size() > count) {
        ids.remove(r.nextInt(ids.size()));
      }
      return ids.isEmpty() ? null : StringUtils.join(ids, ',');
    }
    else if (settingsJson.getRandom() == ExamSettingsRandom.CATEGORY) {
      // Same as above but assignment ids are listed in categories
      Set<Long> ids = new HashSet<>();
      List<ExamSettingsCategory> categories = settingsJson.getCategories();
      for (ExamSettingsCategory category : categories) {
        List<Long> categoryIds = category.getWorkspaceMaterialIds();
        Random r = new Random();
        while (categoryIds.size() > category.getRandomCount()) {
          categoryIds.remove(r.nextInt(categoryIds.size()));
        }
        ids.addAll(categoryIds);
      }
      return ids.isEmpty() ? null : StringUtils.join(ids, ',');
    }
    return null;
  }

}
