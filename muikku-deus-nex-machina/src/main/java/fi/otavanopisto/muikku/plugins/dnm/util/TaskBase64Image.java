package fi.otavanopisto.muikku.plugins.dnm.util;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;

import fi.otavanopisto.muikku.plugins.material.BinaryMaterialController;
import fi.otavanopisto.muikku.plugins.material.model.BinaryMaterial;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;

public class TaskBase64Image extends AbstractHtmlMaterialCleanerTask {

  @Inject
  private Logger logger;
  
  @Inject
  private BinaryMaterialController binaryMaterialController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  private int imageCounter = 0;
  
  @Override
  protected void cleanElement(Element element) {
    if ("img".equals(element.getTagName())) {
      String src = element.getAttribute("src");
      if (StringUtils.startsWith(src, "data:") && StringUtils.contains(src, ";base64,")) {
        logger.info("Converting base64 image");
        try {
          String contentType = StringUtils.substringBetween(src, "data:", ";base64,");
          byte[] data = Base64.decodeBase64(StringUtils.substringAfter(src, ";base64,"));

          String prefix = null;
          if (StringUtils.contains(contentType,  "jpg") || StringUtils.contains(contentType,  "jpeg")) {
            prefix = "jpg";
          }
          else if (StringUtils.contains(contentType, "gif")) {
            prefix = "gif";
          }
          else if (StringUtils.contains(contentType, "png")) {
            prefix = "png";
          }
          else {
            logger.log(Level.WARNING, String.format("Image of content type %s prefixed as %s", contentType, prefix));
          }
          String name = prefix == null
              ? String.format("img%s", StringUtils.leftPad(++imageCounter + "", 3, '0'))
              : String.format("img%s.%s", StringUtils.leftPad(++imageCounter + "", 3, '0'), prefix);

          BinaryMaterial material = binaryMaterialController.createBinaryMaterial(name, contentType, data);
          WorkspaceMaterial workspaceMaterial = workspaceMaterialController.createWorkspaceMaterial(getWorkspaceMaterial(), material);
          String workspaceUrl = StringUtils.prependIfMissing(workspaceMaterialController.getCompletePath(workspaceMaterial), "/");
          logger.info(String.format("Image converted to %s", workspaceUrl));
          element.setAttribute("src",  workspaceUrl);

          markModified();
        }
        catch (Exception e) {
          logger.log(Level.SEVERE, String.format("Failed to fix image from %s", src), e);
        }
      }
    }
  }

  @Override
  public Integer getPriority() {
    return PRIORITY_HIGH;
  }

}
