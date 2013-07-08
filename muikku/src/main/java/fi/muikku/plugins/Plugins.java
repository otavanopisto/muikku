package fi.muikku.plugins;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.Logged;
import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleController;
import fi.muikku.plugin.AfterPluginInitEvent;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PluginContextClassLoader;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.Transactional;

@Dependent
public class Plugins {

	private Logger logger = Logger.getLogger(getClass().getName());
	
	@Inject
	private LocaleController localeController;
	
	@Inject
  @Any
  private Instance<PluginDescriptor> plugins;
	
	@Inject
	private Event<AfterPluginInitEvent> afterPluginInitEvent;
	
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
    	  fireAfterPluginInitEvent(pluginDescriptor.getName());
    	  if (pluginDescriptor instanceof LocalizedPluginDescriptor) {
    	    List<LocaleBundle> localeBundles = ((LocalizedPluginDescriptor) pluginDescriptor).getLocaleBundles();
    	    for (LocaleBundle localeBundle : localeBundles) {
    	      localeController.add(localeBundle.getLocation(), localeBundle.getBundle());
    	    }
    	  }
      	logger.info("Plugin '" + pluginDescriptor.getName() + "' initialized");
    	} catch (Exception e) {
    		logger.log(Level.SEVERE, "Failed to initialize plugin: " + pluginDescriptor.getName(), e);
    	}
  	}
	}

  private void fireAfterPluginInitEvent(String name) {
    AfterPluginInitEvent eventData = new AfterPluginInitEvent();
    eventData.setPluginName(name);
    afterPluginInitEvent.fire(eventData);
  }

}
