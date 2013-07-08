package fi.muikku.dao.plugins;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.plugins.Plugin;
import fi.muikku.model.plugins.Plugin_;

@DAO
public class PluginEntityDAO extends fi.muikku.dao.CoreDAO<Plugin> {

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
  
  public List<Plugin> listByName(String name) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Plugin> criteria = criteriaBuilder.createQuery(Plugin.class);
    Root<Plugin> root = criteria.from(Plugin.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(Plugin_.name), name)
    );
    
    return entityManager.createQuery(criteria).getResultList();
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