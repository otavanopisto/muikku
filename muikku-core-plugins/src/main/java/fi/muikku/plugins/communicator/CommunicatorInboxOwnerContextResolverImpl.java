package fi.muikku.plugins.communicator;

import javax.inject.Inject;

import fi.muikku.controller.UserController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.communicator.model.CommunicatorMessageSignature;
import fi.muikku.plugins.communicator.model.CommunicatorMessageTemplate;
import fi.muikku.security.ContextReference;
import fi.muikku.security.UserContextResolver;

public class CommunicatorInboxOwnerContextResolverImpl implements UserContextResolver {

  @Inject
  private UserController userController;
  
  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return 
        CommunicatorMessageSignature.class.isInstance(contextReference) ||
        CommunicatorMessageTemplate.class.isInstance(contextReference);
  }

  @Override
  public UserEntity resolveUser(ContextReference contextReference) {
    if (CommunicatorMessageSignature.class.isInstance(contextReference)) {
      return userController.findUserEntity(((CommunicatorMessageSignature) contextReference).getUser());
    }

    if (CommunicatorMessageTemplate.class.isInstance(contextReference)) {
      return userController.findUserEntity(((CommunicatorMessageTemplate) contextReference).getUser());
    }
    
    return null;
  }
  
}
