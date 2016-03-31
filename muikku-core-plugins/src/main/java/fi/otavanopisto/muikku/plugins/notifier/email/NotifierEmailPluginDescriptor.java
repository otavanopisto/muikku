package fi.otavanopisto.muikku.plugins.notifier.email;

import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class NotifierEmailPluginDescriptor implements PluginDescriptor {

  @Override
  public void init() {
  }

	@Override
	public String getName() {
		return "notifier-email";
	}
	
}
