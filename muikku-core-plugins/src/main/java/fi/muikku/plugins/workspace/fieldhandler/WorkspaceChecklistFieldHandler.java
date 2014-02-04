package fi.muikku.plugins.workspace.fieldhandler;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.material.QueryChecklistFieldController;
import fi.muikku.plugins.material.fieldmeta.ChecklistFieldMeta;
import fi.muikku.plugins.material.fieldmeta.ChecklistFieldOptionMeta;
import fi.muikku.plugins.material.model.QueryChecklistField;
import fi.muikku.plugins.material.model.QueryChecklistFieldOption;
import fi.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswerOption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceChecklistFieldHandler extends AbstractWorkspaceFieldHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Inject
  private QueryChecklistFieldController queryChecklistFieldController;
  
  @Override
  public String getType() {
    return "application/vnd.muikku.field.checklist";
  }

  @Override
  public void renderField(Document ownerDocument, Element objectElement, String content, WorkspaceMaterialField workspaceMaterialField,
      WorkspaceMaterialReply workspaceMaterialReply) throws JsonParseException, JsonMappingException, IOException {

    ChecklistFieldMeta fieldMeta = (new ObjectMapper()).readValue(content, ChecklistFieldMeta.class);
    String parameterName = getHtmlFieldName(workspaceMaterialField.getName());
    
    Node objectParent = objectElement.getParentNode();
    objectParent.insertBefore(objectElement, objectElement);
    
    WorkspaceMaterialChecklistFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialChecklistFieldAnswerByFieldAndReply(workspaceMaterialField, workspaceMaterialReply);
    
    
    for (ChecklistFieldOptionMeta option : fieldMeta.getOptions()) {
      QueryChecklistFieldOption fieldOption = queryChecklistFieldController.findQueryChecklistFieldOptionByFieldAndName((QueryChecklistField) workspaceMaterialField.getQueryField(), option.getName());
      boolean checked = false;
      if (fieldAnswer != null) {
        checked = workspaceMaterialFieldAnswerController.findWorkspaceMaterialChecklistFieldAnswerOptionByFieldAnswerAndOption(fieldAnswer, fieldOption) != null;
      }
      
      Element inputElement = ownerDocument.createElement("input");
      inputElement.setAttribute("type", "checkbox");
      inputElement.setAttribute("value", option.getName());
      inputElement.setAttribute("name", parameterName);
      
      if (checked) {
        inputElement.setAttribute("checked", "checked");
      }
      
      // TODO: Label For ...
      Element labelElement = ownerDocument.createElement("label");
      labelElement.setTextContent(option.getText());

      objectParent.insertBefore(inputElement, objectElement);  
      objectParent.insertBefore(labelElement, objectElement);
      objectParent.insertBefore(ownerDocument.createElement("br"), objectElement);      
    }
    
    objectParent.removeChild(objectElement);
  }

  @Override
  public void persistField(WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String[]> requestParameterMap)
      throws MaterialQueryIntegrityExeption {

    String parameterName = getHtmlFieldName(workspaceMaterialField.getName());
    List<String> parameterValues = Arrays.asList(requestParameterMap.get(parameterName));
    QueryChecklistField queryField = (QueryChecklistField) workspaceMaterialField.getQueryField();
    List<QueryChecklistFieldOption> fieldOptions = queryChecklistFieldController.listQueryChecklistFieldOptionsByField(queryField);
    
    WorkspaceMaterialChecklistFieldAnswer workspaceMaterialChecklistFieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialChecklistFieldAnswerByFieldAndReply(workspaceMaterialField, reply);
    if (workspaceMaterialChecklistFieldAnswer == null) {
      workspaceMaterialChecklistFieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialChecklistFieldAnswer(workspaceMaterialField, reply);
    }
    
    for (QueryChecklistFieldOption fieldOption : fieldOptions) {
      boolean checked = parameterValues.contains(fieldOption.getName());
      WorkspaceMaterialChecklistFieldAnswerOption answerOption = workspaceMaterialFieldAnswerController.findWorkspaceMaterialChecklistFieldAnswerOptionByFieldAnswerAndOption(workspaceMaterialChecklistFieldAnswer, fieldOption);
      
      if (checked) {
        if (answerOption == null) {
          answerOption = workspaceMaterialFieldAnswerController.createWorkspaceMaterialChecklistFieldAnswerOption(workspaceMaterialChecklistFieldAnswer, fieldOption);
        }
      } else {
        if (answerOption != null) {
          workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialChecklistFieldAnswerOption(answerOption);
        }
      }
    }
    
  }

}
