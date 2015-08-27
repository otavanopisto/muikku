package fi.muikku.plugins.profile;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;

import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.entity.User;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEmailEntityController;

@Named
@Stateful
@RequestScoped
@Join (path = "/profile", to = "/jsf/profile/profile.jsf")
public class ProfileBackingBean {
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  public UserEntity getLoggedUserEntity() {
    return sessionController.getLoggedUserEntity();
  }
  
  public User getLoggedUser() {
    return userController.findUserByDataSourceAndIdentifier(
        sessionController.getLoggedUserSchoolDataSource(), sessionController.getLoggedUserIdentifier());
  }
  
  public List<String> listUserEmails() {
    return userEmailEntityController.listAddressesByUserEntity(getLoggedUserEntity());
  }
}
