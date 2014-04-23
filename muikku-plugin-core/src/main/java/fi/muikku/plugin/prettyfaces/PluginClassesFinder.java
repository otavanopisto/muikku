package fi.muikku.plugin.prettyfaces;

import java.util.List;

import javax.servlet.ServletContext;

import com.ocpsoft.pretty.faces.config.annotation.AbstractClassFinder;
import com.ocpsoft.pretty.faces.config.annotation.PackageFilter;
import com.ocpsoft.pretty.faces.config.annotation.PrettyAnnotationHandler;

import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PluginLibraryDescriptor;
import fi.muikku.plugin.manager.PluginManagerException;
import fi.muikku.plugin.manager.SingletonPluginManager;

public class PluginClassesFinder extends AbstractClassFinder {
  
	public PluginClassesFinder(ServletContext servletContext, PackageFilter packageFilter) {
		super(servletContext, resolvePluginClassLoader(), packageFilter);
	}

	@Override
	public void findClasses(PrettyAnnotationHandler classHandler) {
	  try {
	    List<PluginLibraryDescriptor> pluginLibraries = SingletonPluginManager.getInstance().discoverPluginLibraries();
	    for (PluginLibraryDescriptor pluginLibrary : pluginLibraries) {
	      for (Class<? extends PluginDescriptor> pluginDescriptorClass : pluginLibrary.getPlugins()) {
	        PluginDescriptor plugin = pluginDescriptorClass.newInstance();
	        for (Class<?> bean : plugin.getBeans()) {
	          classHandler.processClass(bean);
	        }
	      }
	    }
    } catch (PluginManagerException | InstantiationException | IllegalAccessException e) {
      log.error("Error occured while trying inject plugin PrettyFaces annotation", e);
    }
	}

	private static final ClassLoader resolvePluginClassLoader() {
		try {
			return SingletonPluginManager.getInstance().getPluginsClassLoader();
		} catch (PluginManagerException e) {
			return null;
		}
	}
	
}
