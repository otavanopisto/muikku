package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.Date;
import java.util.List;
import java.util.Set;

public class CommunicatorMessageItemRESTModel extends CommunicatorMessageRESTModel {

  public CommunicatorMessageItemRESTModel(Long id, Long communicatorMessageId, Long senderId, String categoryName, String caption, 
      String content, Date created, Set<String> tags, List<Long> recipientIds, boolean unreadMessagesInThread,
      Date threadLatestMessageDate) {
    super(id, communicatorMessageId, senderId, categoryName, caption, content, created, tags, recipientIds);
    this.unreadMessagesInThread = unreadMessagesInThread;
    this.threadLatestMessageDate = threadLatestMessageDate;
  }
  
  public boolean isUnreadMessagesInThread() {
    return unreadMessagesInThread;
  }

  public void setUnreadMessagesInThread(boolean unreadMessagesInThread) {
    this.unreadMessagesInThread = unreadMessagesInThread;
  }

  public Date getThreadLatestMessageDate() {
    return threadLatestMessageDate;
  }

  public void setThreadLatestMessageDate(Date threadLatestMessageDate) {
    this.threadLatestMessageDate = threadLatestMessageDate;
  }

  private Date threadLatestMessageDate;
  private boolean unreadMessagesInThread;
}
