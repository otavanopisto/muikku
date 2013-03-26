package fi.muikku.dao.users;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.users.SystemUserRole;
import fi.muikku.model.users.SystemUserRoleType;
import fi.muikku.model.users.SystemUserRole_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class SystemUserRoleDAO extends CoreDAO<SystemUserRole> {

	private static final long serialVersionUID = 1271818701330697756L;

	public SystemUserRole findByType(SystemUserRoleType type) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SystemUserRole> criteria = criteriaBuilder.createQuery(SystemUserRole.class);
    Root<SystemUserRole> root = criteria.from(SystemUserRole.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(SystemUserRole_.systemUserRoleType), type)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
}
