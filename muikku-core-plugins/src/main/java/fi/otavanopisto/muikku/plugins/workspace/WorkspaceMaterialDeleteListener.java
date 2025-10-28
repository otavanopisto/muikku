package fi.otavanopisto.muikku.plugins.workspace;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.workspace.events.WorkspaceMaterialDeleteEvent;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;

@ApplicationScoped
public class WorkspaceMaterialDeleteListener {

  @Inject
  private WorkspaceMaterialFieldController workspaceMaterialFieldController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;
  
  public void onWorkspaceMaterialDelete(@Observes WorkspaceMaterialDeleteEvent event) throws WorkspaceMaterialContainsAnswersExeption {
    WorkspaceMaterial workspaceMaterial = event.getWorkspaceNode();
    
    List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByWorkspaceMaterial(workspaceMaterial);
    for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
      workspaceMaterialFieldController.deleteWorkspaceMaterialField(workspaceMaterialField, event.getRemoveAnswers());
    }
    
    List<WorkspaceMaterialReply> workspaceMaterialReplies = workspaceMaterialReplyController.listWorkspaceMaterialRepliesByWorkspaceMaterial(workspaceMaterial);
    for (WorkspaceMaterialReply workspaceMaterialReply : workspaceMaterialReplies) {
      workspaceMaterialReplyController.deleteWorkspaceMaterialReply(workspaceMaterialReply);
    }
  }
  
}
