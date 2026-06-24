package fi.otavanopisto.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table (
  indexes = {
    @Index (columnList = "owner, workspaceEntityId")
  }
)
public class WorkspaceNote {


  public Long getId() {
    return id;
  }
  
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }
  
  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public Long getOwner() {
    return owner;
  }

  public void setOwner(Long owner) {
    this.owner = owner;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }

  public void setWorkspaceMaterialId(Long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
  }

  public String getStart() {
    return start;
  }

  public void setStart(String start) {
    this.start = start;
  }

  public String getEnd() {
    return end;
  }

  public void setEnd(String end) {
    this.end = end;
  }

  public Long getIndex() {
    return index;
  }

  public void setIndex(Long index) {
    this.index = index;
  }

  public WorkspaceNoteType getType() {
    return type;
  }

  public void setType(WorkspaceNoteType type) {
    this.type = type;
  }

  public boolean getArchived() {
    return archived;
  }

  public void setArchived(boolean archived) {
    this.archived = archived;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column 
  private String title;
  
  @NotNull
  @Column (nullable = false)
  private Long workspaceEntityId;
  
  @Column
  private Long workspaceMaterialId;
  
  @Column(length=16)
  private String start;

  @Column(length=16)
  private String end;
  
  @Column(name = "noteIndex")
  private Long index;
  
  @NotNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private WorkspaceNoteType type;
  
  @Lob
  private String note;
  
  @NotNull
  @Column (nullable=false)
  private Long owner;
  
  @Column (nullable = false)
  private boolean archived;
}