package fi.muikku.plugins;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.Logged;
import fi.muikku.plugin.PluginContextClassLoader;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.Transactional;

@Dependent
public class Plugins {

	private Logger logger = Logger.getLogger(getClass().getName());
	
	@Inject
  @Any
  private Instance<PluginDescriptor> plugins;
	
	public List<PluginDescriptor> getPlugins() {
		List<PluginDescriptor> result = new ArrayList<>();
		
		Iterator<PluginDescriptor> pluginIterator = plugins.iterator();
  	while (pluginIterator.hasNext()) {
  		result.add(pluginIterator.next());
  	}
  	
  	return result;
	}

	@Logged
	@Transactional
	@PluginContextClassLoader
	public void initialize() {
		logger.info("Initializing plugins");

  	for (PluginDescriptor pluginDescriptor : getPlugins()) {
  		logger.info("Initializing plugin: " + pluginDescriptor.getName());
      
    	try {
    	  pluginDescriptor.init();
      	logger.info("Plugin '" + pluginDescriptor.getName() + "' initialized");
    	} catch (Exception e) {
    		logger.log(Level.SEVERE, "Failed to initialize plugin: " + pluginDescriptor.getName(), e);
    	}
  	}
	}

}
