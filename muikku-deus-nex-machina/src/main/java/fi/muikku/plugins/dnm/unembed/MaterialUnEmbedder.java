package fi.muikku.plugins.dnm.unembed;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

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
import org.w3c.dom.Element;
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
import fi.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialCorrectAnswersDisplay;
import fi.muikku.plugins.workspace.model.WorkspaceNode;

@Singleton
public class MaterialUnEmbedder {

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private HtmlMaterialController htmlMaterialController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private Logger logger;

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
    if (html == null) {
      return false;
    }

    Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(new InputSource(new StringReader(html)));
    NodeList iframes = DeusNexXmlUtils.findNodesByXPath(document.getDocumentElement(),
        "//iframe[@data-type='embedded-document']");
    
    if (iframes.getLength() != 0) {
      logger.info("Html material " + htmlMaterial.getId() + " contains embeds");
    }

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
      
      HashMap<Long, WorkspaceMaterialAssignmentType> assignmentTypes = new HashMap<Long, WorkspaceMaterialAssignmentType>();

      Document documentPiece = splittedHtmlDocument.get(i);
      List<HtmlMaterial> pieceHtmlMaterials;
      if (isEmbedPiece(documentPiece)) {
        WorkspaceMaterialAssignmentType assignmentType = embeddedHtmlMaterialAssignmentType(documentPiece);
        pieceHtmlMaterials = new ArrayList<HtmlMaterial>();
        long embeddedHtmlMaterialId = embeddedHtmlMaterialId(documentPiece);
        if (htmlMaterialPieces.containsKey(embeddedHtmlMaterialId)) {
          for (Long htmlMaterialId : htmlMaterialPieces.get(embeddedHtmlMaterialId)) {
            logger.info("Existing html material " + htmlMaterialId + " embedded in " + htmlMaterial.getId());
            HtmlMaterial pieceHtmlMaterial = htmlMaterialController.findHtmlMaterialById(htmlMaterialId);
            pieceHtmlMaterials.add(pieceHtmlMaterial);
            pieceList.add(pieceHtmlMaterial.getId());
            assignmentTypes.put(pieceHtmlMaterial.getId(), assignmentType);
          }
        }
        else {
          HtmlMaterial pieceHtmlMaterial = htmlMaterialController.findHtmlMaterialById(embeddedHtmlMaterialId);
          logger.info("Existing html material " + embeddedHtmlMaterialId + " embedded in " + htmlMaterial.getId());
          pieceHtmlMaterials.add(pieceHtmlMaterial);
          pieceList.add(pieceHtmlMaterial.getId());
          assignmentTypes.put(pieceHtmlMaterial.getId(), assignmentType);
        }
      }
      else {
        HtmlMaterial pieceHtmlMaterial = htmlMaterialController.createHtmlMaterial(
            htmlMaterial.getTitle() + " (" + i + ")",
            DeusNexXmlUtils.serializeElement(documentPiece.getDocumentElement(), true, false, "xml"),
            "text/html; editor=CKEditor",
            0l);
        logger.info("New html material piece " + pieceHtmlMaterial.getId() + " split from " + htmlMaterial.getId());
        pieceHtmlMaterials = new ArrayList<HtmlMaterial>();
        pieceHtmlMaterials.add(pieceHtmlMaterial);
        pieceList.add(pieceHtmlMaterial.getId());
      }
      
