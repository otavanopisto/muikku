package fi.otavanopisto.muikku.dao;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

public abstract class CoreDAO<T> extends AbstractDAO<T> {

	private static final long serialVersionUID = -4143857142842905598L;

	protected EntityManager getEntityManager() {
    return entityManager;
  }

  @PersistenceContext (unitName = "muikku")
  private EntityManager entityManager;
}