package fi.otavanopisto.muikku.atests;

public class WorkspaceDiscussionThread {

  public WorkspaceDiscussionThread() {
  }

  public WorkspaceDiscussionThread(Long id, String title, String message, Boolean sticky, Boolean locked) {
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

  public Boolean getLocked() {
    return locked;
  }

  public void setLocked(Boolean locked) {
    this.locked = locked;
  }

  private Long id;
  private String title;
  private String message;
  private Boolean sticky;
  private Boolean locked;
}