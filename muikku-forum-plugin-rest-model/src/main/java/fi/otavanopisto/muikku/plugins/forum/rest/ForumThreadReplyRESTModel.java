package fi.otavanopisto.muikku.plugins.forum.rest;

import java.util.Date;



public class ForumThreadReplyRESTModel extends ForumMessageRESTModel {

  public ForumThreadReplyRESTModel() {
  }
  
  public ForumThreadReplyRESTModel(Long id, String message, Long creator, Date created, Long forumAreaId) {
    super(id, message, creator, created, forumAreaId);
  }

}
