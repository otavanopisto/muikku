package fi.muikku.plugins.materialfields;

import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.events.HtmlMaterialProcessEvent;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.servlet.ContextPath;

@RequestScoped
public class HtmlMaterialFieldListeners {
  
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
  
  public void onHtmlMaterialProcess(@Observes HtmlMaterialProcessEvent event) {
    Document document = event.getDocument();

    NodeList objects = document.getElementsByTagName("object");
    for (int i = objects.getLength() - 1; i >= 0; i--) {
      Node objectNode = objects.item(i);
      Node parentNode = objectNode.getParentNode();
      if (objectNode instanceof Element
          && ((Element) objectNode).hasAttribute("type")
          && ((Element) objectNode).getAttribute("type").startsWith("application/vnd.muikku.field")) {
          NodeList children = objectNode.getChildNodes();
          for (int j = children.getLength() - 1; j >= 0; j--) {
            Node child = children.item(j);
            if (child instanceof Element &&
                "param".equals(child.getNodeName().toLowerCase(Locale.ROOT))) {
              Element childElement = (Element) child;
              if ("content".equals(childElement.getAttribute("name"))) {
                logger.log(Level.INFO, "Decoding element: " + childElement.getAttribute("value"));
              }
            } else {
              parentNode.insertBefore(child, objectNode);
            }
          }
          parentNode.removeChild(objectNode);
      }
    }
  }
}
