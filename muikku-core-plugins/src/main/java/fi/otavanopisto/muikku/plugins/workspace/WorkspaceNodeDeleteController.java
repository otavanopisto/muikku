package fi.otavanopisto.muikku.plugins.workspace;

import java.util.List;

import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.evaluation.EvaluationDeleteController;
import fi.otavanopisto.muikku.plugins.evaluation.dao.WorkspaceNodeEvaluationDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluation;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.otavanopisto.muikku.plugins.workspace.events.WorkspaceMaterialDeleteEvent;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;

public class WorkspaceNodeDeleteController {
  
  @Inject
  private Event<WorkspaceMaterialDeleteEvent> workspaceMaterialDeleteEvent;

  @Inject
  private WorkspaceNodeDAO workspaceNodeDAO;

  @Inject
  private WorkspaceNodeEvaluationDAO workspaceNodeEvaluationDAO;
  
  @Inject
  private EvaluationDeleteController evaluationDeleteController;
  
  public void deleteWorkspaceMaterial(WorkspaceMaterial workspaceMaterial, boolean removeAnswers)
      throws WorkspaceMaterialContainsAnswersExeption {
    try {
      workspaceMaterialDeleteEvent.fire(new WorkspaceMaterialDeleteEvent(workspaceMaterial, removeAnswers));

      List<WorkspaceNode> childNodes = workspaceNodeDAO.listByParentSortByOrderNumber(workspaceMaterial);
      for (WorkspaceNode childNode : childNodes) {
        if (childNode instanceof WorkspaceMaterial) {
          deleteWorkspaceMaterial((WorkspaceMaterial) childNode, removeAnswers);
        }
        else if (childNode instanceof WorkspaceFolder) {
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

    deleteWorkspaceNode(workspaceMaterial);
  }

  /**
   * Deletes a workspace node and all data associated to it. Assumes that the node no longer has any child nodes. 
   * 
   * @param node Workspace node to be deleted
   */
  public void deleteWorkspaceNode(WorkspaceNode node) {
    // Node evaluations have a soft reference, so this ensures no orphans will remain  
    List<WorkspaceNodeEvaluation> evaluations = workspaceNodeEvaluationDAO.listByWorkspaceNodeId(node.getId());
    for (WorkspaceNodeEvaluation evaluation : evaluations) {
      evaluationDeleteController.deleteWorkspaceNodeEvaluation(evaluation);
    }
    if (node instanceof WorkspaceMaterial) {
      // TODO Stage 2: If the node is a material and that material would be orphaned, delete the material as well
    }
    // Delete the node. Thanks to inheritance, this will also delete associated WorkspaceMaterial, WorkspaceFolder, and WorkspaceRootFolder
    workspaceNodeDAO.delete(node);
  }

}
