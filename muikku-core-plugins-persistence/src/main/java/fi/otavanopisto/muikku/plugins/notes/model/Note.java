package fi.otavanopisto.muikku.plugins.notes.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;


@Entity
public class Note {


  public Long getId() {
    return id;
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

  public Long getCreator() {
    return creator;
  }

  public void setCreator(Long creator) {
    this.creator = creator;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
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

  public boolean getArchived() {
    return archived;
  }

  public void setArchived(boolean archived) {
    this.archived = archived;
  }
  
  public Date getStartDate() {
    return startDate;
  }

  public void setStartDate(Date startDate) {
    this.startDate = startDate;
  }
  
  public Date getDueDate() {
    return dueDate;
  }

  public void setDueDate(Date dueDate) {
    this.dueDate = dueDate;
  }
  
  public boolean getMultiUserNote() {
    return multiUserNote;
  }

  public void setMultiUserNote(boolean multiUserNote) {
    this.multiUserNote = multiUserNote;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (nullable = false)
  private String title;
  
  @Lob
  private String description;
  
  @Enumerated (EnumType.STRING)
  @Column (nullable = false)
  private NoteType type;
  
  @Enumerated (EnumType.STRING)
  @Column (nullable = false)
  private NotePriority priority;
  
  @Column (nullable=false)
  private Long creator;
  
  @NotNull
  @Column (nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date created;
  
  @NotNull
  @Column (nullable=false)
  private Long lastModifier;
  
  @NotNull
  @Column (nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date lastModified;

  @Column (nullable = false)
  private boolean archived;
  
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date startDate;
  
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date dueDate;
  
  @Column (nullable = false)
  private boolean multiUserNote;
}

  
