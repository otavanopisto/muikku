package fi.muikku.plugins.forum.wall;

import fi.muikku.plugins.forum.model.ForumMessage;
import fi.muikku.plugins.wall.WallFeedItem;

public class UserFeedForumMessageItem extends WallFeedItem {

  private ForumMessage forumMessage;

  public UserFeedForumMessageItem(ForumMessage message) {
    super(message.getCreated());
    this.forumMessage = message;
  }

  public ForumMessage getForumMessage() {
    return forumMessage;
  }

}
