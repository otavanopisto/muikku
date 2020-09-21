package fi.otavanopisto.muikku.plugins.search;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
import fi.otavanopisto.muikku.search.SearchIndexer;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;

public class CommunicatorMessageIndexer {
  
  @Inject
  private Logger logger;

  @Inject 
  private CourseMetaController courseMetaController; 
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private UserController userController;
  
  @Inject 
  private SessionController sessionController;
  
  @Inject
  private SearchIndexer indexer;
  
  @Inject
  private CommunicatorController communicatorController;

  public void indexMessage(CommunicatorMessage message, UserEntity userEntity) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      if (message != null) {
    	
    	IndexedCommunicatorMessage indexedCommunicatorMessage = new IndexedCommunicatorMessage();
    	indexedCommunicatorMessage.setMessage(message.getContent());
    	indexedCommunicatorMessage.setSender(message.getSender());
        CommunicatorMessageId messageId = message.getCommunicatorMessageId();
    	List<CommunicatorMessageRecipient> receiver = communicatorController.listCommunicatorMessageRecipientsByUserAndMessage(userEntity, messageId, message.getTrashedBySender());
    	indexedCommunicatorMessage.setReceiver(receiver);
        
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
      logger.warning(String.format("could not index message #%s/%s", indexedCommunicatorMessage.getClass().getSimpleName(), indexedCommunicatorMessage.getSender()));
    }
  }

  
}

