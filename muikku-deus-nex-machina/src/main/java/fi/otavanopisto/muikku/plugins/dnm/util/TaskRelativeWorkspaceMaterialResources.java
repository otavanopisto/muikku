package fi.otavanopisto.muikku.plugins.dnm.util;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;

import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;

public class TaskRelativeWorkspaceMaterialResources extends AbstractHtmlMaterialCleanerTask {

  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Override
  protected void cleanElement(Element element) {
    boolean resourceConflict = false;
    // TODO: Treats all relative links as immediate child resources of this material ONLY  
    String elementName = element.getTagName();
    if ("img".equals(elementName) || "source".equals(elementName) || "embed".equals(elementName) || "object".equals(elementName)) {
      String attributeName = "object".equals(elementName) ? "data" : "src";
      String src = element.getAttribute(attributeName);
      
      // Process all links that point to /workspace/...
      
      if (StringUtils.startsWith(src, "/workspace/")) {
        logger.info(String.format("Processing resource %s", src));
        
        // Resolve WorkspaceMaterial and Material the link points to
        
        WorkspaceMaterial resourceWorkspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByRootPath(src);
        if (resourceWorkspaceMaterial != null) {
          String resourceUrlName = resourceWorkspaceMaterial.getUrlName();
          Material resourceMaterial = resourceWorkspaceMaterial == null ? null : workspaceMaterialController.getMaterialForWorkspaceMaterial(resourceWorkspaceMaterial);
          if (resourceMaterial != null) {

            // Ensure that all workspace materials using this HTML material will have the link target as a child resource 

            Material htmlMaterial = workspaceMaterialController.getMaterialForWorkspaceMaterial(getWorkspaceMaterial());
            List<WorkspaceMaterial> workspaceHtmlMaterials = workspaceMaterialController.listWorkspaceMaterialsByMaterial(htmlMaterial);
            for (WorkspaceMaterial workspaceHtmlMaterial : workspaceHtmlMaterials) {
              WorkspaceMaterial childMaterial = workspaceMaterialController.findWorkspaceMaterialByParentAndUrlName(workspaceHtmlMaterial, resourceUrlName);
              if (childMaterial == null) {
                childMaterial = workspaceMaterialController.createWorkspaceMaterial(workspaceHtmlMaterial, resourceMaterial, resourceUrlName, null, null);
                logger.info(String.format("Created resource %d with relative url %s", childMaterial.getId(), resourceUrlName));
              }
              else {
                resourceConflict = !resourceMaterial.getId().equals(childMaterial.getMaterialId());
                if (resourceConflict) {
                  logger.warning(String.format("Skipping resource because WorkspaceMaterial %d has conflicting child resource %s", workspaceHtmlMaterial.getId(), resourceUrlName));
                  break;
                }
              }
            }
            
            // Change source link to resource URL name
            
            if (!resourceConflict) {
              element.setAttribute(attributeName, resourceUrlName);
              markModified();
            }
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

  @Override
  public Integer getPriority() {
    return PRIORITY_NORMAL;
  }

}
