package fi.muikku.plugins.dnm.unembed;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.Lock;
import javax.ejb.Singleton;
import javax.inject.Inject;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.xpath.XPathExpressionException;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.plugins.dnm.parser.DeusNexInternalException;
import fi.muikku.plugins.dnm.parser.DeusNexXmlUtils;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;

@Singleton
public class MaterialUnEmbedder {

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private HtmlMaterialController htmlMaterialController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;

  @Lock
  public void unembedWorkspaceMaterials(WorkspaceNode parentNode) throws DeusNexInternalException {
    try {
      loadHtmlMaterialPieces();
      for (WorkspaceNode node : workspaceMaterialController.listWorkspaceNodesByParent(parentNode)) {
        unembedWorkspaceNode(parentNode, node);
      }
      saveHtmlMaterialPieces();
    } catch (XPathExpressionException | SAXException | IOException | ParserConfigurationException
        | TransformerException | WorkspaceMaterialContainsAnswersExeption e) {
      throw new DeusNexInternalException(e.getClass().getName() + ": " + e.getMessage());
    }
  }
  
  private void loadHtmlMaterialPieces() throws JsonParseException, JsonMappingException, IOException {
    if (pluginSettingsController.getPluginSettingKey("deus-nex-machina", "unembed-html-material-pieces") != null) {
      htmlMaterialPieces = new HashMap<Long, List<Long>>();
    } else {
      String jsonHtmlMaterialPieces = 
          pluginSettingsController.getPluginSetting("deus-nex-machina", "unembed-html-material-pieces");
      ObjectMapper objectMapper = new ObjectMapper();
      htmlMaterialPieces = objectMapper.readValue(jsonHtmlMaterialPieces, new TypeReference<Map<Long, List<Long>>>() {});
    }
  }
  
  private void saveHtmlMaterialPieces() throws JsonGenerationException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    String jsonHtmlMaterialPieces = objectMapper.writeValueAsString(htmlMaterialPieces);
    pluginSettingsController.setPluginSetting("deus-nex-machina", "unembed-html-material-pieces", jsonHtmlMaterialPieces);
  }

  private void unembedWorkspaceNode(WorkspaceNode parent, WorkspaceNode workspaceNode) throws XPathExpressionException,
      SAXException, IOException, ParserConfigurationException, DeusNexInternalException, TransformerException,
      WorkspaceMaterialContainsAnswersExeption {
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
          unembedHtmlMaterial(parent, workspaceMaterial, htmlMaterial);
        }
      }
    }
  }

  private boolean hasEmbeds(HtmlMaterial htmlMaterial) throws SAXException, IOException, ParserConfigurationException,
      XPathExpressionException {
    String html = htmlMaterial.getHtml();
    Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(new InputSource(new StringReader(html)));
    NodeList iframes = DeusNexXmlUtils.findNodesByXPath(document.getDocumentElement(),
        "//iframe[@data-type='embedded-document']/");

    return iframes.getLength() != 0;
  }

  private void unembedHtmlMaterial(WorkspaceNode parent, WorkspaceMaterial workspaceMaterial, HtmlMaterial htmlMaterial)
      throws SAXException, IOException, ParserConfigurationException, XPathExpressionException,
      DeusNexInternalException, TransformerException, WorkspaceMaterialContainsAnswersExeption {
    String html = htmlMaterial.getHtml();
    Document document = DeusNexXmlUtils.createDocumentBuilder().parse(new InputSource(new StringReader(html)));

    List<Document> splittedHtmlDocument = splitHtmlDocument(document);
    for (int i = 0; i < splittedHtmlDocument.size(); i++) {

      List<Long> pieceList = new ArrayList<Long>();
      htmlMaterialPieces.put(htmlMaterial.getId(), pieceList);

      Document documentPiece = splittedHtmlDocument.get(i);
      List<HtmlMaterial> pieceHtmlMaterials;
      if (isEmbedPiece(documentPiece)) {
        pieceHtmlMaterials = new ArrayList<HtmlMaterial>();
        long embeddedHtmlMaterialId = embeddedHtmlMaterialId(documentPiece);
        if (htmlMaterialPieces.containsKey(embeddedHtmlMaterialId)) {
          for (Long htmlMaterialId : htmlMaterialPieces.get(embeddedHtmlMaterialId)) {
            HtmlMaterial pieceHtmlMaterial = htmlMaterialController.findHtmlMaterialById(htmlMaterialId);
            pieceHtmlMaterials.add(pieceHtmlMaterial);
            pieceList.add(pieceHtmlMaterial.getId());
          }
        } else {
          HtmlMaterial pieceHtmlMaterial = htmlMaterialController.findHtmlMaterialById(embeddedHtmlMaterialId);
          pieceHtmlMaterials.add(pieceHtmlMaterial);
          pieceList.add(pieceHtmlMaterial.getId());
        }
      } else {
        HtmlMaterial pieceHtmlMaterial = htmlMaterialController.createHtmlMaterial(
            htmlMaterial.getTitle() + " (" + i + ")",
            DeusNexXmlUtils.serializeElement(documentPiece.getDocumentElement(), true, false, "html", "5"),
            "text/html; editor=CKEditor",
            0l);
        pieceHtmlMaterials = new ArrayList<HtmlMaterial>();
        pieceHtmlMaterials.add(pieceHtmlMaterial);
        pieceList.add(pieceHtmlMaterial.getId());
      }
      
      for (HtmlMaterial pieceHtmlMaterial : pieceHtmlMaterials) {
        WorkspaceNode newNode = workspaceMaterialController.createWorkspaceMaterial(parent, pieceHtmlMaterial);
        workspaceMaterialController.moveAbove(newNode, workspaceMaterial);
      }
    }
    
    workspaceMaterialController.deleteWorkspaceMaterial(workspaceMaterial, true);
  }
  
  private boolean isEmbedPiece(Document documentPiece) throws XPathExpressionException {
    NodeList iframes = DeusNexXmlUtils.findNodesByXPath(documentPiece.getDocumentElement(),
        "/body/iframe[@data-type='embedded-document']");
    return iframes.getLength() > 0;
  }

  private long embeddedHtmlMaterialId(Document documentPiece) throws XPathExpressionException {
    NodeList iframes = DeusNexXmlUtils.findNodesByXPath(documentPiece.getDocumentElement(),
        "/body/iframe[@data-type='embedded-document']");
    return Long.parseLong(iframes.item(0).getAttributes().getNamedItem("data-material-id").getNodeValue(), 10);
  }

  private List<Document> splitHtmlDocument(Document document) throws XPathExpressionException, DeusNexInternalException {
    DocumentBuilder documentBuilder = DeusNexXmlUtils.createDocumentBuilder();

    while (embedIframesInNonTopLevelElement(document)) {
      bubbleUpEmbedIframes(document);
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

  private boolean embedIframesInNonTopLevelElement(Document document) throws XPathExpressionException {
    NodeList iframes = DeusNexXmlUtils.findNodesByXPath(document.getDocumentElement(),
        "/body/*//iframe[@data-type='embedded-document']");
    return iframes.getLength() > 0;
  }

  private void bubbleUpEmbedIframes(Document document) throws XPathExpressionException {
    NodeList iframes = DeusNexXmlUtils.findNodesByXPath(document.getDocumentElement(),
        "/body/*//iframe[@data-type='embedded-document']");

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
    
    if (!parent.hasChildNodes()) {
      parentsParent.removeChild(parent);
    }
    
    if (!newParent.hasChildNodes()) {
      parentsParent.removeChild(newParent);
    }
  }

  private Map<Long, List<Long>> htmlMaterialPieces;
}