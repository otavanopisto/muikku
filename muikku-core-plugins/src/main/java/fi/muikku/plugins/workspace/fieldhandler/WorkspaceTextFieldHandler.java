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
import fi.muikku.plugins.material.fieldmeta.TextFieldMeta;
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

    TextFieldMeta textFieldMeta = (new ObjectMapper()).readValue(content, TextFieldMeta.class);
    
    String parameterName = getHtmlFieldName(workspaceMaterialField.getName());
    String value = null;
    
    WorkspaceMaterialTextFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialTextFieldAnswerByFieldAndReply(workspaceMaterialField, workspaceMaterialReply);
    if (fieldAnswer != null) {
      value = fieldAnswer.getValue();
    }
    
    Element inputElement = ownerDocument.createElement("input");
    inputElement.setAttribute("class", "muikku-text-field");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("name", parameterName);
    inputElement.setAttribute("size", String.valueOf(textFieldMeta.getColumns()));
    inputElement.setAttribute("placeholder", textFieldMeta.getHelp());
    inputElement.setAttribute("title", textFieldMeta.getHint());
    
    if (StringUtils.isNotEmpty(value)) {
      inputElement.setAttribute("value", value);
    }
    
    Node objectParent = objectElement.getParentNode();
    objectParent.insertBefore(inputElement, objectElement);
    objectParent.removeChild(objectElement);
  }

  @Override
  public void persistField(WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String[]> requestParameterMap)
      throws MaterialQueryIntegrityExeption {

    String parameterName = getHtmlFieldName(workspaceMaterialField.getName());    
    String parameterValue = getRequestParameterMapFirstValue(requestParameterMap, parameterName);
    
    WorkspaceMaterialTextFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialTextFieldAnswerByFieldAndReply(workspaceMaterialField, reply);
    if (StringUtils.isNotBlank(parameterValue)) {
      if (fieldAnswer == null) {
        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialTextFieldAnswer(workspaceMaterialField, reply, parameterValue);
      } else {
        fieldAnswer = workspaceMaterialFieldAnswerController.updateWorkspaceMaterialTextFieldAnswerValue(fieldAnswer, parameterValue);
      }
    } else {
      if (fieldAnswer != null) {
        workspaceMaterialFieldAnswerController.updateWorkspaceMaterialTextFieldAnswerValue(fieldAnswer, null);
      }
    }
  }
  
}
