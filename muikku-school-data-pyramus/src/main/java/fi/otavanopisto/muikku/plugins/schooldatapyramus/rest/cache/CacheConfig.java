package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.cache;

import java.util.List;

import fi.pyramus.webhooks.WebhookType;

public class CacheConfig {

  public CacheConfig() {
  }
  
  public CacheConfig(List<String> enabledCaches, CacheStrategy evictStrategy, Long expireTime) {
    this.enabledCaches = enabledCaches;
    this.cacheStrategy = evictStrategy;
    this.expireTime = expireTime;
  }
  
  public List<String> getEnabledCaches() {
    return enabledCaches;
  }
  
  public void setEnabledCaches(List<String> enabledCaches) {
    this.enabledCaches = enabledCaches;
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
  
  public List<WebhookType> getEvictOn() {
    return evictOn;
  }
  
  public void setEvictOn(List<WebhookType> evictOn) {
    this.evictOn = evictOn;
  }
  
  private List<String> enabledCaches;
  private CacheStrategy cacheStrategy;
  private Long expireTime;
  private List<WebhookType> evictOn;
}
