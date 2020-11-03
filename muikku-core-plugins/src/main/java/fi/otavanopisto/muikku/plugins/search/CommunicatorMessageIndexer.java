package fi.otavanopisto.muikku.plugins.search;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessage;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageRecipient;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageSender;
import fi.otavanopisto.muikku.search.SearchIndexer;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;

public class CommunicatorMessageIndexer {
  
  @Inject
  private Logger logger;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @Inject
  private SearchIndexer indexer;
  
  @Inject
  private CommunicatorController communicatorController;
  
  @Inject 
  private UserEntityController userEntityController;
  
  @Inject 
  private UserController userController;
  
  @Inject
  private SessionController sessionController;

  public void indexMessage(CommunicatorMessage message) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      if (message != null) {
    	UserEntity loggedUser = sessionController.getLoggedUserEntity();
      	IndexedCommunicatorMessage indexedCommunicatorMessage = new IndexedCommunicatorMessage();

    	//set message
    	indexedCommunicatorMessage.setMessage(message.getContent());
    	
    	//set communicatorMessageId
    	CommunicatorMessageId communicatorMessageId = message.getCommunicatorMessageId();
    	Long messageId = communicatorMessageId.getId();
    	indexedCommunicatorMessage.setCommunicatorMessageId(messageId);
    	
    	//set caption
    	indexedCommunicatorMessage.setCaption(message.getCaption());
    	
    	
    	//set sender
    	Long senderId = message.getSender();
    	UserEntity senderEntity = userEntityController.findUserEntityById(senderId);
        User sender = userController.findUserByUserEntityDefaults(senderEntity);
        IndexedCommunicatorMessageSender senderData = new IndexedCommunicatorMessageSender();
        senderData.setFirstName(sender.getFirstName());
        senderData.setLastName(sender.getLastName());
        senderData.setUserEntityId(senderId);
    	indexedCommunicatorMessage.setSender(senderData);
    	indexedCommunicatorMessage.setSenderId(senderId);
    	
    	//set recipients
    	List<CommunicatorMessageRecipient> recipientsList = communicatorController.listAllCommunicatorMessageRecipients(message);
    	List<IndexedCommunicatorMessageRecipient> recipientsEntityList = new ArrayList<IndexedCommunicatorMessageRecipient>();
    	for (CommunicatorMessageRecipient recipient : recipientsList) {
            Long recipientId = recipient.getRecipient();
            
            if(recipientId != null) {
              UserEntity recipientEntity = userEntityController.findUserEntityById(recipientId);
              User userRecipient = userController.findUserByUserEntityDefaults(recipientEntity);
              
              IndexedCommunicatorMessageRecipient recipientData = new IndexedCommunicatorMessageRecipient();
              
              //set receiver userEntityId & display name
              recipientData.setUserEntityId(recipientId);
              recipientData.setDisplayName(userRecipient.getDisplayName());
          	  
              // set is message read/unread by receiver
              recipientData.setReadByReceiver(recipient.getReadByReceiver());
              
              recipientsEntityList.add(recipientData);
            }
        }
    	indexedCommunicatorMessage.setReceiver(recipientsEntityList);
    	
    	// set created
    	Date created = message.getCreated();
    	indexedCommunicatorMessage.setCreated(created);
    	
    	// set tags
    	Set<Long> tags = message.getTags();
    	indexedCommunicatorMessage.setTags(tags);
    	
    	//set labels
        List<CommunicatorMessageIdLabel> labels = communicatorController.listMessageIdLabelsByUserEntity(loggedUser, communicatorMessageId);
        indexedCommunicatorMessage.setLabels(labels);
    	
    	
    	indexedCommunicatorMessage.setSearchId(message.getId().toString());
        
    	//call method indexCommunicatorMessage
    	indexCommunicatorMessage(indexedCommunicatorMessage);
    	
      } else {
        logger.warning(String.format("could not index communicator message because message entity #%s/%s could not be found", message));
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  private void indexCommunicatorMessage(IndexedCommunicatorMessage indexedCommunicatorMessage) {
    try {
      if (indexedCommunicatorMessage != null) {
        indexer.index(indexedCommunicatorMessage.getClass().getSimpleName(), indexedCommunicatorMessage);
      }
    } catch (Exception e) {
      logger.warning(String.format("could not index message #%s/%s//%s", indexedCommunicatorMessage.getClass().getSimpleName(), indexedCommunicatorMessage.getSearchId(), e));
    }
  }

  
}

