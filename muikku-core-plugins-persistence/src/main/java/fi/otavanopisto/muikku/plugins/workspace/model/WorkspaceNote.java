package fi.otavanopisto.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.validation.constraints.NotNull;

@Entity
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
  
  public Long getWorkspace() {
    return workspace;
  }

  public void setWorkspace(Long workspace) {
    this.workspace = workspace;
  }

  public Long getOwner() {
    return owner;
  }

  public void setOwner(Long owner) {
    this.owner = owner;
  }
  
  public Integer getOrderNumber() {
    return orderNumber;
  }

  public void setOrderNumber(Integer orderNumber) {
    this.orderNumber = orderNumber;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column 
  private String title;
  
  @NotNull
  @Column (nullable = false)
  private Long workspace;
  
  @Lob
  private String note;
  
  @NotNull
  @Column (nullable=false)
  private Long owner;
  
  @NotNull
  @Column (nullable=false)
  private Integer orderNumber;
  
  @Column (nullable = false)
  private Boolean archived = Boolean.FALSE;
}

  
