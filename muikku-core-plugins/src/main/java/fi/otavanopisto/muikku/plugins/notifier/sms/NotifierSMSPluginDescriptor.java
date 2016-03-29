package fi.otavanopisto.muikku.plugins.notifier.sms;

import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class NotifierSMSPluginDescriptor implements PluginDescriptor {

  @Override
  public void init() {
  }

	@Override
	public String getName() {
		return "notifier-sms";
	}
	
}
