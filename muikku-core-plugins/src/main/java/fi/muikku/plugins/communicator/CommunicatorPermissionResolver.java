package fi.muikku.plugins.communicator;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.muikku.controller.ResourceRightsController;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.ResourceRolePermissionDAO;
import fi.muikku.dao.users.EnvironmentUserDAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.muikku.security.AbstractPermissionResolver;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.PermissionResolver;
import fi.otavanopisto.security.User;

@RequestScoped
public class CommunicatorPermissionResolver extends AbstractPermissionResolver implements PermissionResolver {

  @Inject
  private ResourceRolePermissionDAO resourceUserRolePermissionDAO;
  
  @Inject
  private EnvironmentUserDAO environmentUserDAO;

  @Inject
  private CommunicatorController communicatorController;
  
  @Inject
  private CommunicatorPermissionCollection permissionCollection;
  
  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private ResourceRightsController resourceRightsController;
  
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
