package fi.muikku.plugins.workspace.fieldhandler;

import java.io.IOException;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.material.model.field.TextField;
import fi.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer;

public class WorkspaceTextFieldHandler extends AbstractWorkspaceFieldHandler {
  
  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Override
  public String getType() {
    return "application/vnd.muikku.field.text";
  }

  @Override
  public void renderField(Document ownerDocument, Element objectElement, String content, WorkspaceMaterialField workspaceMaterialField,
      WorkspaceMaterialReply workspaceMaterialReply) throws JsonParseException, JsonMappingException, IOException {

    TextField textField = (new ObjectMapper()).readValue(content, TextField.class);
    
    String parameterName = getHtmlFieldName(workspaceMaterialField.getName());
    String value = null;
    
    WorkspaceMaterialTextFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialTextFieldAnswerByQueryFieldAndReply(workspaceMaterialField, workspaceMaterialReply);
    if (fieldAnswer != null) {
      value = fieldAnswer.getValue();
    }
    
    Element inputElement = ownerDocument.createElement("input");
    inputElement.setAttribute("class", "muikku-text-field");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("name", parameterName);
    inputElement.setAttribute("size", String.valueOf(textField.getColumns()));
    inputElement.setAttribute("placeholder", textField.getHelp());
    inputElement.setAttribute("title", textField.getHint());
    inputElement.setAttribute("value", value);
    
    Node objectParent = objectElement.getParentNode();
    objectParent.insertBefore(inputElement, objectElement);
    objectParent.removeChild(objectElement);
  }

  @Override
  public void persistField(WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String> requestParameterMap)
      throws MaterialQueryIntegrityExeption {

    String parameterName = getHtmlFieldName(workspaceMaterialField.getName());
    String value = requestParameterMap.get(parameterName);
    
    WorkspaceMaterialTextFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialTextFieldAnswerByQueryFieldAndReply(workspaceMaterialField, reply);
    if (StringUtils.isNotBlank(value)) {
      if (fieldAnswer == null) {
        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialTextFieldAnswer(workspaceMaterialField, reply, value);
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
