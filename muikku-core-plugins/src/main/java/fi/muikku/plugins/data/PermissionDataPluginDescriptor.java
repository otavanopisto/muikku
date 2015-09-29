package fi.muikku.plugins.data;

import javax.enterprise.event.Observes;
import fi.muikku.plugin.AfterPluginsInitEvent;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PrioritizedPluginDescriptor;

public class PermissionDataPluginDescriptor implements PluginDescriptor, PrioritizedPluginDescriptor {
  
//  @Inject
//  private PermissionsPluginController permissionsPluginController;
//
  @Override
  public void init() {
  }

	@Override
	public String getName() {
		return "data-permissions";
	}
	
	public void onAfterPluginsInit(@Observes AfterPluginsInitEvent event) {
	  // TODO: moved to data plugin as @observes cannot be prioritized (last in this case)
//    try {
//      permissionsPluginController.processPermissions();
//    } catch (Exception e) {
//      // TODO: Proper error handling
//      e.printStackTrace();
//      throw new RuntimeException(e);
//    }
	}

  @Override
  public int getPriority() {
    return PrioritizedPluginDescriptor.LAST;
  }
	
}
