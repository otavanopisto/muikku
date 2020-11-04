package fi.otavanopisto.muikku.search;

import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
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
		      name = "communicatorMessageId",
		      type = "Long",
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
		      type = "IndexedCommunicatorMessageSender",
		      index = "not_analyzed"
		    ),
		    @IndexableFieldOption (
		      name = "receiver",
		      type = "List<IndexedCommunicatorMessageRecipient>",
		      index = "not_analyzed"
		    ),
		    @IndexableFieldOption (
		      name = "created",
		      type = "Date",
		      index = "not_analyzed"
		    ),
		    @IndexableFieldOption (
		      name = "tags",
		      type = "Set<Long>",
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
  
  public Long getCommunicatorMessageId() {
	return this.communicatorMessageId;
  }
  
  public String getCaption() {
    return this.caption;
  }
  
  public long getSenderId() {
    return this.senderId;
  }
  
  public IndexedCommunicatorMessageSender getSender() {
	    return this.sender;
	  }
  
  public List<IndexedCommunicatorMessageRecipient> getReceiver() {
    return this.receiver;
  }
  
  @IndexId
  public String getSearchId() {
	return this.searchId;
  }
  
  public Date getcreated() {
	 return this.created;
  }
  
  public Set<Long> getTags(){
	  return this.tags;
  }
  
  public void setMessage(String message) {
    this.message = message;
  }
  
  public void setCommunicatorMessageId(Long communicatorMessageId) {
	this.communicatorMessageId = communicatorMessageId;
  }
  
  public void setCaption(String caption) {
	    this.caption = caption;
	  }
  
  public void setSenderId(long senderId) {
    this.senderId = senderId;
  }
  
  public void setSender(IndexedCommunicatorMessageSender sender) {
	    this.sender = sender;
	  }
  
  public void setReceiver(List<IndexedCommunicatorMessageRecipient> recipientsEntityList) {
	this.receiver = recipientsEntityList;
  }
  
  
  public void setSearchId(String searchId) {
	 this.searchId = searchId;
  }
 
  
  public void setCreated(Date created) {
	this.created = created;
  }
  
  public void setTags(Set<Long> tags) {
	this.tags = tags;
  }
  
  
  
  private String message;
  private Long communicatorMessageId;
  private String caption;
  private long senderId;
  private IndexedCommunicatorMessageSender sender;
  private List<IndexedCommunicatorMessageRecipient> receiver;
  private String searchId;
  private Date created;
  private Set<Long> tags;
}

