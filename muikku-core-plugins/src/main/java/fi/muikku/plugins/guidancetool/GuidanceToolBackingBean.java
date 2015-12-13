package fi.muikku.plugins.guidancetool;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join (path = "/guider", to = "/jsf/guider/index.jsf")
@LoggedIn
public class GuidanceToolBackingBean {

  @RequestAction
  public String init() {
    return null;
  }
  
}
