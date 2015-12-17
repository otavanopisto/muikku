package fi.muikku.plugins.dnm.util;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

public abstract class AbstractHtmlMaterialCleanerTask implements HtmlMaterialCleanerTask {

  private boolean modified;
  private WorkspaceMaterial workspaceMaterial;

  public boolean process(Document document, WorkspaceMaterial material) {
    this.modified = false;
    this.workspaceMaterial = material;
    cleanNodes(document.getDocumentElement().getChildNodes());
    return this.modified;
  }

  private void cleanNodes(NodeList nodes) {
    for (int i = 0; i < nodes.getLength(); i++) {
      Node node = nodes.item(i);
      if (node instanceof Element) {
        cleanElement((Element) node);
      }
      cleanNodes(node.getChildNodes());
    }
  }
  
  protected abstract void cleanElement(Element e);
  
  protected boolean isModified() {
    return modified;
  }
  
  protected WorkspaceMaterial getWorkspaceMaterial() {
    return workspaceMaterial;
  }
  
  protected void markModified() {
    modified = true;
  }

}
