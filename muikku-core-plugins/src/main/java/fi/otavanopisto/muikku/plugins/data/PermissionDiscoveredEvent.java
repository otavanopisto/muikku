package fi.otavanopisto.muikku.plugins.data;

import java.io.Serializable;

import fi.otavanopisto.muikku.model.security.Permission;

public class PermissionDiscoveredEvent implements Serializable {

  private static final long serialVersionUID = -585577596896435739L;

  public PermissionDiscoveredEvent(Permission permission) {
    this.permission = permission;
  }
  
  public Permission getPermission() {
    return permission;
  }

  private Permission permission;
}
