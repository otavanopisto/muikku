package fi.otavanopisto.muikku.search;

import java.util.Date;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
        name = "searchId",
        type = "Long",
        index = "not_analyzed"
      ),
      @IndexableFieldOption (
        name = "created",
        type = "Date",
        index = "not_analyzed"
     ),
     @IndexableFieldOption (
       name = "tags",
       type = "Set<String>",
       index = "not_analyzed"
     )
   }
)
@JsonIgnoreProperties(ignoreUnknown = true)
public class IndexedCommunicatorMessage {
  
  public String getMessage() {
    return this.message;
  }
  
  public Long getCommunicatorMessageId() {
    return this.communicatorMessageId;
  }
  
  public String getCaption() {
    return this.caption;
  }
  
  public IndexedCommunicatorMessageSender getSender() {
    return this.sender;
  }
  
  public List<IndexedCommunicatorMessageRecipient> getReceiver() {
    return this.receiver;
  }
  
  @IndexId
  public Long getId() {
    return this.id;
  }
  
  public Date getcreated() {
    return this.created;
  }
  
  public Set<String> getTags(){
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
  
  public void setSender(IndexedCommunicatorMessageSender sender) {
    this.sender = sender;
  }
  
  public void setReceiver(List<IndexedCommunicatorMessageRecipient> recipientsEntityList) {
    this.receiver = recipientsEntityList;
  }
  
  public void setSearchId(Long searchId) {
    this.id = searchId;
  }
  
  public void setCreated(Date created) {
    this.created = created;
  }
  
  public void setTags(Set<String> tags) {
    this.tags = tags;
  }
  
  private String message;
  private Long communicatorMessageId;
  private String caption;
  private IndexedCommunicatorMessageSender sender;
  private List<IndexedCommunicatorMessageRecipient> receiver;
  private Long id;
  private Date created;
  private Set<String> tags;
}

