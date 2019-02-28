package fi.otavanopisto.muikku.plugins.workspace.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@Entity
public class WorkspaceJournalComment {

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

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }
   
  public Boolean getArchived() {
    return archived;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public Long getCreator() {
    return creator;
  }

  public void setCreator(Long creator) {
    this.creator = creator;
  }

  public WorkspaceJournalComment getParent() {
    return parent;
  }

  public void setParent(WorkspaceJournalComment parent) {
    this.parent = parent;
  }

  public WorkspaceJournalEntry getJournalEntry() {
    return journalEntry;
  }

  public void setJournalEntry(WorkspaceJournalEntry journalEntry) {
    this.journalEntry = journalEntry;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private WorkspaceJournalEntry journalEntry;
  
  @ManyToOne
  private WorkspaceJournalComment parent;
  
  @Column (name = "creator_id")
  private Long creator;
  
  @Lob
  private String comment;
  
  @NotNull
  @Column (nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date created;

  @Column (nullable=false)
  private Boolean archived;

}
