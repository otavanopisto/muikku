package fi.otavanopisto.muikku.plugins.notes;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;


@Entity
public class Note {


  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }
  
  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public NoteType getType() {
    return type;
  }

  public void setType(NoteType type) {
    this.type = type;
  }

  public NotePriority getPriority() {
    return priority;
  }

  public void setPriority(NotePriority priority) {
    this.priority = priority;
  }

  public Boolean getPinned() {
    return pinned;
  }

  public void setPinned(Boolean pinned) {
    this.pinned = pinned;
  }

  public String getOwner() {
    return owner;
  }

  public void setOwner(String owner) {
    this.owner = owner;
  }

  public String getCreator() {
    return creator;
  }

  public void setCreator(String creator) {
    this.creator = creator;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public String getLastModifier() {
    return lastModifier;
  }

  public void setLastModifier(String lastModifier) {
    this.lastModifier = lastModifier;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
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
  
  @NotNull
  @Column
  private String title;
  
  @NotNull
  @Column
  private String description;
  
  @Enumerated (EnumType.STRING)
  @Column
  private NoteType type;
  
  @Enumerated (EnumType.STRING)
  @Column
  private NotePriority priority;
  
  @NotNull
  @Column
  private Boolean pinned;
  
  @NotNull
  @Column (nullable=false)
  private String owner;
  
  @NotNull
  @Column (nullable=false)
  private String creator;
  
  @NotNull
  @Column (nullable=false)
  private Date created;
  
  @Column
  private String lastModifier;
  
  @Column
  private Date lastModified;
  
  @NotNull
  @Column
  private Boolean archived;
}

  
