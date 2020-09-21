package fi.otavanopisto.muikku.plugins.search;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import java.util.List;

public class IndexedCommunicatorMessage {
public IndexedCommunicatorMessage() {
    super();
   // this.message = communicatorMessage.getContent();
   // this.sender = communicatorMessage.getSender();
   // CommunicatorMessageId messageId = communicatorMessage.getCommunicatorMessageId();
    //this.receiver =  communicatorController.listCommunicatorMessageRecipientsByUserAndMessage(userEntity, messageId, communicatorMessage.getTrashedBySender());
  }
  
  public String getMessage() {
	 return this.message;
  }
  
  public long getSender() {
    return this.sender;
  }
  
  public List<CommunicatorMessageRecipient> getReceiver() {
    return this.receiver;
  }
  
  public void setMessage(String message) {
    this.message = message;
  }
  
  public void setSender(long sender) {
    this.sender = sender;
  }
  
  public void setReceiver(List<CommunicatorMessageRecipient> receiver) {
	this.receiver = receiver;
  }
  
  private String message;
  private long sender;
  private List<CommunicatorMessageRecipient> receiver;
}

