package fi.muikku.plugins.forum.rest;

import java.util.Date;


public class ForumMessageRESTModel {

  public ForumMessageRESTModel() {
    
  }
  
  public ForumMessageRESTModel(Long id, String message, Long creator, Date created) {
    this.id = id;
    this.message = message;
    this.creator = creator;
    this.created = created;
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

  private Long id;
  private String message;
  private Long creator;
  private Date created;

}
