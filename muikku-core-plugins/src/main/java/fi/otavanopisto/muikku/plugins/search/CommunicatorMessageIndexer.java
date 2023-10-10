package fi.otavanopisto.muikku.plugins.search;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageIdLabelDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageRecipientDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageRecipientUserGroupDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageRecipientWorkspaceGroupDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipientUserGroup;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipientWorkspaceGroup;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessage;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageLabels;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageRecipient;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageRecipientGroup;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageSender;
import fi.otavanopisto.muikku.search.SearchIndexer;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserGroupController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;

public class CommunicatorMessageIndexer {
  
  @Inject
  private Logger logger;

  @Inject
  private SearchIndexer indexer;
  
  @Inject
  private SearchProvider search;
  
  @Inject 
  private UserEntityController userEntityController;
  
  @Inject
  private CommunicatorMessageRecipientDAO communicatorMessageRecipientDAO;
  
  @Inject
  private CommunicatorMessageRecipientUserGroupDAO communicatorMessageRecipientUserGroupDAO;
  
  @Inject
  private CommunicatorMessageRecipientWorkspaceGroupDAO communicatorMessageRecipientWorkspaceGroupDAO;
  
  @Inject
  private CommunicatorMessageIdLabelDAO communicatorMessageIdLabelDAO;
  
