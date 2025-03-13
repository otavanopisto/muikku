package fi.otavanopisto.muikku.plugins.profile;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
//TODO Remove this file and its xhtml completely
//@Join (path = "/profile", to = "/jsf/profile/profile.jsf")
public class ProfileBackingBean {
  
  @RequestAction
  @LoggedIn
  public String init() {
    return null;
  }

}