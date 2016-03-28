package fi.otavanopisto.muikku.users;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.users.EnvironmentUserDAO;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.UserEntity;

public class EnvironmentUserController {
  
  @Inject
  private EnvironmentUserDAO environmentUserDAO;  

  public EnvironmentUser createEnvironmentUser(UserEntity userEntity, EnvironmentRoleEntity role) {
    return environmentUserDAO.create(userEntity, role);
  }
  
  public EnvironmentUser findEnvironmentUserByUserEntity(UserEntity userEntity) {
    return environmentUserDAO.findByUserEntity(userEntity);
  }

  public List<EnvironmentUser> listEnvironmentUsers() {
    return environmentUserDAO.listAll();
  }
  
  public EnvironmentUser updateEnvironmentUserRole(EnvironmentUser environmentUser, EnvironmentRoleEntity role) {
    return environmentUserDAO.updateRole(environmentUser, role);
  }

}
