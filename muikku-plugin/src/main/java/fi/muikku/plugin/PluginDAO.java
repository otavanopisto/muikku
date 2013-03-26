package fi.muikku.plugin;

import javax.annotation.Resource;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Status;
import javax.transaction.UserTransaction;
import fi.muikku.dao.AbstractDAO;

public class PluginDAO<T> extends AbstractDAO<T> {

  private static final long serialVersionUID = -146157476338894997L;

  @Resource
  private UserTransaction userTransaction;

  @SuppressWarnings("cdi-ambiguous-dependency")
  @Inject
  @PluginPersistence
  private EntityManager pluginEntityManager;

  @Override
  protected EntityManager getEntityManager() {
    try {
      boolean hasTransaction = userTransaction.getStatus() == Status.STATUS_ACTIVE;
      if (hasTransaction) {
        pluginEntityManager.joinTransaction();
      }
    } catch (Exception e) {
      // TODO exception handling
    }

    return pluginEntityManager;
  }

}
