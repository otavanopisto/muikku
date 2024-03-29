package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/records", to = "/jsf/records/index.jsf")
@LoggedIn
public class TranscriptofRecordsBackingBean {
  
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
