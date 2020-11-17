package fi.otavanopisto.muikku.plugins.search;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageIdLabelDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageRecipientDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessage;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageLabels;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageRecipient;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageSender;
import fi.otavanopisto.muikku.search.SearchIndexer;
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
  private UserEntityController userEntityController;
  
  @Inject 
  private UserController userController;
  
  @Inject
  private CommunicatorMessageRecipientDAO communicatorMessageRecipientDAO;
  
  @Inject
  private CommunicatorMessageIdLabelDAO communicatorMessageIdLabelDAO;

  public void indexMessage(CommunicatorMessage message) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      if (message != null) {
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

        if (Boolean.TRUE.equals(message.getArchivedBySender())) {
          senderData.setFirstName("");
          senderData.setLastName("");
          senderData.setUserEntityId(null);
          indexedCommunicatorMessage.setSenderId(senderId);

        } else {
          senderData.setFirstName(sender.getFirstName());
          senderData.setLastName(sender.getLastName());
          senderData.setUserEntityId(senderId);
          indexedCommunicatorMessage.setSenderId(senderId);
        }

        indexedCommunicatorMessage.setSender(senderData);
        
    	  //set recipients
    	  List<CommunicatorMessageRecipient> recipientsList = communicatorMessageRecipientDAO.listByMessageIncludeGroupRecipients(message);
	    	List<IndexedCommunicatorMessageRecipient> recipientsEntityList = new ArrayList<IndexedCommunicatorMessageRecipient>();
	    	for (CommunicatorMessageRecipient recipient : recipientsList) {
          Long recipientId = recipient.getRecipient();
          if(recipientId != null) {
            
            UserEntity recipientEntity = userEntityController.findUserEntityById(recipientId);
            User userRecipient = userController.findUserByUserEntityDefaults(recipientEntity);
            
            IndexedCommunicatorMessageRecipient recipientData = new IndexedCommunicatorMessageRecipient();
            
            if (Boolean.TRUE.equals(recipient.getArchivedByReceiver())) {
              
              continue;
            }
            
            //set receiver userEntityId & display name
            recipientData.setUserEntityId(recipientId);
            recipientData.setDisplayName(userRecipient.getDisplayName());
          	
            // set is message read/unread by receiver
            recipientData.setReadByReceiver(recipient.getReadByReceiver());
              
            // set labels
            List<IndexedCommunicatorMessageLabels> labelsList = new ArrayList<IndexedCommunicatorMessageLabels>();
            List<CommunicatorMessageIdLabel> labels = communicatorMessageIdLabelDAO.listByUserAndMessageId(recipientEntity, communicatorMessageId);
            for (CommunicatorMessageIdLabel label : labels) {
              IndexedCommunicatorMessageLabels labelData = new IndexedCommunicatorMessageLabels();
              CommunicatorLabel wholeLabel = label.getLabel();
              
                labelData.setLabel(wholeLabel.getName());
                labelData.setId(wholeLabel.getId());
                labelsList.add(labelData);
            } 
              
            recipientData.setLabels(labelsList);
            recipientsEntityList.add(recipientData);
          }
        }
	    	
    	  indexedCommunicatorMessage.setReceiver(recipientsEntityList);
	    	
	    	// set created
	    	Date created = message.getCreated();
	    	indexedCommunicatorMessage.setCreated(created);
	    	
	    	// set tags
	    	Set<Long> tags = message.getTags();
	    	Set<String> strs = new HashSet<>(tags.size());
	    	tags.forEach(i -> strs.add(i.toString()));
	    	indexedCommunicatorMessage.setTags(strs);
	    	
	    	
	    	indexedCommunicatorMessage.setSearchId(message.getId());
	        
	    	//call method indexCommunicatorMessage
	    	indexCommunicatorMessage(indexedCommunicatorMessage);
	    	
	    } else {
	      logger.warning(String.format("could not index communicator message because message entity #%s/ %s could not be found", message));
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