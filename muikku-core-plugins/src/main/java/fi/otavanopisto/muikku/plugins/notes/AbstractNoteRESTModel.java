package fi.otavanopisto.muikku.plugins.notes;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public abstract class AbstractNoteRESTModel {

  public AbstractNoteRESTModel() {
  }
  
  public AbstractNoteRESTModel(Long id, String title, String description, NotePriority priority, Boolean pinned, String owner, String creator) {
    super();
    this.id = id;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.pinned = pinned;
    this.owner = owner;
    this.creator = creator;

  }

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

  private Long id;
  private String title;
  private String description;
  private NotePriority priority;
  private Boolean pinned;
  private String owner;
  private String creator;
}