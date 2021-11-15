package fi.otavanopisto.muikku.plugins.ceepos;

import java.nio.charset.StandardCharsets;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import com.google.common.hash.Hashing;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrder;
import fi.otavanopisto.muikku.security.LoggedInWithQueryParams;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
@Join(path = "/ceepos/done", to = "/jsf/ceepos/index.jsf")
@LoggedInWithQueryParams
public class CeeposDoneViewBackingBean {

  @Parameter("Id")
  private String id;

  @Parameter("Status")
  private Integer status;

  @Parameter("Reference")
  private String reference;

  @Parameter("Hash")
  private String hash;

  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;

  @Inject
  private CeeposController ceeposController;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @RequestAction
  public String init() {
    
    // User has to be logged in
    
    if (!sessionController.isLoggedIn()) {
      return NavigationRules.ACCESS_DENIED;
    }

    // Hash validation (TODO restore)
    
//    StringBuilder sb = new StringBuilder();
//    sb.append(StringUtils.defaultIfEmpty(id, ""));
//    sb.append("&");
//    sb.append(status == null ? "" : status);
//    sb.append("&");
//    sb.append(StringUtils.defaultIfEmpty(reference, ""));
//    sb.append("&");
//    sb.append(getSetting("key"));
//    String expectedHash = Hashing.sha256().hashString(sb.toString(), StandardCharsets.UTF_8).toString();
//    if (!StringUtils.equals(expectedHash, hash)) {
//      logger.severe(String.format("Hash validation failure with order %s (%s) for user %s", id, reference, sessionController.getLoggedUserIdentifier()));
//      return NavigationRules.INTERNAL_ERROR;
//    }

    // Order specified by order query parameter must exist
    
    CeeposOrder ceeposOrder = ceeposController.findOrderByIdAndArchived(new Long(id), false);
    if (ceeposOrder == null) {
      logger.warning(String.format("Order %s not found", id));
      return NavigationRules.NOT_FOUND;
    }
    
    // Order must bwlong to the current user (TODO restore)
    
//    if (!StringUtils.equals(sessionController.getLoggedUserIdentifier(), ceeposOrder.getUserIdentifier())) {
//      logger.severe(String.format("User %s trying to access order %s belonging to %s",
//          sessionController.getLoggedUserIdentifier(),
//          id,
//          ceeposOrder.getUserIdentifier()));
//      return NavigationRules.ACCESS_DENIED;
//    }
    
    return null;
  }
  
  public void setId(String id) {
    this.id = id;
  }

  public void setStatus(Integer status) {
    this.status = status;
  }
  
  public void setReference(String reference) {
    this.reference = reference;
  }
  
  public void setHash(String hash) {
    this.hash = hash;
  }

  private String getSetting(String setting) {
    return pluginSettingsController.getPluginSetting("ceepos", setting);
  }

}
