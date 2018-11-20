package fi.otavanopisto.muikku.plugins.forum.rest;

import java.util.Date;


public class ForumMessageRESTModel {

  public ForumMessageRESTModel() {
  }
  
  public ForumMessageRESTModel(Long id, String message, ForumMessageUserRESTModel creator, Date created, Long forumAreaId, Date lastModified) {
    this.id = id;
    this.message = message;
    this.creator = creator;
    this.created = created;
    this.lastModified = lastModified;
    this.forumAreaId = forumAreaId;
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

  public ForumMessageUserRESTModel getCreator() {
    return creator;
  }

  public void setCreator(ForumMessageUserRESTModel creator) {
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
  private ForumMessageUserRESTModel creator;
  private Date created;
  private Long forumAreaId;
  private Date lastModified;
}
