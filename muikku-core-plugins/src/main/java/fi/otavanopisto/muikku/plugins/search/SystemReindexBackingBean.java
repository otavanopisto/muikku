package fi.otavanopisto.muikku.plugins.search;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.search.SearchReindexEvent;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@Join (path = "/system/search/reindex", to = "/jsf/system/search-reindex.jsf")
public class SystemReindexBackingBean {
  
  @Inject
  private Event<SearchReindexEvent> reindexEvent;
  
  @Inject
  private SessionController sessionController;
  
	@RequestAction
	public String init() {
	  if (sessionController.hasPermission(MuikkuPermissions.ADMIN, null)) {
	    reindexEvent.fire(new SearchReindexEvent());
	  }
	  
	  return "/index.jsf?faces-redirect=true";
	}
}
