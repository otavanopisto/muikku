package fi.otavanopisto.muikku.plugins.cleanup;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import fi.otavanopisto.muikku.controller.SystemSettingsController;

@Stateless
public class CleanupShutdown {

  @Inject
  private SystemSettingsController systemSettingsController;
  
  // Shouldn't ever get mixed up with any other transaction but just for the
  // heck of it, let's implicitly state that this needs to run in its own
  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void toggle(String key, boolean enabled) {
    systemSettingsController.setSetting(key, Boolean.toString(enabled));
  }

}
