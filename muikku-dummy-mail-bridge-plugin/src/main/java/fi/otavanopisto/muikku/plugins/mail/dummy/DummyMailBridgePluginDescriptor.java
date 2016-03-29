package fi.otavanopisto.muikku.plugins.mail.dummy;

import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class DummyMailBridgePluginDescriptor implements PluginDescriptor {

  @Override
  public void init() {
  }

  @Override
  public String getName() {
    return "dummy-mail-bridge";
  }

}
