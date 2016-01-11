package fi.muikku.plugins.dnm.util;

import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;

import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

public class TaskRelativeWorkspaceMaterialResources extends AbstractHtmlMaterialCleanerTask {

  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Override
  protected void cleanElement(Element element) {
    if ("img".equals(element.getTagName())) {
      // TODO object, embed, iframe, audio, etc.
      String src = element.getAttribute("src");
      if (StringUtils.startsWith(src, "/workspace/")) {
        logger.info(String.format("Processing resource %s", src));
        WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByRootPath(src);
        if (workspaceMaterial != null) {
          Material material = workspaceMaterial == null ? null : workspaceMaterialController.getMaterialForWorkspaceMaterial(workspaceMaterial);
          if (material != null) {
            WorkspaceMaterial childMaterial = workspaceMaterialController.findWorkspaceMaterialByParentAndUrlName(getWorkspaceMaterial(), workspaceMaterial.getUrlName());
            if (childMaterial == null) {
              childMaterial = workspaceMaterialController.createWorkspaceMaterial(getWorkspaceMaterial(), material, workspaceMaterial.getUrlName(), null, null);
              logger.info(String.format("Created resource %d with relative url %s", childMaterial.getId(), workspaceMaterial.getUrlName()));
            }
            else {
              logger.warning(String.format("Child resource %s already exists", workspaceMaterial.getUrlName()));
            }
            element.setAttribute("src", workspaceMaterial.getUrlName());
            markModified();
          }
          else {
            logger.warning("Resource does not resolve to Material");
          }
        }
        else {
          logger.warning("Resource does not resolve to WorkspaceMaterial");
        }
      }
    }
  }

}
