package fi.otavanopisto.muikku.plugins.search;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.search.CommunicatorMessageSearchBuilder;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageRecipient;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageSender;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
import fi.otavanopisto.muikku.search.SearchResult;

public class ElasticCommunicatorMessageSearchBuilder implements CommunicatorMessageSearchBuilder{

  public ElasticCommunicatorMessageSearchBuilder(ElasticSearchProvider elastic) {
    this.elastic = elastic;
  }
  
  @Override
  public SearchResult search() {
    return elastic.searchCommunicatorMessages(
        getMessage(),
        getCommunicatorMessageId(),
        getCaption(),
        getSenderId(),
        getSender(),
        getReceiver(),
        getCreated(),
        getTags(),
        getFirstResult(),
        getMaxResults(),
        getSorts()
    );
  }

  private ElasticSearchProvider elastic;

@Override
public String getMessage() {
	// TODO Auto-generated method stub
	return message;
}

@Override
public CommunicatorMessageSearchBuilder setMessage(String message) {
	// TODO Auto-generated method stub
	this.message = message;
	return this;
}

@Override
public Long getCommunicatorMessageId() {
	// TODO Auto-generated method stub
	return communicatorMessageId;
}

@Override
public CommunicatorMessageSearchBuilder setCommunicatorMessageId(Long communicatorMessageId) {
	// TODO Auto-generated method stub
	this.communicatorMessageId = communicatorMessageId;
	return this;
}

@Override
public String getCaption() {
	// TODO Auto-generated method stub
	return caption;
}

@Override
public CommunicatorMessageSearchBuilder setCaption(String caption) {
	// TODO Auto-generated method stub
	this.caption = caption;
	return this;
}

@Override
public List<IndexedCommunicatorMessageRecipient> getReceiver() {
	// TODO Auto-generated method stub
	return receiver;
}

@Override
public CommunicatorMessageSearchBuilder addReceiver(List<IndexedCommunicatorMessageRecipient> receiver) {
	// TODO Auto-generated method stub
	this.receiver = receiver;
	return this;
}

@Override
public long getSenderId() {
	// TODO Auto-generated method stub
	return senderId;
}

@Override
public CommunicatorMessageSearchBuilder setSenderId(long senderId) {
	this.senderId = senderId;
	return this;
}


@Override
public IndexedCommunicatorMessageSender getSender() {
	// TODO Auto-generated method stub
	return sender;
}

@Override
public CommunicatorMessageSearchBuilder setSender(IndexedCommunicatorMessageSender sender) {
	// TODO Auto-generated method stub
	this.sender = sender;
	return this;
}

@Override
public Date getCreated() {
	// TODO Auto-generated method stub
	return created;
}

@Override
public CommunicatorMessageSearchBuilder setCreated(Date created) {
	// TODO Auto-generated method stub
	this.created = created;
	return this;
}

@Override
public Set<Long> getTags() {
	// TODO Auto-generated method stub
	return tags;
}

@Override
public CommunicatorMessageSearchBuilder setTags(Set<Long> tags) {
	// TODO Auto-generated method stub
	this.tags = tags;
	return this;
}

@Override
public int getFirstResult() {
	// TODO Auto-generated method stub
	return firstResult;
}

@Override
public CommunicatorMessageSearchBuilder setFirstResult(int firstResult) {
	// TODO Auto-generated method stub
	this.firstResult = firstResult;
	return this;
}

@Override
public int getMaxResults() {
	// TODO Auto-generated method stub
	return maxResults;
}

@Override
public CommunicatorMessageSearchBuilder setMaxResults(int maxResults) {
	// TODO Auto-generated method stub
	this.maxResults = maxResults;
	return this;
}

@Override
public List<Sort> getSorts() {
  return sort;
}

@Override
public CommunicatorMessageSearchBuilder addSort(Sort sort) {
  if (this.sort == null) {
    this.sort = new ArrayList<>();
  }
  this.sort.add(sort);
  return this;
}

@Override
public CommunicatorMessageSearchBuilder setSorts(List<Sort> sorts) {
	// TODO Auto-generated method stub
	this.sort = sorts;
	return this;
}


private String message;
private Long communicatorMessageId;
private String caption;
private long senderId;
private IndexedCommunicatorMessageSender sender;
private List<IndexedCommunicatorMessageRecipient> receiver;
private Date created;
private Set<Long> tags;
private List<Sort> sort;
private int maxResults;
private int firstResult;
}