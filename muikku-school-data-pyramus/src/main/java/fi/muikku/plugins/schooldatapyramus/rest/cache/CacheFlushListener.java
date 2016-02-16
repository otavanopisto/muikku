package fi.muikku.plugins.schooldatapyramus.rest.cache;

import fi.muikku.cache.CacheFlushEvent;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

public class CacheFlushListener {
  
  @Inject
  private EntityCacheEvictor entityCacheEvictor;

  public void onCacheFlush(@Observes CacheFlushEvent event) {
    entityCacheEvictor.flushAll();
  }
  
}
