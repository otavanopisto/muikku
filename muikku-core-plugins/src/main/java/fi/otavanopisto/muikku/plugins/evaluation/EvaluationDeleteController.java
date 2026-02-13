package fi.otavanopisto.muikku.plugins.evaluation;

import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.evaluation.dao.WorkspaceNodeEvaluationAudioClipDAO;
import fi.otavanopisto.muikku.plugins.evaluation.dao.WorkspaceNodeEvaluationDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluation;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluationAudioClip;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialReplyDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;

public class EvaluationDeleteController {

  @Inject
  private Logger logger;

  @Inject
  private EvaluationFileStorageUtils file;
  
  @Inject
  private WorkspaceMaterialDAO workspaceMaterialDAO;

  @Inject
  private WorkspaceMaterialReplyDAO workspaceMaterialReplyDAO;

  @Inject
  private WorkspaceNodeEvaluationDAO workspaceNodeEvaluationDAO;

  @Inject
  private WorkspaceNodeEvaluationAudioClipDAO workspaceNodeEvaluationAudioClipDAO;

  public void deleteWorkspaceNodeEvaluation(WorkspaceNodeEvaluation evaluation) {
    if (evaluation != null) {
      
      // First get rid of audio clips associated with the evaluation
      
      List<WorkspaceNodeEvaluationAudioClip> evaluationAudioClips = workspaceNodeEvaluationAudioClipDAO.listByEvaluation(evaluation);
      for (WorkspaceNodeEvaluationAudioClip evaluationAudioClip : evaluationAudioClips) {
        if (file.isFileInFileSystem(evaluation.getStudentEntityId(), evaluationAudioClip.getClipId())) {
          try {
            file.removeFileFromFileSystem(evaluation.getStudentEntityId(), evaluationAudioClip.getClipId());
          } catch (IOException e) {
            logger.log(Level.SEVERE, String.format("Could not remove clip %s", evaluationAudioClip.getClipId()), e);
          }
        }

        // Remove the audio clip from the database
        
        workspaceNodeEvaluationAudioClipDAO.delete(evaluationAudioClip);
      }
      
      // Remove the evaluation itself

      workspaceNodeEvaluationDAO.delete(evaluation);
      
      // #7584: Adjust user's reply object accordingly
      
      WorkspaceNode node = workspaceMaterialDAO.findById(evaluation.getWorkspaceNodeId()); 
      if (node != null && node instanceof WorkspaceMaterial) {
        WorkspaceMaterialReply reply = workspaceMaterialReplyDAO.findByWorkspaceMaterialAndUserEntityId((WorkspaceMaterial) node, evaluation.getStudentEntityId()); 
        if (reply != null) {
          WorkspaceMaterialReplyState newState = null;
          switch (reply.getState()) {
            case PASSED:
            case FAILED:
            case INCOMPLETE:
              if (reply.getSubmitted() != null && reply.getWithdrawn() != null) {
                newState = reply.getSubmitted().before(reply.getWithdrawn()) ? WorkspaceMaterialReplyState.WITHDRAWN : WorkspaceMaterialReplyState.SUBMITTED;
              }
              else if (reply.getSubmitted() != null) {
                newState = WorkspaceMaterialReplyState.SUBMITTED;
              }
              else {
                newState = WorkspaceMaterialReplyState.ANSWERED;
              }
              workspaceMaterialReplyDAO.updateState(reply, newState);
              break;
            default:
              break;
          }
        }
      }
    }
  }

}
