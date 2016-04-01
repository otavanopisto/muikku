package fi.otavanopisto.muikku.dao.security;

import java.util.List;

import fi.otavanopisto.muikku.model.security.Permission_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.security.Permission;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class PermissionDAO extends CoreDAO<Permission> {

	private static final long serialVersionUID = 1865691516876354591L;

	public Permission create(String name, String scope) {
	  Permission permission = new Permission();
	  
	  permission.setName(name);
	  permission.setScope(scope);
	  
	  getEntityManager().persist(permission);
	  
	  return permission;
	}
	
	public Permission findByName(String name) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Permission> criteria = criteriaBuilder.createQuery(Permission.class);
    Root<Permission> root = criteria.from(Permission.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(Permission_.name), name)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<Permission> listByScope(String scope) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Permission> criteria = criteriaBuilder.createQuery(Permission.class);
    Root<Permission> root = criteria.from(Permission.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(Permission_.scope), scope)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
