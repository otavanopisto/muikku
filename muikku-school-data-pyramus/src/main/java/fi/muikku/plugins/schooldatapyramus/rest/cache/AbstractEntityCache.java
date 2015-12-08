package fi.muikku.plugins.schooldatapyramus.rest.cache;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.inject.Inject;

public abstract class AbstractEntityCache {
  
  @Inject
  private Logger logger;
  
  @Inject
  private CacheConfigs cacheConfigs;
  
  @Inject
  private EntityCacheEvictor entityCacheEvictor;
  
  @Inject
  private EntityCacheStatistics entityCacheStatistics;
  
  @PostConstruct
  public void init() {
    cache = new HashMap<>();
    logger.info(String.format("(%s) New cache created", getType()));
    entityCacheEvictor.addCache(this);
  }
  
  @PreDestroy
  public void deinit() {
    logger.info(String.format("(%s) Cache removed", getType()));
    entityCacheEvictor.removeCache(this);
  }
  
  public abstract String getType();
  
  public <T> CachedEntity<T> put(String path, T data) {
    CacheConfig cacheConfig = cacheConfigs.getCacheConfig(path);
    if (!cacheConfig.getEnabledCaches().contains(getType())) {
      entityCacheStatistics.addSkip(getType(), path);
      return null;
    }
    
    Long expires = null;
    
    switch (cacheConfig.getCacheStrategy()) {
      case NONE:
        entityCacheStatistics.addSkip(getType(), path);
        return null;
      case EXPIRES:
        if (cacheConfig.getExpireTime() != null) {
          expires = System.currentTimeMillis() + cacheConfig.getExpireTime();
        }
      break;
      case PERSISTENT:
      break;
    }
    
    if (cache.keySet().size() > getMaxEntries()) {
      clear();
    }
    
    CachedEntity<T> cachedEntity = new CachedEntity<T>(data, expires);
    cache.put(path, cachedEntity);
    
    return cachedEntity;
  }
  
  public void remove(String path) {
    if (cache.containsKey(path)) {
      logger.fine(String.format("(%s) Cache cleared for %s", getType(), path));
      cache.remove(path);
    } else {
      logger.fine(String.format("(%s) Did not find any cached resources for %s", getType(), path));
    }
  }
  
  public <T> CachedEntity<T> get(String path, Class<? extends T> clazz) {
    @SuppressWarnings("unchecked")
    CachedEntity<T> cachedEntity = (CachedEntity<T>) cache.get(path);
    if (cachedEntity != null) {
      if ((cachedEntity.getExpires() != null) || (cachedEntity.getExpires().longValue() < System.currentTimeMillis())) {
        entityCacheStatistics.addHit(getType(), path);
        return cachedEntity;
      } else {
        remove(path);
      }
    }
    
    entityCacheStatistics.addMiss(getType(), path);

    return null;
  }

  public void clear() {
    cache.clear();
  }
  
  public abstract int getMaxEntries();

  private Map<String, CachedEntity<?>> cache;
}
