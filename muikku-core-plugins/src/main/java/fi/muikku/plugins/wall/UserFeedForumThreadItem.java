package fi.muikku.plugins.wall;

import java.util.Date;
import java.util.List;

import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.tranquil.TranquilEntity;

@TranquilEntity
public class UserFeedForumThreadItem extends UserFeedItem {

  private ForumThread thread;

  public UserFeedForumThreadItem(ForumThread thread, List<ForumThreadReply> replies) {
    super(UserFeedItemType.FORUMTHREAD);
    this.thread = thread;
  }

  public ForumThread getThread() {
    return thread;
  }
  
  @Override
  public Date getDate() {
    return thread.getCreated();
  }

}
