package fi.otavanopisto.muikku.dao.plugins;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.plugins.PluginUserSetting_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.plugins.PluginUserSetting;
import fi.otavanopisto.muikku.model.plugins.PluginUserSettingKey;
import fi.otavanopisto.muikku.model.users.UserEntity;

public class PluginUserSettingDAO extends CoreDAO<PluginUserSetting> {

	private static final long serialVersionUID = 7948864110260023579L;

	public PluginUserSetting create(PluginUserSettingKey key, UserEntity user, String value) {
		PluginUserSetting pluginUserSetting = new PluginUserSetting();
		pluginUserSetting.setKey(key);
		pluginUserSetting.setUser(user);
		pluginUserSetting.setValue(value);
		
		getEntityManager().persist(pluginUserSetting);
		
		return pluginUserSetting;
	}

	public PluginUserSetting findByKeyAndUser(PluginUserSettingKey key, UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<PluginUserSetting> criteria = criteriaBuilder.createQuery(PluginUserSetting.class);
    Root<PluginUserSetting> root = criteria.from(PluginUserSetting.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
      		criteriaBuilder.equal(root.get(PluginUserSetting_.key), key),
      		criteriaBuilder.equal(root.get(PluginUserSetting_.user), user)
      ) 
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

	public List<UserEntity> listUsersByKey(PluginUserSettingKey key) {
		EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserEntity> criteria = criteriaBuilder.createQuery(UserEntity.class);
    Root<PluginUserSetting> root = criteria.from(PluginUserSetting.class);
    criteria.select(root.get(PluginUserSetting_.user));
    
    criteria.where(
      criteriaBuilder.equal(root.get(PluginUserSetting_.key), key)
    );
    
    return entityManager.createQuery(criteria).getResultList();
	}
	
	public PluginUserSetting updateValue(PluginUserSetting pluginUserSetting, String value) {
		pluginUserSetting.setValue(value);
		
		getEntityManager().persist(pluginUserSetting);
		
		return pluginUserSetting;
	}
}
