package fi.muikku.dao.forum;

import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.forum.EnvironmentForumArea;
import fi.muikku.model.forum.EnvironmentForumArea_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class EnvironmentForumAreaDAO extends CoreDAO<EnvironmentForumArea> {
  
	private static final long serialVersionUID = 2917574952932278029L;

	public EnvironmentForumArea create(Environment environment, String name, Boolean archived) {
    EnvironmentForumArea environmentForumArea = new EnvironmentForumArea();
    
    environmentForumArea.setEnvironment(environment);
    environmentForumArea.setName(name);
    environmentForumArea.setArchived(archived);
    
    getEntityManager().persist(environmentForumArea);
    
    return environmentForumArea;
  }
 
  public List<EnvironmentForumArea> listByEnvironment(Environment environment) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<EnvironmentForumArea> criteria = criteriaBuilder.createQuery(EnvironmentForumArea.class);
    Root<EnvironmentForumArea> root = criteria.from(EnvironmentForumArea.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(EnvironmentForumArea_.environment), environment)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
