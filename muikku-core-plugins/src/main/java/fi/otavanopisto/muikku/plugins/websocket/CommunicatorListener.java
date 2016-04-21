package fi.otavanopisto.muikku.plugins.websocket;

import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.enterprise.event.TransactionPhase;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.communicator.events.CommunicatorMessageSent;
import fi.otavanopisto.muikku.users.UserEntityController;

public class CommunicatorListener {

  @Inject
  private Logger logger;
 
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @Transactional (value = TxType.REQUIRES_NEW)
  public void onCommunicatorMessageSent(@Observes (during = TransactionPhase.AFTER_COMPLETION) CommunicatorMessageSent event) {
    UserEntity userEntity = userEntityController.findUserEntityById(event.getRecipientUserEntityId());
    if (userEntity != null) {
      webSocketMessenger.sendMessage("Communicator:newmessagereceived", null, Arrays.asList(userEntity));
    } else {
      logger.log(Level.SEVERE, String.format("Could not find message recipient user entity %d", event.getRecipientUserEntityId()));
    }
  }
  
}
