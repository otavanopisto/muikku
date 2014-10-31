package fi.muikku.plugins.friends;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.model.users.UserEntity;
import fi.muikku.security.LoggedIn;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserEntityController;

@Dependent
@Stateful
@Named("Friends")
public class FriendsController {

  @Inject
  private SessionController sessionController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private FriendDAO friendDAO;

  @Inject
  private FriendRequestDAO friendRequestDAO;
  
  @LoggedIn
  public FriendRequest createFriendRequest(UserEntity recipient, String message) {
    UserEntity creator = sessionController.getLoggedUserEntity();

    return friendRequestDAO.create(creator, recipient, message);
  }
  
  @LoggedIn
  public List<UserEntity> listFriends() {
    UserEntity user = sessionController.getLoggedUserEntity();
    
    List<UserEntity> friends = new ArrayList<UserEntity>();
    List<Friend> listByUser = friendDAO.listByUser(user);
    for (Friend f : listByUser) {
      if (!f.getUserA().equals(user.getId()))
        friends.add(userEntityController.findUserEntityById(f.getUserA()));
      if (f.getUserB().equals(user.getId()))
        friends.add(userEntityController.findUserEntityById(f.getUserB()));
    }
    
    return friends;
  }
  
  @LoggedIn
  public boolean isFriend(UserEntity user) {
    UserEntity loggedUser = sessionController.getLoggedUserEntity();
    
    Friend f = friendDAO.findByUsers(loggedUser, user);
    return f != null;
  }
}
