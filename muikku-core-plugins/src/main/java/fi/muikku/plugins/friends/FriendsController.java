package fi.muikku.plugins.friends;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.model.users.UserEntity;
import fi.muikku.security.LoggedIn;
import fi.muikku.session.SessionController;

@Dependent
@Stateful
@Named("Friends")
public class FriendsController {

  @Inject
  private SessionController sessionController;

  @Inject
  private FriendRequestDAO friendRequestDAO;
  
  @LoggedIn
  public FriendRequest createFriendRequest(UserEntity recipient, String message) {
    UserEntity creator = sessionController.getUser();

    return friendRequestDAO.create(creator, recipient, message);
  }
}
