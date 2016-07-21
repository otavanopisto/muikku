package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import org.threeten.bp.ZonedDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.threetenbp.ser.ZonedDateTimeSerializer;

public class WorkspaceDetails {

  public WorkspaceDetails() {
  }

  public WorkspaceDetails(String typeId, ZonedDateTime beginDate, ZonedDateTime endDate, String externalViewUrl) {
    super();
    this.typeId = typeId;
    this.beginDate = beginDate;
    this.endDate = endDate;
    this.externalViewUrl = externalViewUrl;
  }

  public String getTypeId() {
    return typeId;
  }
  
  public void setTypeId(String typeId) {
    this.typeId = typeId;
  }
  
  public String getExternalViewUrl() {
    return externalViewUrl;
  }

  public void setExternalViewUrl(String externalViewUrl) {
    this.externalViewUrl = externalViewUrl;
  }
  
  public ZonedDateTime getBeginDate() {
    return beginDate;
  }
  
  public ZonedDateTime getEndDate() {
    return endDate;
  }

  private String typeId;
  
  private String externalViewUrl;
  
  @JsonSerialize(using=ZonedDateTimeSerializer.class)
  private ZonedDateTime beginDate;
  
  @JsonSerialize(using=ZonedDateTimeSerializer.class)
  private ZonedDateTime endDate;
}
