package fi.muikku.plugins.material;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;

import javax.ejb.Stateless;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
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
import fi.muikku.plugins.material.events.HtmlMaterialAfterProcessEvent;
import fi.muikku.plugins.material.events.HtmlMaterialBeforeProcessEvent;
import fi.muikku.plugins.material.events.HtmlMaterialBeforeSerializeEvent;
import fi.muikku.plugins.material.events.HtmlMaterialProcessEvent;
import fi.muikku.plugins.material.model.HtmlMaterial;

@Dependent
@Stateless
public class HtmlMaterialController {
  
  @Inject
  private Event<HtmlMaterialBeforeProcessEvent> beforeProcessEvent;

  @Inject
  private Event<HtmlMaterialAfterProcessEvent> afterProcessEvent;

  @Inject
  private Event<HtmlMaterialProcessEvent> processEvent;

  @Inject
  private Event<HtmlMaterialBeforeSerializeEvent> beforeSerializeEvent;

	@Inject
	private HtmlMaterialDAO htmlMaterialDAO;
	
	public HtmlMaterial createHtmlMaterial(String urlName, String title, String html) {
		return htmlMaterialDAO.create(urlName, title, html);
	}
	
	public HtmlMaterial findHtmlMaterialById(Long id) {
		return htmlMaterialDAO.findById(id);
	}
	
	public Document getProcessedHtmlDocument(HtmlMaterial htmlMaterial) throws SAXException, IOException {
    return processHtml(htmlMaterial.getId(), htmlMaterial.getHtml());
	}
	
	private Document processHtml(Long materialId, String html) throws SAXException, IOException {
    if (StringUtils.isNotBlank(html)) {
      DOMParser parser = new DOMParser();
      StringReader htmlReader = new StringReader(html);
      try {
        InputSource inputSource = new InputSource(htmlReader);
        parser.parse(inputSource);

        Document document = parser.getDocument();
        
        this.beforeProcessEvent.fire(new HtmlMaterialBeforeProcessEvent(materialId, document));
        this.processEvent.fire(new HtmlMaterialProcessEvent(materialId, document));
        this.afterProcessEvent.fire(new HtmlMaterialAfterProcessEvent(materialId, document));

        return document;
      } finally {
        htmlReader.close();
      }
    }
    
    return null;
  }

  public String getSerializedHtmlDocument(HtmlMaterial htmlMaterial) throws SAXException, IOException, XPathExpressionException, TransformerException {
    Document processedHtmlDocument = getProcessedHtmlDocument(htmlMaterial);
    HtmlMaterialBeforeSerializeEvent event = new HtmlMaterialBeforeSerializeEvent(htmlMaterial.getId(), processedHtmlDocument);
    beforeSerializeEvent.fire(event);
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
