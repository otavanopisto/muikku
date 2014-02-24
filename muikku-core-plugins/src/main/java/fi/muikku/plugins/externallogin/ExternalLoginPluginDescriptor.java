package fi.muikku.plugins.externallogin;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class ExternalLoginPluginDescriptor implements PluginDescriptor {

  @Override
  public String getName() {
    return "externallogin";
  }
  
  @Override
  public void init() {
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
      
      /* Backing Beans */
      
      ExternalLoginWidgetBackingBean.class      
    ));
  }

}
