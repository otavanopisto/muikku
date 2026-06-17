package fi.otavanopisto.muikku.plugins.workspace.fieldio;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.material.QuerySelectField;
import fi.otavanopisto.muikku.model.material.QuerySelectFieldOption;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialField;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialSelectFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;

public class WorkspaceSelectFieldIOHandler implements WorkspaceFieldIOHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Override
  public void store(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) throws WorkspaceFieldIOException {
    WorkspaceMaterialSelectFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialSelectFieldAnswerByFieldAndReply(field, reply);
    if (StringUtils.isNotBlank(value)) {
      QuerySelectFieldOption option = workspaceMaterialFieldAnswerController.findSelectFieldOptionByName((QuerySelectField) field.getQueryField(), value);
      if (fieldAnswer == null) {
        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialSelectFieldAnswer(field, reply, option);
      } else {
        fieldAnswer = workspaceMaterialFieldAnswerController.updateWorkspaceMaterialSelectFieldAnswerValue(fieldAnswer, option);
      }
    } else {
      if (fieldAnswer != null) {
        workspaceMaterialFieldAnswerController.updateWorkspaceMaterialSelectFieldAnswerValue(fieldAnswer, null);
      }
    }
  }

  @Override
  public String retrieve(WorkspaceMaterialField field, WorkspaceMaterialReply reply) throws WorkspaceFieldIOException{
    WorkspaceMaterialSelectFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialSelectFieldAnswerByFieldAndReply(field, reply);
    if (fieldAnswer != null) {
      if (fieldAnswer.getValue() != null) {
          return fieldAnswer.getValue().getName();
      }
    }
    return null;
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.select";
  }

}
