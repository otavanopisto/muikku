package fi.muikku.plugins.settings.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugins.settings.model.Plugin;
import fi.muikku.plugins.settings.model.Plugin_;

@DAO
public class PluginEntityDAO extends fi.muikku.plugin.PluginDAO<Plugin> {

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
  
  public void delete(Plugin plugin) {
    super.delete(plugin);
  }
  
  public List<Plugin> listByLibrary(String pluginLibrary) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Plugin> criteria = criteriaBuilder.createQuery(Plugin.class);
    Root<Plugin> root = criteria.from(Plugin.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(Plugin_.library), pluginLibrary)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
}