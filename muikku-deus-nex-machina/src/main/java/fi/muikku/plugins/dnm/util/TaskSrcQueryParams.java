package fi.muikku.plugins.dnm.util;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;

public class TaskSrcQueryParams extends AbstractHtmlMaterialCleanerTask {
  
  @Override
  protected void cleanElement(Element e) {
    if (e.hasAttribute("src")) {
      String src = e.getAttribute("src");
      if (StringUtils.startsWith(src, "/workspace/")) {
        int i = StringUtils.indexOf(src, "?");
        if (i != -1) {
          e.setAttribute("src", StringUtils.substring(src,  0,  i));
          markModified();
        }
      }
    }
  }

}
