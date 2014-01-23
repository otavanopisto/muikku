package fi.muikku.plugins.data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.plugin.AfterPluginsInitEvent;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PrioritizedPluginDescriptor;

@ApplicationScoped
@Stateful
public class PermissionDataPluginDescriptor implements PluginDescriptor, PrioritizedPluginDescriptor {
	
	@Inject
	private PermissionsPluginController permissionsPluginController;
	
	@Override
	public String getName() {
		return "data-permissions";
	}
	
	@Override
	public void init() {
		
	}

	@Override
	public List<Class<?>> getBeans() {
	  return new ArrayList<Class<?>>(Arrays.asList(
	      PermissionsPluginController.class
	  ));
	}
	
	public void onAfterPluginsInit(@Observes AfterPluginsInitEvent event) {
    try {
      permissionsPluginController.processPermissions();
    } catch (Exception e) {
      // TODO: Proper error handling
      e.printStackTrace();
      throw new RuntimeException(e);
    }
	}

  @Override
  public int getPriority() {
    return PrioritizedPluginDescriptor.LAST;
  }
	
}
