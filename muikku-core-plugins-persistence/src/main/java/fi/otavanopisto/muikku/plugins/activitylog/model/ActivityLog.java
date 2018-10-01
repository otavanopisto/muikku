package fi.otavanopisto.muikku.plugins.activitylog.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@Entity
public class ActivityLog {
  
  public Long getId() {
    return id;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }
  
  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }
  
  public ActivityLogType getActivityLogType() {
    return type;
  }
  
  public void setActivityLogType(ActivityLogType type) {
    this.type = type;
  }
  
  public Date getTimestamp() {
    return timestamp;
  }
  
  public void setTimestamp(Date timestamp) {
    this.timestamp = timestamp;
  }
  
  public Long getWorkspaceId() {
    return workspaceId;
  }
  
  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
  }
  
  public Long getContextId() {
    return contextId;
  }
  
  public void setContextId(Long contextId) {
    this.contextId = contextId;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column (nullable = false)
  private Long userEntityId;
  
  @NotNull
  @Convert(converter = ActivityLogTypeConverter.class)
  private ActivityLogType type;
  
  @NotNull
  @Column (nullable = false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date timestamp;
  
  @Column
  private Long workspaceId;
  
  @Column
  private Long contextId;
}