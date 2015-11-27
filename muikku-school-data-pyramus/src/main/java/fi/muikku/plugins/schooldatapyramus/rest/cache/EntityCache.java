package fi.muikku.plugins.schooldatapyramus.rest.cache;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.inject.Inject;

@Stateful
public class EntityCache {
  
  @Inject
  private Logger logger;
  
  @Inject
  private CacheSettingsController cacheSettingsController;
  
  @PostConstruct
  public void init() {
    cache = new HashMap<>();
  }
  
  public <T> CachedEntity<T> put(String path, T data) {
    CacheSetting cacheSettings = cacheSettingsController.getCacheSettings(path);
    Long expires = null;
    
    if (cacheSettings.getExpireTime() != null) {
      expires = System.currentTimeMillis() + cacheSettings.getExpireTime();
    }
    
    CachedEntity<T> cachedEntity = new CachedEntity<T>(data, expires);
    cache.put(path, cachedEntity);
    
    return cachedEntity;
  }
  
  public void remove(String path) {
    cache.remove(path);
  }
  
  public <T> CachedEntity<T> get(String path, Class<? extends T> clazz) {
    @SuppressWarnings("unchecked")
    CachedEntity<T> cachedEntity = (CachedEntity<T>) cache.get(path);
    if (cachedEntity != null) {
      if ((cachedEntity.getExpires() != null) || (cachedEntity.getExpires().longValue() < System.currentTimeMillis())) {
        cachedEntity.incHit();
        logger.info(String.format("Cache hit (%s), hits %d", path, cachedEntity.getHits()));
        return cachedEntity;
      } else {
        cache.remove(path);
      }
    }
    
    return null;
  }
  
  private Map<String, CachedEntity<?>> cache;
}
