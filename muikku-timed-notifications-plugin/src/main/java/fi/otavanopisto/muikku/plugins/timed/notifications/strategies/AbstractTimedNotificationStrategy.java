package fi.otavanopisto.muikku.plugins.timed.notifications.strategies;

import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.Timeout;
import javax.ejb.Timer;
import javax.ejb.TimerConfig;
import javax.ejb.TimerService;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.UserStudyPeriodType;
import fi.otavanopisto.muikku.users.OrganizationEntityController;

public abstract class AbstractTimedNotificationStrategy implements TimedNotificationStrategy {
  
  @Resource
  private TimerService timerService;
  
  @Inject
  private OrganizationEntityController organizationEntityController;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @PostConstruct
  public void init(){
    startTimer(getDuration());
  }
  
  @Timeout
  public void handleTimeout(){
    if (isActive()) {
      schoolDataBridgeSessionController.startSystemSession();
      try {
        sendNotifications();
      } finally {
        schoolDataBridgeSessionController.endSystemSession();
      }
    }
    startTimer(getDuration());
  }
   
  @Override
  public boolean isActive(){
    return true;
  }
  
  private void startTimer(long duration) {
    if (this.timer != null) {
      this.timer.cancel();
      this.timer = null;
    }
    
    TimerConfig timerConfig = new TimerConfig();
    timerConfig.setPersistent(false);
    
    this.timer = timerService.createSingleActionTimer(duration, timerConfig);
  }
  
  protected List<OrganizationEntity> getActiveOrganizations() {
    List<OrganizationEntity> result = new ArrayList<>();
    
    String enabledOrganizations = pluginSettingsController.getPluginSetting("timed-notifications", "enabledOrganizations");
    
    if (StringUtils.isNotBlank(enabledOrganizations)) {
      String[] organizationIdentifiers = StringUtils.split(enabledOrganizations, ",");

      for (String organizationIdentifierStr : organizationIdentifiers) {
        if (StringUtils.isNotBlank(organizationIdentifierStr)) {
          SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(organizationIdentifierStr);
          
          if (identifier != null) {
            OrganizationEntity organizationEntity = organizationEntityController.findByDataSourceAndIdentifierAndArchived(
                identifier.getDataSource(), identifier.getIdentifier(), Boolean.FALSE);
            if (organizationEntity != null) {
              result.add(organizationEntity);
            }
          }
        }
      }
    }

    return result;
  }

  /**
   * Returns study start date for a given search result. If the result has study periods
   * of type TEMPORARILY SUSPENDED, the latest end date of such period is considered as 
   * the study start date. This is to avoid notifiers triggering on students that are on 
   * a temporary leave. 
   * 
   * @param studentSearchResult
   * @return
   */
  protected Date getStudyStartDateIncludingTemporaryLeaves(Map<String, Object> studentSearchResult) {
    Date studyStartDate = getDateResult(studentSearchResult.get("studyStartDate"));

    @SuppressWarnings("unchecked")
    List<Map<String, Object>> studyPeriods = (List<Map<String, Object>>) studentSearchResult.get("studyPeriods");
    
    LocalDate maxEndDate = null;
    
    if (CollectionUtils.isNotEmpty(studyPeriods)) {
      for (Map<String, Object> studyPeriod : studyPeriods) {
        UserStudyPeriodType studyPeriodType = EnumUtils.getEnum(UserStudyPeriodType.class, (String) studyPeriod.get("type"));
        
        if (studyPeriodType == UserStudyPeriodType.TEMPORARILY_SUSPENDED) {
          String periodEndStr = (String) studyPeriod.get("end");
          
          if (StringUtils.isNotBlank(periodEndStr)) {
            LocalDate periodEnd = LocalDate.parse(periodEndStr);
            if (periodEnd == null) {
              // If a period has no end date, it's considered as ongoing forever - thus
              // the startdate cannot be determined like this
              studyStartDate = null;
              maxEndDate = null;
              break;
            }
            else if (maxEndDate == null || (periodEnd != null && periodEnd.isAfter(periodEnd))) {
              maxEndDate = periodEnd;
            }
          }
        }
      }
    }
    
    // If there is a period end date, we consider that + 1 day as the study start date
    
    if (maxEndDate != null) {
      Date date = Date.from(maxEndDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
      
      return date.after(studyStartDate) ? date : studyStartDate;
    }
    
    return studyStartDate;
  }
  
  protected OffsetDateTime fromDateToOffsetDateTime(Date date) {
    if (date == null) {
      return null;
    }
    Instant instant = date.toInstant();
    ZoneId systemId = ZoneId.systemDefault();
    ZoneOffset offset = systemId.getRules().getOffset(instant);
    return date.toInstant().atOffset(offset);
  }

  protected Date getDateResult(Object value) {
    Date date = null;
    if (value instanceof Long) {
      date = new Date((Long) value);
    }
    else if (value instanceof Double) {
      // seconds to ms
      date = new Date(((Double) value).longValue() * 1000);
    }
    return date;
  }
  
  private Timer timer;
}
