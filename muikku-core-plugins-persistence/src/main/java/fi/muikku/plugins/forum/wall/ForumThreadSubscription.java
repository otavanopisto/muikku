package fi.muikku.plugins.forum.wall;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.muikku.plugins.forum.model.ForumThread;

@Entity
public class ForumThreadSubscription {

  public ForumThread getForumThread() {
    return forumThread;
  }

  public void setForumThread(ForumThread forumThread) {
    this.forumThread = forumThread;
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
  private ForumThread forumThread;
}
