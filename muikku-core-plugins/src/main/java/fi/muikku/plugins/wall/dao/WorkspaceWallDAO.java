package fi.muikku.plugins.wall.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.wall.model.WorkspaceWall;
import fi.muikku.plugins.wall.model.WorkspaceWall_;

@DAO
public class WorkspaceWallDAO extends PluginDAO<WorkspaceWall> {

	private static final long serialVersionUID = -4292824493620956200L;

	public WorkspaceWall create(WorkspaceEntity course) {
    WorkspaceWall courseWall = new WorkspaceWall();
    
    courseWall.setWorkspace(course.getId());
    
    getEntityManager().persist(courseWall);
    
    return courseWall;
  }

  public WorkspaceWall findByCourse(WorkspaceEntity course) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceWall> criteria = criteriaBuilder.createQuery(WorkspaceWall.class);
    Root<WorkspaceWall> root = criteria.from(WorkspaceWall.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(WorkspaceWall_.workspace), course.getId()));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
