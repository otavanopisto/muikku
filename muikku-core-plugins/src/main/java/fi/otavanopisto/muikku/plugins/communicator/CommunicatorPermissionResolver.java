package fi.otavanopisto.muikku.plugins.communicator;

import java.util.List;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.security.AbstractPermissionResolver;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.PermissionResolver;
import fi.otavanopisto.security.User;

@Dependent
public class CommunicatorPermissionResolver extends AbstractPermissionResolver implements PermissionResolver {

  @Inject
  private Logger logger;
  
  @Inject
  private CommunicatorController communicatorController;
  
  @Inject
  private CommunicatorPermissionCollection permissionCollection;
  
  @Override
  public boolean handlesPermission(String permission) {
    try {
      if (permissionCollection.containsPermission(permission)) {
        String permissionScope = permissionCollection.getPermissionScope(permission);
        
        return CommunicatorPermissionCollection.PERMISSIONSCOPE_COMMUNICATOR.equals(permissionScope); 
      } else
        return false;
    } catch (NoSuchFieldException e) {
      e.printStackTrace();
      return false;
    }
  }
  
  @Override
  public boolean hasPermission(String permission, ContextReference contextReference, User user) {
    UserEntity userEntity = (UserEntity) user;
    CommunicatorMessage message = resolveMessage(contextReference);
    
    if (message == null) {
      logger.severe(String.format("Trying to resolve permission for null message"));
      return false;
    }
    
    if (message.getSender() == null) {
      logger.severe(String.format("Trying to resolve permission for message %d with null sender", message.getId()));
      return false;
    }
    
    if (userEntity == null) {
      logger.severe(String.format("Trying to resolve permission for null userEntity"));
      return false;
    }
    
    if (message.getSender().equals(userEntity.getId())) {
      // Sender has access to the message
      return true;
    } else {
      List<CommunicatorMessageRecipient> recipients = communicatorController.listCommunicatorMessageRecipients(message);
      
      for (CommunicatorMessageRecipient recipient : recipients) {
        if (recipient.getRecipient().equals(userEntity.getId()))
          return true;
      }
    }
    
    return false;
  }

  private CommunicatorMessage resolveMessage(ContextReference contextReference) {
    if (contextReference instanceof CommunicatorMessage)
      return (CommunicatorMessage) contextReference;

    if (contextReference instanceof CommunicatorMessageRecipient) {
      CommunicatorMessageRecipient recipient = (CommunicatorMessageRecipient) contextReference;
      
      return recipient.getCommunicatorMessage();
    }
      
//    if (contextReference instanceof CommunicatorMessage)
//      return (CommunicatorMessage) contextReference;
    
    return null;
  }

  @Override
  public boolean hasEveryonePermission(String permission, ContextReference contextReference) {
    return false;
  }
  
}
