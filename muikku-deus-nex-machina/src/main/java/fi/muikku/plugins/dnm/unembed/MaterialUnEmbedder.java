package fi.muikku.plugins.dnm.unembed;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.xpath.XPathExpressionException;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import fi.muikku.plugins.dnm.parser.DeusNexException;
import fi.muikku.plugins.dnm.parser.DeusNexInternalException;
import fi.muikku.plugins.dnm.parser.DeusNexXmlUtils;
import fi.muikku.plugins.material.HtmlMaterialController;
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
  private HtmlMaterialController htmlMaterialController;
 
  public void unembedWorkspaceMaterials(WorkspaceRootFolder rootFolder) throws DeusNexInternalException {
    try {
        for (WorkspaceNode node : workspaceMaterialController.listWorkspaceNodesByParent(rootFolder)) {
          unembedWorkspaceNode(rootFolder, node);
        }
    } catch ( XPathExpressionException
            | SAXException 
            | IOException 
            | ParserConfigurationException
            | DeusNexException
            | TransformerException e
            ) {
      throw new DeusNexInternalException(e.getClass().getName() + ": " + e.getMessage());
    }
  }
  
  private void unembedWorkspaceNode(WorkspaceNode parent, WorkspaceNode workspaceNode) throws XPathExpressionException, SAXException, IOException, ParserConfigurationException, DeusNexInternalException, TransformerException {
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
    NodeList iframes = DeusNexXmlUtils.findNodesByXPath(document.getDocumentElement(), "//iframe[@data-type='embedded-document']/");

    return iframes.getLength() != 0;
  }
  
  private void unembedHtmlMaterial(WorkspaceNode parent, HtmlMaterial htmlMaterial) throws SAXException, IOException, ParserConfigurationException, XPathExpressionException, DeusNexInternalException, TransformerException {
    String html = htmlMaterial.getHtml();
    Document document = DeusNexXmlUtils.createDocumentBuilder().parse(new InputSource(new StringReader(html)));
    
    List<Document> splittedHtmlDocument = splitHtmlDocument(document);
    for (Document documentPiece : splittedHtmlDocument) {
      HtmlMaterial pieceHtmlMaterial = htmlMaterialController.createHtmlMaterial(
          htmlMaterial.getTitle(),
          DeusNexXmlUtils.serializeElement(documentPiece.getDocumentElement(), true, false, "", "1.0"),
          "text/html; editor=CKEditor",
          0l);
      WorkspaceMaterial workspaceMaterial = workspaceMaterialController.createWorkspaceMaterial(parent, pieceHtmlMaterial, ""); // TODO: urlname

    }
    
  }
  
  private List<Document> splitHtmlDocument(Document document) throws XPathExpressionException, DeusNexInternalException {
    DocumentBuilder documentBuilder = DeusNexXmlUtils.createDocumentBuilder();
    
    while (iframesInNonTopLevelElement(document)) {
      bubbleUpIframes(document);
    }
    
    List<Document> documentPieces = new ArrayList<Document>();
    NodeList pieceNodes = DeusNexXmlUtils.findNodesByXPath(document.getDocumentElement(), "/html/body/*");
    
    for (int i = 0; i < pieceNodes.getLength(); i++) {
      Node pieceNode = pieceNodes.item(i);
      Document documentPiece = documentBuilder.newDocument();
      Node html = documentPiece.createElement("html");
      documentPiece.appendChild(html);
      Node body = documentPiece.createElement("body");
      html.appendChild(body);
      Node adoptedPieceNode = documentPiece.adoptNode(pieceNode);
      body.appendChild(adoptedPieceNode);
      documentPieces.add(documentPiece);
    }
    
    return documentPieces;
  }
  
  private boolean iframesInNonTopLevelElement(Document document) throws XPathExpressionException {
    NodeList iframes = DeusNexXmlUtils.findNodesByXPath(document.getDocumentElement(), "/html/body/*//iframe[@data-type='embedded-document']/");
    return iframes.getLength() > 0;
  }
  
  private void bubbleUpIframes(Document document) throws XPathExpressionException {
    NodeList iframes = DeusNexXmlUtils.findNodesByXPath(document.getDocumentElement(), "/html/body/*//iframe[@data-type='embedded-document']/");
    
    for (int i = 0; i < iframes.getLength(); i++) {
      Node iframe = iframes.item(i);
      
      bubbleUp(iframe);
    }
  }
  
  private void bubbleUp(Node node) {
    Node parent = node.getParentNode();
    Node parentsParent = parent.getParentNode();
    Node newParent = node.getOwnerDocument().createElement(parent.getNodeName());
    while (node.getNextSibling() != null) {
      Node sibling = node.getNextSibling();
      parent.removeChild(sibling);
      newParent.appendChild(sibling);
    }
    
    parentsParent.insertBefore(parent.getNextSibling(), newParent);
    parent.removeChild(node);
    parentsParent.insertBefore(newParent, node);
  }
  
  private Map<Long, List<Long>> htmlMaterialPieces;
}