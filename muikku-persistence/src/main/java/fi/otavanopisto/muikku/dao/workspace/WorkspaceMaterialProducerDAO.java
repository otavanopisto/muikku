package fi.otavanopisto.muikku.dao.workspace;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialProducer;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialProducer_;

public class WorkspaceMaterialProducerDAO extends CoreDAO<WorkspaceMaterialProducer> {
  
  private static final long serialVersionUID = -2752326025619390579L;

  public WorkspaceMaterialProducer create(WorkspaceEntity workspaceEntity, String name) {
	  WorkspaceMaterialProducer workspaceMaterialProducer = new WorkspaceMaterialProducer();
    
	  workspaceMaterialProducer.setName(name);
	  workspaceMaterialProducer.setWorkspaceEntity(workspaceEntity);
	  
    return persist(workspaceMaterialProducer);
  }

	public List<WorkspaceMaterialProducer> listByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialProducer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialProducer.class);
    Root<WorkspaceMaterialProducer> root = criteria.from(WorkspaceMaterialProducer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialProducer_.workspaceEntity), workspaceEntity)
    );
   
    return entityManager.createQuery(criteria).getResultList();
	}

  public void delete(WorkspaceMaterialProducer workspaceMaterialProducer) {
    super.delete(workspaceMaterialProducer);
  }

}
