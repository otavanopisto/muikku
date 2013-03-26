package fi.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.model.base.Environment;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class EnvironmentUserRolePermission extends UserRolePermission {

  // TODO: Unique all?
  
  public Environment getEnvironment() {
    return environment;
  }

  public void setEnvironment(Environment environment) {
    this.environment = environment;
  }

  @ManyToOne
  private Environment environment;
}
