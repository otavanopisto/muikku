package fi.muikku.plugins.wall.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.wall.model.EnvironmentWall;

@DAO
public class EnvironmentWallDAO extends PluginDAO<EnvironmentWall> {

	private static final long serialVersionUID = 8146341830536682139L;

	public EnvironmentWall create() {
    EnvironmentWall environmentWall = new EnvironmentWall();
    getEntityManager().persist(environmentWall);
    
    return environmentWall;
  }
  
  public EnvironmentWall find() {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<EnvironmentWall> criteria = criteriaBuilder.createQuery(EnvironmentWall.class);
    Root<EnvironmentWall> root = criteria.from(EnvironmentWall.class);
    criteria.select(root);
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
