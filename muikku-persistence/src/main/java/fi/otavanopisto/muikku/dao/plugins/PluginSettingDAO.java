package fi.otavanopisto.muikku.dao.plugins;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.plugins.PluginSetting_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.plugins.PluginSetting;
import fi.otavanopisto.muikku.model.plugins.PluginSettingKey;

public class PluginSettingDAO extends CoreDAO<PluginSetting> {

	private static final long serialVersionUID = -8305629694721284063L;

	public PluginSetting create(PluginSettingKey key, String value) {
		PluginSetting pluginSetting = new PluginSetting();
		pluginSetting.setKey(key);
		pluginSetting.setValue(value);
		
		getEntityManager().persist(pluginSetting);
		
		return pluginSetting;
	}
	
	public PluginSetting findByKey(PluginSettingKey key) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<PluginSetting> criteria = criteriaBuilder.createQuery(PluginSetting.class);
    Root<PluginSetting> root = criteria.from(PluginSetting.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(PluginSetting_.key), key)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
	
	public PluginSetting updateValue(PluginSetting pluginSetting, String value) {
		pluginSetting.setValue(value);
		
		getEntityManager().persist(pluginSetting);
		
		return pluginSetting;
	}
	
}
