package fi.otavanopisto.muikku.plugins.notifier;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.notifier.NotifierController;
import fi.otavanopisto.muikku.plugin.AfterPluginsInitEvent;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class NotifierPluginDescriptor implements PluginDescriptor {

  @Inject
  private NotifierController notifierController;

  @Override
  public void init() {
  }
  
	@Override
	public String getName() {
		return "notifier";
	}

  public void onAfterPluginsInit(@Observes AfterPluginsInitEvent event) {
    try {
      notifierController.processActionsAndMethods();
    } catch (Exception e) {
      // TODO: Proper error handling
      e.printStackTrace();
      throw new RuntimeException(e);
    }
  }

}
