package fi.muikku.security.impl;

import fi.muikku.model.users.UserEmailEntity;
import fi.muikku.model.users.UserEntity;
import fi.muikku.security.UserContextResolver;
import fi.otavanopisto.security.ContextReference;

public class UserEntityContextResolverImpl implements UserContextResolver {

  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return 
        UserEntity.class.isInstance(contextReference) ||
        UserEmailEntity.class.isInstance(contextReference);
  }

  @Override
  public UserEntity resolveUser(ContextReference contextReference) {
    if (UserEntity.class.isInstance(contextReference))
      return (UserEntity) contextReference;
    
    if (UserEmailEntity.class.isInstance(contextReference))
      return ((UserEmailEntity) contextReference).getUser();
    
    return null;
  }
  
}
