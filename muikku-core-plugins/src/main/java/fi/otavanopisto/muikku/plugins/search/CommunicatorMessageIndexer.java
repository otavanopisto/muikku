package fi.otavanopisto.muikku.plugins.search;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
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
import fi.otavanopisto.muikku.users.UserEntityName;

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
        indexedCommunicatorMessage.setCommunicatorMessageThreadId(communicatorMessageId.getId());
        	
        //set caption
        indexedCommunicatorMessage.setCaption(message.getCaption());
      	  
        //set sender
        Long senderId = message.getSender();
        UserEntity senderEntity = userEntityController.findUserEntityById(senderId);
        User sender = (senderEntity != null && Boolean.FALSE.equals(senderEntity.getArchived())) 
            ? userController.findUserByUserEntityDefaults(senderEntity) : null;
        
        if (sender != null) {
          IndexedCommunicatorMessageSender senderData = new IndexedCommunicatorMessageSender();
          senderData.setFirstName(sender.getFirstName());
          senderData.setLastName(sender.getLastName());
          senderData.setNickName(sender.getNickName());
          senderData.setUserEntityId(senderId);
          senderData.setArchivedBySender(message.getArchivedBySender());
          
          List<IndexedCommunicatorMessageLabels> labelsList = new ArrayList<IndexedCommunicatorMessageLabels>();
          List<CommunicatorMessageIdLabel> labels = communicatorMessageIdLabelDAO.listByUserAndMessageId(senderEntity, communicatorMessageId);
          for (CommunicatorMessageIdLabel label : labels) {
            IndexedCommunicatorMessageLabels labelData = new IndexedCommunicatorMessageLabels();
            CommunicatorLabel wholeLabel = label.getLabel();
            
            labelData.setLabel(wholeLabel.getName());
            labelData.setId(wholeLabel.getId());
            labelsList.add(labelData);
          } 
            
          senderData.setLabels(labelsList);
          
          indexedCommunicatorMessage.setSender(senderData);
        }
        
        //set recipients
        List<CommunicatorMessageRecipient> recipientsList = communicatorMessageRecipientDAO.listByMessageIncludeGroupRecipients(message);
        List<IndexedCommunicatorMessageRecipient> recipientsEntityList = new ArrayList<IndexedCommunicatorMessageRecipient>();
        for (CommunicatorMessageRecipient recipient : recipientsList) {
          Long recipientId = recipient.getRecipient();
          UserEntity recipientEntity = userEntityController.findUserEntityById(recipientId);
          UserEntityName recipientName = userEntityController.getName(recipientEntity);

          if (recipientName != null) {
            IndexedCommunicatorMessageRecipient recipientData = new IndexedCommunicatorMessageRecipient();
            
            recipientData.setUserEntityId(recipientId);
            recipientData.setFirstName(recipientName.getFirstName());
            recipientData.setLastName(recipientName.getLastName());
            recipientData.setNickName(recipientName.getNickName());
            recipientData.setStudyProgrammeName(recipientName.getStudyProgrammeName());
            // set is message read/unread by receiver
            recipientData.setReadByReceiver(recipient.getReadByReceiver());
            recipientData.setArchivedByReceiver(recipient.getArchivedByReceiver());
              
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
	    	
        indexedCommunicatorMessage.setRecipients(recipientsEntityList);
	    	
        // set created
        Date created = message.getCreated();
        indexedCommunicatorMessage.setCreated(created);
	    	
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
      logger.warning(String.format("could not index message #%s/%s//%s", indexedCommunicatorMessage.getClass().getSimpleName(), indexedCommunicatorMessage.getId(), e));
    }
  }
}