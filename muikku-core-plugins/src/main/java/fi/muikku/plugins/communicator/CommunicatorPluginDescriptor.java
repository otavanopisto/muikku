package fi.muikku.plugins.communicator;

import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import javax.annotation.PostConstruct;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.controller.messaging.MessagingWidget;
import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;

public class CommunicatorPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {
  
  public static final String MESSAGING_CATEGORY = "message"; 
  
  @Inject
  @Any
  private Instance<MessagingWidget> messagingWidgets;

  @PostConstruct
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
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.communicator.CommunicatorPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.communicator.CommunicatorPluginMessages", LocaleUtils.toLocale("en"))));

    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.communicator.CommunicatorJsPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.communicator.CommunicatorJsPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }
}
