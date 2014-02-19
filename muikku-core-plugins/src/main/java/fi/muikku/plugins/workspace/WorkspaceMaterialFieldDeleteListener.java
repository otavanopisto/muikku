package fi.muikku.plugins.workspace;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.plugins.workspace.events.WorkspaceMaterialFieldDeleteEvent;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFieldAnswer;

public class WorkspaceMaterialFieldDeleteListener {
  
  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  public void onWorkspaceMaterialFieldDeleted(@Observes WorkspaceMaterialFieldDeleteEvent event) {
    WorkspaceMaterialField materialField = event.getWorkspaceMaterialField();
    
    List<WorkspaceMaterialFieldAnswer> answers = workspaceMaterialFieldAnswerController.listWorkspaceMaterialFieldAnswersByField(materialField);
    for (WorkspaceMaterialFieldAnswer answer : answers) {
      workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialFieldAnswer(answer); 
    }
  }
  
}
