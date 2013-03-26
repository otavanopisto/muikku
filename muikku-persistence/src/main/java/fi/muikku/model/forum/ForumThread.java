package fi.muikku.model.forum;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.model.util.ResourceEntity;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class ForumThread extends ForumMessage implements ResourceEntity {

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  private String title;
}
