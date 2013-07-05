package fi.muikku.security.impl;

import fi.muikku.model.users.UserEntity;
import fi.muikku.security.ContextReference;
import fi.muikku.security.UserContextResolver;

public class UserEntityContextResolverImpl implements UserContextResolver {

  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return 
        UserEntity.class.isInstance(contextReference);
  }

  @Override
  public UserEntity resolveUser(ContextReference contextReference) {
    return (UserEntity) contextReference;
  }
  
}
