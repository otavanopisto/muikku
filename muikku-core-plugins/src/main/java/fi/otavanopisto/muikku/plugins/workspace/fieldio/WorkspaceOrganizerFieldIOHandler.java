package fi.otavanopisto.muikku.plugins.workspace.fieldio;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialField;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialOrganizerFieldAnswer;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;

public class WorkspaceOrganizerFieldIOHandler implements WorkspaceFieldIOHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Override
  public void store(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) throws WorkspaceFieldIOException {
    WorkspaceMaterialOrganizerFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialOrganizerFieldAnswerByFieldAndReply(field, reply);
    if (StringUtils.isNotBlank(value)) {
      if (fieldAnswer == null) {
        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialOrganizerFieldAnswer(field, reply, value);
      } else {
        fieldAnswer = workspaceMaterialFieldAnswerController.updateWorkspaceMaterialOrganizerFieldAnswerValue(fieldAnswer, value);
      }
    } else {
      if (fieldAnswer != null) {
        workspaceMaterialFieldAnswerController.updateWorkspaceMaterialOrganizerFieldAnswerValue(fieldAnswer, null);
      }
    }
  }

  @Override
  public String retrieve(WorkspaceMaterialField field, WorkspaceMaterialReply reply) throws WorkspaceFieldIOException{
    WorkspaceMaterialOrganizerFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialOrganizerFieldAnswerByFieldAndReply(field, reply);
    if (fieldAnswer != null) {
      return fieldAnswer.getValue();
    }
    
    return null;
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.organizer";
  }

}
