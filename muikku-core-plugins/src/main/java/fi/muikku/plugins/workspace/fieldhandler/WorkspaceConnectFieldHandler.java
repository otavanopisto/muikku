package fi.muikku.plugins.workspace.fieldhandler;

import java.io.IOException;
import java.util.Map;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldMeta;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceConnectFieldHandler implements WorkspaceFieldHandler {

  private static final int ALPHABET_SIZE = 26;

  @Override
  public String getType() {
    return "application/vnd.muikku.field.connect";
  }

  @Override
  public void renderField(Document ownerDocument, Element objectElement, String content, WorkspaceMaterialField workspaceMaterialField,
      WorkspaceMaterialReply workspaceMaterialReply) throws JsonParseException, JsonMappingException, IOException {

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
      
      fi.muikku.plugins.material.fieldmeta.ConnectFieldOptionMeta connectFieldOptionMeta = rowIndex < fieldsSize ? connectFieldMeta.getFields().get(rowIndex) : null;
      fi.muikku.plugins.material.fieldmeta.ConnectFieldOptionMeta counterpart = rowIndex < counterpartsSize ? connectFieldMeta.getCounterparts().get(rowIndex) : null;

      tdTermElement.setAttribute("class", "muikku-connect-field-term-cell");
      tdValueElement.setAttribute("class", "muikku-connect-field-value-cell");
      tdCounterpartElement.setAttribute("class", "muikku-connect-field-counterpart-cell");
      
      if (connectFieldOptionMeta != null) {
        tdTermElement.setTextContent((rowIndex + 1) + " - " + connectFieldOptionMeta.getText());
        tdTermElement.setAttribute("data-muikku-connect-field-option-name", connectFieldOptionMeta.getName());

        inputElement.setAttribute("type", "text");
        inputElement.setAttribute("name", workspaceMaterialField.getName() + "." + connectFieldOptionMeta.getName());
        inputElement.setAttribute("class", "muikku-connect-field-value");
        
        tdValueElement.appendChild(inputElement);
      }

      if (counterpart != null) {
        tdCounterpartElement.setTextContent(getExcelStyleLetterIndex(rowIndex) + " - " + counterpart.getText());
        tdCounterpartElement.setAttribute("data-muikku-connect-field-option-name", counterpart.getName());
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
  public void persistField(WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String> requestParameterMap)
      throws MaterialQueryIntegrityExeption {
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
