package fi.muikku.schooldata;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;

import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.schooldata.entity.User;

@RequestScoped
@Stateful
public class UserSchoolDataControllerDelegator
    extends SchoolDataController<UserSchoolDataController>
    implements UserSchoolDataController {

  // TODO: rights / model???
  
  @Override
  public User findUser(UserEntity userEntity) {
    if (userEntity == null)
      return null;
    
    UserSchoolDataController controller = getSchoolDataController(userEntity);
    return controller.findUser(userEntity);
  }

  @Override
  public User createUser(UserEntity userEntity, String firstName, String lastName, String email) {
    UserSchoolDataController controller = getSchoolDataController(userEntity);
    return controller.createUser(userEntity, firstName, lastName, email);
  }
  
}
