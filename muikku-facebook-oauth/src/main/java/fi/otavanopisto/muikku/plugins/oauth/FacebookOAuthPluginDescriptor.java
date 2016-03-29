package fi.otavanopisto.muikku.plugins.oauth;

import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class FacebookOAuthPluginDescriptor implements PluginDescriptor {

  @Override
  public void init() {
  }

	@Override
	public String getName() {
		return "facebook-oauth";
	}
	
}
