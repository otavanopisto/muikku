package fi.otavanopisto.muikku.dao.plugins;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.plugins.PluginUserSettingKey_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.plugins.PluginUserSettingKey;

public class PluginUserSettingKeyDAO extends CoreDAO<PluginUserSettingKey> {

	private static final long serialVersionUID = -1720725608859632056L;

	public PluginUserSettingKey create(String plugin, String name) {
		PluginUserSettingKey pluginSettingKey = new PluginUserSettingKey();
		pluginSettingKey.setName(name);
		pluginSettingKey.setPlugin(plugin);
		
		getEntityManager().persist(pluginSettingKey);
		
		return pluginSettingKey;
	}
	
	public PluginUserSettingKey findByPluginAndName(String plugin, String name) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<PluginUserSettingKey> criteria = criteriaBuilder.createQuery(PluginUserSettingKey.class);
    Root<PluginUserSettingKey> root = criteria.from(PluginUserSettingKey.class);
    criteria.select(root);
    criteria.where(
    	criteriaBuilder.and(
      		criteriaBuilder.equal(root.get(PluginUserSettingKey_.name), name),
      		criteriaBuilder.equal(root.get(PluginUserSettingKey_.plugin), plugin)
    	)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
	
}
