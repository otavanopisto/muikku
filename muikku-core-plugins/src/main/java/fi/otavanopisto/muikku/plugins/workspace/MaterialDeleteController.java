package fi.otavanopisto.muikku.plugins.workspace;

import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.evaluation.EvaluationDeleteController;
import fi.otavanopisto.muikku.plugins.evaluation.dao.WorkspaceNodeEvaluationDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluation;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialAudioFieldAnswerClipDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialFieldAnswerDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialFieldDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialFileFieldAnswerFileDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialMultiSelectFieldAnswerOptionDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialReplyDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.otavanopisto.muikku.plugins.workspace.fieldio.FileAnswerType;
import fi.otavanopisto.muikku.plugins.workspace.fieldio.FileAnswerUtils;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAudioFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAudioFieldAnswerClip;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswerOption;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;

public class MaterialDeleteController {
  
  @Inject
  private Logger logger;

  @Inject
  private WorkspaceNodeDAO workspaceNodeDAO;
  
  @Inject
  private WorkspaceMaterialFieldDAO workspaceMaterialFieldDAO;
  
  @Inject
  private WorkspaceMaterialFieldAnswerDAO workspaceMaterialFieldAnswerDAO;
  
  @Inject
  private WorkspaceMaterialAudioFieldAnswerClipDAO workspaceMaterialAudioFieldAnswerClipDAO;
  
  @Inject
  private WorkspaceMaterialFileFieldAnswerFileDAO workspaceMaterialFileFieldAnswerFileDAO;
  
  @Inject
  private WorkspaceMaterialMultiSelectFieldAnswerOptionDAO workspaceMaterialMultiSelectFieldAnswerOptionDAO;
  
  @Inject
  private WorkspaceMaterialReplyDAO workspaceMaterialReplyDAO;

  @Inject
  private WorkspaceNodeEvaluationDAO workspaceNodeEvaluationDAO;
  
  @Inject
  private EvaluationDeleteController evaluationDeleteController;

  @Inject
  private FileAnswerUtils fileAnswerUtils;
  
  public void deleteWorkspaceMaterial(WorkspaceMaterial workspaceMaterial, boolean removeAnswers)
      throws WorkspaceMaterialContainsAnswersExeption {
    try {
      
      // First remove workspace material fields and their answers. If removeAnswers is false and
      // the fields have been answered, this throws an exception that halts the whole operation
      
      List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldDAO.listByWorkspaceMaterial(workspaceMaterial);
      for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
        deleteWorkspaceMaterialField(workspaceMaterialField, removeAnswers);
      }
      
      // After individual fields and answers are gone, workspace material replies can be deleted
      
      List<WorkspaceMaterialReply> workspaceMaterialReplies = workspaceMaterialReplyDAO.listByWorkspaceMaterial(workspaceMaterial);
      for (WorkspaceMaterialReply workspaceMaterialReply : workspaceMaterialReplies) {
        deleteWorkspaceMaterialReply(workspaceMaterialReply);
      }
      
      // Recurse to delete workspace material children (practically page attachments)

      List<WorkspaceNode> childNodes = workspaceNodeDAO.listByParentSortByOrderNumber(workspaceMaterial);
      for (WorkspaceNode childNode : childNodes) {
        if (childNode instanceof WorkspaceMaterial) {
          deleteWorkspaceMaterial((WorkspaceMaterial) childNode, removeAnswers);
        }
        else {
          // Just in case but no page should have a folder as its child, though
          deleteWorkspaceNode(childNode);
        }
      }
    }
    catch (Exception e) {
      Throwable cause = e;
      while (cause != null) {
        cause = cause.getCause();
        if (cause instanceof WorkspaceMaterialContainsAnswersExeption) {
          throw (WorkspaceMaterialContainsAnswersExeption) cause;
        }
      }
      throw e;
    }

    // TODO Stage 2: If the underlying material would be orphaned, delete it as well

