package fi.muikku.plugins.workspace;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.plugins.workspace.events.WorkspaceMaterialFieldDeleteEvent;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswerOption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;

public class WorkspaceMaterialFieldDeleteListener {
  
  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  public void onWorkspaceMaterialFieldDeleted(@Observes WorkspaceMaterialFieldDeleteEvent event) {
    WorkspaceMaterialField materialField = event.getWorkspaceMaterialField();
    
    List<WorkspaceMaterialFieldAnswer> answers = workspaceMaterialFieldAnswerController.listWorkspaceMaterialFieldAnswersByField(materialField);
    for (WorkspaceMaterialFieldAnswer answer : answers) {
      deleteFieldAnswer(answer); 
    }
  }

  private void deleteFieldAnswer(WorkspaceMaterialFieldAnswer answer) {
    if (answer instanceof WorkspaceMaterialFileFieldAnswer) {
      List<WorkspaceMaterialFileFieldAnswerFile> fileAnswerFiles = workspaceMaterialFieldAnswerController.listWorkspaceMaterialFileFieldAnswerFilesByFieldAnswer((WorkspaceMaterialFileFieldAnswer) answer);
      for (WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile : fileAnswerFiles) {
        workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialFileFieldAnswerFile(fieldAnswerFile);
      }
    } else if (answer instanceof WorkspaceMaterialMultiSelectFieldAnswer) {
      List<WorkspaceMaterialMultiSelectFieldAnswerOption> options = workspaceMaterialFieldAnswerController.listWorkspaceMaterialMultiSelectFieldAnswerOptions((WorkspaceMaterialMultiSelectFieldAnswer) answer); 
      for (WorkspaceMaterialMultiSelectFieldAnswerOption option : options) {
        workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialMultiSelectFieldAnswerOption(option);
      }
    }
    
    workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialFieldAnswer(answer);
  }
  
}
