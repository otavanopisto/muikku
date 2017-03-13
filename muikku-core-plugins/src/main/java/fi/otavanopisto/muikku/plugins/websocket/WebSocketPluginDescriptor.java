package fi.otavanopisto.muikku.plugins.websocket;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugin.AfterPluginsInitEvent;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class WebSocketPluginDescriptor implements PluginDescriptor {
  
  @Inject
  private WebSocketTicketController websocketTicketController;
  
  public static final String PLUGIN_NAME = "websocket";

  @Override
  public void init() {
  }

  public void onAfterPluginsInit(@Observes AfterPluginsInitEvent event) {
    websocketTicketController.removeAllTickets();
  }

	@Override
	public String getName() {
		return PLUGIN_NAME;
	}

}
