package fi.muikku.plugins.commonlog;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class CommonLogPluginDescriptor implements PluginDescriptor {

  @Override
  public String getName() {
    return "common-log";
  }
  
  @Override
  public void init() {
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
        LogProvider.class
    ));
  }

}
