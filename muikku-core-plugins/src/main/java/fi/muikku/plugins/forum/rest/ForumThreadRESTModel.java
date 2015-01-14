package fi.muikku.plugins.forum.rest;

import java.util.Date;


public class ForumThreadRESTModel extends ForumMessageRESTModel {

  public ForumThreadRESTModel() {
  }
  
  public ForumThreadRESTModel(Long id, String title, String message, Long creator, Date created, Boolean sticky) {
    super(id, message, creator, created);
    this.title = title;
    this.setSticky(sticky);
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

  private String title;
  private Boolean sticky;
}
