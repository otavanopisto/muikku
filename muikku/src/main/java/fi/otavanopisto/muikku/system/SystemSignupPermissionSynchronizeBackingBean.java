package fi.otavanopisto.muikku.system;

import java.util.logging.Logger;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.search.WorkspaceSignupPermissionsSynchronizeEvent;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@Named
//TODO Remove this file and its xhtml completely AND replace it with a REST endpoint
//@Join (path = "/system/syncsignuppermissions", to = "/jsf/system/cache-flush.jsf")
public class SystemSignupPermissionSynchronizeBackingBean {
  
  @Parameter
  private Boolean resume;

  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private Event<WorkspaceSignupPermissionsSynchronizeEvent> synchronizeEvent;
  
  @RequestAction
  public String init() {
    if (sessionController.hasPermission(MuikkuPermissions.ADMIN, null)) {
      logger.warning("Synchronizing signup permissions");
      
      synchronizeEvent.fire(new WorkspaceSignupPermissionsSynchronizeEvent(resume != null ? resume : false));
    }
    
    return "/index.jsf?faces-redirect=true";
  }
  
  public void setResume(Boolean resume) {
    this.resume = resume;
  }
  
  public Boolean getResume() {
    return resume;
  }
}
