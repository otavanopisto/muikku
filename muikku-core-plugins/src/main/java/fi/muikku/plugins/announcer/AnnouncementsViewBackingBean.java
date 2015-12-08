package fi.muikku.plugins.announcer;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;

@Named
@Stateful
@RequestScoped
@Join (path = "/announcements", to = "/jsf/announcement/index.jsf")
public class AnnouncementsViewBackingBean {

}
