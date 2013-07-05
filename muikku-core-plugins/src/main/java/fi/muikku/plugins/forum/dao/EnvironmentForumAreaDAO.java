package fi.muikku.plugins.forum.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.muikku.plugins.forum.model.EnvironmentForumArea_;


@DAO
public class EnvironmentForumAreaDAO extends PluginDAO<EnvironmentForumArea> {
  
	private static final long serialVersionUID = 2917574952932278029L;

	public EnvironmentForumArea create(Environment environment, String name, Boolean archived, UserEntity owner, ResourceRights rights) {
    EnvironmentForumArea environmentForumArea = new EnvironmentForumArea();
    
    environmentForumArea.setEnvironment(environment.getId());
    environmentForumArea.setName(name);
    environmentForumArea.setArchived(archived);
    environmentForumArea.setOwner(owner.getId());
    environmentForumArea.setRights(rights.getId());
    
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
        criteriaBuilder.equal(root.get(EnvironmentForumArea_.environment), environment.getId())
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
