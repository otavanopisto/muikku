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
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrder;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.security.LoggedInWithQueryParams;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;

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
  private UserEntityController userEntityController;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @RequestAction
  public String init() {
    
    // User has to be logged in
    
    if (!sessionController.isLoggedIn()) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    logger.info(String.format("Ceepos order %s: Status %d reference %s", id, status, reference));

    // Hash validation
    
    StringBuilder sb = new StringBuilder();
    sb.append(StringUtils.defaultIfEmpty(id, ""));
    sb.append("&");
    sb.append(status == null ? "" : status);
    sb.append("&");
    sb.append(StringUtils.defaultIfEmpty(reference, ""));
    sb.append("&");
    sb.append(getSetting("key"));
    String expectedHash = Hashing.sha256().hashString(sb.toString(), StandardCharsets.UTF_8).toString();
    if (!StringUtils.equals(expectedHash, hash)) {
      logger.severe(String.format("Ceepos order %s: Hash validation failure (reference %s) for user %s", id, reference, sessionController.getLoggedUserIdentifier()));
      return NavigationRules.INTERNAL_ERROR;
    }

    // Order specified by order query parameter must exist
    
    CeeposOrder ceeposOrder = ceeposController.findOrderByIdAndArchived(Long.valueOf(id), false);
    if (ceeposOrder == null) {
      logger.warning(String.format("Ceepos order %s: Not found", id));
      return NavigationRules.NOT_FOUND;
    }
    
    // Order must bwlong to the current user
    
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
