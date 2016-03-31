package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.cache;

public enum CacheStrategy {

  /**
   * Entity will not be cached
   */
  
  NONE,
  
  /**
   * Entity will expire after expire time and on evict request
   */
  
  EXPIRES,
  
  /**
   * Entity will expire only on evict request
   */
  
  PERSISTENT
  
}
