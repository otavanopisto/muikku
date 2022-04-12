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

public class ElasticCommunicatorMessageSearchBuilder implements CommunicatorMessageSearchBuilder {

  public ElasticCommunicatorMessageSearchBuilder(ElasticSearchProvider elastic) {
    this.elastic = elastic;
  }
  
  @Override
  public SearchResults<List<IndexedCommunicatorMessage>> search() {
    return elastic.searchCommunicatorMessages(
        getQueryString(),
        getSenderId(),
        getSender(),
        getRecipients(),
        getCreated(),
        getTags(),
        getFirstResult(),
        getMaxResults(),
        getSorts()
    );
  }

  private ElasticSearchProvider elastic;

  @Override
  public List<IndexedCommunicatorMessageRecipient> getRecipients() {
    return recipients;
  }
  
  @Override
  public CommunicatorMessageSearchBuilder setRecipients(List<IndexedCommunicatorMessageRecipient> recipients) {
    this.recipients = recipients;
    return this;
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

  public String getQueryString() {
    return queryString;
  }

  public ElasticCommunicatorMessageSearchBuilder setQueryString(String queryString) {
    this.queryString = queryString;
    return this;
  }

  private String queryString;
  private long senderId;
  private IndexedCommunicatorMessageSender sender;
  private List<IndexedCommunicatorMessageRecipient> recipients;
  private Date created;
  private Set<Long> tags;
  private List<Sort> sort;
  private int maxResults;
  private int firstResult;
}