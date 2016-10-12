package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.rest.model.UserBasicInfo;

/**
 * REST model for message threads containing information about the thread but not the contents nor recipients.
 */
public class CommunicatorThreadRESTModel extends AbstractCommunicatorMessageRESTModel {

  public CommunicatorThreadRESTModel(Long id, Long communicatorMessageId, Long senderId, UserBasicInfo sender, 
      String categoryName, String caption, Date created, Set<String> tags, boolean unreadMessagesInThread, 
      Date threadLatestMessageDate, Long messageCountInThread, List<CommunicatorMessageIdLabelRESTModel> labels) {
    super(id, communicatorMessageId, senderId, categoryName, caption, created, tags);
    this.sender = sender;
    this.unreadMessagesInThread = unreadMessagesInThread;
    this.threadLatestMessageDate = threadLatestMessageDate;
    this.messageCountInThread = messageCountInThread;
    this.labels = labels;
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

  public UserBasicInfo getSender() {
    return sender;
  }

  public void setSender(UserBasicInfo sender) {
    this.sender = sender;
  }

  public Long getMessageCountInThread() {
    return messageCountInThread;
  }

  public void setMessageCountInThread(Long messageCountInThread) {
    this.messageCountInThread = messageCountInThread;
  }

  public List<CommunicatorMessageIdLabelRESTModel> getLabels() {
    return labels;
  }

  public void setLabels(List<CommunicatorMessageIdLabelRESTModel> labels) {
    this.labels = labels;
  }

  private Date threadLatestMessageDate;
  private boolean unreadMessagesInThread;
  private UserBasicInfo sender;
  private Long messageCountInThread;
  private List<CommunicatorMessageIdLabelRESTModel> labels = new ArrayList<CommunicatorMessageIdLabelRESTModel>();
}
