package fi.otavanopisto.muikku.plugins.h2db;

import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class H2DBPluginDescriptor implements PluginDescriptor {

  @Override
  public void init() {
  }

	@Override
	public String getName() {
		return "h2db";
	}

}