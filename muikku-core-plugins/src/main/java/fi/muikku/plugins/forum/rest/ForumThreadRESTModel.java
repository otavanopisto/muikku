package fi.muikku.plugins.forum.rest;

import java.util.Date;


public class ForumThreadRESTModel extends ForumMessageRESTModel {

  public ForumThreadRESTModel() {
  }
  
  public ForumThreadRESTModel(Long id, String title, String message, Long creator, Date created) {
    super(id, message, creator, created);
    this.title = title;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  private String title;
}
