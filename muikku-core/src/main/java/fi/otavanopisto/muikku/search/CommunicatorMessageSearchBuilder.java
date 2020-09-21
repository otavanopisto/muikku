package fi.otavanopisto.muikku.search;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;


public interface CommunicatorMessageSearchBuilder {
  SearchResult search();
	  
  String getMessage();

  CommunicatorMessageSearchBuilder setMessage(String message);

  List<CommunicatorMessageRecipient> getReceiver();

  CommunicatorMessageSearchBuilder addReceiver(List<CommunicatorMessageRecipient> receiver);

  CommunicatorMessageSearchBuilder setReceiver(List<CommunicatorMessageRecipient> receiver);

  long getSender();
  
  CommunicatorMessageSearchBuilder setSender(long sender);
  
  int getFirstResult();

  CommunicatorMessageSearchBuilder setFirstResult(int firstResult);

  int getMaxResults();

  CommunicatorMessageSearchBuilder setMaxResults(int maxResults);

  List<Sort> getSorts();

  CommunicatorMessageSearchBuilder addSort(Sort sort);

  CommunicatorMessageSearchBuilder setSorts(List<Sort> sorts);

  TemplateRestrictionForCommunicatorMessage getTemplateRestriction();
  CommunicatorMessageSearchBuilder setTemplateRestriction(TemplateRestrictionForCommunicatorMessage templateRestriction);
	  
  public enum TemplateRestrictionForCommunicatorMessage {
    LIST_ALL,
    ONLY_TEMPLATES,
    ONLY_COMMUNICATORMESSAGES
  }

}
