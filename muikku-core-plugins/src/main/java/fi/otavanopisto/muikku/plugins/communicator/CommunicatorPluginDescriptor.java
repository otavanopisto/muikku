package fi.otavanopisto.muikku.plugins.communicator;

import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.controller.messaging.MessagingWidget;
import fi.otavanopisto.muikku.i18n.LocaleBundle;
import fi.otavanopisto.muikku.i18n.LocaleLocation;
import fi.otavanopisto.muikku.plugin.LocalizedPluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class CommunicatorPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {
  
  public static final String MESSAGING_CATEGORY = "message"; 
  
  @Inject
  @Any
  private Instance<MessagingWidget> messagingWidgets;

  @Override
  public void init() {
    for (MessagingWidget messagingWidget : messagingWidgets) {
      messagingWidget.persistCategory(MESSAGING_CATEGORY);
    }
  }

	@Override
	public String getName() {
		return "communicator";
	}
	
  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.communicator.CommunicatorPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.communicator.CommunicatorPluginMessages", LocaleUtils.toLocale("en"))));

    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.communicator.CommunicatorJsPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.communicator.CommunicatorJsPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }
}
