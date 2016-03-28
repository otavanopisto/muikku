package fi.otavanopisto.muikku.plugins;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import fi.otavanopisto.muikku.dao.PluginDAO;

public abstract class CorePluginsDAO<T> extends PluginDAO<T> {
  
  private static final long serialVersionUID = -5116396317760092051L;

  protected EntityManager getEntityManager() {
    return entityManager;
  }

  @PersistenceContext (unitName = "muikku-core-plugins")
  private EntityManager entityManager;
  
}
