package fi.otavanopisto.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.otavanopisto.muikku.model.users.EnvironmentUser;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class EnvironmentUserPermissionOverride extends PermissionOverride {

  // TODO: Unique all?
  
  public EnvironmentUser getEnvironmentUser() {
    return environmentUser;
  }

  public void setEnvironmentUser(EnvironmentUser environmentUser) {
    this.environmentUser = environmentUser;
  }

  @ManyToOne
  private EnvironmentUser environmentUser;
}
