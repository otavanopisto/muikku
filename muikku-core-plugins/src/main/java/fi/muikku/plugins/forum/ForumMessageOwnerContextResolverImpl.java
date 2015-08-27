package fi.muikku.plugins.forum;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.forum.model.ForumMessage;
import fi.muikku.security.UserContextResolver;
import fi.muikku.users.UserEntityController;
import fi.otavanopisto.security.ContextReference;

public class ForumMessageOwnerContextResolverImpl implements UserContextResolver {

  @Inject
  private UserEntityController userEntityController;
  
  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return 
        ForumMessage.class.isInstance(contextReference);
  }

  @Override
  public UserEntity resolveUser(ContextReference contextReference) {
    ForumMessage message = (ForumMessage) contextReference;
    
    return userEntityController.findUserEntityById(message.getCreator());
  }
  
}
