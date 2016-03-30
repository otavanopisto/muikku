package fi.otavanopisto.muikku.security;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.security.ContextReference;

public interface UserContextResolver extends ContextResolver {

  UserEntity resolveUser(ContextReference contextReference);
}
