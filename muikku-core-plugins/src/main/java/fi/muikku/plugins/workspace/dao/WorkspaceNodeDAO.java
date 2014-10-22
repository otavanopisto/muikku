package fi.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceNode_;

public class WorkspaceNodeDAO extends CorePluginsDAO<WorkspaceNode> {

	private static final long serialVersionUID = 6929866288759721384L;

	public WorkspaceNode findByParentAndUrlName(WorkspaceNode parent, String urlName) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNode> criteria = criteriaBuilder.createQuery(WorkspaceNode.class);
    Root<WorkspaceNode> root = criteria.from(WorkspaceNode.class);
    criteria.select(root);
    criteria.where(
   		criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceNode_.parent), parent),
        criteriaBuilder.equal(root.get(WorkspaceNode_.urlName), urlName)
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
	}

	public List<WorkspaceNode> listByParent(WorkspaceNode parent) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNode> criteria = criteriaBuilder.createQuery(WorkspaceNode.class);
    Root<WorkspaceNode> root = criteria.from(WorkspaceNode.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceNode_.parent), parent)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

}
