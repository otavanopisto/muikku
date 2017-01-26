package fi.otavanopisto.muikku.plugins.feed;

import javax.enterprise.event.Observes;
import fi.otavanopisto.muikku.plugin.AfterPluginsInitEvent;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class FeedPluginDescriptor implements PluginDescriptor {

  @Override
  public void init() {
  }
	
	@Override
	public String getName() {
		return "feed";
	}
	
	public void onAfterPluginsInit(@Observes AfterPluginsInitEvent event) {
	}
	
}
