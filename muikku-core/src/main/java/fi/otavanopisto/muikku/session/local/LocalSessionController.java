package fi.otavanopisto.muikku.session.local;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.session.SessionController;

public interface LocalSessionController extends SessionController {

  public void representUser(Long userId);

  public void endRepresentation();

  public boolean isRepresenting();

  public UserEntity getRepresentedUser();
}
