package fi.muikku.dao.security;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.security.AuthSource;
import fi.muikku.model.security.AuthSource_;

@DAO
public class AuthSourceDAO extends CoreDAO<AuthSource> {

  private static final long serialVersionUID = 954369239264816433L;

  public AuthSource create(String name, String strategy) {
	  AuthSource authSource = new AuthSource();
	  authSource.setName(name);
	  authSource.setStrategy(strategy);

	  return persist(authSource);
	}
	
	public AuthSource findByStrategy(String strategy) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AuthSource> criteria = criteriaBuilder.createQuery(AuthSource.class);
    Root<AuthSource> root = criteria.from(AuthSource.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(AuthSource_.strategy), strategy)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
