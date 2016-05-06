package fi.otavanopisto.muikku.plugins.forum.rest;

import java.util.Date;


public class ForumMessageRESTModel {

  public ForumMessageRESTModel() {
    
  }
  
  public ForumMessageRESTModel(Long id, String message, Long creator, Date created, Long forumAreaId, Date lastModified) {
    this.id = id;
    this.message = message;
    this.creator = creator;
    this.created = created;
    this.lastModified = lastModified;
    this.setForumAreaId(forumAreaId);
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
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

  public Long getForumAreaId() {
    return forumAreaId;
  }

  public void setForumAreaId(Long forumAreaId) {
    this.forumAreaId = forumAreaId;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  private Long id;
  private String message;
  private Long creator;
  private Date created;
  private Long forumAreaId;
  private Date lastModified;

}
