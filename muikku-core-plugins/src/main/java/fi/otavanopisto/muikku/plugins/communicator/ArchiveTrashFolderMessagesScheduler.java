package fi.otavanopisto.muikku.plugins.communicator;

import java.time.LocalDate;
import java.util.Date;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageRecipientDAO;

@Startup
@Singleton
public class ArchiveTrashFolderMessagesScheduler {
  
  private static final int COMMUNICATOR_TRASHFOLDER_MESSAGE_EXIPIRATION_DAYS = 30;
  
  @Inject
  private Logger logger;
  
  @Inject
  private CommunicatorMessageDAO communicatorMessageDAO;

  @Inject
  private CommunicatorMessageRecipientDAO communicatorMessageRecipientDAO;

  @Schedule (dayOfWeek="*", hour = "6", minute = "0", persistent = false) 
  public void archiveTrashFolderMessages() {
    LocalDate nowDate = LocalDate.now().minusDays(COMMUNICATOR_TRASHFOLDER_MESSAGE_EXIPIRATION_DAYS);
    Date thresholdDate = java.sql.Date.valueOf(nowDate);
    
    logger.info(String.format("Archiving messages in trash folders with threshold date %s", thresholdDate));
    
    int archivedSenderMessages = communicatorMessageDAO.timedArchiveSenderMessagesInTrash(thresholdDate);
    logger.info(String.format("Archived %d sent messages.", archivedSenderMessages));
    
    int archivedRecipientMessages = communicatorMessageRecipientDAO.timedArchiveRecipientMessagesInTrash(thresholdDate);
    logger.info(String.format("Archived %d received messages.", archivedRecipientMessages));
  }
  
}
