package fi.otavanopisto.muikku.plugins.settings;

import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.plugin.LocalizedPluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class SettingsPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {

  @Override
  public void init() {
  }

	@Override
	public String getName() {
		return "settings";
	}

  @Override
  public List<ResourceBundle> getResourceBundles() {
    return Arrays.asList(
        ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.settings.SettingsPluginMessages", LocaleUtils.toLocale("fi")),
        ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.settings.SettingsPluginMessages", LocaleUtils.toLocale("en")));
  }

}
