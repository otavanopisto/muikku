package fi.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.users.EnvironmentUserRole;
import fi.muikku.model.users.EnvironmentUserRoleType;
import fi.muikku.model.users.EnvironmentUserRole_;

@DAO
public class EnvironmentUserRoleDAO extends CoreDAO<EnvironmentUserRole> {

	private static final long serialVersionUID = 7781839501190084061L;

	public List<EnvironmentUserRole> listByEnvironmentUserRoleType(EnvironmentUserRoleType environmentUserRoleType) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<EnvironmentUserRole> criteria = criteriaBuilder.createQuery(EnvironmentUserRole.class);
    Root<EnvironmentUserRole> root = criteria.from(EnvironmentUserRole.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(EnvironmentUserRole_.environmentUserRoleType), environmentUserRoleType)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

}
