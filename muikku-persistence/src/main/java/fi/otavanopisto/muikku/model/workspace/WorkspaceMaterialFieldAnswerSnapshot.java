package fi.otavanopisto.muikku.model.workspace;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@Entity
@Table (
  indexes = {
    @Index ( columnList = "workspaceMaterialFieldId, userEntityId" )
  }
)
public class WorkspaceMaterialFieldAnswerSnapshot {

  public Long getId() {
    return id;
  }

  public Long getWorkspaceMaterialFieldId() {
    return workspaceMaterialFieldId;
  }

  public void setWorkspaceMaterialFieldId(Long workspaceMaterialFieldId) {
    this.workspaceMaterialFieldId = workspaceMaterialFieldId;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column (nullable = false)
  private Long workspaceMaterialFieldId;
  
  @NotNull
  @Column (nullable = false)
  private Long userEntityId;
  
  @NotNull
  @Column (nullable = false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date date;
  
  @Lob
  private String value;

}