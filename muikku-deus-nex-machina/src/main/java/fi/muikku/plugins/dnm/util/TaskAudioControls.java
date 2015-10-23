package fi.muikku.plugins.dnm.util;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;

public class TaskAudioControls extends AbstractHtmlMaterialCleanerTask {

  @Override
  protected void cleanElement(Element e) {
    if (StringUtils.equals(e.getTagName(), "audio")) {
      if (!e.hasAttribute("controls")) {
        e.setAttribute("controls", "true");
        markModified();
      }
      if (!e.hasAttribute("preload") || !"none".equals(e.getAttribute("preload"))) {
        e.setAttribute("preload", "none");
        markModified();
      }
    }
  }

}
