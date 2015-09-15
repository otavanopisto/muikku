package fi.muikku.plugins.workspace.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@Entity
public class WorkspaceMaterialReply  {

  public Long getId() {
    return id;
  }
  
  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }
  
  public WorkspaceMaterial getWorkspaceMaterial() {
    return workspaceMaterial;
  }
  
  public void setWorkspaceMaterial(WorkspaceMaterial workspaceMaterial) {
    this.workspaceMaterial = workspaceMaterial;
  }

  public Long getNumberOfTries() {
    return numberOfTries;
  }

  public void setNumberOfTries(Long numberOfTries) {
    this.numberOfTries = numberOfTries;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }
  
  public Date getSubmitted() {
    return submitted;
  }
  
  public void setSubmitted(Date submitted) {
    this.submitted = submitted;
  }
  
  public Date getWithdrawn() {
    return withdrawn;
  }
  
  public void setWithdrawn(Date withdrawn) {
    this.withdrawn = withdrawn;
  }
  
  public WorkspaceMaterialReplyState getState() {
    return state;
  }
  
  public void setState(WorkspaceMaterialReplyState state) {
    this.state = state;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceMaterial workspaceMaterial;

  @NotNull
  @Column (nullable = false)
  private Long userEntityId;

  @NotNull
  @Column (nullable = false)
  private Long numberOfTries;
  
  @NotNull
  @Column (nullable = false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date created;
  
  @NotNull
  @Column (nullable = false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date lastModified;

  @Temporal (value=TemporalType.TIMESTAMP)
  private Date submitted;
  
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date withdrawn;
  
  @NotNull
  @Column (nullable = false)
  @Enumerated (EnumType.STRING)
  private WorkspaceMaterialReplyState state;
  
}
