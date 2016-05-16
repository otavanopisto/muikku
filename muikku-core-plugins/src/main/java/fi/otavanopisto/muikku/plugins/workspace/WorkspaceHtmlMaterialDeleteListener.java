package fi.otavanopisto.muikku.plugins.workspace;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;

@ApplicationScoped
public class WorkspaceHtmlMaterialDeleteListener {
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  public void onHtmlMaterialDelete(@Observes HtmlMaterialDeleteEvent htmlMaterialDeleteEvent) throws WorkspaceMaterialContainsAnswersExeption {
    // TODO: This should not be limited to html materials
    Material material = htmlMaterialDeleteEvent.getMaterial();
    
    List<WorkspaceMaterial> workspaceMaterials = workspaceMaterialController.listWorkspaceMaterialsByMaterial(material);
    for (WorkspaceMaterial workspaceMaterial : workspaceMaterials) {
      workspaceMaterialController.deleteWorkspaceMaterial(workspaceMaterial, htmlMaterialDeleteEvent.getRemoveAnswers());
    }
    
  }

}
