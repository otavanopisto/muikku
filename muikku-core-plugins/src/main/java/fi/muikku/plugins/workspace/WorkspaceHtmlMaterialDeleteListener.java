package fi.muikku.plugins.workspace;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.plugins.material.events.HtmlMaterialDeleteEvent;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

@Stateless
public class WorkspaceHtmlMaterialDeleteListener {
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  public void onHtmlMaterialDelete(@Observes HtmlMaterialDeleteEvent htmlMaterialDeleteEvent) {
    // TODO: This should not be limited to html materials
    Material material = htmlMaterialDeleteEvent.getMaterial();
    
    List<WorkspaceMaterial> workspaceMaterials = workspaceMaterialController.listWorkspaceMaterialsByMaterial(material);
    for (WorkspaceMaterial workspaceMaterial : workspaceMaterials) {
      workspaceMaterialController.deleteWorkspaceMaterial(workspaceMaterial);
    }
  }

}
