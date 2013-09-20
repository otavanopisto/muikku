package fi.muikku.dao.workspace;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.material.Material;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceMaterial;
import fi.muikku.model.workspace.WorkspaceMaterial_;

public class WorkspaceMaterialDAO extends CoreDAO<WorkspaceMaterial> {

  public WorkspaceMaterial create(WorkspaceEntity workspaceEntity, Material material) {
    WorkspaceMaterial workspaceMaterial = new WorkspaceMaterial();
    workspaceMaterial.setMaterial(material);
    workspaceMaterial.setWorkspaceEntity(workspaceEntity);
    getEntityManager().persist(workspaceMaterial);
    return workspaceMaterial;
  }
  
  public List<WorkspaceMaterial> listByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    CriteriaBuilder criteriaBuilder = getEntityManager().getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterial> criteria = criteriaBuilder.createQuery(WorkspaceMaterial.class);
    Root<WorkspaceMaterial> root = criteria.from(WorkspaceMaterial.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(WorkspaceMaterial_.workspaceEntity), workspaceEntity)
    );
    return getEntityManager().createQuery(criteria).getResultList();
  }
  
  public void delete(WorkspaceMaterial workspaceMaterial) {
    super.delete(workspaceMaterial);
  }
}
