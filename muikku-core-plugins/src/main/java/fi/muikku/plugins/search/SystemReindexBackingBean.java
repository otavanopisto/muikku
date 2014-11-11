package fi.muikku.plugins.search;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.search.SearchReindexEvent;

@Named
@Join (path = "/system/search/reindex", to = "/system/search-reindex.jsf")
public class SystemReindexBackingBean {
  
  @Inject
  private Event<SearchReindexEvent> reindexEvent;
  
	@RequestAction
	public String init() {
	  // TODO: Secure this
	  reindexEvent.fire(new SearchReindexEvent());
	  return "/index.jsf?faces-redirect=true";
	}
}
