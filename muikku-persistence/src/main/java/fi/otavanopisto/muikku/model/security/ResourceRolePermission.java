package fi.otavanopisto.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class ResourceRolePermission extends RolePermission {

  // TODO: Unique all?

  public ResourceRights getResourcePermission() {
    return resourcePermission;
  }

  public void setResourcePermission(ResourceRights resourcePermission) {
    this.resourcePermission = resourcePermission;
  }

  @ManyToOne
  private ResourceRights resourcePermission;
}
