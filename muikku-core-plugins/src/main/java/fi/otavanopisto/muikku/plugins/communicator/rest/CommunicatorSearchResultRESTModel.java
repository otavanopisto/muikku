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
      String categoryName, String caption, String content, Date created, Set<String> tags, List<CommunicatorSearchResultRecipientRESTModel> receiver, Boolean readByReceiver, List<CommunicatorUserLabelRESTModel> labels) {
    super(id, communicatorMessageId, senderId, categoryName, caption, created, tags);
    this.receiver = receiver;
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
  
  public List<CommunicatorSearchResultRecipientRESTModel> getReceiver() {
    return receiver;
  }

  public void setReceiver(List<CommunicatorSearchResultRecipientRESTModel> receiver) {
    this.receiver = receiver;
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
  
  public List<CommunicatorUserLabelRESTModel> getLabels() {
    return labels;
  }

  public void setLabels(List<CommunicatorUserLabelRESTModel> labels) {
    this.labels = labels;
  }

  private CommunicatorSearchSenderRESTModel sender;
  private List<CommunicatorSearchResultRecipientRESTModel> receiver = new ArrayList<CommunicatorSearchResultRecipientRESTModel>();
  private Boolean readByreceiver;
  private String content;
  private List<CommunicatorUserLabelRESTModel> labels;
}
