package fi.otavanopisto.muikku.dao.plugins;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.plugins.Plugin_;
import fi.otavanopisto.muikku.model.plugins.Plugin;

public class PluginEntityDAO extends fi.otavanopisto.muikku.dao.CoreDAO<Plugin> {

  /**
   * 
   */
  private static final long serialVersionUID = -19075691136L;
  
  public Plugin create(String name, Boolean isEnabled) {
    Plugin plugin = new Plugin();
    plugin.setName(name);
    plugin.setEnabled(isEnabled);
    getEntityManager().persist(plugin);
    return plugin;
  }
  
  public Plugin findByName(String name) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Plugin> criteria = criteriaBuilder.createQuery(Plugin.class);
    Root<Plugin> root = criteria.from(Plugin.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(Plugin_.name), name)
    );
    
    try {
      return entityManager.createQuery(criteria).getSingleResult();
    } catch (NoResultException noResultException) {
      return null;
    }
  }
  
  public Plugin updateEnabled(Plugin plugin, Boolean enabled) {
    plugin.setEnabled(enabled);
    getEntityManager().persist(plugin);
    return plugin;
  }
  
  public void delete(Plugin plugin) {
    super.delete(plugin);
  }
}