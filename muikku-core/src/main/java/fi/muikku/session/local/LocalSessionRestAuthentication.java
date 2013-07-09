package fi.muikku.session.local;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.session.RestAuthentication;

@RequestScoped
@LocalSessionAuthentication
public class LocalSessionRestAuthentication implements RestAuthentication {
  
  @Inject
  private UserEntityDAO userDAO;
  
  @Override
  public UserEntity getUser() {
    return userDAO.findById(userId);
  }

  public void setUser(UserEntity user) {
    if (user != null) {
      this.userId = user.getId();
    } else
      logout();
  }

  @Override
  public boolean isLoggedIn() {
    return userId != null;
  }

  @Override
  public void logout() {
    userId = null;
  }
  
  private Long userId = null;
}
