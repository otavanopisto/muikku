package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.threetenbp.ser.OffsetDateTimeSerializer;

public class WorkspaceDetails {

  public WorkspaceDetails() {
  }

  public WorkspaceDetails(String typeId, OffsetDateTime beginDate, OffsetDateTime endDate, String externalViewUrl) {
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
  
  public OffsetDateTime getBeginDate() {
    return beginDate;
  }
  
  public OffsetDateTime getEndDate() {
    return endDate;
  }

  private String typeId;
  
  private String externalViewUrl;
  
  @JsonSerialize(using=OffsetDateTimeSerializer.class)
  private OffsetDateTime beginDate;
  
  @JsonSerialize(using=OffsetDateTimeSerializer.class)
  private OffsetDateTime endDate;
}