    deleteWorkspaceNode(workspaceMaterial);
  }
  
  /**
   * Deletes a workspace folder. Assumes that the folder no longer has any child nodes.
   * 
   * @param folder Workspace folder to be deleted
   */
  public void deleteWorkspaceFolder(WorkspaceFolder folder) {
    deleteWorkspaceNode(folder);
  }

  /**
   * Deletes a workspace root folder. Assumes that the folder no longer has any child nodes.
   * 
   * @param folder Workspace root folder to be deleted
   */
  public void deleteWorkspaceRootFolder(WorkspaceRootFolder folder) {
    deleteWorkspaceNode(folder);
  }

  /**
   * Deletes a workspace materia field.
   * 
   * @param field Workspace material field to be deleted
   * 
   * @throws WorkspaceMaterialContainsAnswersExeption If <code>removeAnswers</code> is <code>false</code> and the field contains answers
   */
  public void deleteWorkspaceMaterialField(WorkspaceMaterialField field, boolean removeAnswers) throws WorkspaceMaterialContainsAnswersExeption {
    
    // Before the field can be deleted, its answers have to be deleted

    List<WorkspaceMaterialFieldAnswer> answers = workspaceMaterialFieldAnswerDAO.listByField(field);
    if (removeAnswers) {
      for (WorkspaceMaterialFieldAnswer answer : answers) {
        deleteWorkspaceMaterialFieldAnswer(answer); 
      }
    }
    else if (!answers.isEmpty()) {
      throw new WorkspaceMaterialContainsAnswersExeption("Could not remove workspace material field because it contains answers");
    }
    
    // Field can now be deleted
    
    workspaceMaterialFieldDAO.delete(field);
  }
  
  /**
   * Deletes a workspace material field answer.
   * 
   * @param answer Answer to be deleted
   */
  public void deleteWorkspaceMaterialFieldAnswer(WorkspaceMaterialFieldAnswer answer) {
    if (answer instanceof WorkspaceMaterialAudioFieldAnswer) {
      
      // Audio field answers need their clips deleted first
      
      List<WorkspaceMaterialAudioFieldAnswerClip> audioAnswerClips = workspaceMaterialAudioFieldAnswerClipDAO.listByFieldAnswer((WorkspaceMaterialAudioFieldAnswer) answer);
      for (WorkspaceMaterialAudioFieldAnswerClip audioAnswerClip : audioAnswerClips) {
        try {
          deleteWorkspaceMaterialAudioFieldAnswerClip(audioAnswerClip);
        }
        catch (Exception e) {
          // Audio field was removed completely but it's not fatal if its answer files in file system fail to remove
          logger.log(Level.WARNING, String.format("Problems removing file system files related to audio answer %d", answer.getId()), e);
        }
      }
    }
    else if (answer instanceof WorkspaceMaterialFileFieldAnswer) {
      
      // File field answers need their files deleted first
      
      List<WorkspaceMaterialFileFieldAnswerFile> fileAnswerFiles = workspaceMaterialFileFieldAnswerFileDAO.listByFieldAnswer((WorkspaceMaterialFileFieldAnswer) answer);
      for (WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile : fileAnswerFiles) {
        try {
          deleteWorkspaceMaterialFileFieldAnswerFile(fieldAnswerFile);
        }
        catch (Exception e) {
          // File field was removed completely but it's not fatal if its answer files in file system fail to remove
          logger.log(Level.WARNING, String.format("Problems removing file system files related to file answer %d", answer.getId()), e);
        }
      }
    }
    else if (answer instanceof WorkspaceMaterialMultiSelectFieldAnswer) {
      
      // Multiselect field answers need their individual answer options deleted first 
      
      List<WorkspaceMaterialMultiSelectFieldAnswerOption> options = workspaceMaterialMultiSelectFieldAnswerOptionDAO.listByFieldAnswer((WorkspaceMaterialMultiSelectFieldAnswer) answer);
      for (WorkspaceMaterialMultiSelectFieldAnswerOption option : options) {
        deleteWorkspaceMaterialMultiSelectFieldAnswerOption(option);
      }
    }
    
    // Answer itself can now be deleted. Entity inheritance ensures it will also be removed from the
    // answer table related to the type of the field (e.g. WorkspaceMaterialTextFieldAnswer)
    
    workspaceMaterialFieldAnswerDAO.delete(answer);
  }

  public void deleteWorkspaceMaterialReply(WorkspaceMaterialReply workspaceMaterialReply) {
    workspaceMaterialReplyDAO.delete(workspaceMaterialReply);
  }

  public void deleteWorkspaceMaterialFileFieldAnswerFile(WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile) throws IOException {
    if (fileAnswerUtils.isFileSystemStorageEnabled(FileAnswerType.FILE)) {
      Long userEntityId = fieldAnswerFile.getFieldAnswer().getReply().getUserEntityId();
      if (fileAnswerUtils.isFileInFileSystem(FileAnswerType.FILE, userEntityId, fieldAnswerFile.getFileId())) {
        fileAnswerUtils.removeFileFromFileSystem(FileAnswerType.FILE, userEntityId, fieldAnswerFile.getFileId());
      }
    }
    workspaceMaterialFileFieldAnswerFileDAO.delete(fieldAnswerFile);
  }

  public void deleteWorkspaceMaterialAudioFieldAnswerClip(WorkspaceMaterialAudioFieldAnswerClip fieldAnswerAudio) throws IOException {
    if (fileAnswerUtils.isFileSystemStorageEnabled(FileAnswerType.AUDIO)) {
      Long userEntityId = fieldAnswerAudio.getFieldAnswer().getReply().getUserEntityId();
      if (fileAnswerUtils.isFileInFileSystem(FileAnswerType.AUDIO, userEntityId, fieldAnswerAudio.getClipId())) {
        fileAnswerUtils.removeFileFromFileSystem(FileAnswerType.AUDIO, userEntityId, fieldAnswerAudio.getClipId());
      }
    }
    workspaceMaterialAudioFieldAnswerClipDAO.delete(fieldAnswerAudio);
  }
  
  public void deleteWorkspaceMaterialMultiSelectFieldAnswerOption(WorkspaceMaterialMultiSelectFieldAnswerOption answerOption) {
    workspaceMaterialMultiSelectFieldAnswerOptionDAO.delete(answerOption);
  }

  /**
   * Deletes a workspace node and all data associated to it. Assumes that the node no longer has any child nodes.
   * 
   * Private mostly for safety reasons, as especially deleting workspace materials (which are nodes too) need
   * to go through extra checks for answers and such.
   * 
   * @param node Workspace node to be deleted
   */
  private void deleteWorkspaceNode(WorkspaceNode node) {

    // Node evaluations have a soft reference, so this ensures no orphans will remain  
    
    List<WorkspaceNodeEvaluation> evaluations = workspaceNodeEvaluationDAO.listByWorkspaceNodeId(node.getId());
    for (WorkspaceNodeEvaluation evaluation : evaluations) {
      evaluationDeleteController.deleteWorkspaceNodeEvaluation(evaluation);
    }
    
    // Delete the node. Thanks to entity inheritance, this will also delete associated
    // WorkspaceMaterial, WorkspaceFolder, or WorkspaceRootFolder
    
    workspaceNodeDAO.delete(node);
  }

}
