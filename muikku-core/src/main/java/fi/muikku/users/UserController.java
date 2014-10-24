package fi.muikku.users;

import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.UserSchoolDataController;
import fi.muikku.schooldata.entity.User;

public class UserController {
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  public User createUser(SchoolDataSource schoolDataSource, String firstName, String lastName) {
    return userSchoolDataController.createUser(schoolDataSource, firstName, lastName);
  }

  public User findUserByDataSourceAndIdentifier(String schoolDataSource, String userIdentifier) {
    return userSchoolDataController.findUser(schoolDataSource, userIdentifier);
  }

  public User findUserByUserEntity(UserEntity userEntity) {
    // TODO: Support merging from several sources

    List<User> users = userSchoolDataController.listUsersByEntity(userEntity);
    if (users.size() > 0) {
      return users.get(0);
    }

    return null;
  }

  public List<User> listUsers() {
    return userSchoolDataController.listUsers();
  }
  
}
