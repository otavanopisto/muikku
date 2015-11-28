package fi.muikku.plugins.schooldatapyramus.rest.cache;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
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
public class CacheSettingsController {
  
  @Inject
  private Logger logger;

  @PostConstruct
  public void init() {
    InputStream settingStream = getClass()
      .getClassLoader()
      .getResourceAsStream("pyramus-rest-cache-settings.json");
    
    try {
      settings = new ObjectMapper().readValue(settingStream, PyramusCacheSettings.class);
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Failed to parse Pyramus cache settings file", e);
    }
    
    if (settingStream == null) {    
      logger.severe("Could not read Pyramus cache settings file"); 
      settings = new PyramusCacheSettings();
      settings.setDefaultSettings(new CacheSetting(new ArrayList<String>(), CacheStrategy.NONE, 0l, 0l));
    }
  }
  
  public List<String> getEvictTypePaths(WebhookType type) {
    List<String> result = new ArrayList<>();
    
    for (String key : settings.getSettings().keySet()) {
      CacheSetting setting = settings.getSettings().get(key);
      if ((setting.getEvictOn() != null) && setting.getEvictOn().contains(type)) {
        result.add(key);
      }
    }
    
    return result;
  }
  
  public CacheSetting getCacheSettings(String requestPath) {
    if (StringUtils.isNotBlank(requestPath)) {
      for (String settingKey : settings.getSettings().keySet()) {
        String path = settingKey.replaceAll("\\{[a-zA-Z]*\\}", "([a-zA-Z0-9]*)");
        
        if (requestPath.matches(path)) {
          logger.info(String.format("Using cache settings %s for path %s", settingKey, path));
          return settings.getSettings().get(settingKey);
        }
      }
    }
    
    logger.info(String.format("Using default cache settings for path %s", requestPath));
    
    return settings.getDefaultSettings();
  }
  
  private PyramusCacheSettings settings;

  public static class PyramusCacheSettings {
   
    public CacheSetting getDefaultSettings() {
      return defaultSettings;
    }
    
    public void setDefaultSettings(CacheSetting defaultSettings) {
      this.defaultSettings = defaultSettings;
    }
    
    public Map<String, CacheSetting> getSettings() {
      return settings;
    }
    
    public void setSettings(Map<String, CacheSetting> settings) {
      this.settings = settings;
    }
    
    @JsonProperty ("default")
    private CacheSetting defaultSettings;
    
    private Map<String, CacheSetting> settings;
  }
  
}
