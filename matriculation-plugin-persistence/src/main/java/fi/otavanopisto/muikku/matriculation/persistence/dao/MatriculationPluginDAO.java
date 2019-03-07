package fi.otavanopisto.muikku.matriculation.persistence.dao;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import fi.otavanopisto.muikku.dao.PluginDAO;

public abstract class MatriculationPluginDAO<T> extends PluginDAO<T> {

  private static final long serialVersionUID = 1062901330769382376L;
  @PersistenceContext(unitName = "muikku-matriculation-plugin")
  private EntityManager entityManager;

  protected EntityManager getEntityManager() {
    return entityManager;
  }

  public MatriculationPluginDAO() {
    super();
  }

}