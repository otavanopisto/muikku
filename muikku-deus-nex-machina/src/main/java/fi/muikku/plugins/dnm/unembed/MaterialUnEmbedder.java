package fi.muikku.plugins.dnm.unembed;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.xml.crypto.NodeSetData;
import javax.xml.namespace.QName;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import fi.muikku.plugins.dnm.parser.DeusNexInternalException;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;

public class MaterialUnEmbedder {
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private MaterialController materialController;
  
  public void unembedWorkspaceMaterials(WorkspaceRootFolder rootFolder) throws DeusNexInternalException {
    try {
        for (WorkspaceNode node : workspaceMaterialController.listWorkspaceNodesByParent(rootFolder)) {
          unembedWorkspaceNode(rootFolder, node);
        }
    } catch (XPathExpressionException | SAXException | IOException | ParserConfigurationException e) {
      throw new DeusNexInternalException(e.getClass().getName() + ": " + e.getMessage());
    }
  }
  
  private void unembedWorkspaceNode(WorkspaceNode parent, WorkspaceNode workspaceNode) throws XPathExpressionException, SAXException, IOException, ParserConfigurationException {
    if (workspaceNode instanceof WorkspaceFolder) {
      for (WorkspaceNode childNode : workspaceMaterialController.listWorkspaceNodesByParent(workspaceNode)) {
        unembedWorkspaceNode(workspaceNode, childNode);
      }
    } else if (workspaceNode instanceof WorkspaceMaterial) {
      WorkspaceMaterial workspaceMaterial = (WorkspaceMaterial) workspaceNode;
      Material material = workspaceMaterialController.getMaterialForWorkspaceMaterial(workspaceMaterial);
      
      if (material instanceof HtmlMaterial) {
        HtmlMaterial htmlMaterial = (HtmlMaterial) material;
       
        if (hasEmbeds(htmlMaterial)) {
          unembedHtmlMaterial(workspaceNode, htmlMaterial);
        }
      }
    }
  }
  
  private boolean hasEmbeds(HtmlMaterial htmlMaterial) throws SAXException, IOException, ParserConfigurationException, XPathExpressionException {
    String html = htmlMaterial.getHtml();
    Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(html);
    XPathExpression documentEmbedXPath = xpath.compile("//iframe[@data-type='embedded-document']/");

    NodeList iframes = (NodeList)documentEmbedXPath.evaluate(document.getDocumentElement(), XPathConstants.NODESET);

    return iframes.getLength() != 0;
  }
  
  private void unembedHtmlMaterial(WorkspaceNode parent, HtmlMaterial htmlMaterial) throws SAXException, IOException, ParserConfigurationException, XPathExpressionException {
    String html = htmlMaterial.getHtml();
    Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(html);
    XPathExpression documentEmbedXPath = xpath.compile("//iframe[@data-type='embedded-document']/");

    NodeList iframes = (NodeList)documentEmbedXPath.evaluate(document.getDocumentElement(), XPathConstants.NODESET);
    
    List<Element> splittedHtmlDocument = splitHtmlDocument(iframes);
    for (Element element : splittedHtmlDocument) {
      //
    }
    
  }
  
  private List<Element> splitHtmlDocument(NodeList splitPositions) {
    return new ArrayList<>();
  }
  
  private Map<Long, Long> htmlMaterialPieces;
  private XPath xpath = XPathFactory.newInstance().newXPath();
}