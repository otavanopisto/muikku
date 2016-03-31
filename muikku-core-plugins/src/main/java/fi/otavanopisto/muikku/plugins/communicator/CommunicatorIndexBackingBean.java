package fi.otavanopisto.muikku.plugins.communicator;

import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.security.LoggedIn;

@Named
@RequestScoped
@Join(path = "/communicator", to = "/jsf/communicator/index.jsf")
@LoggedIn
public class CommunicatorIndexBackingBean {

  @RequestAction
  public String init() {
    return null;
  }
    
}