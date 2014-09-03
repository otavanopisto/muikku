package fi.muikku.plugins.guidancerequest;

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

public class GuidanceRequestPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {

  public static final String MESSAGING_CATEGORY = "guidancerequest";
  
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
		return "guidancerequest";
	}

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.guidancerequest.GuidanceRequestPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.guidancerequest.GuidanceRequestPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }
}
