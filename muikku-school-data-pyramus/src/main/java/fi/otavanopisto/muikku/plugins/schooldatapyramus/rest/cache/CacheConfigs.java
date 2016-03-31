package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.cache;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.pyramus.webhooks.WebhookType;

@ApplicationScoped
public class CacheConfigs {
  
  @Inject
  private Logger logger;

  @PostConstruct
  public void init() {
    InputStream settingStream = getClass()
      .getClassLoader()
      .getResourceAsStream("pyramus-rest-cache-config.json");
    
    try {
      config = new ObjectMapper().readValue(settingStream, PyramusCacheConfig.class);
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Failed to parse Pyramus cache settings file", e);
    }
    
    if (settingStream == null) {    
      logger.severe("Could not read Pyramus cache settings file"); 
      config = new PyramusCacheConfig();
      config.setDefaultSettings(new CacheConfig(new ArrayList<String>(), CacheStrategy.NONE, 0l));
      config.setSettings(new HashMap<String, CacheConfig>());
    }
  }
  
  public List<String> getEvictTypePaths(WebhookType type) {
    List<String> result = new ArrayList<>();
    
    for (String key : config.getSettings().keySet()) {
      CacheConfig setting = config.getSettings().get(key);
      if ((setting.getEvictOn() != null) && setting.getEvictOn().contains(type)) {
        result.add(key);
      }
    }
    
    return result;
  }
  
  public CacheConfig getCacheConfig(String requestPath) {
    if (StringUtils.isNotBlank(requestPath)) {
      for (String settingKey : config.getSettings().keySet()) {
        String path = settingKey.replaceAll("\\{[a-zA-Z]*\\}", "([a-zA-Z0-9]*)");
        
        if (requestPath.matches(path)) {
          logger.fine(String.format("Using cache settings %s for path %s", settingKey, path));
          return config.getSettings().get(settingKey);
        }
      }
    }
    
    return config.getDefaultSettings();
  }
  
  private PyramusCacheConfig config;

  public static class PyramusCacheConfig {
   
    public CacheConfig getDefaultSettings() {
      return defaultSettings;
    }
    
    public void setDefaultSettings(CacheConfig defaultSettings) {
      this.defaultSettings = defaultSettings;
    }
    
    public Map<String, CacheConfig> getSettings() {
      return settings;
    }
    
    public void setSettings(Map<String, CacheConfig> settings) {
      this.settings = settings;
    }
    
    @JsonProperty ("default")
    private CacheConfig defaultSettings;
    
    private Map<String, CacheConfig> settings;
  }
  
}
