package fi.muikku.plugins.transcriptofrecords;

import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.security.LoggedIn;

@Named
@RequestScoped
@Join(path = "/records/", to = "/jsf/records/index.jsf")
@LoggedIn
public class TranscriptofRecordsBackingBean {

  @RequestAction
	public String init() {
	  return null;
	}
	
}
