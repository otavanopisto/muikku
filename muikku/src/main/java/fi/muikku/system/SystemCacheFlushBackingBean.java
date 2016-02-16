package fi.muikku.system;

import java.util.logging.Logger;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.cache.CacheFlushEvent;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.SessionController;

@Named
@Join (path = "/system/cache/flush", to = "/jsf/system/cache-flush.jsf")
public class SystemCacheFlushBackingBean {
  
  @Inject
  private Logger logger;
  
  @Inject
  private Event<CacheFlushEvent> cacheFlushEvent;
  
  @Inject
  private SessionController sessionController;
  
	@RequestAction
	public String init() {
	  if (sessionController.hasPermission(MuikkuPermissions.ADMIN, null)) {
	    logger.warning("Flushing all caches");
	    cacheFlushEvent.fire(new CacheFlushEvent());
	  }
	  
	  return "/index.jsf?faces-redirect=true";
	}
}
