package fi.muikku.plugins.schooldatapyramus.rest.cache;

public class CacheSetting {

  public CacheSetting() {
  }
  
  public CacheSetting(CacheStrategy evictStrategy, Long maxEntries, Long expireTime) {
    this.cacheStrategy = evictStrategy;
    this.maxEntries = maxEntries;
    this.expireTime = expireTime;
  }
  
  public CacheStrategy getCacheStrategy() {
    return cacheStrategy;
  }
  
  public void setCacheStrategy(CacheStrategy cacheStrategy) {
    this.cacheStrategy = cacheStrategy;
  }
  
  public Long getExpireTime() {
    return expireTime;
  }
  
  public void setExpireTime(Long expireTime) {
    this.expireTime = expireTime;
  }
  
  public Long getMaxEntries() {
    return maxEntries;
  }
  
  public void setMaxEntries(Long maxEntries) {
    this.maxEntries = maxEntries;
  }
  
  private CacheStrategy cacheStrategy;
  private Long maxEntries;
  private Long expireTime;
}
