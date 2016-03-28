package fi.otavanopisto.muikku.plugins.communicator;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageSignature;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageTemplate;
import fi.otavanopisto.muikku.security.UserContextResolver;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.security.ContextReference;

public class CommunicatorInboxOwnerContextResolverImpl implements UserContextResolver {

  @Inject
  private UserEntityController userEntityController;
  
  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return 
        CommunicatorMessageSignature.class.isInstance(contextReference) ||
        CommunicatorMessageTemplate.class.isInstance(contextReference);
  }

  @Override
  public UserEntity resolveUser(ContextReference contextReference) {
    if (CommunicatorMessageSignature.class.isInstance(contextReference)) {
      return userEntityController.findUserEntityById(((CommunicatorMessageSignature) contextReference).getUser());
    }

    if (CommunicatorMessageTemplate.class.isInstance(contextReference)) {
      return userEntityController.findUserEntityById(((CommunicatorMessageTemplate) contextReference).getUser());
    }
    
    return null;
  }
  
}
