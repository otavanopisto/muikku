package fi.otavanopisto.muikku.plugins.wall.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.wall.model.EnvironmentWall;


public class EnvironmentWallDAO extends CorePluginsDAO<EnvironmentWall> {

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
