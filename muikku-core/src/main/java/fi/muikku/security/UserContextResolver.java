package fi.muikku.security;

import fi.muikku.model.stub.users.UserEntity;

public interface UserContextResolver extends ContextResolver {

  UserEntity resolveUser(ContextReference contextReference);
}
