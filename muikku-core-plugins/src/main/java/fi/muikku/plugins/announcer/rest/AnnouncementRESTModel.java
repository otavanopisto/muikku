package fi.muikku.plugins.announcer.rest;

import java.util.Date;

public class AnnouncementRESTModel {
  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public Long getPublisherUserEntityId() {
    return publisherUserEntityId;
  }
  public void setPublisherUserEntityId(Long publisherUserEntityId) {
    this.publisherUserEntityId = publisherUserEntityId;
  }
  public String getCaption() {
    return caption;
  }
  public void setCaption(String caption) {
    this.caption = caption;
  }
  public String getContent() {
    return content;
  }
  public void setContent(String content) {
    this.content = content;
  }
  public Date getCreated() {
    return created;
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
  public Date getEndDate() {
    return endDate;
  }
  public void setEndDate(Date endDate) {
    this.endDate = endDate;
  }
  public Boolean isArchived() {
    return archived;
  }
  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  private Long id;
  private Long publisherUserEntityId;
  private String caption;
  private String content;
  private Date created;
  private Date startDate;
  private Date endDate;
  private Boolean archived;
}
