package fi.otavanopisto.muikku.atests;

import java.util.Date;
import java.util.List;

public class Announcement {
  
  public Announcement() {
  }
  
  public Announcement(Long id, Long publisherUserEntityId, List<Long> userGroupIds, String caption, String content, Date created, Date startDate, Date endDate, Boolean archived, Boolean publiclyVisible) {
    super();
    this.id = id;
    this.publisherUserEntityId = publisherUserEntityId;
    this.userGroupEntityIds = userGroupIds;
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

  public List<Long> getUserGroupEntityIds() {
    return userGroupEntityIds;
  }

  public void setUserGroupEntityIds(List<Long> userGroupEntityIds) {
    this.userGroupEntityIds = userGroupEntityIds;
  }

  public Boolean getPubliclyVisible() {
    return publiclyVisible;
  }

  public void setPubliclyVisible(Boolean publiclyVisible) {
    this.publiclyVisible = publiclyVisible;
  }
  
  private Long id;
  private Long publisherUserEntityId;
  private String caption;
  private String content;
  private Date created;
  private Date startDate;
  private Date endDate;
  private Boolean archived;
  private List<Long> userGroupEntityIds;
  private Boolean publiclyVisible;

}
