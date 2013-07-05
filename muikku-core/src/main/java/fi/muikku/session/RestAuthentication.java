package fi.muikku.session;

import fi.muikku.model.users.UserEntity;

public interface RestAuthentication {

  public boolean isLoggedIn();

  public UserEntity getUser();

  public void logout();

}
