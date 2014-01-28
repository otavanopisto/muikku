package fi.muikku.plugins.material;

import java.io.IOException;
import java.io.StringReader;
import java.util.Iterator;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.cyberneko.html.parsers.DOMParser;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import fi.muikku.plugins.material.events.HtmlMaterialCreateEvent;
import fi.muikku.plugins.material.model.HtmlMaterial;

@Stateless
public class HtmlMaterialCreateListener {
  
  @Any
  @Inject
  private Instance<MaterialFieldProcessor> materialProcessors;
  
  public void onHtmlMatreialCreated(@Observes HtmlMaterialCreateEvent htmlMaterialCreateEvent) throws SAXException, IOException {
    HtmlMaterial htmlMaterial = htmlMaterialCreateEvent.getMaterial();
    String html = htmlMaterial.getHtml();

    if (StringUtils.isNotBlank(html)) {
      StringReader htmlReader = new StringReader(html);
      try {
        DOMParser parser = new DOMParser();
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
                  MaterialFieldProcessor fieldProcessor = getProcessorByType(type);
                  if (fieldProcessor != null) {
                    fieldProcessor.process(htmlMaterial, content);
                  }
                }
              }
            }
          }
        }
      } finally {
        htmlReader.close();
      }
    }
  }
  
  private MaterialFieldProcessor getProcessorByType(String type) {
    Iterator<MaterialFieldProcessor> processors = materialProcessors.iterator();
    while (processors.hasNext()) {
      MaterialFieldProcessor processor = processors.next();
      if (type.equals(processor.getType())) {
        return processor;
      }
    }
    
    return null;
  }

}
