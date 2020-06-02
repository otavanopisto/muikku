package fi.otavanopisto.muikku.plugins.dnm.util;

import java.io.InputStream;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;

import fi.otavanopisto.muikku.plugins.material.BinaryMaterialController;
import fi.otavanopisto.muikku.plugins.material.model.BinaryMaterial;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;

public class TaskMathMl extends AbstractHtmlMaterialCleanerTask {

  @Inject
  private Logger logger;
  
  @Inject
  private BinaryMaterialController binaryMaterialController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  private int imageCounter = 0;
  
  @Override
  protected void cleanElement(Element element) {
    boolean needsModify = false;
    if ("img".equals(element.getTagName()) && element.hasAttribute("ix_mathmldata")) {
      String src = element.getAttribute("src");
      if (StringUtils.startsWith(src, "/~Repository/ResourceAPI/RenderMathML")) {
        src = "http://muikku.otavanopisto.fi" + src;
        needsModify = true;
      }
      else if (StringUtils.startsWith(src, "muikku.otavanopisto.fi/~Repository/ResourceAPI/RenderMathML")) {
        src = "http://" + src;
        needsModify = true;
      }
      else if (StringUtils.startsWith(src, "http://muikku.otavanopisto.fi/~Repository/ResourceAPI/RenderMathML")) {
        needsModify = true;
      }
      if (needsModify) {
        try {
          logger.info("Converting MathML from " + src);
          URL url = new URL(src);
          InputStream is = url.openStream();
          byte[] data = {};
          try {
            data = IOUtils.toByteArray(is);
          }
          finally {
            is.close();
          }
          String name = "mathml" + StringUtils.leftPad(++imageCounter + "", 3, '0') + ".png";
          String license = null;
          BinaryMaterial material = binaryMaterialController.createBinaryMaterial(name, "image/png", data, license);
          WorkspaceMaterial workspaceMaterial = workspaceMaterialController.createWorkspaceMaterial(getWorkspaceMaterial(), material);
          String workspaceUrl = StringUtils.prependIfMissing(workspaceMaterialController.getCompletePath(workspaceMaterial), "/");
          logger.info("MathML converted to " + workspaceUrl);
          element.setAttribute("src",  workspaceUrl);
          element.removeAttribute("ix_mathml");
          element.removeAttribute("ix_mathmldata");
          
          markModified();
        }
        catch (Exception e) {
          logger.log(Level.SEVERE, "Failed to process MathML from URL " + src, e);
        }
      }
    }
  }

  @Override
  public Integer getPriority() {
    return PRIORITY_HIGH;
  }

}
