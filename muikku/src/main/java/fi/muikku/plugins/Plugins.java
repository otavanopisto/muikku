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

import org.hibernate.dialect.FirebirdDialect;

import fi.muikku.Logged;
import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleController;
import fi.muikku.plugin.AfterPluginInitEvent;
import fi.muikku.plugin.AfterPluginsInitEvent;
import fi.muikku.plugin.BeforePluginInitEvent;
import fi.muikku.plugin.BeforePluginsInitEvent;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PluginContextClassLoader;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PluginEvent;
import fi.muikku.plugin.Transactional;
import fi.muikku.plugin.manager.PluginManagerException;
import fi.muikku.plugin.manager.SingletonPluginManager;

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
	
	@Inject
	private Event<BeforePluginInitEvent> beforePluginInitEvent;
	
	@Inject
	private Event<BeforePluginsInitEvent> beforePluginsInitEvent;
	
	@Inject
	private Event<AfterPluginsInitEvent> afterPluginsInitEvent;
	
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

		firePluginsInitEvent(false);
  	for (PluginDescriptor pluginDescriptor : getPlugins()) {
  		logger.info("Initializing plugin: " + pluginDescriptor.getName());
      
    	try {
    	  firePluginInitEvent(pluginDescriptor, false);
    	  pluginDescriptor.init();
    	  firePluginInitEvent(pluginDescriptor, true);
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
  	firePluginsInitEvent(true);
	}

  private void firePluginInitEvent(PluginDescriptor pluginDescriptor, boolean isAfter) {
    PluginEvent eventData;
    if (isAfter) {
      eventData = new AfterPluginInitEvent();
    } else {
      eventData = new BeforePluginInitEvent();
    }
    
    String pluginName = pluginDescriptor.getName();
    String pluginLibrary = "";
    try {
      pluginLibrary = SingletonPluginManager.getInstance()
          .getLibraryDescriptorOfPluginDescriptor(pluginDescriptor).getName();
    } catch (PluginManagerException pluginManagerException) {
      logger.severe("Failed to get descriptor of plugin: " + pluginName);
    }
    
    eventData.setPluginName(pluginName);
    eventData.setPluginLibrary(pluginLibrary);
    
    if (isAfter) {
      afterPluginInitEvent.fire((AfterPluginInitEvent)eventData);
    } else {
      beforePluginInitEvent.fire((BeforePluginInitEvent)eventData);
    }
  }

  private void firePluginsInitEvent(boolean isAfter) {
    if (isAfter) {
      afterPluginsInitEvent.fire(new AfterPluginsInitEvent());
    } else {
      beforePluginsInitEvent.fire(new BeforePluginsInitEvent());
    }
  }
}
