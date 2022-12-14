package fi.otavanopisto.muikku.plugins.workspace.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

@Entity
public class WorkspaceEntityFile {

  public Long getId() {
    return id;
  }
  
  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  public Long getWorkspaceEntity() {
    return workspaceEntity;
  }

  public void setWorkspaceEntity(Long workspaceEntity) {
    this.workspaceEntity = workspaceEntity;
  }

  public String getFileIdentifier() {
    return fileIdentifier;
  }

  public void setFileIdentifier(String fileIdentifier) {
    this.fileIdentifier = fileIdentifier;
  }

  public String getDiskName() {
    return diskName;
  }

  public void setDiskName(String diskName) {
    this.diskName = diskName;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column (name = "workspaceEntity_id", nullable = false)
  private Long workspaceEntity;
  
  @NotNull
  @Column (nullable=false)
  @NotEmpty
  private String fileIdentifier;

  @NotNull
  @Column (nullable=false)
  @NotEmpty
  private String diskName;

  @NotNull
  @Column (nullable=false)
  @NotEmpty
  private String contentType;
  
  @NotNull
  @Column (nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date lastModified;

}