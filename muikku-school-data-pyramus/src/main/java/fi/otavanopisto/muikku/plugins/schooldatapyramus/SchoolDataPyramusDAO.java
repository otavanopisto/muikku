package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import fi.otavanopisto.muikku.dao.PluginDAO;

public class SchoolDataPyramusDAO<T> extends PluginDAO<T> {
  
  private static final long serialVersionUID = -4318751707397038077L;

  @Override
  protected EntityManager getEntityManager() {
    return entityManager;
  }
  
  @PersistenceContext (unitName = "muikku-schooldata-pyramus")
  private EntityManager entityManager;
  
}
