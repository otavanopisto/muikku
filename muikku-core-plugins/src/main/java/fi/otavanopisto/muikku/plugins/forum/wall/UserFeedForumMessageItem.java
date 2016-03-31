package fi.otavanopisto.muikku.plugins.forum.wall;

import fi.otavanopisto.muikku.plugins.forum.model.ForumMessage;
import fi.otavanopisto.muikku.plugins.wall.WallFeedItem;

public class UserFeedForumMessageItem extends WallFeedItem {

  private ForumMessage forumMessage;

  public UserFeedForumMessageItem(ForumMessage message) {
    super(message.getCreated());
    this.forumMessage = message;
  }

  public ForumMessage getForumMessage() {
    return forumMessage;
  }
  
  @Override
  public String getType() {
    return "forumMessages";
  }
  
  @Override
  public String getIdentifier() {
    return getForumMessage().getId().toString();
  }
}
