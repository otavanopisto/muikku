package fi.otavanopisto.muikku.dao.base;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.base.EnvironmentDefaults;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

public class EnvironmentDefaultsDAO extends CoreDAO<EnvironmentDefaults> {

	private static final long serialVersionUID = -3385964084597820036L;

	public EnvironmentDefaults find() {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<EnvironmentDefaults> criteria = criteriaBuilder.createQuery(EnvironmentDefaults.class);
		Root<EnvironmentDefaults> root = criteria.from(EnvironmentDefaults.class);
		criteria.select(root);

		return getSingleResult(entityManager.createQuery(criteria));
	}

}
