package fi.muikku.plugins.dnm;

import java.io.IOException;
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import fi.muikku.plugins.dnm.parser.content.ConnectFieldOption;
import fi.muikku.plugins.dnm.parser.content.DeusNexFieldElementHandler;
import fi.muikku.plugins.dnm.parser.content.OptionListOption;
import fi.muikku.plugins.dnm.parser.content.RightAnswer;
import fi.muikku.plugins.dnm.parser.structure.DeusNexDocument;
import fi.muikku.plugins.dnm.translator.FieldTranslator;
import fi.muikku.plugins.material.model.field.ConnectField;
import fi.muikku.plugins.material.model.field.Field;
import fi.muikku.plugins.material.model.field.MemoField;
import fi.muikku.plugins.material.model.field.SelectField;
import fi.muikku.plugins.material.model.field.TextField;

class FieldElementsHandler implements DeusNexFieldElementHandler {

  public FieldElementsHandler(DeusNexDocument deusNexDocument) {
    this.deusNexDocument = deusNexDocument;
    this.fieldTranslator = new FieldTranslator();
  }

  private Element wrapWithObjectElement(org.w3c.dom.Document ownerDocument, Element content, Field fieldMeta) {
    ObjectMapper objectMapper = new ObjectMapper();
    
    Element objectElement = ownerDocument.createElement("object");
    objectElement.setAttribute("type", fieldMeta.getType());

    Element paramTypeElement = ownerDocument.createElement("param");
    paramTypeElement.setAttribute("name", "type");
    paramTypeElement.setAttribute("value", "application/json");

    Element paramContentElement = ownerDocument.createElement("param");
    paramContentElement.setAttribute("name", "content");
    try {
      paramContentElement.setAttribute("value", objectMapper.writeValueAsString(fieldMeta));
    } catch (DOMException | IOException e) {
      e.printStackTrace();
    }

    objectElement.appendChild(paramTypeElement);
    objectElement.appendChild(paramContentElement);
    objectElement.appendChild(content);
    
    return objectElement;
  }

  @Override
  public Node handleTextField(org.w3c.dom.Document ownerDocument, String paramName, Integer columns, List<RightAnswer> rightAnswers, String help, String hint) {
    // TODO: This is just for show, real implementation depends on QueryMaterial implementation
   
    TextField textFieldData = fieldTranslator.translateTextField(paramName, columns, rightAnswers, help, hint);

    Element inputElement = ownerDocument.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("name", paramName);
    inputElement.setAttribute("size", String.valueOf(columns));

    return wrapWithObjectElement(ownerDocument, inputElement, textFieldData);
  }

  @Override
  public Node handleMemoField(Document ownerDocument, String paramName, Integer columns, Integer rows, String help, String hint) {
    // TODO: This is just for show, real implementation depends on QueryMaterial implementation
    
    MemoField fieldData = fieldTranslator.translateMemoField(paramName, columns, rows, help, hint);

    Element textAreaElement = ownerDocument.createElement("textarea");
    textAreaElement.setAttribute("name", paramName);
    textAreaElement.setAttribute("cols", String.valueOf(columns));
    textAreaElement.setAttribute("rows", String.valueOf(rows));
    textAreaElement.setAttribute("placeholder", help);
    textAreaElement.setAttribute("title", hint);

    return wrapWithObjectElement(ownerDocument, textAreaElement, fieldData);
  }

  @Override
  public Node handleOptionList(org.w3c.dom.Document ownerDocument, String paramName, String type, List<OptionListOption> options, String help, String hint) {
    // TODO: This is just for show, real implementation depends on QueryMaterial implementation
    
    SelectField optionListFieldData = fieldTranslator.translateOptionList(paramName, type, options);

    Element selectElement = ownerDocument.createElement("select");
    selectElement.setAttribute("name", paramName);

    for (OptionListOption option : options) {
      Element optionElement = ownerDocument.createElement("option");
      optionElement.setAttribute("value", option.getName());
      optionElement.setTextContent(option.getText());
      selectElement.appendChild(optionElement);
    }

    return wrapWithObjectElement(ownerDocument, selectElement, optionListFieldData);
  }

  @Override
  public Node handleConnectField(org.w3c.dom.Document ownerDocument, String paramName, List<ConnectFieldOption> options, String help, String hint) {
    ConnectField connectFieldData = fieldTranslator.translateConnectField(paramName, options);

    Element table = ownerDocument.createElement("table");
    Element tbody = ownerDocument.createElement("tbody");
    int fieldCount = 0;
    for (ConnectFieldOption connectFieldOption : options) {
      Element tr = ownerDocument.createElement("tr");
      Element tdLeft = ownerDocument.createElement("td");
      Element tdCenter = ownerDocument.createElement("td");
      Element tdRight = ownerDocument.createElement("td");
      Element input = ownerDocument.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("name", paramName);
      input.setAttribute("data-fieldcount", String.valueOf(fieldCount));

      tdLeft.setTextContent(connectFieldOption.getTerm());
      tdCenter.appendChild(input);
      tdRight.setTextContent(connectFieldOption.getEquivalent());
      tr.appendChild(tdLeft);
      tr.appendChild(tdCenter);
      tr.appendChild(tdRight);
      tbody.appendChild(tr);
      fieldCount++;
    }

    table.appendChild(tbody);

    return wrapWithObjectElement(ownerDocument, table, connectFieldData);
  }

  @SuppressWarnings("unused")
  private DeusNexDocument deusNexDocument;

  private FieldTranslator fieldTranslator;
}