package fi.otavanopisto.muikku.plugins.evaluation.model;

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
    @Index (columnList = "userEntityId, workspaceEntityId")
  }
)

public class EvaluationNote {

  public Long getId() {
    return id;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Long getCreator() {
    return creator;
  }

  public void setCreator(Long creator) {
    this.creator = creator;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Long getLastModifier() {
    return lastModifier;
  }

  public void setLastModifier(Long lastModifier) {
    this.lastModifier = lastModifier;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  public boolean isArchived() {
    return archived;
  }

  public void setArchived(boolean archived) {
    this.archived = archived;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column (nullable = false)
  private Long workspaceEntityId;
  
  @Lob
  private String note;
  
  @NotNull
  @Column(nullable = false)
  @Temporal(value=TemporalType.TIMESTAMP)
  private Date created;
  
  @NotNull
  @Column (nullable=false)
  private Long creator;
  
  @NotNull
  @Column (nullable=false)
  private Long userEntityId;
  
  @Column
  private Long lastModifier;
  
  @Column
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date lastModified;
  
  @Column (nullable = false)
  private boolean archived;
}