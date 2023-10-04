package fi.otavanopisto.muikku.plugins.communicator;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageRecipientDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.plugins.search.CommunicatorMessageIndexer;

@Startup
@Singleton
public class ArchiveTrashFolderMessagesScheduler {
  
  private static final int COMMUNICATOR_TRASHFOLDER_MESSAGE_EXIPIRATION_DAYS = 30;
  private static final int COMMUNICATOR_TRASHFOLDER_CLEANUP_MAX_BATCH_SIZE = 100;
  
  @Inject
  private Logger logger;
  
  @Inject
  private CommunicatorMessageDAO communicatorMessageDAO;

  @Inject
  private CommunicatorMessageRecipientDAO communicatorMessageRecipientDAO;

  @Inject
  private CommunicatorMessageIndexer communicatorMessageIndexer;
  
  @Schedule (dayOfWeek="*", hour = "6", minute = "0", persistent = false) 
  public void archiveTrashFolderMessages() {
    Date thresholdDate = getThresholdDate();
    
    logger.info(String.format("Archiving messages in trash folders with threshold date %s", thresholdDate));

    /**
     * Because indexing takes time, we need to have some restrictions on how many messages
     * we try to handle in a batch. The batch size is divided between sent and received messages
     * as the indexing is per changed message.
     */
    int batchSize = COMMUNICATOR_TRASHFOLDER_CLEANUP_MAX_BATCH_SIZE;
    
    List<CommunicatorMessage> trashedSenderMessages = communicatorMessageDAO.listSendersExpiredTrashMessages(thresholdDate, batchSize);
    for (CommunicatorMessage communicatorMessage : trashedSenderMessages) {
      CommunicatorMessage updatedMessage = communicatorMessageDAO.updateArchivedBySender(communicatorMessage, true);
      communicatorMessageIndexer.indexMessage(updatedMessage);
    }
    
    logger.info(String.format("Archived %d sent messages.", trashedSenderMessages.size()));

    batchSize = batchSize - trashedSenderMessages.size();
    
    if (batchSize > 0) {
      List<CommunicatorMessageRecipient> trashedRecipientMessages = communicatorMessageRecipientDAO.listRecipientsExpiredTrashMessages(thresholdDate, batchSize);
      for (CommunicatorMessageRecipient recipient : trashedRecipientMessages) {
        CommunicatorMessageRecipient updatedRecipient = communicatorMessageRecipientDAO.updateArchivedByReceiver(recipient, true);
        CommunicatorMessage message = updatedRecipient.getCommunicatorMessage();
        communicatorMessageIndexer.indexMessage(message);
      }

      logger.info(String.format("Archived %d received messages.", trashedRecipientMessages.size()));
    } else {
      logger.info("Archived 0 received messages. (Batch full.)");
    }
  }
  
  private java.sql.Date getThresholdDate() {
    LocalDate nowDate = LocalDate.now().minusDays(COMMUNICATOR_TRASHFOLDER_MESSAGE_EXIPIRATION_DAYS);
    return java.sql.Date.valueOf(nowDate);
  }
}
