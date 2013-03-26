package fi.muikku.plugins;

import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.faces.view.facelets.ResourceResolver;

import com.sun.faces.facelets.impl.DefaultResourceResolver;

import fi.muikku.plugin.manager.PluginManagerException;
import fi.muikku.plugin.manager.SingletonPluginManager;

public class PluginResourceResolver extends ResourceResolver {

	private static final Logger logger = Logger.getLogger(PluginResourceResolver.class.getName());
	private static final String PLUGIN_RESOURCE_BASE_PATH = "META-INF/resources";

	@Override
	public URL resolveUrl(String path) {
		URL defaultResource = defaultResourceResolver.resolveUrl(path);
		if (defaultResource != null) {
			return defaultResource;
		}

		URL resource;

		SingletonPluginManager pluginManager;
		try {
			pluginManager = SingletonPluginManager.getInstance();

			ClassLoader pluginsClassLoader = pluginManager.getPluginsClassLoader();

			StringBuilder pluginResourcePath = new StringBuilder().append(PLUGIN_RESOURCE_BASE_PATH).append(path);

			resource = pluginsClassLoader.getResource(pluginResourcePath.toString());
			if (resource != null) {
				return resource;
			}
		} catch (PluginManagerException e) {
			logger.log(Level.SEVERE, "Plugin resource resolving failed", e);
		}

		return null;
	}

	private final DefaultResourceResolver defaultResourceResolver = new DefaultResourceResolver();
}
