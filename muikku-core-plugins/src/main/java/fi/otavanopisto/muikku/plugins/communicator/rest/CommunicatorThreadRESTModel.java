package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.rest.model.UserBasicInfo;

public class CommunicatorThreadRESTModel extends CommunicatorMessageRESTModel {

  public CommunicatorThreadRESTModel(Long id, Long communicatorMessageId, Long senderId, UserBasicInfo sender, 
      String categoryName, String caption, String content, Date created, Set<String> tags, List<CommunicatorMessageRecipientRESTModel> recipients, 
      boolean unreadMessagesInThread, Date threadLatestMessageDate, Long messageCountInThread, List<CommunicatorMessageIdLabelRESTModel> labels) {
    super(id, communicatorMessageId, senderId, categoryName, caption, content, created, tags);
    this.sender = sender;
    this.unreadMessagesInThread = unreadMessagesInThread;
    this.threadLatestMessageDate = threadLatestMessageDate;
    this.messageCountInThread = messageCountInThread;
    this.labels = labels;
    this.recipients = recipients;
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

  public List<CommunicatorMessageRecipientRESTModel> getRecipients() {
    return recipients;
  }

  public void setRecipients(List<CommunicatorMessageRecipientRESTModel> recipients) {
    this.recipients = recipients;
  }

  private Date threadLatestMessageDate;
  private boolean unreadMessagesInThread;
  private UserBasicInfo sender;
  private Long messageCountInThread;
  private List<CommunicatorMessageIdLabelRESTModel> labels;
  private List<CommunicatorMessageRecipientRESTModel> recipients = new ArrayList<CommunicatorMessageRecipientRESTModel>();
}
