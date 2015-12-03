package fi.muikku.plugins.schooldatapyramus;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.muikku.controller.PluginSettingsController;

@ApplicationScoped
public class PyramusStudentActivityMapper {

  @Inject
  private Logger logger;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @PostConstruct
  public void init() {
    try {
      String archiveChanges = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "participationTypeChange.archive");    
      if (StringUtils.isNotBlank(archiveChanges)) {
        toInactive = new ObjectMapper().readValue(archiveChanges, new TypeReference<Map<String, Long>>() {});
      }
      String unarchiveChanges = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "participationTypeChange.unarchive");    
      if (StringUtils.isNotBlank(unarchiveChanges)) {
        toActive = new ObjectMapper().readValue(unarchiveChanges, new TypeReference<Map<String, Long>>() {});
      }
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Invalid settings", e);
    }
    if (toInactive == null) {
      toInactive = new HashMap<String, Long>();
    }
    if (toActive == null) {
      toActive = new HashMap<String, Long>();
    }
  }
    
  public Long toInactive(Long participationTypeId) {
    return toInactive.get(String.valueOf(participationTypeId));
  }

  public Long toActive(Long participationTypeId) {
    return toActive.get(String.valueOf(participationTypeId));
  }
  
  public boolean isActive(Long participationTypeId) {
    return toInactive.containsKey(String.valueOf(participationTypeId));
  }
  
  public Set<String> getActive() {
    return toInactive.keySet();
  }

  public Set<String> getInactive() {
    return toActive.keySet();
  }

  public String getActiveCDT() {
    return StringUtils.join(getActive(), ',');
  }

  public String getInactiveCDT() {
    return StringUtils.join(getInactive(), ',');
  }
  
  private Map<String, Long> toInactive;
  private Map<String,Long> toActive;
}
