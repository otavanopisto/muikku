package fi.muikku.plugins.dnm;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPathExpressionException;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.cyberneko.html.parsers.DOMParser;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.dnm.parser.DeusNexException;
import fi.muikku.plugins.dnm.parser.DeusNexInternalException;
import fi.muikku.plugins.dnm.parser.DeusNexXmlUtils;
import fi.muikku.plugins.dnm.parser.content.DeusNexContentParser;
import fi.muikku.plugins.dnm.parser.content.DeusNexEmbeddedItemElementHandler;
import fi.muikku.plugins.dnm.parser.structure.DeusNexDocument;
import fi.muikku.plugins.dnm.parser.structure.DeusNexStructureParser;
import fi.muikku.plugins.dnm.parser.structure.model.Binary;
import fi.muikku.plugins.dnm.parser.structure.model.Document;
import fi.muikku.plugins.dnm.parser.structure.model.Folder;
import fi.muikku.plugins.dnm.parser.structure.model.Query;
import fi.muikku.plugins.dnm.parser.structure.model.Resource;
import fi.muikku.plugins.dnm.parser.structure.model.ResourceContainer;
import fi.muikku.plugins.dnm.parser.structure.model.Type;
import fi.muikku.plugins.material.BinaryMaterialController;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.WorkspaceMaterialUtils;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceNodeType;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.servlet.ContextPath;

@ApplicationScoped
@Stateful
public class DeusNexMachinaController {

  @Inject
  private Logger logger;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  @ContextPath
  private String contextPath;

  private class EmbeddedItemHandler implements DeusNexEmbeddedItemElementHandler {

    public EmbeddedItemHandler(DeusNexMachinaController deusNexMachinaController, WorkspaceRootFolder rootFolder, DeusNexDocument deusNexDocument) {
      this.rootFolder = rootFolder;
      this.deusNexDocument = deusNexDocument;
    }

    @Override
    public Node handleEmbeddedDocument(org.w3c.dom.Document ownerDocument, String title, Integer queryType, Integer resourceNo, Integer embeddedResourceNo) {
      // TODO: This is just for show, real implementation depends on HtmlMaterial implementation

      String relativePath = getResourcePath(resourceNo);
      if (relativePath != null) {
        Element iframeElement = ownerDocument.createElement("iframe");
        iframeElement.setAttribute("src", relativePath);
        iframeElement.setAttribute("title", title);
        iframeElement.setAttribute("seamless", "seamless");
        iframeElement.setAttribute("border", "0");
        iframeElement.setAttribute("frameborder", "0");

        iframeElement.setAttribute("data-type", "embedded-document");

        iframeElement.setAttribute("width", "100%");
        iframeElement.setTextContent("Browser does not support iframes");
        return iframeElement;
      } else {
        logger.warning("Embedded document " + resourceNo + " could not be found.");
      }

      return null;
    }

    @Override
    public Node handleEmbeddedImage(org.w3c.dom.Document ownerDocument, String title, String alt, Integer width, Integer height, Integer hspace, String align,
        Integer resourceNo) {
      String relativePath = getResourcePath(resourceNo);
      if (relativePath != null) {
        Element imgElement = ownerDocument.createElement("img");
        imgElement.setAttribute("src", relativePath);
        imgElement.setAttribute("title", title);
        imgElement.setAttribute("alt", alt);
        imgElement.setAttribute("width", String.valueOf(width));
        imgElement.setAttribute("height", String.valueOf(height));
        imgElement.setAttribute("hspace", String.valueOf(hspace));
        imgElement.setAttribute("align", align);
        return imgElement;
      } else {
        logger.warning("Embedded image " + resourceNo + " could not be found.");
      }

      return null;
    }

    @Override
    public Node handleEmbeddedAudio(org.w3c.dom.Document ownerDocument, Integer resourceNo, Boolean showAsLink, String fileName, String linkText,
        Boolean autoStart, Boolean loop) {
      String path = getResourcePath(resourceNo);
      if (path != null) {
        if (showAsLink) {
          Element linkElement = ownerDocument.createElement("a");
          linkElement.setTextContent(linkText);
          linkElement.setAttribute("target", "_blank");
          linkElement.setAttribute("href", path);
          return linkElement;
        } else {
          Element audioElement = ownerDocument.createElement("audio");

          String contentType = getResorceContentType(resourceNo);
          if (StringUtils.isNotBlank(contentType)) {
            Element sourceElement = ownerDocument.createElement("source");
            sourceElement.setAttribute("src", path + "?embed=true");
            sourceElement.setAttribute("type", contentType);
            audioElement.appendChild(sourceElement);
          } else {
            logger.warning("Embedded audio " + resourceNo + " content type could not be resolved.");
          }

          if (autoStart) {
            audioElement.setAttribute("autoplay", "autoplay");
          }

          if (loop) {
            audioElement.setAttribute("loop", "loop");
          }

          return audioElement;
        }
      } else {
        logger.warning("Embedded audio " + resourceNo + " could not be found.");
      }

      return null;
    }

