package fi.otavanopisto.muikku.plugins.calendar;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;

import fi.otavanopisto.muikku.cache.CacheFlushEvent;

public class JPACacheFlushListener {
  
  @PersistenceUnit
  private EntityManagerFactory entityManagerFactory;

  @Inject
  private Logger logger;
  
  public void onCacheFlush(@Observes CacheFlushEvent event) {
    logger.log(Level.INFO, "Flushing JPA cache");
    try {
      entityManagerFactory.getCache().evictAll();
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Flushing JPA cache failed", e);
    }
  }
  
}
