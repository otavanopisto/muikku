package fi.muikku.plugins.workspace;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.workspace.dao.WorkspaceMaterialFieldDAO;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;

@Stateless
@Dependent
public class WorkspaceMaterialFieldController {

  @Inject
  WorkspaceMaterialFieldDAO workspaceMaterialFieldDAO;
  
  public List<WorkspaceMaterialField> findWorkspaceMaterialFieldsByMaterial(WorkspaceMaterial material){
    return workspaceMaterialFieldDAO.findMaterialFieldByMaterial(material);
  }
  
  
}
