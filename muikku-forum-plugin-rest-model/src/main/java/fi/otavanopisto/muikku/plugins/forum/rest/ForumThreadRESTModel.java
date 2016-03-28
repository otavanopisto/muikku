package fi.otavanopisto.muikku.plugins.forum.rest;

import java.util.Date;


public class ForumThreadRESTModel extends ForumMessageRESTModel {

  public ForumThreadRESTModel() {
  }
  
  public ForumThreadRESTModel(Long id, String title, String message, Long creator, Date created, Long forumAreaId, Boolean sticky, Boolean locked, Date updated, Long numReplies) {
    super(id, message, creator, created, forumAreaId);
    this.title = title;
    this.sticky = sticky;
    this.locked = locked;
    this.setUpdated(updated);
    this.setNumReplies(numReplies);
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Boolean getSticky() {
    return sticky;
  }

  public void setSticky(Boolean sticky) {
    this.sticky = sticky;
  }

  public Boolean getLocked() {
    return locked;
  }

  public void setLocked(Boolean locked) {
    this.locked = locked;
  }

  public Date getUpdated() {
    return updated;
  }

  public void setUpdated(Date updated) {
    this.updated = updated;
  }

  public Long getNumReplies() {
    return numReplies;
  }

  public void setNumReplies(Long numReplies) {
    this.numReplies = numReplies;
  }

  private String title;
  private Boolean sticky;
  private Boolean locked;
  private Date updated;
  private Long numReplies;
}
