package fi.muikku.plugin;

import java.util.List;

public interface PluginLibraryDescriptor {

	public String getName();
	public List<Class<? extends PluginDescriptor>> getPlugins(); 
	
}
