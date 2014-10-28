package fi.muikku.plugins.user;

import java.io.FileNotFoundException;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.friends.FriendsController;
import fi.muikku.schooldata.entity.User;
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
  private FriendsController friendsController_TEMP;
	
	@RequestAction
	public void init() throws FileNotFoundException {
	}

	public User getUser() {
	  return userController.findUserByDataSourceAndIdentifier(getUserEntity().getDefaultSchoolDataSource(), getUserEntity().getDefaultIdentifier());
	}
	
	public UserEntity getUserEntity() {
	  return userEntityController.findUserEntityById(userId);
	}
	
	public void addFriend(String message) {
	  friendsController_TEMP.createFriendRequest(getUserEntity(), message);
	}
	
	public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }
}
