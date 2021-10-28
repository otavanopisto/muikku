package fi.otavanopisto.muikku.plugins.ceepos;

import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Matches;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrder;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/ceepos/pay", to = "/jsf/ceepos/index.jsf")
@LoggedIn
public class CeeposPayViewBackingBean {

  @Parameter ("order")
  @Matches ("[0-9]{1,}")
  private Long orderId;
  
  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private CeeposController ceeposController;

  @RequestAction
  public String init() {
    
    // User has to be logged in
    
    if (!sessionController.isLoggedIn()) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    // Order specified by orderId query parameter must exist
    
    CeeposOrder ceeposOrder = ceeposController.findOrderByIdAndArchived(orderId, false);
    if (ceeposOrder == null) {
      logger.warning(String.format("Order %d not found", orderId));
      return NavigationRules.NOT_FOUND;
    }
    
    // Order must bwlong to the current user
    
    if (!StringUtils.equals(sessionController.getLoggedUserIdentifier(), ceeposOrder.getUserIdentifier())) {
      logger.severe(String.format("User %s trying to access order %d belonging to %s",
          sessionController.getLoggedUserIdentifier(),
          orderId,
          ceeposOrder.getUserIdentifier()));
      return NavigationRules.ACCESS_DENIED;
    }

    // TODO Should we validate order state at this point or leave it to the UI?

    return null;
  }

}
