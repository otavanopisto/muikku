package fi.muikku.plugins.dnm.util;

import org.w3c.dom.Element;

public class TaskIxNamespaces extends AbstractHtmlMaterialCleanerTask {
  
  @Override
  protected void cleanElement(Element e) {
    if (e.hasAttribute("xmlns:ix")) {
      e.removeAttribute("xmlns:ix");
      markModified();
    }
    if (e.hasAttribute("xmlns:ixf")) {
      e.removeAttribute("xmlns:ixf");
      markModified();
    }
  }

  @Override
  public Integer getPriority() {
    return PRIORITY_LOW;
  }

}
