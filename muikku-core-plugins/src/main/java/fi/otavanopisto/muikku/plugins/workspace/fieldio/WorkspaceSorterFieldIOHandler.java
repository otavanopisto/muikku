package fi.otavanopisto.muikku.plugins.workspace.fieldio;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialSorterFieldAnswer;

public class WorkspaceSorterFieldIOHandler implements WorkspaceFieldIOHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Override
  public void store(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) throws WorkspaceFieldIOException {
    WorkspaceMaterialSorterFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialSorterFieldAnswerByFieldAndReply(field, reply);
    if (StringUtils.isNotBlank(value)) {
      if (fieldAnswer == null) {
        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialSorterFieldAnswer(field, reply, value);
      } else {
        fieldAnswer = workspaceMaterialFieldAnswerController.updateWorkspaceMaterialSorterFieldAnswerValue(fieldAnswer, value);
      }
    } else {
      if (fieldAnswer != null) {
        workspaceMaterialFieldAnswerController.updateWorkspaceMaterialSorterFieldAnswerValue(fieldAnswer, null);
      }
    }
  }

  @Override
  public String retrieve(WorkspaceMaterialField field, WorkspaceMaterialReply reply) throws WorkspaceFieldIOException{
    WorkspaceMaterialSorterFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialSorterFieldAnswerByFieldAndReply(field, reply);
    if (fieldAnswer != null) {
      return fieldAnswer.getValue();
    }
    
    return null;
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.sorter";
  }

}
