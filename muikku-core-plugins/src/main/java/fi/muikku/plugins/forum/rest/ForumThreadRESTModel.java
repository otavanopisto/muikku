package fi.muikku.plugins.forum.rest;

import java.util.Date;


public class ForumThreadRESTModel extends ForumMessageRESTModel {

  public ForumThreadRESTModel() {
  }
  
  public ForumThreadRESTModel(Long id, String title, String message, Long creator, Date created, Long forumAreaId, Boolean sticky, Boolean locked) {
    super(id, message, creator, created, forumAreaId);
    this.title = title;
    this.sticky = sticky;
    this.locked = locked;
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

  private String title;
  private Boolean sticky;
  private Boolean locked;
}
