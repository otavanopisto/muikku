package fi.muikku.plugins.wall.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.plugins.forum.model.ForumArea;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class ForumAreaSubscription extends WallSubscription {

  @Override
  public WallSubscriptionType getType() {
    return WallSubscriptionType.FORUM;
  }
  
  public ForumArea getForumArea() {
    return forumArea;
  }

  public void setForumArea(ForumArea forumArea) {
    this.forumArea = forumArea;
  }

  @ManyToOne
  private ForumArea forumArea;
}
