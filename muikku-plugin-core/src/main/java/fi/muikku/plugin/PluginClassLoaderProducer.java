package fi.muikku.plugin;

import javax.enterprise.context.Dependent;

import javax.enterprise.inject.Produces;

import fi.muikku.plugin.manager.PluginManagerException;
import fi.muikku.plugin.manager.SingletonPluginManager;

public class PluginClassLoaderProducer {

	@Produces
	@PluginClassLoader
	@Dependent
	public ClassLoader productPluginClassLoader() {
		try {
			return SingletonPluginManager.getInstance().getPluginsClassLoader();
		} catch (PluginManagerException e) {
		}
		
		return null;
	}
	
}
