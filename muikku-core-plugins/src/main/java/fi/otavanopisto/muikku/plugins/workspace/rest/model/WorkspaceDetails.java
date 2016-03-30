package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import org.joda.time.DateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.joda.ser.DateTimeSerializer;

public class WorkspaceDetails {

  public WorkspaceDetails() {
  }

  public WorkspaceDetails(DateTime beginDate, DateTime endDate, String externalViewUrl) {
    super();
    this.beginDate = beginDate;
    this.endDate = endDate;
    this.externalViewUrl = externalViewUrl;
  }

  public String getExternalViewUrl() {
    return externalViewUrl;
  }

  public void setExternalViewUrl(String externalViewUrl) {
    this.externalViewUrl = externalViewUrl;
  }
  
  public DateTime getBeginDate() {
    return beginDate;
  }
  
  public DateTime getEndDate() {
    return endDate;
  }

  private String externalViewUrl;
  
  @JsonSerialize(using=DateTimeSerializer.class)
  private DateTime beginDate;
  
  @JsonSerialize(using=DateTimeSerializer.class)
  private DateTime endDate;
}
