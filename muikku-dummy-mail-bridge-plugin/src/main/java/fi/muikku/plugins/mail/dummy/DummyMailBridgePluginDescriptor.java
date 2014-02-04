package fi.muikku.plugins.mail.dummy;

import java.util.Arrays;
import java.util.List;

import fi.muikku.plugin.PluginDescriptor;

public class DummyMailBridgePluginDescriptor implements PluginDescriptor {

  @Override
  public String getName() {
    return "dummy-mail-bridge";
  }

  @Override
  public void init() {
    
  }

  @Override
  public List<Class<?>> getBeans() {
    return Arrays.asList(new Class<?>[] {
        DummyMailBridge.class
    });
  }

}
