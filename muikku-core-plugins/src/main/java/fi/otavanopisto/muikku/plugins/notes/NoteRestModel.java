package fi.otavanopisto.muikku.plugins.notes;

import java.util.Date;


import fi.otavanopisto.muikku.plugins.notes.model.NotePriority;
import fi.otavanopisto.muikku.plugins.notes.model.NoteStatus;
import fi.otavanopisto.muikku.plugins.notes.model.NoteType;

public class NoteRestModel {

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

  public Long getOwner() {
    return owner;
  }

  public void setOwner(Long owner) {
    this.owner = owner;
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

  public String getCreatorName() {
    return creatorName;
  }

  public void setCreatorName(String creatorName) {
    this.creatorName = creatorName;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Date getDueDate() {
    return dueDate;
  }

  public void setDueDate(Date dueDate) {
    this.dueDate = dueDate;
  }

  public NoteStatus getStatus() {
    return status;
  }

  public void setStatus(NoteStatus status) {
    this.status = status;
  }

  private Long id;
  private String title;
  private String description;
  private NoteType type;
  private NotePriority priority;
  private Boolean pinned;
  private Long owner;
  private Long creator;
  private String creatorName;
  private Date created;
  private Date dueDate;
  private NoteStatus status;
}