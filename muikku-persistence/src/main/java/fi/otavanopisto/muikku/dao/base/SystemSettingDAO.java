package fi.otavanopisto.muikku.dao.base;

import fi.otavanopisto.muikku.model.base.SystemSetting_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.base.SystemSetting;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

public class SystemSettingDAO extends CoreDAO<SystemSetting> {

	private static final long serialVersionUID = -3385964084597820036L;
	
	public SystemSetting create(String key, String value) {
	  SystemSetting systemSetting = new SystemSetting();
	  systemSetting.setKey(key);
	  systemSetting.setValue(value);
	  getEntityManager().persist(systemSetting);
	  return systemSetting;
	}

	public SystemSetting update(SystemSetting systemSetting, String value) {
	  systemSetting.setValue(value);
	  getEntityManager().persist(systemSetting);
	  return systemSetting;
	}

	public SystemSetting findByKey(String key) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<SystemSetting> criteria = criteriaBuilder.createQuery(SystemSetting.class);
		Root<SystemSetting> root = criteria.from(SystemSetting.class);
		criteria.select(root);
		criteria.where(criteriaBuilder.equal(root.get(SystemSetting_.key), key));

		return getSingleResult(entityManager.createQuery(criteria));
	}

}