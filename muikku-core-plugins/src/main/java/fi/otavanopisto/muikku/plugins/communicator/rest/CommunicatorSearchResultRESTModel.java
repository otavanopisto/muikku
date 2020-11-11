package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.rest.model.UserBasicInfo;

/**
 * REST model for message threads containing information about the thread but not the contents nor recipients.
 */
public class CommunicatorSearchResultRESTModel extends AbstractCommunicatorMessageRESTModel {

  public CommunicatorSearchResultRESTModel(Long id, Long communicatorMessageId, Long senderId, CommunicatorSearchSenderRESTModel sender, 
      String categoryName, String caption, String content, Date created, Set<String> tags, List<CommunicatorSearchResultRecipientRESTModel> recipients, Boolean readByReceiver, List<CommunicatorSearchResultLabelRESTModel> labels) {
    super(id, communicatorMessageId, senderId, categoryName, caption, created, tags);
    this.recipients = recipients;
    this.sender = sender;
    this.readByreceiver = readByReceiver;
    this.content = content;
    this.labels = labels;
  }

  public CommunicatorSearchSenderRESTModel getSender() {
    return sender;
  }

  public void setSender(CommunicatorSearchSenderRESTModel sender) {
    this.sender = sender;
  }
  
  public List<CommunicatorSearchResultRecipientRESTModel> getRecipients() {
    return recipients;
  }

  public void setRecipients(List<CommunicatorSearchResultRecipientRESTModel> recipients) {
    this.recipients = recipients;
  }
  
  public Boolean getReadByReceiver() {
    return readByreceiver;
  }
  
  public void setReadByReceiver(Boolean readByReceiver) {
    this.readByreceiver = readByReceiver;
  }
  
  public String getContent() {
    return content;
  }
  
  public void setContent(String content) {
    this.content = content;
  }
  
  public List<CommunicatorSearchResultLabelRESTModel> getLabels() {
    return labels;
  }

  public void setLabels(List<CommunicatorSearchResultLabelRESTModel> labels) {
    this.labels = labels;
  }

  private CommunicatorSearchSenderRESTModel sender;
  private List<CommunicatorSearchResultRecipientRESTModel> recipients = new ArrayList<CommunicatorSearchResultRecipientRESTModel>();
  private Boolean readByreceiver;
  private String content;
  private List<CommunicatorSearchResultLabelRESTModel> labels;
}
