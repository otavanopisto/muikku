package fi.otavanopisto.muikku.plugins.workspace;

import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.plugin.LocalizedPluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class WorkspacePluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {
  
  public static final String PLUGIN_NAME = "workspace";

  @Override
  public void init() {
  }

	@Override
	public String getName() {
		return PLUGIN_NAME;
	}

  @Override
  public List<ResourceBundle> getResourceBundles() {
    return Arrays.asList(
        ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.workspace.WorkspacePluginMessages", LocaleUtils.toLocale("en")),
        ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.workspace.WorkspacePluginMessages", LocaleUtils.toLocale("fi")));
  }

}
