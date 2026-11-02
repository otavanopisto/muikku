package fi.otavanopisto.muikku.plugins.cleanup;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;

@Stateless
public class CleanupShutdown {

  @Inject
  private SystemSettingsController systemSettingsController;
  
  // Shouldn't ever get mixed up with any other transaction but just for the
  // heck of it, let's explicitly state that this needs to run in its own
  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void disable(String enabledKey, String userEntityIdKey) {
    
    // Job shutdown

    systemSettingsController.setSetting(enabledKey, Boolean.toString(false));
    
    // Shutdown indicates a fatal mistake, so roll back the job's userEntityId
    // by one so that when it is re-enabled, it'll retry the failed student

    String userEntityId = systemSettingsController.getSetting(userEntityIdKey);
    if (!StringUtils.isBlank(userEntityId) && NumberUtils.isNumber(userEntityId)) {
      userEntityId = String.valueOf(Long.parseLong(userEntityId) - 1);
      systemSettingsController.setSetting(userEntityIdKey, userEntityId);
    }
  }

}
