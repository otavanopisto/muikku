package fi.otavanopisto.muikku.plugins.notes;

import java.util.Date;

import org.apache.james.mime4j.field.datetime.DateTime;

public class NoteRestModel extends AbstractNoteRESTModel{
  
  public NoteRestModel() {
    
  }

  public NoteRestModel(Long id, String title, String description, NoteType type, NotePriority priority, Boolean pinned, String owner, String creator, Date created, String lastModifier, Date lastModified, Boolean archived) {
    super(id, title, description, priority, pinned, owner, creator);
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

  private Long id;
  private String title;
  private String description;
  private NoteType type;
  private NotePriority priority;
  private Boolean pinned;
  private String owner;
  private String creator;
  private Date created;
  private String lastModifier;
  private Date lastModified;
  private Boolean archived;
}

  
