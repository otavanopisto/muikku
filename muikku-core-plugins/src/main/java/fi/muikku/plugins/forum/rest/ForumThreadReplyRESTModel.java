package fi.muikku.plugins.forum.rest;

import java.util.Date;



public class ForumThreadReplyRESTModel extends ForumMessageRESTModel {

  public ForumThreadReplyRESTModel() {
  }
  
  public ForumThreadReplyRESTModel(Long id, String message, Long creator, Date created) {
    super(id, message, creator, created);
  }

}
