package fi.otavanopisto.muikku.plugins.workspace.model;

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
        @Index ( columnList = "workspaceEntityId, userEntityId, archived, created DESC" )
    }
)
public class WorkspaceJournalEntry {

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getHtml() {
    return html;
  }
  
  public void setHtml(String html) {
    this.html = html;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }
  
  public String getMaterialFieldReplyIdentifier() {
    return materialFieldReplyIdentifier;
  }
  
  public void setMaterialFieldReplyIdentifier(String materialFieldReplyIdentifier) {
    this.materialFieldReplyIdentifier = materialFieldReplyIdentifier;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }
   
  public Boolean getArchived() {
    return archived;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @Column
  private Long workspaceEntityId;
  
  @Column
  private Long userEntityId;
  
  @Column
  @Lob
  private String html;
  
  @Column
  private String title;
  
  @NotNull
  @Column (updatable=false, nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date created;
  
  @Column 
  private String materialFieldReplyIdentifier;

  @Column (nullable=false)
  private Boolean archived;
}
