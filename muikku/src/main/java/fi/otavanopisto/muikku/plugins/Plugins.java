package fi.otavanopisto.muikku.plugins;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.Logged;
import fi.otavanopisto.muikku.i18n.LocaleBundle;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.plugin.AfterPluginInitEvent;
import fi.otavanopisto.muikku.plugin.AfterPluginsInitEvent;
import fi.otavanopisto.muikku.plugin.BeforePluginInitEvent;
import fi.otavanopisto.muikku.plugin.BeforePluginsInitEvent;
import fi.otavanopisto.muikku.plugin.LocalizedPluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginEvent;
import fi.otavanopisto.muikku.plugin.PrioritizedPluginDescriptor;

@Dependent
public class Plugins {

  @Inject
	private Logger logger;
	
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
	public void initialize() {
		logger.info("Initializing plugins");
		
		List<PluginDescriptor> plugins = getPlugins();
		Collections.sort(plugins, new Comparator<PluginDescriptor>() {
			
			@Override
			public int compare(PluginDescriptor o1, PluginDescriptor o2) {
				return getPriority(o1) - getPriority(o2);
			}
			
			private int getPriority(PluginDescriptor plugin) {
				if (plugin instanceof PrioritizedPluginDescriptor) {
					return ((PrioritizedPluginDescriptor) plugin).getPriority();
				}
				
				return 0;
			}
 		});
		
		firePluginsInitEvent(false);
  	for (PluginDescriptor pluginDescriptor : plugins) {
  		
    	try {
    	  firePluginInitEvent(pluginDescriptor, false);
    	  logger.info("Initializing plugin: " + pluginDescriptor.getName());
    	  
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
    
    eventData.setPluginName(pluginDescriptor.getName());
    
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
