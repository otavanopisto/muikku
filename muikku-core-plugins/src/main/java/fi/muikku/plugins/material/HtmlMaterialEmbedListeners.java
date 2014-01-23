package fi.muikku.plugins.material;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.processing.HtmlMaterialProcessingContext;
import fi.muikku.plugins.material.processing.MaterialProcessorAdapter;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.servlet.ContextPath;

@RequestScoped
public class HtmlMaterialEmbedListeners extends MaterialProcessorAdapter {
  
private static final boolean ADD_DEBUG_MARKERS = false;
  
  @Inject
  private Logger logger;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private HtmlMaterialController htmlMaterialController;
   
  @Inject 
  @ContextPath
  private String contextPath;
  
  @PostConstruct
  public void init() {
  }
  
  public void processMaterial(HtmlMaterialProcessingContext event) {
    Document document = event.getDocument();

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
              if ((workspaceMaterial != null) && (workspaceMaterial.getMaterial() instanceof HtmlMaterial)) {
                HtmlMaterial htmlMaterial = (HtmlMaterial) workspaceMaterial.getMaterial();
                
                try {
                  Document embeddedDocument = htmlMaterialController.getProcessedHtmlDocument((HtmlMaterial) workspaceMaterial.getMaterial());
                  NodeList objectNodeList = embeddedDocument.getElementsByTagName("object");

                  for (int objectIndex = 0, objectsLength = objectNodeList.getLength(); objectIndex < objectsLength; objectIndex++) {
                    Element objectElement = (Element) objectNodeList.item(objectIndex);
                    if (!objectElement.hasAttribute("data-embed-id")) {
                      objectElement.setAttribute("data-embed-id", htmlMaterial.getId().toString());
                    } else {
                      objectElement.setAttribute("data-embed-id", htmlMaterial.getId().toString() + ":" + objectElement.getAttribute("data-embed-id"));
                    }
                  }
                  
                  Node parent = iframeElement.getParentNode();
                  Node nextSibling = iframeElement.getNextSibling();

                  if (ADD_DEBUG_MARKERS) {
                    Element iframeStartMarker = createIframeMarker(iframeElement.getOwnerDocument(), "#" + workspaceMaterial.getMaterial().getId() + " / " + workspaceMaterial.getMaterial().getTitle() + " >>>>>>>>>>", "background: green; color: #fff; border: 1px dotted #000; text-align: center;");
                    parent.insertBefore(iframeStartMarker, iframeElement);
                  }
                  
                  event.replaceWithForeignDocumentBody(iframeElement, embeddedDocument);
                  
                  if (ADD_DEBUG_MARKERS) {
                    Element iframeEndMarker = createIframeMarker(iframeElement.getOwnerDocument(), "<<<<<<<<<< #" + workspaceMaterial.getMaterial().getId() + " / " + workspaceMaterial.getMaterial().getTitle(), "background: red; color: #fff; border: 1px dotted #000; text-align: center;");
                    if (nextSibling != null) {
                      parent.insertBefore(iframeEndMarker, nextSibling);
                    } else {
                      parent.appendChild(iframeEndMarker);
                    }
                  }
                  
                } catch (SAXException | IOException e) {
                  // Processing failed, let iframe to be as-is and log the failure.
                  logger.log(Level.SEVERE, "iframe processing failed", e);
                } 
              } else {
                logger.log(Level.WARNING, "Embedded material: " + StringUtils.join(pathEntries, "/") + " could not be found"); 
              }
            }
          }
        }
      }
    }
  }

  private Element createIframeMarker(Document ownerDocument, String text, String style) {
    Element result = ownerDocument.createElement("div");
    result.setAttribute("style", style);
    result.appendChild(ownerDocument.createTextNode(text));
    return result;
  }

}
