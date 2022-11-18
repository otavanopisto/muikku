package fi.otavanopisto.muikku.atests;

import java.util.Date;

public class DiscussionMessage {
  public Long getId() {
    return id;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public Discussion getDiscussion() {
    return discussion;
  }

  public void setDiscussion(Discussion discussion) {
    this.discussion = discussion;
  }


  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
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
  
  public Long getVersion() {
    return version;
  }

  public void setVersion(Long version) {
    this.version = version;
  }
  private Long id;
  private Discussion discussion;
  private String message;
  private Boolean archived = Boolean.FALSE;
  private Long creator;
  private Date created;
  private Long lastModifier;
  private Date lastModified;
  private Long version;
}