  @Inject
  private UserGroupController userGroupController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  public void indexMessage(CommunicatorMessage communicatorMessage) {
    if (communicatorMessage == null) {
      logger.warning("NULL communicatorMessage given");
      return;
    }
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      IndexedCommunicatorMessage indexedCommunicatorMessage = new IndexedCommunicatorMessage();

      //set message
      indexedCommunicatorMessage.setMessage(communicatorMessage.getContent());
        
      //set communicatorMessageId
      CommunicatorMessageId communicatorMessageId = communicatorMessage.getCommunicatorMessageId();
      indexedCommunicatorMessage.setCommunicatorMessageThreadId(communicatorMessageId.getId());
        
      //set caption
      indexedCommunicatorMessage.setCaption(communicatorMessage.getCaption());
        
      //set sender
      Long senderId = communicatorMessage.getSender();
      UserEntity senderEntity = userEntityController.findUserEntityById(senderId);
      UserEntityName senderName = userEntityController.getName(senderEntity, false);
      
      if (senderName != null) {
        IndexedCommunicatorMessageSender senderData = new IndexedCommunicatorMessageSender();
        senderData.setFirstName(senderName.getFirstName());
        senderData.setLastName(senderName.getLastName());
        senderData.setNickName(senderName.getNickName());
        senderData.setUserEntityId(senderId);
        senderData.setTrashedBySender(communicatorMessage.getTrashedBySender());
        senderData.setArchivedBySender(communicatorMessage.getArchivedBySender());
        
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

      // Group Recipients
      
      List<IndexedCommunicatorMessageRecipientGroup> indexedRecipientGroups = new ArrayList<>();
      List<CommunicatorMessageRecipientUserGroup> recipientGroups = communicatorMessageRecipientUserGroupDAO.listByMessage(communicatorMessage);
      for (CommunicatorMessageRecipientUserGroup recipientGroup : recipientGroups) {
        UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(recipientGroup.getUserGroupEntityId());
        UserGroup group = userGroupEntity != null ? userGroupController.findUserGroup(userGroupEntity) : null;

        if (group != null) {
          IndexedCommunicatorMessageRecipientGroup groupData = new IndexedCommunicatorMessageRecipientGroup();
          
          groupData.setGroupName(group.getName());

          // Process the group recipients
          List<CommunicatorMessageRecipient> recipientGroupRecipients = communicatorMessageRecipientDAO.listByMessageAndGroup(communicatorMessage, recipientGroup);
          List<IndexedCommunicatorMessageRecipient> indexedRecipientGroupRecipients = new ArrayList<>();

          for (CommunicatorMessageRecipient recipientGroupRecipient : recipientGroupRecipients) {
            IndexedCommunicatorMessageRecipient indexedMessageRecipientModel = indexedMessageRecipientModel(recipientGroupRecipient, communicatorMessageId);
            if (indexedMessageRecipientModel != null) {
              indexedRecipientGroupRecipients.add(indexedMessageRecipientModel);
            } else {
              logger.log(Level.WARNING, String.format("Couldn't index message %d recipient %d", communicatorMessage.getId(), recipientGroupRecipient.getId()));
            }
          }

          groupData.setRecipients(indexedRecipientGroupRecipients);
          indexedRecipientGroups.add(groupData);
        } else {
          logger.log(Level.WARNING, String.format("Couldn't index message %d recipient UserGroup %d", communicatorMessage.getId(), recipientGroup.getUserGroupEntityId()));
        }
      }
      
      List<CommunicatorMessageRecipientWorkspaceGroup> workspaceRecipientGroups = communicatorMessageRecipientWorkspaceGroupDAO.listByMessage(communicatorMessage);
      for (CommunicatorMessageRecipientWorkspaceGroup workspaceRecipientGroup : workspaceRecipientGroups) {
        WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceRecipientGroup.getWorkspaceEntityId());
        Workspace workspace = workspaceEntity != null ? workspaceController.findWorkspace(workspaceEntity) : null;
        
        if (workspace != null) {
          IndexedCommunicatorMessageRecipientGroup groupData = new IndexedCommunicatorMessageRecipientGroup();
          groupData.setGroupName(workspace.getName());
          
          // Process the group recipients
          List<CommunicatorMessageRecipient> recipientGroupRecipients = communicatorMessageRecipientDAO.listByMessageAndGroup(communicatorMessage, workspaceRecipientGroup);
          List<IndexedCommunicatorMessageRecipient> indexedRecipientGroupRecipients = new ArrayList<>();

          for (CommunicatorMessageRecipient recipientGroupRecipient : recipientGroupRecipients) {
            IndexedCommunicatorMessageRecipient indexedMessageRecipientModel = indexedMessageRecipientModel(recipientGroupRecipient, communicatorMessageId);
            if (indexedMessageRecipientModel != null) {
              indexedRecipientGroupRecipients.add(indexedMessageRecipientModel);
            } else {
              logger.log(Level.WARNING, String.format("Couldn't index message %d recipient %d", communicatorMessage.getId(), recipientGroupRecipient.getId()));
            }
          }
          
          groupData.setRecipients(indexedRecipientGroupRecipients);
          indexedRecipientGroups.add(groupData);
        } else {
          logger.log(Level.WARNING, String.format("Couldn't index message %d recipient Workspace %d", communicatorMessage.getId(), workspaceRecipientGroup.getWorkspaceEntityId()));
        }
      }
      
      // Individual recipients
      
      List<CommunicatorMessageRecipient> recipientsList = communicatorMessageRecipientDAO.listByMessage(communicatorMessage);
      List<IndexedCommunicatorMessageRecipient> recipientsEntityList = new ArrayList<IndexedCommunicatorMessageRecipient>();
      for (CommunicatorMessageRecipient recipient : recipientsList) {
        IndexedCommunicatorMessageRecipient indexedMessageRecipientModel = indexedMessageRecipientModel(recipient, communicatorMessageId);
        if (indexedMessageRecipientModel != null) {
          recipientsEntityList.add(indexedMessageRecipientModel);
        } else {
          logger.log(Level.WARNING, String.format("Couldn't index message %d recipient %d", communicatorMessage.getId(), recipient.getId()));
        }
      }
        
      indexedCommunicatorMessage.setGroupRecipients(indexedRecipientGroups);
      indexedCommunicatorMessage.setRecipients(recipientsEntityList);
      
      // set created
      Date created = communicatorMessage.getCreated();
      indexedCommunicatorMessage.setCreated(created);
      
      indexedCommunicatorMessage.setSearchId(communicatorMessage.getId());
        
      //call method indexCommunicatorMessage
      indexCommunicatorMessage(indexedCommunicatorMessage);
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  private IndexedCommunicatorMessageRecipient indexedMessageRecipientModel(CommunicatorMessageRecipient recipient, CommunicatorMessageId communicatorMessageId) {
    Long recipientId = recipient.getRecipient();
    UserEntity recipientEntity = userEntityController.findUserEntityById(recipientId);
    UserEntityName recipientName = userEntityController.getName(recipientEntity, false);

    if (recipientName != null) {
      IndexedCommunicatorMessageRecipient recipientData = new IndexedCommunicatorMessageRecipient();
      
      recipientData.setId(recipient.getId());
      recipientData.setUserEntityId(recipientId);
      recipientData.setFirstName(recipientName.getFirstName());
      recipientData.setLastName(recipientName.getLastName());
      recipientData.setNickName(recipientName.getNickName());
      recipientData.setStudyProgrammeName(recipientName.getStudyProgrammeName());
      // set is message read/unread by receiver
      recipientData.setReadByReceiver(recipient.getReadByReceiver());
      recipientData.setTrashedByReceiver(recipient.getTrashedByReceiver());
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
      
      return recipientData;
    }
    
    return null;
  }

  private void indexCommunicatorMessage(IndexedCommunicatorMessage indexedCommunicatorMessage) {
    try {
      if (indexedCommunicatorMessage != null) {
        indexer.index(IndexedCommunicatorMessage.INDEX_NAME, IndexedCommunicatorMessage.TYPE_NAME, indexedCommunicatorMessage);
      }
    } catch (Exception e) {
      Long communicatorMessageId = indexedCommunicatorMessage != null ? indexedCommunicatorMessage.getId() : null;
      logger.log(Level.WARNING, String.format("Could not index communicator message %d", communicatorMessageId), e);
    }
  }

  /**
   * Updates the indexed message in place so that only the readByReceiver information for given receiver is updated.
   * 
   * @param communicatorMessageRecipient recipient who's status needs to be updated
   */
  public void updateIndexMessageReadByReceiver(CommunicatorMessageRecipient communicatorMessageRecipient) {
    boolean readByReceiver = communicatorMessageRecipient.getReadByReceiver();
    
    CommunicatorMessage communicatorMessage = communicatorMessageRecipient.getCommunicatorMessage();
    IndexedCommunicatorMessage indexedCommunicatorMessage = search.findCommunicatorMessage(communicatorMessage.getId());
    if (indexedCommunicatorMessage != null) {
      Long recipientId = communicatorMessageRecipient.getId();
      
      if (indexedCommunicatorMessage.getRecipients() != null) {
        indexedCommunicatorMessage.getRecipients().stream()
          .filter(indexedRecipient -> Objects.equals(indexedRecipient.getId(), recipientId))
          .forEach(indexedRecipient -> indexedRecipient.setReadByReceiver(readByReceiver));
      }

      if (indexedCommunicatorMessage.getGroupRecipients() != null) {
        for (IndexedCommunicatorMessageRecipientGroup recipientGroup : indexedCommunicatorMessage.getGroupRecipients()) {
          if (recipientGroup.getRecipients() != null) {
            recipientGroup.getRecipients().stream()
              .filter(indexedRecipient -> Objects.equals(indexedRecipient.getId(), recipientId))
              .forEach(indexedRecipient -> indexedRecipient.setReadByReceiver(readByReceiver));
          }
        }
      }
      
      indexCommunicatorMessage(indexedCommunicatorMessage);
    } else {
      logger.log(Level.WARNING, String.format("Could not find communicator message %d for reindexing", communicatorMessage.getId()));
    }
  }
}