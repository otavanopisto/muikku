package fi.muikku.plugins.announcer;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;

@Named
@Stateful
@RequestScoped
@Join (path = "/announcer", to = "/jsf/announcer/index.jsf")
public class AnnouncerBackingBean {

}
