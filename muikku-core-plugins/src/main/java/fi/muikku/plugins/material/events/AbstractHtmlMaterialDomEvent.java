package fi.muikku.plugins.material.events;

import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public abstract class AbstractHtmlMaterialDomEvent extends MaterialEvent {

  public AbstractHtmlMaterialDomEvent() {
  }

  public AbstractHtmlMaterialDomEvent(Long materialId, Document document) {
    super(materialId);
    this.document = document;
  }
  
  public Document getDocument() {
    return document;
  }

  public Element getBodyElement() {
    return getBodyElement(document); 
  }
  
  public Element getBodyElement(Document document) {
    try {
      Node bodyNode = findNodeByXPath(document.getDocumentElement(), "//BODY");
      if (bodyNode == null) {
        bodyNode = document.getDocumentElement();
      }  
      return (Element) bodyNode;
    } catch (XPathExpressionException e) {
    }

    return null;
  }

  public Document importChildren(Element parentElement, Element foreignParentElement) {
    Document ownerDocument = parentElement.getOwnerDocument();
    
    Node nextSibling = parentElement.getNextSibling();
    Node parent = parentElement.getParentNode();
    parent.removeChild(parentElement);
    
    NodeList foreignChildNodes = foreignParentElement.getChildNodes();
    for (int i = 0, l = foreignChildNodes.getLength(); i < l; i++) {
      Node importedChildNode = ownerDocument.importNode(foreignChildNodes.item(i), true);
      if (nextSibling != null) {
        parent.insertBefore(importedChildNode, nextSibling);
      } else {
        parent.appendChild(importedChildNode);
      }
    }
    
    return ownerDocument;
  }

  public Document importDocumentBody(Element parentElement, Document foreignDocument) {
    Element foreignBody = getBodyElement(foreignDocument);
    return importChildren(parentElement, foreignBody);
  }

  public Node findNodeByXPath(Node contextNode, String expression) throws XPathExpressionException {
    return (Node) XPathFactory.newInstance().newXPath().evaluate(expression, contextNode, XPathConstants.NODE);
  }
  
  private Document document;
}
