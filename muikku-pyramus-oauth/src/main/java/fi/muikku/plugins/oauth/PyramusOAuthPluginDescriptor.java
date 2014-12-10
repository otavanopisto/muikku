package fi.muikku.plugins.oauth;

import fi.muikku.plugin.PluginDescriptor;

public class PyramusOAuthPluginDescriptor implements PluginDescriptor {

  public static final String PLUGIN_NAME = "pyramus-oauth";
  
  @Override
  public void init() {
  }

	@Override
	public String getName() {
		return PLUGIN_NAME;
	}

}
