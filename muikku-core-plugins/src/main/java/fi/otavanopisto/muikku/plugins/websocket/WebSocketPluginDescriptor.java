package fi.otavanopisto.muikku.plugins.websocket;

import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class WebSocketPluginDescriptor implements PluginDescriptor {

  public static final String PLUGIN_NAME = "websocket";

  @Override
  public void init() {
  }

  @Override
  public String getName() {
    return PLUGIN_NAME;
  }

}
