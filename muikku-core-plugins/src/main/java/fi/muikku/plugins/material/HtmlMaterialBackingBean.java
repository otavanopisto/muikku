package fi.muikku.plugins.material;

import java.io.IOException;
import java.io.Serializable;
import java.io.StringReader;
import java.io.StringWriter;

import javax.enterprise.context.RequestScoped;
import javax.faces.context.FacesContext;
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

import org.apache.commons.lang3.StringUtils;
import org.cyberneko.html.parsers.DOMParser;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.schooldata.WorkspaceController;

@Named
@RequestScoped
public class HtmlMaterialBackingBean implements Serializable {
  
  private static final long serialVersionUID = -1205161035039949658L;

  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  public String renderMaterial(Long materialId) {
  	HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(materialId);
  	if (htmlMaterial != null) { 
      try {
        String contextPath = FacesContext.getCurrentInstance().getExternalContext().getRequestContextPath();
        return serializeDocument(processHtml(contextPath, htmlMaterial.getHtml()));
      } catch (SAXException | IOException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      } catch (XPathExpressionException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      } catch (TransformerException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }
  	}
  	
  	return null;
  }
  
  public void save(ActionEvent event) {
    
  }
  
  private Document processHtml(String contextPath, String html) throws SAXException, IOException, XPathExpressionException {
    if (StringUtils.isNotBlank(html)) {
      DOMParser parser = new DOMParser();
      StringReader htmlReader = new StringReader(html);
      try {
        InputSource inputSource = new InputSource(htmlReader);
        parser.parse(inputSource);

        Document document = parser.getDocument();
        NodeList iframes = document.getElementsByTagName("iframe");
        for (int i = iframes.getLength() - 1; i >= 0; i--) {
          Node iframeNode = iframes.item(i);
          if (iframeNode instanceof Element) {
            Element iframeElement = (Element) iframeNode;
            String src = iframeElement.getAttribute("src");
            if (StringUtils.isNotBlank(src)) {
              int queryIndex = src.lastIndexOf('?');
              String[] pathEntries = StringUtils.removeStart(queryIndex > -1 ? src.substring(0, queryIndex) : src, contextPath + "/workspace/").split("/", 3);
              if (pathEntries.length > 2) {
                String workspaceUrlName = pathEntries[0];
                String materialPath = pathEntries[2];
                
                WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(workspaceUrlName);
                if (workspaceEntity != null) {
                  WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByWorkspaceEntityAndPath(workspaceEntity, materialPath);
                  if (workspaceMaterial != null) {
                    if (workspaceMaterial.getMaterial() instanceof HtmlMaterial) {
                      embedDocument(contextPath, document, iframeElement, (HtmlMaterial) workspaceMaterial.getMaterial());
                    }
                  }
                }
              }
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
  
  private void embedDocument(String contextPath, Document ownerDocument, Element iframeElement, HtmlMaterial htmlMaterial) throws XPathExpressionException, SAXException, IOException {
    Document targetDocument = processHtml(contextPath, htmlMaterial.getHtml());
    
    Node bodyNode = findNodeByXPath(targetDocument.getDocumentElement(), "//BODY");
    if (bodyNode == null) {
      bodyNode = targetDocument.getDocumentElement();
    }    
    
    if (bodyNode instanceof Element) {
      Element bodyElement = (Element) bodyNode;
      Node nextSibling = iframeElement.getNextSibling();
      Node parent = iframeElement.getParentNode();
      parent.removeChild(iframeElement);
      
      NodeList bodyChildNodes = bodyElement.getChildNodes();
      for (int i = 0, l = bodyChildNodes.getLength(); i < l; i++) {
        Node importedChildNode = ownerDocument.importNode(bodyChildNodes.item(i), true);
        if (nextSibling != null) {
          parent.insertBefore(importedChildNode, nextSibling);
        } else {
          parent.appendChild(importedChildNode);
        }
      }
    }
  }

  private static Node findNodeByXPath(Node contextNode, String expression) throws XPathExpressionException {
    return (Node) XPathFactory.newInstance().newXPath().evaluate(expression, contextNode, XPathConstants.NODE);
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
}
