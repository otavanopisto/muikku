package fi.muikku.model.forum;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.model.base.Environment;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class EnvironmentForumArea extends ForumArea {

  public Environment getEnvironment() {
    return environment;
  }

  public void setEnvironment(Environment environment) {
    this.environment = environment;
  }

  @ManyToOne
  private Environment environment;
}
