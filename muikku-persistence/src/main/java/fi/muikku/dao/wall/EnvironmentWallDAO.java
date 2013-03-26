package fi.muikku.dao.wall;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.wall.EnvironmentWall;
import fi.muikku.model.wall.EnvironmentWall_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class EnvironmentWallDAO extends CoreDAO<EnvironmentWall> {

	private static final long serialVersionUID = 8146341830536682139L;

	public EnvironmentWall create(Environment environment) {
    EnvironmentWall environmentWall = new EnvironmentWall();
    
    environmentWall.setEnvironment(environment);
    
    getEntityManager().persist(environmentWall);
    
    return environmentWall;
  }
  
  public EnvironmentWall findByEnvironment(Environment environment) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<EnvironmentWall> criteria = criteriaBuilder.createQuery(EnvironmentWall.class);
    Root<EnvironmentWall> root = criteria.from(EnvironmentWall.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(EnvironmentWall_.environment), environment));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
