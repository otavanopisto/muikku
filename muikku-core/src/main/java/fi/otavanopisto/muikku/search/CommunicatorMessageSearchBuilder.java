package fi.otavanopisto.muikku.search;

import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.search.SearchProvider.Sort;

public interface CommunicatorMessageSearchBuilder {
  
  SearchResults<List<IndexedCommunicatorMessage>> search();
	  
  String getQueryString();
  
  CommunicatorMessageSearchBuilder setQueryString(String queryString);
  
  Date getCreated();
  
  CommunicatorMessageSearchBuilder setCreated(Date created);
  
  Set<Long> getTags();
  
  CommunicatorMessageSearchBuilder setTags(Set<Long> tags);
  
  List<IndexedCommunicatorMessageRecipient> getReceiver();
  
  Long getSearchId();
  
  CommunicatorMessageSearchBuilder setSearchId(Long searchId);
  
  long getSenderId();
  
  IndexedCommunicatorMessageSender getSender();
  
  CommunicatorMessageSearchBuilder setSender(IndexedCommunicatorMessageSender sender);
  
  CommunicatorMessageSearchBuilder setSenderId(long senderId);
  
  int getFirstResult();

  CommunicatorMessageSearchBuilder setFirstResult(int firstResult);

  int getMaxResults();

  CommunicatorMessageSearchBuilder setMaxResults(int maxResults);

  List<Sort> getSorts();

  CommunicatorMessageSearchBuilder addSort(Sort sort);

  CommunicatorMessageSearchBuilder setSorts(List<Sort> sorts);

  CommunicatorMessageSearchBuilder addReceiver(List<IndexedCommunicatorMessageRecipient> receiver);

  CommunicatorMessageSearchBuilder setReceiver(List<IndexedCommunicatorMessageRecipient> receiver);
}
