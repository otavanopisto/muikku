package fi.otavanopisto.muikku.atests;

public class DiscussionThread {

  public DiscussionThread() {
  }

  public DiscussionThread(Long id, String title, String message, Boolean sticky, LockForumThread locked) {
    this.id = id;
    this.title = title;
    this.message = message;
    this.sticky = sticky;
    this.locked = locked;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }
  
  public String getMessage() {
    return message;
  }
  
  public void setMessage(String message) {
    this.message = message;
  }

  public Boolean getSticky() {
    return sticky;
  }

  public void setSticky(Boolean sticky) {
    this.sticky = sticky;
  }

  public LockForumThread getLocked() {
    return locked;
  }

  public void setLocked(LockForumThread locked) {
    this.locked = locked;
  }

  private Long id;
  private String title;
  private String message;
  private Boolean sticky;
  private LockForumThread locked;
}