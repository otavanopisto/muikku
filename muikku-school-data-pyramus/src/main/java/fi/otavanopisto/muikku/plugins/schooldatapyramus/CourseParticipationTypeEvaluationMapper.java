package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.pyramus.rest.model.Grade;

@ApplicationScoped
public class CourseParticipationTypeEvaluationMapper {
  
  @Inject
  private Logger logger;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @PostConstruct
  public void init() {
    String participationTypeEvaluationMapSetting = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "participationTypeEvaluationMap");
    if (StringUtils.isNotBlank(participationTypeEvaluationMapSetting)) {
      ObjectMapper objectMapper = new ObjectMapper(); 
      try {
        config = objectMapper.readValue(participationTypeEvaluationMapSetting, ParticipationTypeMapConfig.class);
      } catch (IOException e) {
        logger.log(Level.SEVERE, "Invalid evaluation participation type map config", e);
      }
    }
  }
  
  public Long getParticipationTypeId(Grade grade) {
    if (config == null) {
      logger.log(Level.SEVERE, "Cannot resolve grade participantion type because config is null");
      return null;
    }
    
    Map<Long, Long> grades = config.getGrades();
    if (grades != null) {
      Long participationTypeId = grades.get(grade.getId());
      if (participationTypeId != null) {
        return participationTypeId;
      }
    }
    
    if (grade.getPassingGrade() == null) {
      logger.log(Level.SEVERE, "passingGrade property is null");
      return null;
    }
    
    Map<String, Long> defaults = config.getDefaults();
    if (defaults == null) {
      logger.log(Level.SEVERE, "Cannot resolve grade participantion type because specific grade mapping could not be found and defaults are not defined");
      return null;
    }
    
    if (grade.getPassingGrade()) {
      Long participationTypeId = defaults.get("passing");
      if (participationTypeId == null) {
        logger.log(Level.SEVERE, "Cannot resolve grade participantion type because specific grade mapping could not be found and defaults passing grade is null");
        return null;
      }
      
      return participationTypeId;
    } else {
      Long participationTypeId = defaults.get("nonPassing");
      if (participationTypeId == null) {
        logger.log(Level.SEVERE, "Cannot resolve grade participantion type because specific grade mapping could not be found and defaults nonPassing grade is null");
        return null;
      }
      
      return participationTypeId;
    }
  }
  
  private ParticipationTypeMapConfig config;
  
  public static class ParticipationTypeMapConfig {
  
    public ParticipationTypeMapConfig() {
    }
    
    public Map<Long, Long> getGrades() {
      return grades;
    }
    
    public void setGrades(Map<Long, Long> grades) {
      this.grades = grades;
    }
    
    public Map<String, Long> getDefaults() {
      return defaults;
    }
    
    public void setDefaults(Map<String, Long> defaults) {
      this.defaults = defaults;
    }
    
    private Map<Long, Long> grades;
    private Map<String, Long> defaults;
  }
  
}
