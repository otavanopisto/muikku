package fi.otavanopisto.muikku.plugins.announcer;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@LoggedIn
// TODO Remove this file and its xhtml completely
//@Join (path = "/announcements", to = "/jsf/announcements/index.jsf")
public class AnnouncementsViewBackingBean {
  
  @RequestAction
  public String init() {
    return null;
  }

}