      for (HtmlMaterial pieceHtmlMaterial : pieceHtmlMaterials) {
        WorkspaceNode newNode = workspaceMaterialController.createWorkspaceMaterial(parent, pieceHtmlMaterial,
            assignmentTypes.get(pieceHtmlMaterial.getId()), WorkspaceMaterialCorrectAnswersDisplay.ALWAYS);
        workspaceMaterialController.moveAbove(newNode, workspaceMaterial);
      }
    }
    
    workspaceMaterialController.deleteWorkspaceMaterial(workspaceMaterial, true);
    htmlMaterialController.deleteHtmlMaterial(htmlMaterial);
  }
  
  private boolean isEmbedPiece(Document documentPiece) throws XPathExpressionException {
    Node iframe = DeusNexXmlUtils.findNodeByXPath(documentPiece.getDocumentElement(),
        "body/iframe[@data-type='embedded-document']");
    return iframe != null;
  }

  private long embeddedHtmlMaterialId(Document documentPiece) throws XPathExpressionException {
    Node iframe = DeusNexXmlUtils.findNodeByXPath(documentPiece.getDocumentElement(),
        "body/iframe[@data-type='embedded-document']");
    return Long.parseLong(iframe.getAttributes().getNamedItem("data-material-id").getNodeValue(), 10);
  }
  
  private WorkspaceMaterialAssignmentType embeddedHtmlMaterialAssignmentType(Document documentPiece) throws XPathExpressionException {
    Node iframe = DeusNexXmlUtils.findNodeByXPath(documentPiece.getDocumentElement(),
        "body/iframe[@data-type='embedded-document']");
    Node assignmentTypeNode = iframe.getAttributes().getNamedItem("data-assignment-type");
    String assignmentType = assignmentTypeNode == null ? null : assignmentTypeNode.getNodeValue();
    if ("EXERCISE".equals(assignmentType))
      return WorkspaceMaterialAssignmentType.EXERCISE;
    if ("EVALUATED".equals(assignmentType))
      return WorkspaceMaterialAssignmentType.EVALUATED;
    return null;
  }

  private List<Document> splitHtmlDocument(Document document) throws XPathExpressionException, DeusNexInternalException {

    while (embedIframesInNonTopLevelElement(document)) {
      bubbleUpEmbedIframes(document);
    }
    
    List<Document> documentPieces = new ArrayList<Document>();
    NodeList pieceNodes = DeusNexXmlUtils.findNodesByXPath(document.getDocumentElement(), "body/*");
    
    List<Node> paragraphs = new ArrayList<Node>();
    boolean isEmbeddedDocument = false; 
    for (int i = 0; i < pieceNodes.getLength(); i++) {
      isEmbeddedDocument = false;
      Node pieceNode = pieceNodes.item(i);
      if (pieceNode instanceof Element) {
        Element element = (Element) pieceNode;
        if ("iframe".equals(element.getTagName())) {
          String type = element.getAttribute("data-type");
          isEmbeddedDocument = "embedded-document".equals(type);
        }
      }
      if (isEmbeddedDocument) {
        // text content
        if (!paragraphs.isEmpty()) {
          documentPieces.add(createDocument(paragraphs));
          paragraphs.clear();
        }
        // embedded document
        paragraphs.add(pieceNode);
        documentPieces.add(createDocument(paragraphs));
        paragraphs.clear();
      }
      else {
        paragraphs.add(pieceNode);
      }
    }
    // text content
    if (!paragraphs.isEmpty()) {
      documentPieces.add(createDocument(paragraphs));
      paragraphs.clear();
    }

    return documentPieces;
  }
  
  private Document createDocument(List<Node> paragraphs) throws DeusNexInternalException {
    DocumentBuilder documentBuilder = DeusNexXmlUtils.createDocumentBuilder();
    Document documentPiece = documentBuilder.newDocument();
    Node html = documentPiece.createElement("html");
    documentPiece.appendChild(html);
    Node body = documentPiece.createElement("body");
    html.appendChild(body);
    for (Node paragraph : paragraphs) {
      Node adoptedPieceNode = documentPiece.adoptNode(paragraph);
      body.appendChild(adoptedPieceNode);
    }
    return documentPiece;
  }

  private boolean embedIframesInNonTopLevelElement(Document document) throws XPathExpressionException {
    NodeList iframes = DeusNexXmlUtils.findNodesByXPath(document.getDocumentElement(),
        "body/*//iframe[@data-type='embedded-document']");
    
    if (iframes.getLength() != 0) {
      logger.info(iframes.getLength() + " iframes in non-top-level element");
    }

    return iframes.getLength() > 0;
  }
  
  private void bubbleUpEmbedIframes(Document document) throws XPathExpressionException {
    NodeList iframes = DeusNexXmlUtils.findNodesByXPath(document.getDocumentElement(),
        "body/*//iframe[@data-type='embedded-document']");

    for (int i = 0; i < iframes.getLength(); i++) {
      Node iframe = iframes.item(i);

      bubbleUp(iframe);
    }

    if (iframes.getLength() != 0) {
      logger.info("bubbled up " + iframes.getLength() + " iframes");
    }
  }

  private void bubbleUp(Node node) {
    Node parent = node.getParentNode();
    Node parentsParent = parent.getParentNode();
    
    Node newParent = node.getOwnerDocument().createElement(parent.getNodeName());
    while (node.getNextSibling() != null) {
      Node sibling = node.getNextSibling();
      newParent.appendChild(sibling);
    }

    parentsParent.insertBefore(newParent, parent.getNextSibling());
    parentsParent.insertBefore(node, newParent);
    
    if (!parent.hasChildNodes()) {
      parentsParent.removeChild(parent);
    }
    
    if (!newParent.hasChildNodes()) {
      parentsParent.removeChild(newParent);
    }
  }

  private Map<Long, List<Long>> htmlMaterialPieces;
}