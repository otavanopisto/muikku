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
import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;
import fi.muikku.plugins.material.model.field.OptionListField;
import fi.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialSelectFieldAnswer;

public class WorkspaceOptionListFieldHandler extends AbstractWorkspaceFieldHandler {

  @Inject
  private QueryFieldController queryFieldController;

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;
  
  @Override
  public String getType() {
    return "application/vnd.muikku.field.option-list";
  }

  @Override
  public void renderField(Document ownerDocument, Element objectElement, String content, WorkspaceMaterialField workspaceMaterialField,
      WorkspaceMaterialReply workspaceMaterialReply) throws JsonParseException, JsonMappingException, IOException {

    OptionListField optionListField = (new ObjectMapper()).readValue(content, OptionListField.class);
    
    String parameterName = getHtmlFieldName(workspaceMaterialField.getName());
    WorkspaceMaterialSelectFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialSelectFieldAnswerByQueryFieldAndReply(workspaceMaterialField, workspaceMaterialReply);
    
    Element selectElement = ownerDocument.createElement("select");
    selectElement.setAttribute("name", parameterName);
    
    for (OptionListField.Option option : optionListField.getOptions()) {
      Element optionElement = ownerDocument.createElement("option");
      optionElement.setAttribute("value", option.getName());
      
      if ((fieldAnswer != null) && (fieldAnswer.getValue() != null) && fieldAnswer.getValue().getName().equals(option.getName())) {
        optionElement.setAttribute("selected", "selected");
      }
      
      optionElement.setTextContent(option.getText());
      selectElement.appendChild(optionElement);
    }

    Node objectParent = objectElement.getParentNode();
    objectParent.insertBefore(selectElement, objectElement);
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
    
    WorkspaceMaterialSelectFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialSelectFieldAnswerByQueryFieldAndReply(workspaceMaterialField, reply);
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
