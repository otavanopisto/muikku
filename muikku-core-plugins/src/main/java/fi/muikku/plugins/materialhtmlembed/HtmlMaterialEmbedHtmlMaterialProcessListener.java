package fi.muikku.plugins.materialhtmlembed;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.HtmlMaterialProcessEvent;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.servlet.ContextPath;

public class HtmlMaterialEmbedHtmlMaterialProcessListener {
  
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
  
  public void onHtmlMaterialProcess(@Observes HtmlMaterialProcessEvent event) {
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
              if (workspaceMaterial != null) {
                if (workspaceMaterial.getMaterial() instanceof HtmlMaterial) {
                  try {
                    Document embeddedDocument = htmlMaterialController.getProcessedHtmlDocument((HtmlMaterial) workspaceMaterial.getMaterial());
                    event.importDocumentBody(iframeElement, embeddedDocument);
                  } catch (SAXException | IOException e) {
                    // Processing failed, let iframe to be as-is and log the failure.
                    logger.log(Level.SEVERE, "iframe processing failed", e);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

}
