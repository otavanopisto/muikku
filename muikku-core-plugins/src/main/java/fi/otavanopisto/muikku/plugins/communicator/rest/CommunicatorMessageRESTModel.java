package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.rest.model.UserBasicInfo;

/**
 * REST model for full information about a single message including recipients, sender and 
 * message content.
 */
public class CommunicatorMessageRESTModel extends AbstractCommunicatorMessageRESTModel {

  public CommunicatorMessageRESTModel() {
  }
  
  public CommunicatorMessageRESTModel(Long id, Long communicatorMessageId, Long senderId, UserBasicInfo sender, 
      String categoryName, String caption, String content, Date created, Set<String> tags,
      List<CommunicatorMessageRecipientRESTModel> recipients, Long recipientCount) {
    super(id, communicatorMessageId, senderId, categoryName, caption, created, tags);
    this.content = content;
    this.sender = sender;
    this.recipients = recipients;
    this.recipientCount = recipientCount;
  }
  
  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
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

  public UserBasicInfo getSender() {
    return sender;
  }

  public void setSender(UserBasicInfo sender) {
    this.sender = sender;
  }

  private String content;
  private UserBasicInfo sender;
  private Long recipientCount;
  private List<CommunicatorMessageRecipientRESTModel> recipients = new ArrayList<CommunicatorMessageRecipientRESTModel>();
}
