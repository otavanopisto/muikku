package fi.otavanopisto.muikku.plugins.dnm;

import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class DeusNexMachinaPluginDescriptor implements PluginDescriptor {

  public static final String PLUGIN_NAME = "deus-nex-machina";

  @Override
  public void init() {
  }

	@Override
	public String getName() {
		return PLUGIN_NAME;
	}

}
