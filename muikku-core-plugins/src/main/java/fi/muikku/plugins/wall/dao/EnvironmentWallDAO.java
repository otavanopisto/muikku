package fi.muikku.plugins.wall.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.base.Environment;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.wall.model.EnvironmentWall;
import fi.muikku.plugins.wall.model.EnvironmentWall_;


@DAO
public class EnvironmentWallDAO extends PluginDAO<EnvironmentWall> {

	private static final long serialVersionUID = 8146341830536682139L;

	public EnvironmentWall create(Environment environment) {
    EnvironmentWall environmentWall = new EnvironmentWall();
    
    environmentWall.setEnvironment(environment.getId());
    
    getEntityManager().persist(environmentWall);
    
    return environmentWall;
  }
  
  public EnvironmentWall findByEnvironment(Environment environment) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<EnvironmentWall> criteria = criteriaBuilder.createQuery(EnvironmentWall.class);
    Root<EnvironmentWall> root = criteria.from(EnvironmentWall.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(EnvironmentWall_.environment), environment.getId()));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
