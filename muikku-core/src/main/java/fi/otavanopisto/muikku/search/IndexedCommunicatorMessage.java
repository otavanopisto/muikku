package fi.otavanopisto.muikku.search;

import java.util.List;

import fi.otavanopisto.muikku.search.annotations.IndexId;
import fi.otavanopisto.muikku.search.annotations.Indexable;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldOption;

@Indexable (
		  name = "IndexedCommunicatorMessage",
		  options = {
		    @IndexableFieldOption (
		      name = "message",
		      type = "string",
		      index = "not_analyzed"
		    ),
		    @IndexableFieldOption (
			  name = "caption",
		      type = "string",
		      index = "not_analyzed"
				    ),
		    @IndexableFieldOption (
		      name = "senderId",
		      type = "long",
		      index = "not_analyzed"
		    ),
		    @IndexableFieldOption (
			  name = "sender",
		      type = "string",
		      index = "not_analyzed"
				    ),
		    @IndexableFieldOption (
		      name = "receiver",
		      type = "List<IndexedCommunicatorMessageRecipient>",
		      index = "not_analyzed"
		    )
		  }
		)

public class IndexedCommunicatorMessage {
public IndexedCommunicatorMessage() {
    super();}
  
  public String getMessage() {
	 return this.message;
  }
  
  public String getCaption() {
		 return this.caption;
	  }
  
  public long getSenderId() {
    return this.senderId;
  }
  
  public String getSender() {
	    return this.sender;
	  }
  
  public List<IndexedCommunicatorMessageRecipient> getReceiver() {
    return this.receiver;
  }
  
  public void setMessage(String message) {
    this.message = message;
  }
  
  public void setCaption(String caption) {
	    this.caption = caption;
	  }
  
  public void setSenderId(long senderId) {
    this.senderId = senderId;
  }
  
  public void setSender(String sender) {
	    this.sender = sender;
	  }
  
  public void setReceiver(List<IndexedCommunicatorMessageRecipient> recipientsEntityList) {
	this.receiver = recipientsEntityList;
  }
  
  @IndexId
  public String getSearchId() {
	return this.searchId;
  }
  
  public void setSearchId(String searchId) {
	 this.searchId = searchId;
  }
  
  private String message;
  private String caption;
  private long senderId;
  private String sender;
  private List<IndexedCommunicatorMessageRecipient> receiver;
  private String searchId;
}

