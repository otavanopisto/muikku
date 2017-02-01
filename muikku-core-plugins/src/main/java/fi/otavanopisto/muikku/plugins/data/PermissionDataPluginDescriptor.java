package fi.otavanopisto.muikku.plugins.data;

import javax.enterprise.event.Observes;

import fi.otavanopisto.muikku.plugin.AfterPluginsInitEvent;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;
import fi.otavanopisto.muikku.plugin.PrioritizedPluginDescriptor;

public class PermissionDataPluginDescriptor implements PluginDescriptor, PrioritizedPluginDescriptor {
  
  public static final String PLUGIN_NAME = "data-permissions";

  @Override
  public void init() {
  }

	@Override
	public String getName() {
		return PLUGIN_NAME;
	}
	
	public void onAfterPluginsInit(@Observes AfterPluginsInitEvent event) {
	  // Permissions are initialized in data plugin as as @observes cannot be prioritized (last in this case)
	}

  @Override
  public int getPriority() {
    return PrioritizedPluginDescriptor.LAST;
  }
	
}
