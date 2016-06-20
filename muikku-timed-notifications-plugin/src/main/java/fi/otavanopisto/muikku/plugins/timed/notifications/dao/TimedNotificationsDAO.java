package fi.otavanopisto.muikku.plugins.timed.notifications.dao;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import fi.otavanopisto.muikku.dao.PluginDAO;

public class TimedNotificationsDAO<T> extends PluginDAO<T>{

  private static final long serialVersionUID = 5634602301671420338L;

  @Override
  protected EntityManager getEntityManager() {
    return entityManager;
  }
  
  @PersistenceContext (unitName = "muikku-timed-notifications-plugin")
  private EntityManager entityManager;
}
