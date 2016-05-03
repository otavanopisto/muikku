package fi.otavanopisto.muikku.plugins.forum.rest;

import java.util.Date;



public class ForumThreadReplyRESTModel extends ForumMessageRESTModel {

  public ForumThreadReplyRESTModel() {
  }
  
  public ForumThreadReplyRESTModel(Long id, String message, Long creator, Date created, Long forumAreaId, Long parentReplyId, Date lastModified) {
    super(id, message, creator, created, forumAreaId, lastModified);
    this.parentReplyId = parentReplyId;
  }

  public Long getParentReplyId() {
    return parentReplyId;
  }

  public void setParentReplyId(Long parentReplyId) {
    this.parentReplyId = parentReplyId;
  }

  private Long parentReplyId;
}
