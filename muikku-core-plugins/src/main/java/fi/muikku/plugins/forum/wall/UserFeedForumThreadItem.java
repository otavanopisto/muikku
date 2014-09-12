package fi.muikku.plugins.forum.wall;

import java.util.List;

import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.muikku.plugins.wall.WallFeedItem;

public class UserFeedForumThreadItem extends WallFeedItem {

  private ForumThread thread;

  public UserFeedForumThreadItem(ForumThread thread, List<ForumThreadReply> replies) {
    super(thread.getCreated());
    this.thread = thread;
  }

  public ForumThread getThread() {
    return thread;
  }
  
  @Override
  public String getType() {
    return "forumThreads";
  }
  
  @Override
  public String getIdentifier() {
    return getThread().getId().toString();
  }

}
