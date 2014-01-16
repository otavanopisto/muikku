package fi.muikku.plugins.workspace;

import java.util.Map;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.plugins.materialfields.model.QueryTextField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer;

@Dependent
@Stateless
public class WorkspaceMaterialTextFieldAnswerPersistenceHandler implements WorkspaceMaterialFieldAnswerPersistenceHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;
  
  
  @Override
  public String getFieldType() {
    return "text";
  }

  @Override
  public void persistField(String fieldPrefix, WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String> requestParameterMap) {
    String parameterName = fieldPrefix + workspaceMaterialField.getName();
    String value = requestParameterMap.get(parameterName);
    QueryTextField queryField = (QueryTextField) workspaceMaterialField.getQueryField();
    
    WorkspaceMaterialTextFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialTextFieldAnswerByQueryFieldAndReply(queryField, reply);
    if (StringUtils.isNotBlank(value)) {
      if (fieldAnswer == null) {
        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialTextFieldAnswer(queryField, reply, value);
      } else {
        fieldAnswer = workspaceMaterialFieldAnswerController.updateWorkspaceMaterialTextFieldAnswerValue(fieldAnswer, value);
      }
    } else {
      if (fieldAnswer != null) {
        workspaceMaterialFieldAnswerController.updateWorkspaceMaterialTextFieldAnswerValue(fieldAnswer, null);
      }
    }
  }

}
