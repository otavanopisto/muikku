package fi.otavanopisto.muikku.plugins.hops;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptofRecordsPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Stateful
@RequestScoped
@Join(path = "/hops", to = "/jsf/records/index.jsf")
@LoggedIn
public class HopsBackingBean {
  
  @Inject
  private SessionController sessionController;
  
  @RequestAction
  public String init() {
    if (!sessionController.hasEnvironmentPermission(TranscriptofRecordsPermissions.TRANSCRIPT_OF_RECORDS_VIEW)) {
      return NavigationRules.ACCESS_DENIED;
    }
    return null;
  }

}
