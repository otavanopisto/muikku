package fi.muikku.plugins.seeker;

import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import javax.inject.Inject;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.controller.WidgetController;
import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;

public class SeekerPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {

  @Inject
  private WidgetController widgetController;

  @Override
	public String getName() {
		return "seeker";
	}

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();

    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.seeker.SeekerPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.seeker.SeekerPluginMessages", LocaleUtils.toLocale("en"))));
    
    return bundles;
  }
}
