package fi.otavanopisto.muikku.plugins.schooldatalocal.dao;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUser;

public class LocalUserDAO extends CorePluginsDAO<LocalUser> {

  private static final long serialVersionUID = 3392878990947754605L;

  public LocalUser create(String firstName, String lastName, Long roleId, Boolean archived) {
    LocalUser localUser = new LocalUser();
    localUser.setFirstName(firstName);
    localUser.setLastName(lastName);
    localUser.setRoleId(roleId);
    localUser.setArchived(archived);

    return persist(localUser);
  }

  public LocalUser updateFirstName(LocalUser localUser, String firstName) {
    localUser.setFirstName(firstName);
    return persist(localUser);
  }

  public LocalUser updateLastName(LocalUser localUser, String lastName) {
    localUser.setLastName(lastName);
    return persist(localUser);
  }

  public LocalUser updateRoleId(LocalUser localUser, Long roleId) {
    localUser.setRoleId(roleId);
    return persist(localUser);
  }

  public LocalUser archive(LocalUser localUser) {
    localUser.setArchived(Boolean.TRUE);
    return persist(localUser);
  }
}