    @Override
    public Node handleEmbeddedHyperlink(org.w3c.dom.Document ownerDocument, Integer resourceNo, String target, String fileName, String linkText) {
      String path = getResourcePath(resourceNo);
      if (path != null) {
        Element hyperLinkElement = ownerDocument.createElement("a");
        hyperLinkElement.setAttribute("href", path);
        if (StringUtils.isNotBlank(target)) {
          hyperLinkElement.setAttribute("target", target);
        }

        hyperLinkElement.setTextContent(linkText);

        return hyperLinkElement;
      } else {
        logger.warning("Embedded hyperlink " + resourceNo + " could not be found.");
      }

      return null;
    }

    private String getResourcePath(Integer resourceNo) {
      String path = null;
      String type = null;

      Long workspaceNodeId = getResourceWorkspaceNodeId(resourceNo);
      if (workspaceNodeId != null) {
        // Resource has been imported before
        WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceNodeId);
        if (workspaceMaterial != null) {
          path = contextPath + "/" + WorkspaceMaterialUtils.getCompletePath(workspaceMaterial);
          type = "POOL";
        }
      } else {
        Resource resource = deusNexDocument.getResourceByNo(resourceNo);
        if (resource != null) {
          String rootPath = WorkspaceMaterialUtils.getCompletePath(rootFolder);
          String resourcePath = getResourcePath(deusNexDocument, resource);
          path = contextPath + "/" + rootPath + resourcePath;
          type = "DND";
        }
      }

      if (path != null) {
        path += "?embed=true&on=" + resourceNo + "&rt=" + type;
      }

      return path;
    }

    private String getResourcePath(DeusNexDocument deusNexDocument, Resource resource) {
      List<String> result = new ArrayList<String>();

      ResourceContainer parent = deusNexDocument.getParent(resource);
      do {
        result.add(0, parent.getName());
        parent = deusNexDocument.getParent(parent);
      } while (parent != null);

      result.add(resource.getName());

      return StringUtils.join(result, '/');
    }

    private String getResorceContentType(Integer resourceNo) {
      Resource resource = deusNexDocument.getResourceByNo(resourceNo);
      if (resource != null) {
        if (resource instanceof Binary) {
          return ((Binary) resource).getContentType();
        }
      }

      Long workspaceNodeId = getResourceWorkspaceNodeId(resourceNo);
      if (workspaceNodeId != null) {
        // TODO: This reference is a bit strange
        WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceNodeId);
        if (workspaceMaterial != null) {
          Material material = workspaceMaterialController.getMaterialForWorkspaceMaterial(workspaceMaterial);
          if (material instanceof BinaryMaterial) {
            return ((BinaryMaterial) material).getContentType();
          }
        }
      }

