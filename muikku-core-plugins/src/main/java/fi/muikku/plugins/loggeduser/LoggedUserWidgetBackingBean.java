package fi.muikku.plugins.loggeduser;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;

@Named
@Stateful
@RequestScoped  
public class LoggedUserWidgetBackingBean {
  
  @Inject
  @LocalSession
  private LocalSessionController localSessionController;

  public boolean isRepresenting() {
    return localSessionController.isRepresenting();
  }
  
  public void endRepresentation() {
    localSessionController.endRepresentation();
  }
}
