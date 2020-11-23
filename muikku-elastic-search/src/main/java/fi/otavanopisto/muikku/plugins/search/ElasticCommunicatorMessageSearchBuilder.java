package fi.otavanopisto.muikku.plugins.search;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.search.CommunicatorMessageSearchBuilder;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessage;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageRecipient;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageSender;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
import fi.otavanopisto.muikku.search.SearchResults;

public class ElasticCommunicatorMessageSearchBuilder implements CommunicatorMessageSearchBuilder{

  public ElasticCommunicatorMessageSearchBuilder(ElasticSearchProvider elastic) {
    this.elastic = elastic;
  }
  
  @Override
  public SearchResults<List<IndexedCommunicatorMessage>> search() {
    return elastic.searchCommunicatorMessages(
        getMessage(),
        getCommunicatorMessageId(),
        getCaption(),
        getSenderId(),
        getSender(),
        getReceiver(),
        getSearchId(),
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
		return message;
	}
	
	@Override
	public CommunicatorMessageSearchBuilder setMessage(String message) {
		this.message = message;
		return this;
	}
	
	@Override
	public Long getCommunicatorMessageId() {
		return communicatorMessageId;
	}
	
	@Override
	public CommunicatorMessageSearchBuilder setCommunicatorMessageId(Long communicatorMessageId) {
		this.communicatorMessageId = communicatorMessageId;
		return this;
	}
	
	@Override
	public String getCaption() {
		return caption;
	}
	
	@Override
	public CommunicatorMessageSearchBuilder setCaption(String caption) {
		this.caption = caption;
		return this;
	}
	
	@Override
	public List<IndexedCommunicatorMessageRecipient> getReceiver() {
		return receiver;
	}
	
	@Override
	public CommunicatorMessageSearchBuilder addReceiver(List<IndexedCommunicatorMessageRecipient> receiver) {
		this.receiver = receiver;
		return this;
	}
	
	@Override
  public CommunicatorMessageSearchBuilder setReceiver(List<IndexedCommunicatorMessageRecipient> receiver) {
    this.receiver = receiver;
    return this;
  }
	
	@Override
	public Long getSearchId() {
	  return searchId;
	}
	
	@Override
	public long getSenderId() {
		return senderId;
	}
	
	@Override
	public CommunicatorMessageSearchBuilder setSenderId(long senderId) {
		this.senderId = senderId;
		return this;
	}
	
	
	@Override
	public IndexedCommunicatorMessageSender getSender() {
		return sender;
	}
	
	@Override
	public CommunicatorMessageSearchBuilder setSender(IndexedCommunicatorMessageSender sender) {
		this.sender = sender;
		return this;
	}
	
	@Override
	public CommunicatorMessageSearchBuilder setSearchId(Long searchId) {
	  this.searchId = searchId;
	  return this;
	}
	
	@Override
	public Date getCreated() {
		return created;
	}
	
	@Override
	public CommunicatorMessageSearchBuilder setCreated(Date created) {
		this.created = created;
		return this;
	}
	
	@Override
	public Set<Long> getTags() {
		return tags;
	}
	
	@Override
	public CommunicatorMessageSearchBuilder setTags(Set<Long> tags) {
		this.tags = tags;
		return this;
	}
	
	@Override
	public int getFirstResult() {
		return firstResult;
	}
	
	@Override
	public CommunicatorMessageSearchBuilder setFirstResult(int firstResult) {
		this.firstResult = firstResult;
		return this;
	}
	
	@Override
	public int getMaxResults() {
		return maxResults;
	}
	
	@Override
	public CommunicatorMessageSearchBuilder setMaxResults(int maxResults) {
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
		this.sort = sorts;
		return this;
	}
	
	private String message;
	private Long communicatorMessageId;
	private String caption;
	private long senderId;
	private IndexedCommunicatorMessageSender sender;
	private List<IndexedCommunicatorMessageRecipient> receiver;
	private Long searchId;
	private Date created;
	private Set<Long> tags;
	private List<Sort> sort;
	private int maxResults;
	private int firstResult;
}