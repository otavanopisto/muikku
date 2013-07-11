package fi.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.EnvironmentRoleType;
import fi.muikku.model.users.EnvironmentUserRole_;

@DAO
public class EnvironmentRoleEntityDAO extends CoreDAO<EnvironmentRoleEntity> {

	private static final long serialVersionUID = 7781839501190084061L;

	public List<EnvironmentRoleEntity> listByEnvironmentRoleType(EnvironmentRoleType environmentUserRoleType) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<EnvironmentRoleEntity> criteria = criteriaBuilder.createQuery(EnvironmentRoleEntity.class);
    Root<EnvironmentRoleEntity> root = criteria.from(EnvironmentRoleEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(EnvironmentUserRole_.environmentUserRoleType), environmentUserRoleType)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

}
