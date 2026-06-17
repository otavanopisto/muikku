package fi.otavanopisto.muikku.plugins.forum;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.forum.ForumMessage;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.security.UserContextResolver;
import fi.otavanopisto.muikku.users.UserEntityController;
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
