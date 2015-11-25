package fi.muikku.plugins.profile;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserAddress;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEmailEntityController;
import fi.otavanopisto.security.LoggedIn;

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
  
  @RequestAction
  @LoggedIn
  public String init() {
    UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();
    User user = userController.findUserByDataSourceAndIdentifier(sessionController.getLoggedUserSchoolDataSource(), sessionController.getLoggedUserIdentifier());
    List<UserAddress> userAddresses = userController.listUserAddresses(user);
    
    displayName = user.getDisplayName();
    
    addresses = new ArrayList<>();
    for (UserAddress userAddress : userAddresses) {
      addresses.add(String.format("%s %s %s %s", userAddress.getStreet(), userAddress.getPostalCode(), userAddress.getCity(), userAddress.getCountry()));
    }

    // TODO: Shouldn't these emails come from school data bridge?
    emails = userEmailEntityController.listAddressesByUserEntity(loggedUserEntity);
    
    return null;
  }
  
  public String getDisplayName() {
    return displayName;
  }

  public List<String> getAddresses() {
    return addresses;
  }
  
  public List<String> getEmails() {
    return emails;
  }
  
  private String displayName;
  private List<String> emails;
  private List<String> addresses;
}
