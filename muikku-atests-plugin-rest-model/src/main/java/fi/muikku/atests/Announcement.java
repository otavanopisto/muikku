package fi.muikku.atests;

import java.util.Date;

public class Announcement {

  public Announcement(Long id, Long userGroupId, Long publisherUserEntityId, String caption, String content, Date created, Date startDate, Date endDate, boolean archived,
    boolean publiclyVisible) {
    super();
    this.id = id;
    this.publisherUserEntityId = publisherUserEntityId;
    this.caption = caption;
    this.content = content;
    this.created = created;
    this.startDate = startDate;
    this.endDate = endDate;
    this.archived = archived;
    this.publiclyVisible = publiclyVisible;
  }
  
  public Long getId() {
    return id;
  }
  
  public Long getUserGroupId() {
    return userGroupId;
  }

  public void setUserGroupId(Long userGroupId) {
    this.userGroupId = userGroupId;
  }
  
  public Long getPublisherUserEntityId() {
    return publisherUserEntityId;
  }

  public void setPublisherUserEntityId(Long sender) {
    this.publisherUserEntityId = sender;
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

  public boolean isArchived() {
    return archived;
  }

  public void setArchived(boolean archived) {
    this.archived = archived;
  }
  
  public boolean isPubliclyVisible() {
    return publiclyVisible;
  }
  
  public void setPubliclyVisible(boolean publiclyVisible) {
    this.publiclyVisible = publiclyVisible;
  }

  private Long id;
  private Long userGroupId;
  private Long publisherUserEntityId;
  private String caption;
  private String content;
  private Date created;
  private Date startDate;
  private Date endDate;
  private boolean archived;
  private boolean publiclyVisible;
}