package fi.muikku.plugins.forum.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class EnvironmentForumArea extends ForumArea {

  public Long getEnvironment() {
    return environment;
  }

  public void setEnvironment(Long environment) {
    this.environment = environment;
  }

  @Column (name = "environment_id")
  private Long environment;
}
