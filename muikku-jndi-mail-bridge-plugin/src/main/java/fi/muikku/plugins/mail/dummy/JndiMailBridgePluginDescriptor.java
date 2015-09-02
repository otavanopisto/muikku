package fi.muikku.plugins.mail.dummy;

import java.util.Arrays;
import java.util.List;

import fi.muikku.plugin.PluginDescriptor;

public class JndiMailBridgePluginDescriptor implements PluginDescriptor {

  @Override
  public String getName() {
    return "jndi-mail-bridge";
  }

  @Override
  public void init() {
    
  }
}
