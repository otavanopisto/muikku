package fi.muikku.dao.plugins;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
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
  
  public Plugin create(String name, String library, Boolean isEnabled) {
    Plugin plugin = new Plugin();
    plugin.setName(name);
    plugin.setLibrary(library);
    plugin.setEnabled(isEnabled);
    getEntityManager().persist(plugin);
    return plugin;
  }
  
  public Plugin findByNameAndLibrary(String name, String library) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Plugin> criteria = criteriaBuilder.createQuery(Plugin.class);
    Root<Plugin> root = criteria.from(Plugin.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(Plugin_.name), name),
            criteriaBuilder.equal(root.get(Plugin_.library), library)
        )
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