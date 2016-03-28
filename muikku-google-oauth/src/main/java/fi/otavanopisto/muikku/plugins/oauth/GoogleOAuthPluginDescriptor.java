package fi.otavanopisto.muikku.plugins.oauth;

import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class GoogleOAuthPluginDescriptor implements PluginDescriptor {

  @Override
  public void init() {
  }

	@Override
	public String getName() {
		return "google-oauth";
	}

}
