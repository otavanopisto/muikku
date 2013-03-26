package fi.muikku.session.local;

import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.session.SessionController;

public interface LocalSessionController extends SessionController {

  public void login(String email, String password);

  public void representUser(String userId);

  public void endRepresentation();

  public boolean isRepresenting();
  
  public UserEntity getLoggedUser();

  public UserEntity getRepresentedUser();
}
