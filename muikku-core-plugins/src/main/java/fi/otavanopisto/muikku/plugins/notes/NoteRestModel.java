package fi.otavanopisto.muikku.plugins.notes;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.plugins.notes.model.NotePriority;
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

  public Boolean getIsArchived() {
    return isArchived;
  }

  public void setIsArchived(Boolean isArchived) {
    this.isArchived = isArchived;
  }

  public List<NoteReceiverRestModel> getRecipients() {
    return recipients;
  }

  public void setRecipients(List<NoteReceiverRestModel> recipients) {
    this.recipients = recipients;
  }

  private Long id;
  private String title;
  private String description;
  private NoteType type;
  private NotePriority priority;
  private Long creator;
  private String creatorName;
  private Date created;
  private Date startDate;
  private Date dueDate;
  private Boolean isArchived;
  private List<NoteReceiverRestModel> recipients;

}