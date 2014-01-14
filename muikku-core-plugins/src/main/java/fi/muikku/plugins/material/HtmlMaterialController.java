package fi.muikku.plugins.material;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.SortedSet;
import java.util.TreeSet;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.lang3.StringUtils;
import org.cyberneko.html.parsers.DOMParser;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import fi.muikku.plugins.material.dao.HtmlMaterialDAO;
import fi.muikku.plugins.material.events.HtmlMaterialCreateEvent;
import fi.muikku.plugins.material.events.HtmlMaterialUpdateEvent;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.processing.HtmlMaterialAfterProcessingContext;
import fi.muikku.plugins.material.processing.HtmlMaterialBeforeProcessingContext;
import fi.muikku.plugins.material.processing.HtmlMaterialBeforeSerializeContext;
import fi.muikku.plugins.material.processing.HtmlMaterialProcessingContext;
import fi.muikku.plugins.material.processing.MaterialProcessor;

@Dependent
@Stateless
public class HtmlMaterialController {
  
  @Inject
  private Instance<MaterialProcessor> materialProcessors;

	@Inject
	private HtmlMaterialDAO htmlMaterialDAO;
	
	@Inject
	private Event<HtmlMaterialCreateEvent> materialCreateEvent;

  @Inject
  private Event<HtmlMaterialUpdateEvent> materialUpdateEvent;
  
	public HtmlMaterial createHtmlMaterial(String urlName, String title, String html) {
		HtmlMaterial material = htmlMaterialDAO.create(urlName, title, html);
		materialCreateEvent.fire(new HtmlMaterialCreateEvent(material));
		return material;
	}
	
	public HtmlMaterial findHtmlMaterialById(Long id) {
		return htmlMaterialDAO.findById(id);
	}
	
	public Document getProcessedHtmlDocument(String fieldPrefix, HtmlMaterial htmlMaterial) throws SAXException, IOException {
    return processHtml(fieldPrefix, htmlMaterial.getId(), htmlMaterial.getHtml());
	}
	
	private Document processHtml(String fieldPrefix, Long materialId, String html) throws SAXException, IOException {
    if (StringUtils.isNotBlank(html)) {
      DOMParser parser = new DOMParser();
      StringReader htmlReader = new StringReader(html);
      try {
        InputSource inputSource = new InputSource(htmlReader);
        parser.parse(inputSource);
        
        
        Document document = parser.getDocument();
        
        SortedSet<Integer> stages = new TreeSet<>();
        for (MaterialProcessor materialProcessor : materialProcessors) {
          stages.add(materialProcessor.getProcessingStage());
        }
        
        for (Integer stage : stages) {
          for (MaterialProcessor materialProcessor : materialProcessors) {
            if (stage.intValue() == materialProcessor.getProcessingStage()) {
              materialProcessor.beforeProcessMaterial(new HtmlMaterialBeforeProcessingContext(fieldPrefix, materialId, document));
            }
          }
        }
        
        for (Integer stage : stages) {
          for (MaterialProcessor materialProcessor : materialProcessors) {
            if (stage.intValue() == materialProcessor.getProcessingStage()) {
              materialProcessor.processMaterial(new HtmlMaterialProcessingContext(fieldPrefix, materialId, document));
            }
          }
        }
        
        for (Integer stage : stages) {
          for (MaterialProcessor materialProcessor : materialProcessors) {
            if (stage.intValue() == materialProcessor.getProcessingStage()) {
              materialProcessor.afterProcessMaterial(new HtmlMaterialAfterProcessingContext(fieldPrefix, materialId, document));
            }
          }
        }
          
        return document;
      } finally {
        htmlReader.close();
      }
    }
    
    return null;
  }

  public String getSerializedHtmlDocument(String fieldPrefix, HtmlMaterial htmlMaterial) throws SAXException, IOException, XPathExpressionException, TransformerException {
    Document processedHtmlDocument = getProcessedHtmlDocument(fieldPrefix, htmlMaterial);
    HtmlMaterialBeforeSerializeContext event = new HtmlMaterialBeforeSerializeContext(fieldPrefix, htmlMaterial.getId(), processedHtmlDocument);
    
    SortedSet<Integer> stages = new TreeSet<>();
    for (MaterialProcessor materialProcessor : materialProcessors) {
      stages.add(materialProcessor.getProcessingStage());
    }
    
    for (Integer stage : stages) {
      for (MaterialProcessor materialProcessor : materialProcessors) {
        if (stage.intValue() == materialProcessor.getProcessingStage()) {
          materialProcessor.beforeSerializeMaterial(event);
        }
      }
    }

    return serializeDocument(event.getDocument());
  }
    
  private String serializeDocument(Document document) throws TransformerException, XPathExpressionException {
    StringWriter writer = new StringWriter();

    Node bodyNode = findNodeByXPath(document.getDocumentElement(), "//BODY");
    if (bodyNode == null) {
      bodyNode = document.getDocumentElement();
    }  
    
    if (bodyNode instanceof Element) {
      TransformerFactory transformerFactory = TransformerFactory.newInstance();
      Transformer transformer = transformerFactory.newTransformer();
      transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
      transformer.setOutputProperty(OutputKeys.METHOD, "html");
      transformer.setOutputProperty(OutputKeys.VERSION, "5");
      transformer.setOutputProperty(OutputKeys.INDENT, "no");

      Element bodyElement = (Element) bodyNode;

      NodeList bodyChildNodes = bodyElement.getChildNodes();
      for (int i = 0, l = bodyChildNodes.getLength(); i < l; i++) {
        transformer.transform(new DOMSource(bodyChildNodes.item(i)), new StreamResult(writer));
      }
    }
    
    return writer.getBuffer().toString();
  }

  private Node findNodeByXPath(Node contextNode, String expression) throws XPathExpressionException {
    return (Node) XPathFactory.newInstance().newXPath().evaluate(expression, contextNode, XPathConstants.NODE);
  }
}
