package fi.muikku.plugins.schooldatapyramus.rest.cache;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.muikku.plugins.schooldatapyramus.webhook.WebhookNotificationEvent;

@ApplicationScoped
@Singleton
public class EntityCacheEvictor {
  
  @Inject
  private Logger logger;
  
  @Inject
  private CacheSettingsController cacheSettingsController;

  @PostConstruct
  public void init() {
    caches = new ArrayList<>();
  }
  
  public void addCache(AbstractEntityCache cache) {
    caches.add(cache);
  }
  
  public void removeCache(AbstractEntityCache cache) {
    caches.remove(cache);
  }
  
  public void onWebhookNotificationEvent(@Observes WebhookNotificationEvent event) {
    List<String> evictTypePaths = cacheSettingsController.getEvictTypePaths(event.getType());
    
    Map<String, String> data = null;
    try {
      data = new ObjectMapper().readValue(event.getData(), new TypeReference<Map<String, String>>() { });
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Could not parse webhook notification data", e);
      return;
    }

    for (AbstractEntityCache cache : caches) {
      try {
        Pattern pattern = Pattern.compile("\\{[a-zA-Z]*\\}");
        
        for (String evictTypePath : evictTypePaths) {
          String path = evictTypePath;
          
          Matcher matcher = pattern.matcher(path);
          while (matcher.find()) {
            String variable = StringUtils.substring(matcher.group(0), 1, -1);
            String value = data.get(variable);
            if (value != null) {
              path = matcher.replaceFirst(value);
            }
          }
          
          cache.remove(path);
        }
      } catch (Exception e) {
        logger.log(Level.SEVERE, "Failed to evict caches", e);
        return;
      }
    }
  }
  
  private List<AbstractEntityCache> caches;
}
