package fi.muikku.plugins.dnm.util;

import java.io.InputStream;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;

import fi.muikku.plugins.material.BinaryMaterialController;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.WorkspaceMaterialUtils;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

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
    if ("img".equals(element.getTagName()) && element.hasAttribute("ix_mathmldata")) {
      String src = element.getAttribute("src");
      if (StringUtils.startsWith(src, "/~Repository/ResourceAPI/RenderMathML")) {
        src = "http://muikku.otavanopisto.fi" + src;
        markModified();
      }
      else if (StringUtils.startsWith(src, "muikku.otavanopisto.fi/~Repository/ResourceAPI/RenderMathML")) {
        src = "http://" + src;
        markModified();
      }
      else if (StringUtils.startsWith(src, "http://muikku.otavanopisto.fi/~Repository/ResourceAPI/RenderMathML")) {
        markModified();
      }
      if (isModified()) {
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
          BinaryMaterial material = binaryMaterialController.createBinaryMaterial(name, "image/png", data);
          WorkspaceMaterial workspaceMaterial = workspaceMaterialController.createWorkspaceMaterial(getWorkspaceMaterial(), material);
          String workspaceUrl = StringUtils.prependIfMissing(WorkspaceMaterialUtils.getCompletePath(workspaceMaterial), "/");
          logger.info("MathML converted to " + workspaceUrl);
          element.setAttribute("src",  workspaceUrl);
          element.removeAttribute("ix_mathml");
          element.removeAttribute("ix_mathmldata");
        }
        catch (Exception e) {
          logger.log(Level.SEVERE, "Failed to process MathML from URL " + src, e);
          markClean();
        }
      }
    }
  }

}
