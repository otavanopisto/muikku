package fi.muikku.plugins.workspace.fieldhandler;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.material.QueryConnectFieldController;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldMeta;
import fi.muikku.plugins.material.model.QueryConnectField;
import fi.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.muikku.plugins.material.model.QueryConnectFieldTerm;
import fi.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialConnectFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceConnectFieldHandler extends AbstractWorkspaceFieldHandler {
  
  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Inject
  private QueryConnectFieldController queryConnectFieldController;
  
  private static final int ALPHABET_SIZE = 26;

  @Override
  public String getType() {
    return "application/vnd.muikku.field.connect";
  }

  @Override
  public void renderField(Document ownerDocument, Element objectElement, String content, WorkspaceMaterialField workspaceMaterialField,
      WorkspaceMaterialReply workspaceMaterialReply) throws JsonParseException, JsonMappingException, IOException, MaterialQueryIntegrityExeption {

    QueryConnectField queryConnectField = (QueryConnectField) workspaceMaterialField.getQueryField();
    
    ConnectFieldMeta connectFieldMeta = (new ObjectMapper()).readValue(content, ConnectFieldMeta.class);
    
    Element tableElement = ownerDocument.createElement("table");
    tableElement.setAttribute("class", "muikku-connect-field-table");

    Element tbodyElement = ownerDocument.createElement("tbody");
    
    int fieldsSize = connectFieldMeta.getFields().size();
    int counterpartsSize = connectFieldMeta.getCounterparts().size();
    int rowCount = Math.max(fieldsSize, counterpartsSize);
    
    for (int rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      Element trElement = ownerDocument.createElement("tr");
      Element tdTermElement = ownerDocument.createElement("td");
      Element tdValueElement = ownerDocument.createElement("td");
      Element tdCounterpartElement = ownerDocument.createElement("td");
      Element inputElement = ownerDocument.createElement("input");
      
      fi.muikku.plugins.material.fieldmeta.ConnectFieldOptionMeta connectFieldTermMeta = rowIndex < fieldsSize ? connectFieldMeta.getFields().get(rowIndex) : null;
      fi.muikku.plugins.material.fieldmeta.ConnectFieldOptionMeta connectFieldCounterpartMeta = rowIndex < counterpartsSize ? connectFieldMeta.getCounterparts().get(rowIndex) : null;

      tdTermElement.setAttribute("class", "muikku-connect-field-term-cell");
      tdValueElement.setAttribute("class", "muikku-connect-field-value-cell");
      tdCounterpartElement.setAttribute("class", "muikku-connect-field-counterpart-cell");
      
      if (connectFieldTermMeta != null) {
        QueryConnectFieldTerm term = queryConnectFieldController.findQueryConnectFieldTermByFieldAndName(queryConnectField, connectFieldTermMeta.getName());
        if (term == null) {
          throw new MaterialQueryIntegrityExeption("Query Connect Field Term " +  connectFieldTermMeta.getName() + " does not exist");
        }
        
        tdTermElement.setTextContent((rowIndex + 1) + " - " + connectFieldTermMeta.getText());
        tdTermElement.setAttribute("data-muikku-connect-field-option-name", connectFieldTermMeta.getName());

        inputElement.setAttribute("type", "text");
        inputElement.setAttribute("name", DigestUtils.md5Hex(workspaceMaterialField.getName() + "." + term.getId()));
        inputElement.setAttribute("class", "muikku-connect-field-value");

        WorkspaceMaterialConnectFieldAnswer connectFieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialConnectFieldAnswerByFieldAndReplyAndTerm(workspaceMaterialField, workspaceMaterialReply, term);
        if ((connectFieldAnswer != null) && (connectFieldAnswer.getCounterpart() != null)) {
          inputElement.setAttribute("value", connectFieldAnswer.getCounterpart().getName());
        }
        
        tdValueElement.appendChild(inputElement);
      }

      if (connectFieldCounterpartMeta != null) {
        tdCounterpartElement.setTextContent(getExcelStyleLetterIndex(rowIndex) + " - " + connectFieldCounterpartMeta.getText());
        tdCounterpartElement.setAttribute("data-muikku-connect-field-option-name", connectFieldCounterpartMeta.getName());
      }
      
      trElement.appendChild(tdTermElement);
      trElement.appendChild(tdValueElement);
      trElement.appendChild(tdCounterpartElement);
      tbodyElement.appendChild(trElement);
    }
    
    tableElement.appendChild(tbodyElement);
    
    Node objectParent = objectElement.getParentNode();
    objectParent.insertBefore(tableElement, objectElement);
    objectParent.removeChild(objectElement);
  }

  @Override
  public void persistField(WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String[]> requestParameterMap)
      throws MaterialQueryIntegrityExeption {
    
    QueryConnectField queryConnectField = (QueryConnectField) workspaceMaterialField.getQueryField();
    if (queryConnectField != null) {
      List<QueryConnectFieldTerm> terms = queryConnectFieldController.listConnectFieldTermsByField(queryConnectField);
      for (QueryConnectFieldTerm term : terms) {
        String parameterName = DigestUtils.md5Hex(workspaceMaterialField.getName() + "." + term.getId());
        String parameterValue = getRequestParameterMapFirstValue(requestParameterMap, parameterName);
        QueryConnectFieldCounterpart counterpart = StringUtils.isNotEmpty(parameterValue) ? queryConnectFieldController.findQueryConnectFieldCounterpartByFieldAndName(queryConnectField, parameterValue) : null;
        
        WorkspaceMaterialConnectFieldAnswer connectFieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialConnectFieldAnswerByFieldAndReplyAndTerm(workspaceMaterialField, reply, term);
        if (connectFieldAnswer != null) {
          workspaceMaterialFieldAnswerController.updateWorkspaceMaterialConnectFieldAnswerCounterpart(connectFieldAnswer, counterpart);
        } else {
          if (counterpart != null) {
            workspaceMaterialFieldAnswerController.createWorkspaceMaterialConnectFieldAnswer(workspaceMaterialField, reply, term, counterpart);
          }
        }
      }
    } else {
      throw new MaterialQueryIntegrityExeption("Workspace material connect field #" + workspaceMaterialField.getId() + " points to non-existing field ");
    }
  }

  private String getExcelStyleLetterIndex(int numericIndex) {   
    String result = "";
    
    do {
      int charIndex = numericIndex % ALPHABET_SIZE;
      numericIndex /= ALPHABET_SIZE;
      numericIndex -= 1;
      
      result = new String(Character.toChars(charIndex + 'A')) + result;
    } while (numericIndex > -1);
    
    return result;
  }

  
  
}
