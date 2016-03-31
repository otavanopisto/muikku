package fi.otavanopisto.muikku.plugins.forum.wall;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;

@Entity
public class ForumAreaSubscription {

  public ForumArea getForumArea() {
    return forumArea;
  }

  public void setForumArea(ForumArea forumArea) {
    this.forumArea = forumArea;
  }

  public Long getId() {
    return id;
  }

  public Long getUser() {
    return user;
  }

  public void setUser(Long user) {
    this.user = user;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @Column (name = "user_id")
  private Long user;

  @ManyToOne
  private ForumArea forumArea;
}
