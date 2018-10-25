package fi.otavanopisto.muikku.plugins.activitylog.rest;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;

public class LogDataEntryRESTModel {

  public LogDataEntryRESTModel() {
    
  }
  
  public LogDataEntryRESTModel(ActivityLogType type, Date timestamp, Long contextId) {
    this.type = type;
    this.timestamp = timestamp;
    this.contextId = contextId;
  }
  
  public ActivityLogType getType() {
    return this.type;
  }
  
  public void setType(ActivityLogType type) {
    this.type = type;
  }
  
  public Date getTimestamp () {
    return this.timestamp;
  }
  
  public void setTimestamp(Date timestamp) {
    this.timestamp = timestamp;
  }
  
  public Long getcontextId () {
    return this.contextId;
  }
  
  public void setcontextId(Long contextId) {
    this.contextId = contextId;
  }
  
  private ActivityLogType type;
  private Date timestamp;
  private Long contextId;
}
