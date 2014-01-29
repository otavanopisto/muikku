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
import fi.muikku.plugins.material.QueryFieldController;
import fi.muikku.plugins.material.fieldmeta.SelectFieldMeta;
import fi.muikku.plugins.material.fieldmeta.SelectFieldOptionMeta;
import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;
import fi.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialSelectFieldAnswer;

public class WorkspaceSelectFieldHandler extends AbstractWorkspaceFieldHandler {

  @Inject
  private QueryFieldController queryFieldController;

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;
  
  @Override
  public String getType() {
    return "application/vnd.muikku.field.select";
  }

  @Override
  public void renderField(Document ownerDocument, Element objectElement, String content, WorkspaceMaterialField workspaceMaterialField,
      WorkspaceMaterialReply workspaceMaterialReply) throws JsonParseException, JsonMappingException, IOException {

    SelectFieldMeta selectFieldMeta = (new ObjectMapper()).readValue(content, SelectFieldMeta.class);
    
    String parameterName = getHtmlFieldName(workspaceMaterialField.getName());
    WorkspaceMaterialSelectFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialSelectFieldAnswerByFieldAndReply(workspaceMaterialField, workspaceMaterialReply);
    
    switch (selectFieldMeta.getListType()) {
      case "list":
      case "dropdown":
        renderSelectField(ownerDocument, objectElement, selectFieldMeta, parameterName, fieldAnswer);
      break;
      case "radio":
        renderRadioField(ownerDocument, objectElement, selectFieldMeta, parameterName, fieldAnswer, true);
      break;
      case "radio_horz":
        renderRadioField(ownerDocument, objectElement, selectFieldMeta, parameterName, fieldAnswer, false);
      break;
      case "checklist":
        // TODO: Add proper checklist support
        renderSelectField(ownerDocument, objectElement, selectFieldMeta, parameterName, fieldAnswer);
      break;
    }
  }

  private void renderSelectField(Document ownerDocument, Element objectElement, SelectFieldMeta selectFieldMeta, String parameterName, WorkspaceMaterialSelectFieldAnswer fieldAnswer) {
    Element selectElement = ownerDocument.createElement("select");
    selectElement.setAttribute("name", parameterName);
    
    if (selectFieldMeta.getSize() != null) {
      selectElement.setAttribute("size", String.valueOf(selectFieldMeta.getSize()));
    }
    
    for (SelectFieldOptionMeta selectFieldOptionMeta : selectFieldMeta.getOptions()) {
      Element optionElement = ownerDocument.createElement("option");
      optionElement.setAttribute("value", selectFieldOptionMeta.getName());
      
      if ((fieldAnswer != null) && (fieldAnswer.getValue() != null) && fieldAnswer.getValue().getName().equals(selectFieldOptionMeta.getName())) {
        optionElement.setAttribute("selected", "selected");
      }
      
      optionElement.setTextContent(selectFieldOptionMeta.getText());
      selectElement.appendChild(optionElement);
    }
    
    Node objectParent = objectElement.getParentNode();
    objectParent.insertBefore(selectElement, objectElement);
    objectParent.removeChild(objectElement);
  }

  private void renderRadioField(Document ownerDocument, Element objectElement, SelectFieldMeta selectFieldMeta, String parameterName,
      WorkspaceMaterialSelectFieldAnswer fieldAnswer, boolean horizontal) {
    
    Node objectParent = objectElement.getParentNode();
    objectParent.insertBefore(objectElement, objectElement);
    
    for (SelectFieldOptionMeta option : selectFieldMeta.getOptions()) {
      Element inputElement = ownerDocument.createElement("input");
      inputElement.setAttribute("type", "radio");
      inputElement.setAttribute("value", option.getName());
      inputElement.setAttribute("name", parameterName);
      
      if ((fieldAnswer != null) && (fieldAnswer.getValue() != null) && fieldAnswer.getValue().getName().equals(option.getName())) {
        inputElement.setAttribute("checked", "checked");
      }
      
      // TODO: Label For ...
      Element labelElement = ownerDocument.createElement("label");
      labelElement.setTextContent(option.getText());

      objectParent.insertBefore(inputElement, objectElement);  
      objectParent.insertBefore(labelElement, objectElement);
      if (!horizontal) {
        objectParent.insertBefore(ownerDocument.createElement("br"), objectElement);      
      }
    }
    
    objectParent.removeChild(objectElement);
  }

  @Override
  public void persistField(WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String> requestParameterMap)
      throws MaterialQueryIntegrityExeption {
    
    String parameterName = getHtmlFieldName(workspaceMaterialField.getName());
    
    String value = requestParameterMap.get(parameterName);
    QuerySelectField queryField = (QuerySelectField) workspaceMaterialField.getQueryField();
    QuerySelectFieldOption option = null;
    if (StringUtils.isNotBlank(value)) {
      option = queryFieldController.findQuerySelectFieldOptionByFieldAndName(queryField, value);
      if (option == null) {
        throw new MaterialQueryIntegrityExeption("SelectFieldOption #" + queryField.getId() + " does not contain option '" + value + "'");
      }
    }
    
    WorkspaceMaterialSelectFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialSelectFieldAnswerByFieldAndReply(workspaceMaterialField, reply);
    if (option != null) {
      if (fieldAnswer != null) {
        fieldAnswer = workspaceMaterialFieldAnswerController.updateWorkspaceMaterialSelectFieldAnswerValue(fieldAnswer, option);
      } else {
        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialSelectFieldAnswer(workspaceMaterialField, reply, option);
      }
    } else {
      if (fieldAnswer != null) {
        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialSelectFieldAnswer(workspaceMaterialField, reply, null);
      }
    }
  }

}
