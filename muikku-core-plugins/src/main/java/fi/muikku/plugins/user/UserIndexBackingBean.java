package fi.muikku.plugins.user;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;

@Named
@Stateful
@RequestScoped
@Join ( path = "/user/{userId}", to = "/user/user.jsf")
public class UserIndexBackingBean {

  @Parameter
  private Long userId;

  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;
	
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @Inject
  private SessionController sessionController;

	@RequestAction
	public String init() {
	  if (!sessionController.isLoggedIn())
	    return NavigationRules.NOT_FOUND;
	  
    UserEntity userEntity = userEntityController.findUserEntityById(getUserId());
    if (userEntity == null) {
      return NavigationRules.NOT_FOUND;
    }
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      User user = userController.findUserByDataSourceAndIdentifier(userEntity.getDefaultSchoolDataSource(), userEntity.getDefaultIdentifier());
      if (user == null) {
        return NavigationRules.NOT_FOUND;
      }
      firstName = user.getFirstName();
      lastName = user.getLastName();
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
    
	  return null;
	}
  
  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }
  
  public String getFirstName() {
    return firstName;
  }
  
  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }
  
  public String getLastName() {
    return lastName;
  }
  
  public void setLastName(String lastName) {
    this.lastName = lastName;
  }
  
  private String firstName;
  private String lastName;
}
