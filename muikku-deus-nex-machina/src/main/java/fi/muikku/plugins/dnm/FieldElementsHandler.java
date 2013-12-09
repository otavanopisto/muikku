package fi.muikku.plugins.dnm;

import java.io.IOException;
import java.util.List;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.w3c.dom.DOMException;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import fi.muikku.plugins.dnm.parser.content.ConnectFieldOption;
import fi.muikku.plugins.dnm.parser.content.DeusNexFieldElementHandler;
import fi.muikku.plugins.dnm.parser.content.OptionListOption;
import fi.muikku.plugins.dnm.parser.content.RightAnswer;
import fi.muikku.plugins.dnm.parser.structure.DeusNexDocument;
import fi.muikku.plugins.dnm.translator.FieldTranslator;
import fi.muikku.plugins.material.model.field.ConnectField;
import fi.muikku.plugins.material.model.field.OptionListField;
import fi.muikku.plugins.material.model.field.TextField;

class FieldElementsHandler implements DeusNexFieldElementHandler {

  public FieldElementsHandler(DeusNexDocument deusNexDocument) {
    this.deusNexDocument = deusNexDocument;
    this.fieldTranslator = new FieldTranslator();
  }

  private Element wrapWithObjectElement(org.w3c.dom.Document ownerDocument, String type, Element content, Object metadata) {
    ObjectMapper objectMapper = new ObjectMapper();
    
    Element objectElement = ownerDocument.createElement("object");
    objectElement.setAttribute("type", type);

    Element paramTypeElement = ownerDocument.createElement("param");
    paramTypeElement.setAttribute("name", "type");
    paramTypeElement.setAttribute("value", "application/json");

    Element paramContentElement = ownerDocument.createElement("param");
    paramContentElement.setAttribute("name", "content");
    try {
      paramContentElement.setAttribute("value", objectMapper.writeValueAsString(metadata));
    } catch (DOMException | IOException e) {
      e.printStackTrace();
    }

    objectElement.appendChild(paramTypeElement);
    objectElement.appendChild(paramContentElement);
    objectElement.appendChild(content);
    
    return objectElement;
  }

  @Override
  public Node handleTextField(org.w3c.dom.Document ownerDocument, String paramName, Integer columns, List<RightAnswer> rightAnswers) {
    // TODO: This is just for show, real implementation depends on QueryMaterial implementation
   
    Object textFieldData = fieldTranslator.translateTextField(paramName, columns, rightAnswers);

    Element inputElement = ownerDocument.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("name", paramName);
    inputElement.setAttribute("size", String.valueOf(columns));

    return wrapWithObjectElement(ownerDocument, "application/vnd.muikku.field.text", inputElement, textFieldData);
  }

  @Override
  public Node handleOptionList(org.w3c.dom.Document ownerDocument, String paramName, String type, List<OptionListOption> options) {
    // TODO: This is just for show, real implementation depends on QueryMaterial implementation
    
    Object optionListFieldData = fieldTranslator.translateOptionList(paramName, type, options);

    Element selectElement = ownerDocument.createElement("select");
    selectElement.setAttribute("name", paramName);

    for (OptionListOption option : options) {
      Element optionElement = ownerDocument.createElement("option");
      optionElement.setAttribute("value", option.getName());
      optionElement.setTextContent(option.getText());
      selectElement.appendChild(optionElement);
    }

    return wrapWithObjectElement(ownerDocument, "application/vnd.muikku.field.option-list", selectElement, optionListFieldData);
  }

  @Override
  public Node handleConnectField(org.w3c.dom.Document ownerDocument, String paramName, List<ConnectFieldOption> options) {
    Object connectFieldData = fieldTranslator.translateConnectField(paramName, options);

    Element table = ownerDocument.createElement("table");
    Element tbody = ownerDocument.createElement("tbody");
    for (ConnectFieldOption connectFieldOption : options) {
      Element tr = ownerDocument.createElement("tr");
      Element tdLeft = ownerDocument.createElement("td");
      Element tdCenter = ownerDocument.createElement("td");
      Element tdRight = ownerDocument.createElement("td");
      Element input = ownerDocument.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("name", "");

      tdLeft.setTextContent(connectFieldOption.getTerm());
      tdCenter.appendChild(input);
      tdRight.setTextContent(connectFieldOption.getEquivalent());
      tr.appendChild(tdLeft);
      tr.appendChild(tdCenter);
      tr.appendChild(tdRight);
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    return wrapWithObjectElement(ownerDocument, "application/vnd.muikku.field.connect", table, connectFieldData);
  }

  @SuppressWarnings("unused")
  private DeusNexDocument deusNexDocument;

  private FieldTranslator fieldTranslator;
}