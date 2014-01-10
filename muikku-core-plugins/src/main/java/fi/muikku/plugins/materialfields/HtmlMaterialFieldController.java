package fi.muikku.plugins.materialfields;

import java.io.IOException;
import java.io.StringReader;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.xml.xpath.XPathExpressionException;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.cyberneko.html.parsers.DOMParser;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.field.MemoField;
import fi.muikku.plugins.material.model.field.OptionListField;
import fi.muikku.plugins.material.model.field.TextField;
import fi.muikku.plugins.materialfields.dao.QueryTextFieldDAO;

@Dependent
public class HtmlMaterialFieldController {

  @Inject
  private Logger logger;

  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Inject
  private QueryTextFieldController queryTextFieldController;

  public HtmlMaterial createMaterialFields(HtmlMaterial htmlMaterial) throws SAXException, IOException, XPathExpressionException {
    String html = htmlMaterial.getHtml();

    if (StringUtils.isNotBlank(html)) {
      DOMParser parser = new DOMParser();
      StringReader htmlReader = new StringReader(html);
      try {
        InputSource inputSource = new InputSource(htmlReader);
        parser.parse(inputSource);
        Document document = parser.getDocument();

        NodeList objectNodeList = document.getElementsByTagName("object");
        for (int i = 0, l = objectNodeList.getLength(); i < l; i++) {
          Node objectNode = objectNodeList.item(i);
          if (objectNode instanceof Element) {
            Element objectElement = (Element) objectNode;
            if (objectElement.hasAttribute("type")) {
              String type = objectElement.getAttribute("type");
              if (StringUtils.isNotBlank(type)) {
                NodeList paramNodes = objectElement.getElementsByTagName("param");
                String content = null;
                
                for (int j = 0, jl = paramNodes.getLength(); j < jl; j++) {
                  Node paramNode = paramNodes.item(j);
                  if (paramNode instanceof Element) {
                    Element paramElement = (Element) paramNode;
                    if ("content".equals(paramElement.getAttribute("name"))) {
                      content = paramElement.getAttribute("value");
                      break;
                    }
                  }
                }
                
                if (StringUtils.isNotBlank(content)) {
                  decodeQueryFieldFromJson(htmlMaterial, type, content);
                }
              }
            }
          }
        }
      } finally {
        htmlReader.close();
      }
    }

    return htmlMaterial;
  }

  public void decodeQueryFieldFromJson(Material material, String contentType, String jsonData) throws JsonParseException, JsonMappingException, IOException {
    switch (contentType) {
      case "application/vnd.muikku.field.option-list":
        OptionListField optionListField = objectMapper.readValue(jsonData, OptionListField.class);
        logger.log(Level.INFO, optionListField.toString());
      break;
      case "application/vnd.muikku.field.text":
        TextField textField = objectMapper.readValue(jsonData, TextField.class);
        queryTextFieldController.createQueryTextField(material, textField.getName(), Boolean.FALSE);
        logger.log(Level.INFO, textField.toString());
      break;
      case "application/vnd.muikku.field.memo":
        MemoField memoField = objectMapper.readValue(jsonData, MemoField.class);
        queryTextFieldController.createQueryTextField(material, memoField.getName(), Boolean.FALSE);
        logger.log(Level.INFO, memoField.toString());
      break;
    }
  }

  private ObjectMapper objectMapper = new ObjectMapper();

}
