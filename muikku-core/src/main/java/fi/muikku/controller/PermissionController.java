package fi.muikku.controller;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.model.security.Permission;

@Dependent
@Stateful
public class PermissionController {

  @Inject
  private PermissionDAO permissionDAO;

  public Permission findByName(String name) {
    return permissionDAO.findByName(name);
  }
  
}
