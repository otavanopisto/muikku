package fi.muikku.plugins.workspace;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.plugins.workspace.events.WorkspaceMaterialDeleteEvent;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;

@Stateless
public class WorkspaceMaterialDeleteListener {

  @Inject
  private WorkspaceMaterialFieldController workspaceMaterialFieldController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;
  
  public void onWorkspaceMaterialDelete(@Observes WorkspaceMaterialDeleteEvent event) {
    WorkspaceMaterial workspaceMaterial = event.getWorkspaceNode();
    
    List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByWorkspaceMaterial(workspaceMaterial);
    for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
      workspaceMaterialFieldController.deleteWorkspaceMaterialField(workspaceMaterialField);
    }
    
    List<WorkspaceMaterialReply> workspaceMaterialReplies = workspaceMaterialReplyController.listWorkspaceMaterialRepliesByWorkspaceMaterial(workspaceMaterial);
    for (WorkspaceMaterialReply workspaceMaterialReply : workspaceMaterialReplies) {
      workspaceMaterialReplyController.deleteWorkspaceMaterialReply(workspaceMaterialReply);
    }
  }
  
}
