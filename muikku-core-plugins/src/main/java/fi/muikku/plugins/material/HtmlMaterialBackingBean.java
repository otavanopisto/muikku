package fi.muikku.plugins.material;

import java.io.IOException;
import java.io.Serializable;
import java.io.StringWriter;

import javax.enterprise.context.RequestScoped;
import javax.faces.event.ActionEvent;
import javax.inject.Inject;
import javax.inject.Named;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import fi.muikku.plugins.material.model.HtmlMaterial;

@Named
@RequestScoped
public class HtmlMaterialBackingBean implements Serializable {
  
  private static final long serialVersionUID = -1205161035039949658L;
  
  @Inject
  private HtmlMaterialController htmlMaterialController;
  
  public String renderMaterial(Long materialId) throws SAXException, IOException, XPathExpressionException, TransformerException {
    // TODO: Proper error handling
    
  	HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(materialId);
  	if (htmlMaterial != null) { 
      Document processedHtmlDocument = htmlMaterialController.getProcessedHtmlDocument(htmlMaterial);
      return serializeDocument(processedHtmlDocument);
  	}
  	
  	return null;
  }
  
  public void save(ActionEvent event) {
    
  }
  
  private static String serializeDocument(Document document) throws TransformerException, XPathExpressionException {
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

  private static Node findNodeByXPath(Node contextNode, String expression) throws XPathExpressionException {
    return (Node) XPathFactory.newInstance().newXPath().evaluate(expression, contextNode, XPathConstants.NODE);
  }
}
