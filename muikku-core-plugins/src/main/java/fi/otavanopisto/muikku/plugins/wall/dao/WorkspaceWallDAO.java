package fi.otavanopisto.muikku.plugins.wall.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.wall.model.WorkspaceWall_;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.wall.model.WorkspaceWall;


public class WorkspaceWallDAO extends CorePluginsDAO<WorkspaceWall> {

	private static final long serialVersionUID = -4292824493620956200L;

	public WorkspaceWall create(WorkspaceEntity workspace) {
    WorkspaceWall workspaceWall = new WorkspaceWall();
    
    workspaceWall.setWorkspace(workspace.getId());
    
    getEntityManager().persist(workspaceWall);
    
    return workspaceWall;
  }

  public WorkspaceWall findByWorkspace(WorkspaceEntity workspace) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceWall> criteria = criteriaBuilder.createQuery(WorkspaceWall.class);
    Root<WorkspaceWall> root = criteria.from(WorkspaceWall.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(WorkspaceWall_.workspace), workspace.getId()));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
