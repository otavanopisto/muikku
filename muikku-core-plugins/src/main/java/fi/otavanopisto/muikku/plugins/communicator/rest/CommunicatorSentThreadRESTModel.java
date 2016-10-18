package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.rest.model.UserBasicInfo;

/**
 * REST model for sent messages including the thread information plus recipients.
 */
public class CommunicatorSentThreadRESTModel extends CommunicatorThreadRESTModel {

  public CommunicatorSentThreadRESTModel(Long id, Long communicatorMessageId, Long senderId, UserBasicInfo sender, 
      String categoryName, String caption, Date created, Set<String> tags, boolean unreadMessagesInThread, 
      Date threadLatestMessageDate, Long messageCountInThread, List<CommunicatorMessageIdLabelRESTModel> labels,
      List<CommunicatorMessageRecipientRESTModel> recipients, Long recipientCount) {
    super(id, communicatorMessageId, senderId, sender, categoryName, caption, created, tags, unreadMessagesInThread, 
        threadLatestMessageDate, messageCountInThread, labels);
    this.recipients = recipients;
    this.recipientCount = recipientCount;
  }

  public List<CommunicatorMessageRecipientRESTModel> getRecipients() {
    return recipients;
  }

  public void setRecipients(List<CommunicatorMessageRecipientRESTModel> recipients) {
    this.recipients = recipients;
  }

  public Long getRecipientCount() {
    return recipientCount;
  }

  public void setRecipientCount(Long recipientCount) {
    this.recipientCount = recipientCount;
  }

  private Long recipientCount;
  private List<CommunicatorMessageRecipientRESTModel> recipients = new ArrayList<CommunicatorMessageRecipientRESTModel>();
}