      return null;
    }

    private WorkspaceRootFolder rootFolder;
    private DeusNexDocument deusNexDocument;

  }

  private final static String LOOKUP_SETTING_NAME = "[_DEUS_NEX_MACHINA_LOOKUP_]";

  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Inject
  private BinaryMaterialController binaryMaterialController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @PostConstruct
  public void init() throws IOException {
    deusNexStructureParser = new DeusNexStructureParser();
    loadLookup();
  }

  public DeusNexDocument parseDeusNexDocument(InputStream inputStream) throws DeusNexException {
    return deusNexStructureParser.parseDocument(inputStream);
  }

  public void importDeusNexDocument(WorkspaceNode parentNode, InputStream inputStream) throws DeusNexException {
    DeusNexDocument desNexDocument = parseDeusNexDocument(inputStream);
    WorkspaceRootFolder rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(parentNode);
    List<WorkspaceNode> createdNodes = new ArrayList<>();
    for (Resource resource : desNexDocument.getRootFolder().getResources()) {
      importResource(rootFolder, parentNode, resource, desNexDocument, createdNodes);
    }
    try {
      postProcessResources(createdNodes);
    } catch (Exception e) {
      throw new DeusNexInternalException("PostProcesssing failed. ", e);
    }
  }

  private void postProcessResources(List<WorkspaceNode> createdNodes) throws ParserConfigurationException, SAXException,
      IOException, XPathExpressionException, TransformerException {
    for (WorkspaceNode node : createdNodes) {
      if (node.getType() == WorkspaceNodeType.MATERIAL) {
        WorkspaceMaterial workspaceMaterial = (WorkspaceMaterial) node;
        HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(workspaceMaterial.getMaterialId());
        if (htmlMaterial != null && StringUtils.isNotBlank(htmlMaterial.getHtml())) {
          postProcessHtml(htmlMaterial);
        }
      }
    }
  }

  private void postProcessHtml(HtmlMaterial material) throws ParserConfigurationException, SAXException, IOException,
      XPathExpressionException, TransformerException {
    StringReader htmlReader = new StringReader(material.getHtml());
    DOMParser parser = new DOMParser();
    InputSource inputSource = new InputSource(htmlReader);
    parser.parse(inputSource);
    org.w3c.dom.Document domDocument = parser.getDocument();
    List<Element> elements = DeusNexXmlUtils.getElementsByXPath(domDocument.getDocumentElement(), "//IFRAME[@data-type=\"embedded-document\"]");
    if (!elements.isEmpty()) {
      for (Element element : elements) {
        String path = element.getAttribute("src");
        String workspaceUrlName = "";
        Pattern pattern = Pattern.compile("/([0-9_\\-.a-zA-Z]*)/([0-9_\\-.a-zA-Z]*)/materials/([0-9_\\-.a-zA-Z/]*).*");
        Matcher matcher = pattern.matcher(path);
        if (matcher.matches()) {
          workspaceUrlName = matcher.group(2);
          path = matcher.group(3);
          WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByUrlName(workspaceUrlName);
          WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByWorkspaceEntityAndPath(workspaceEntity, path);
          HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(workspaceMaterial.getMaterialId());
          element.setAttribute("data-material-id", String.valueOf(htmlMaterial.getId()));
          element.setAttribute("data-material-type", htmlMaterial.getType());
          element.setAttribute("data-workspace-material-id", String.valueOf(workspaceMaterial.getId()));
        }
      }
      StringWriter writer = new StringWriter();
      TransformerFactory transformerFactory = TransformerFactory.newInstance();
      Transformer transformer = transformerFactory.newTransformer();
      transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
      transformer.setOutputProperty(OutputKeys.METHOD, "html");
      transformer.setOutputProperty(OutputKeys.VERSION, "5");
      transformer.setOutputProperty(OutputKeys.INDENT, "no");
      transformer.transform(new DOMSource(domDocument), new StreamResult(writer));
      htmlMaterialController.updateHtmlMaterialHtml(material, writer.getBuffer().toString());
    }

  }

  private void importResource(WorkspaceRootFolder rootFolder, WorkspaceNode parent, Resource resource, DeusNexDocument deusNexDocument,
      List<WorkspaceNode> createdNodes) throws DeusNexException {
    WorkspaceNode node = findNode(parent, resource);

    if (resource.getType() == Type.FOLDER) {
      Folder folderResource = (Folder) resource;
      WorkspaceFolder folder = null;
      if (node instanceof WorkspaceFolder) {
        folder = (WorkspaceFolder) node;
      }

      if (folder == null) {
        folder = createFolder(parent, folderResource);
        try {
          setResourceWorkspaceNodeId(resource.getNo(), folder.getId());
        } catch (IOException e) {
          throw new DeusNexInternalException("Failed to store resourceNo lookup file", e);
        }
        createdNodes.add(folder);
      }

      for (Resource childResource : folderResource.getResources()) {
        importResource(rootFolder, folder, childResource, deusNexDocument, createdNodes);
      }
    } else {
      if (node == null) {
        logger.fine("importing " + resource.getPath());

        Material material = createMaterial(rootFolder, resource, deusNexDocument);

        if (material != null) {
          WorkspaceNode workspaceNode = workspaceMaterialController.createWorkspaceMaterial(parent, material, resource.getName());

          try {
            setResourceWorkspaceNodeId(resource.getNo(), workspaceNode.getId());
          } catch (IOException e) {
            throw new DeusNexInternalException("Failed to store resourceNo lookup file", e);
          }

          if (resource instanceof ResourceContainer) {
            List<Resource> childResources = ((ResourceContainer) resource).getResources();
            if (childResources != null) {
              for (Resource childResource : childResources) {
                importResource(rootFolder, workspaceNode, childResource, deusNexDocument, createdNodes);
              }
            }
          }
          createdNodes.add(workspaceNode);
        }
      } else {
        logger.info(node.getPath() + " already exists, skipping");
      }
    }
  }

  private Material createMaterial(WorkspaceRootFolder rootFolder, Resource resource, DeusNexDocument deusNexDocument) throws DeusNexException {
    switch (resource.getType()) {
      case BINARY:
        return createBinaryMaterial((Binary) resource);
      case DOCUMENT:
        return createDocumentMaterial(rootFolder, (Document) resource, deusNexDocument);
      case QUERY:
        return createQueryMaterial(rootFolder, (Query) resource, deusNexDocument);
      default:
      break;
    }

    return null;
  }

  private Material createDocumentMaterial(WorkspaceRootFolder rootFolder, Document resource, DeusNexDocument deusNexDocument) throws DeusNexException {
    String title = resource.getTitle();
    String html = parseDocumentContent(rootFolder, resource.getDocument(), deusNexDocument);

    return htmlMaterialController.createHtmlMaterial(title, html, "text/html;editor=CKEditor", 0l);
  }

  private Material createQueryMaterial(WorkspaceRootFolder rootFolder, Query resource, DeusNexDocument deusNexDocument) throws DeusNexException {
    // TODO: Replace with query implementation when the implementation itself is ready for it

    String title = resource.getTitle();
    String html = parseQueryContent(rootFolder, resource.getDocument(), deusNexDocument);

    return htmlMaterialController.createHtmlMaterial(title, html, "text/html;editor=CKEditor", 0l);
  }

  private BinaryMaterial createBinaryMaterial(Binary resource) {
    String title = resource.getName(); // Nexus title is usually something like "tiedosto"
    String contentType = resource.getContentType();
    byte[] content = resource.getContent();

    return binaryMaterialController.createBinaryMaterial(title, contentType, content);
  }

  private String parseDocumentContent(WorkspaceRootFolder rootFolder, Element document, DeusNexDocument deusNexDocument) throws DeusNexException {
    Map<String, String> localeContents = new DeusNexContentParser().setEmbeddedItemElementHandler(new EmbeddedItemHandler(this, rootFolder, deusNexDocument))
        .parseContent(document);
    String contentFi = localeContents.get("fi");
    return contentFi;
  }

  private String parseQueryContent(WorkspaceRootFolder rootFolder, Element document, DeusNexDocument deusNexDocument) throws DeusNexException {
    Map<String, String> localeContents = new DeusNexContentParser().setEmbeddedItemElementHandler(new EmbeddedItemHandler(this, rootFolder, deusNexDocument))
        .setFieldElementHandler(new FieldElementsHandler(deusNexDocument)).parseContent(document);
    String contentFi = localeContents.get("fi");
    return contentFi;
  }

  private WorkspaceFolder createFolder(WorkspaceNode parent, Folder resource) {
    return workspaceMaterialController.createWorkspaceFolder(parent, resource.getTitle(), resource.getName());
  }

  private WorkspaceNode findNode(WorkspaceNode parent, Resource resource) {
    return workspaceMaterialController.findWorkspaceNodeByParentAndUrlName(parent, resource.getName());
  }

  private void setResourceWorkspaceNodeId(Integer resourceNo, Long workspaceNodeId) throws IOException {
    lookupProperties.put(String.valueOf(resourceNo), String.valueOf(workspaceNodeId));
    storeLookup();
  }

  Long getResourceWorkspaceNodeId(Integer resourceNo) {
    return NumberUtils.createLong(lookupProperties.getProperty(String.valueOf(resourceNo)));
  }

  private void loadLookup() throws IOException {
    lookupProperties = new Properties();

    String lookupSetting = pluginSettingsController.getPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, LOOKUP_SETTING_NAME);
    if (StringUtils.isNotBlank(lookupSetting)) {
      StringReader lookupSettingReader = new StringReader(lookupSetting);
      try {
        lookupProperties.load(lookupSettingReader);
      } finally {
        lookupSettingReader.close();
      }
    }
  }

  private void storeLookup() throws IOException {
    StringWriter lookupSettingWriter = new StringWriter();
    lookupProperties.store(lookupSettingWriter, null);
    String lookupSetting = lookupSettingWriter.toString();
    pluginSettingsController.setPluginSetting(DeusNexMachinaPluginDescriptor.PLUGIN_NAME, LOOKUP_SETTING_NAME, lookupSetting);
  }

  private DeusNexStructureParser deusNexStructureParser;
  private Properties lookupProperties;
}
