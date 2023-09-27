package fi.otavanopisto.muikku.plugins.forum.rest;

import java.util.Date;


public class ForumThreadRESTModel extends ForumMessageRESTModel {

  public ForumThreadRESTModel() {
  }
  
  public ForumThreadRESTModel(Long id, String title, String message, ForumMessageUserRESTModel creator, Date created, Long forumAreaId, Boolean sticky, String lock, Long lockBy, Date lockDate, Date updated, Long numReplies, Date lastModified) {
    super(id, message, creator, created, forumAreaId, lastModified);
    this.title = title;
    this.sticky = sticky;
    this.lock = lock;
    this.lockBy = lockBy;
    this.lockDate = lockDate;
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

  public String getLock() {
    return lock;
  }

  public void setLock(String lock) {
    this.lock = lock;
  }

  public Date getLockDate() {
    return lockDate;
  }

  public void setLockDate(Date lockDate) {
    this.lockDate = lockDate;
  }

  public Long getLockBy() {
    return lockBy;
  }

  public void setLockBy(Long lockBy) {
    this.lockBy = lockBy;
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
  private String lock;
  private Date lockDate;
  private Long lockBy;
  private Date updated;
  private Long numReplies;
}
