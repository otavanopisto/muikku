package fi.otavanopisto.muikku.plugins.ceepos;

import java.nio.charset.StandardCharsets;
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

import com.google.common.hash.Hashing;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrder;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.security.LoggedInWithQueryParams;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;

@Named
@Stateful
@RequestScoped
//TODO Remove this file and its xhtml completely
//@Join(path = "/ceepos/pay", to = "/jsf/ceepos/index.jsf")
@LoggedInWithQueryParams
public class CeeposPayViewBackingBean {

  @Parameter("order")
  @Matches ("[0-9]{1,}")
  private Long order;
  
  @Parameter("hash")
  private String hash;
  
  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private CeeposController ceeposController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @RequestAction
  public String init() {

    // User has to be logged in
    
    if (!sessionController.isLoggedIn()) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    // Order specified by order query parameter must exist
    
    CeeposOrder ceeposOrder = ceeposController.findOrderByIdAndArchived(order, false);
    if (ceeposOrder == null) {
      logger.warning(String.format("Order %d not found", order));
      return NavigationRules.NOT_FOUND;
    }

    // Hash validation
    
    StringBuilder sb = new StringBuilder();
    sb.append(ceeposOrder.getId());
    sb.append("&");
    sb.append(ceeposOrder.getUserIdentifier());
    sb.append("&");
    sb.append(getSetting("key"));
    String expectedHash = Hashing.sha256().hashString(sb.toString(), StandardCharsets.UTF_8).toString();
    if (!StringUtils.equals(expectedHash, hash)) {
      logger.severe(String.format("Ceepos order %d: Hash validation failure with user %s",
          ceeposOrder.getId(),
          sessionController.getLoggedUserIdentifier()));
      return NavigationRules.INTERNAL_ERROR;
    }
    
    // Order must belong to the current user
    
    SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(ceeposOrder.getUserIdentifier());
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(sdi);
    if (userEntity == null || !userEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
      logger.severe(String.format("Ceepos order %d: User %s access revoked",
          ceeposOrder.getId(),
          sessionController.getLoggedUserIdentifier()));
      return NavigationRules.ACCESS_DENIED;
    }

    return null;
  }
  
  public void setOrder(Long order) {
    this.order = order;
  }
  
  public void setHash(String hash) {
    this.hash = hash;
  }

  private String getSetting(String setting) {
    return pluginSettingsController.getPluginSetting("ceepos", setting);
  }

}
