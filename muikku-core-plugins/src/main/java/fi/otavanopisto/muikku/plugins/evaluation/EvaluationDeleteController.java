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

public class EvaluationDeleteController {

  @Inject
  private Logger logger;

  @Inject
  private EvaluationFileStorageUtils file;

  @Inject
  private WorkspaceNodeEvaluationDAO workspaceNodeEvaluationDAO;

  @Inject
  private WorkspaceNodeEvaluationAudioClipDAO workspaceNodeEvaluationAudioClipDAO;

  public void deleteWorkspaceNodeEvaluation(WorkspaceNodeEvaluation evaluation) {
    if (evaluation != null) {
      List<WorkspaceNodeEvaluationAudioClip> evaluationAudioClips = workspaceNodeEvaluationAudioClipDAO.listByEvaluation(evaluation);
      for (WorkspaceNodeEvaluationAudioClip evaluationAudioClip : evaluationAudioClips) {
        if (file.isFileInFileSystem(evaluation.getStudentEntityId(), evaluationAudioClip.getClipId())) {
          try {
            file.removeFileFromFileSystem(evaluation.getStudentEntityId(), evaluationAudioClip.getClipId());
          } catch (IOException e) {
            logger.log(Level.SEVERE, String.format("Could not remove clip %s", evaluationAudioClip.getClipId()), e);
          }
        }

        // Remove db entry
        workspaceNodeEvaluationAudioClipDAO.delete(evaluationAudioClip);
      }

      workspaceNodeEvaluationDAO.delete(evaluation);
    }
  }

}
