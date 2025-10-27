package fi.otavanopisto.muikku.plugins.workspace;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluation;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;

public class WorkspaceNodeDeleteController {
  
  @Inject
  private WorkspaceNodeDAO workspaceNodeDAO;
  
  @Inject
  private EvaluationController evaluationController;
  
  /**
   * Deletes a workspace node and all data associated to it. Assumes that the node no longer has any child nodes. 
   * 
   * @param node Workspace node to be deleted
   */
  public void deleteWorkspaceNode(WorkspaceNode node) {
    // Node evaluations have a soft reference, so this ensures no orphans will remain  
    List<WorkspaceNodeEvaluation> evaluations = evaluationController.listWorkspaceNodeEvaluationsByWorkspaceNodeId(node.getId());
    for (WorkspaceNodeEvaluation evaluation : evaluations) {
      evaluationController.deleteWorkspaceNodeEvaluation(evaluation);
    }
    if (node instanceof WorkspaceMaterial) {
      // TODO Stage 2: If the node is a material and that material would be orphaned, delete the material as well
    }
    // Delete the node. Thanks to inheritance, this will also delete associated WorkspaceMaterial, WorkspaceFolder, and WorkspaceRootFolder
    workspaceNodeDAO.delete(node);
  }

}
