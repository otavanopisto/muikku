package fi.otavanopisto.muikku.dao.security;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.security.GroupPermission;
import fi.otavanopisto.muikku.model.security.GroupPermission_;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;

public class GroupPermissionDAO extends CoreDAO<GroupPermission> {

  private static final long serialVersionUID = -5450007023015652417L;

  public GroupPermission findByUserGroupAndPermission(UserGroupEntity userGroupEntity, Permission permission) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<GroupPermission> criteria = criteriaBuilder.createQuery(GroupPermission.class);
		Root<GroupPermission> root = criteria.from(GroupPermission.class);
		criteria.select(root);
		criteria.where(
		  criteriaBuilder.and(
		    criteriaBuilder.equal(root.get(GroupPermission_.userGroup), userGroupEntity),
				criteriaBuilder.equal(root.get(GroupPermission_.permission), permission)
		  )
		);

		return getSingleResult(entityManager.createQuery(criteria));
	}

}
