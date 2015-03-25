package fi.muikku.security;

import fi.muikku.model.users.UserEntity;
import fi.otavanopisto.security.ContextReference;

public interface UserContextResolver extends ContextResolver {

  UserEntity resolveUser(ContextReference contextReference);
}
