package fi.otavanopisto.muikku.plugins.search;

import java.util.ArrayList;
import java.util.List;

import fi.otavanopisto.muikku.search.CommunicatorMessageSearchBuilder;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageRecipient;
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
        getCaption(),
        getSenderId(),
        getSender(),
        getReceiver(),
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
public String getSender() {
	// TODO Auto-generated method stub
	return sender;
}

@Override
public CommunicatorMessageSearchBuilder setSender(String sender) {
	// TODO Auto-generated method stub
	this.sender = sender;
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
private String caption;
private long senderId;
private String sender;
private List<IndexedCommunicatorMessageRecipient> receiver;
private List<Sort> sort;
private int maxResults;
private int firstResult;
}