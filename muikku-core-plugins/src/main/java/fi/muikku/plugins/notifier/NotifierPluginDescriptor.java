package fi.muikku.plugins.notifier;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.i18n.LocaleBundle;
import fi.muikku.notifier.NotifierController;
import fi.muikku.plugin.AfterPluginsInitEvent;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;

public class NotifierPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {

  @Inject
  private NotifierController notifierController;
  
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

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    
    return bundles;
  }

}
