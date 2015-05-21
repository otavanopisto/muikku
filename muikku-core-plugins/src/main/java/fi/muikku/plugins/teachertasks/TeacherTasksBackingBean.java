package fi.muikku.plugins.teachertasks;

import javax.enterprise.context.RequestScoped;
import javax.inject.Named;
import org.ocpsoft.rewrite.annotation.Join;
import fi.otavanopisto.security.LoggedIn;

@Named
@RequestScoped
@Join(path = "/tasktool/", to = "/jsf/tasktool/index.jsf")
@LoggedIn


public class TeacherTasksBackingBean {

}
