package fi.muikku.plugins.user;

import java.io.FileNotFoundException;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.friends.FriendsController;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.entity.User;

@Named
@Stateful
@RequestScoped
@URLMappings(mappings = {
  @URLMapping(
    id = "user-index", 
    pattern = "/user/#{userIndexBackingBean.userId}", 
    viewId = "/user/user.jsf"
  )    
})
public class UserIndexBackingBean {

	@Inject
	private UserController userController;

  @Inject
  private FriendsController friendsController_TEMP;
	
	@URLAction
	public void init() throws FileNotFoundException {
	}

	public User getUser() {
	  return userController.findUser(getUserEntity());
	}
	
	public UserEntity getUserEntity() {
	  return userController.findUserEntityById(userId);
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

  private Long userId;
}
